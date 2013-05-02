var KlyntAPI = (function(){
	
	var DEFINE = 'define';
	var CHILD_READY = 'childReady';
	var COMMAND = 'command';
	var NOTIFICATION =	'notification';
	var QUERY = 'query';
	var DEFINITIONS_COMPLETE = 'definitionsComplete';
    var CHILD = 'child';
    var PARENT = 'parent';

	var domain = '*';
	var commands = {};
	var notifications = document.createElement('div');
	var queries = {};
	var readyCallbacks = [];

    var id = getId();

    var scaleInFullscreen = true;
	
	var KlyntAPIClass = function(){};
	KlyntAPIClass.prototype = {
		get commands(){
			return commands;
		},
		
		get notifications(){
			return notifications;
		},

        get scaleInFullscreen(){
            return scaleInFullscreen;
        },
        set scaleInFullscreen(value){
            scaleInFullscreen = value;
        }
	};
	
	KlyntAPIClass.prototype.ready = function(callback){
		readyCallbacks.push(callback);
	};
	
	KlyntAPIClass.prototype.query = function(name, params, callback){
		if (!queries.hasOwnProperty(name))
			throw new Error('Query ' + name + ' is not registered.');
			queries[name](params, callback);
	};

    function getId(){
        return "xxxx-xxxx-".replace(/x/g, function() {
            return Math.floor(Math.random()*16).toString(16).toUpperCase();
        }) + new Date().getTime().toString();
    }

    function postToParent(type, data){
        data = data || {};
        data.header = {
            id:             id,
            destination:    PARENT,
            type:           type
        };
        parent.postMessage(JSON.stringify(data), domain);
    }

	window.addEventListener('message', function(event){
		var data = JSON.parse(event.data);
        if (!data || ! data.header)
            return;

		switch(data.header.type){
			case DEFINE:
				define(data.name, data.definitionType);
				break;
			case DEFINITIONS_COMPLETE:
				onReady();
				break;
			case NOTIFICATION:
				dispatchNotification(data.name, data.data);
				break;
		}
		
		function define(name, type){
			if (type == COMMAND)
				defineCommand(name);
			else if (type == QUERY)
				defineQuery(name);
			
			function defineCommand(name){
				commands[name] = function(params){
                    postToParent(COMMAND, {name:name, params:params});
				}
			}
				
			function defineQuery(name){
				queries[name] = function(params, callback){
					window.addEventListener('message', onMessage);
                    postToParent(QUERY, {name: name, params: params});
					
					function onMessage(event){
						var data;
						try { data = JSON.parse(event.data); }
						catch (e) {	/* ignore message */}
						
						if (data && data.header && data.header.type == QUERY && data.header.destination == CHILD && data.name == name){
							window.removeEventListener('message', onMessage);
							callback(data.data);
						}
					}
				}
			}
		}

		function onReady(){
			readyCallbacks.forEach(function(callback){
				callback();
			});
		}
		
		function dispatchNotification(name, data){
			var event = document.createEvent('Event');
			event.data = data;
			event.initEvent(name, true, false);
			notifications.dispatchEvent(event);
		}
	});

    postToParent(CHILD_READY);

    notifications.addEventListener('fullscreen', function(event){
        if (scaleInFullscreen)
            scaleTo((event.data.fullscreen)? event.data.scale : 1);
    });

    function scaleTo(scale)
    {
        if (event.data.chrome)
            document.body.style.zoom = scale;
        else {
            setStyle(document.body, 'transform', 'scale(#)'.replace(/#/, scale));
            setStyle(document.body, 'transformOrigin', '0px 0px');
        }

        function setStyle(element, style, value){

            vendorPrefix(style).forEach(function(style){
                element.style[style] = value;
            });

            function vendorPrefix(style){
                return ["", 'O', 'ms', 'Moz', 'Webkit'].map(function(vendor){
                    return (vendor.length == 0)? style : vendor + (style.charAt(0).toUpperCase()) + style.splice(1);
                })
            }
        }
    }

	return new KlyntAPIClass();
})();