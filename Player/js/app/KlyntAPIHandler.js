/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of the api iframe communication.
 * */

var APIHandler = (function () {

	var DEFINE = 'define';
	var CHILD_READY = 'childReady';
	var COMMAND = 'command';
	var NOTIFICATION = 'notification';
	var QUERY = 'query';
	var DEFINITIONS_COMPLETE = 'definitionsComplete';
	var CHILD = 'child';
	var PARENT = 'parent';

	var domain = '*';

	var commands = {};
	var queries = {};
	var notifications = document.createElement('div');
	var children = {};

	APIHandlerClass = function () {};

	APIHandlerClass.prototype.runCommand = function (name, params) {
		if (typeof commands[name] === "function") {
			commands[name](params);
		}
	}

	APIHandlerClass.prototype.defineCommand = function (name, func) {
		commands[name] = func;
	};

	APIHandlerClass.prototype.defineQuery = function (name, func) {
		queries[name] = func;
	};

	APIHandlerClass.prototype.dispatchNotification = function (name, data) {
		var message = JSON.stringify({
			header: {
				type: NOTIFICATION,
				destination: CHILD
			},
			name: name,
			data: data
		});
		forwardToChildren(message);
		dispatchInternalNotification(name, data);

		function dispatchInternalNotification(name, data) {
			var event = document.createEvent('Event');
			event.data = data;
			event.initEvent(name, true, false);
			notifications.dispatchEvent(event);
		}
	};

	if (window.addEventListener) {
		window.addEventListener('message', onWindowMessage);
	}

	function onWindowMessage(event) {
		var data = getEventData(event);
		if (!data || !data.header) {
			return;
		}

		var reply = bindReply(event.source, data.header.id);

		switch (data.header.type) {
		case CHILD_READY:
			registerChild(data.header.id, event.source);
			// klynt.player.notifyFullscreenStateToAPI();
			registerDefinitions(reply);
			break;
		case COMMAND:
			executeCommand(data.name, data.params);
			break;
		case QUERY:
			executeQuery(data, reply);
			break;
		}

		function registerChild(apiId, contentWindow) {
			children[apiId] = contentWindow;
		}

		function registerDefinitions(reply) {

			registerCollection(commands, COMMAND);
			registerCollection(queries, QUERY);
			notifyDefinitionsComplete();

			function registerCollection(collection, type) {
				for (var name in collection)
					childDefine(name, type);
			}

			function childDefine(name, type) {
				reply.postToChild(DEFINE, {
					definitionType: type,
					name: name
				});
			}

			function notifyDefinitionsComplete() {
				reply.postToChild(DEFINITIONS_COMPLETE);
			}
		}

		function executeCommand(name, params) {

			if (commands.hasOwnProperty(name)) {
				commands[name](params);
			}

		}

		function executeQuery(data, reply) {
			var name = data.name;
			var params = data.params;

			if (!queries.hasOwnProperty(name))
				return;
			var result = queries[name](params);

			reply.postToChild(QUERY, {
				name: name,
				data: result
			});
		}
	}

	function bindReply(child, id) {
		return {
			postToChild: function (type, data) {
				data = data || {};
				data.header = {
					destination: CHILD,
					type: type,
					target: id
				};
				try {
					child.postMessage(JSON.stringify(data), domain);
				} catch (error) {

				}
			}
		}
	}

	function forwardToChildren(data) {
		for (var id in children) {
			try {
				children[id].postMessage(data, domain);
			} catch (error) {
				delete children[id];
			}
		}
	}

	function getEventData(event) {
		try {
			return JSON.parse(event.data);
		} catch (e) {
			return null;
		}
	}

	return new APIHandlerClass();
})();