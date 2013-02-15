/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
var PLAYER = (function () {
	var sequenceCssFiles,
		sequenceScriptFiles;

	var PLAYER = {
		width: data.general.width,
		height: data.general.height,
		title: data.general.title
	};

	/* Public API */

	PLAYER.init = function () {
		this.div = document.createElement("div");
		this.div.id = 'player';
		this.div.className = 'player';
		this.div.style.position = 'absolute';
		this.div.style.overflow = 'hidden';
		this.div.style.top = '0px';
		this.div.style.left = '0px';
		this.div.style.width = this.width + 'px';
		this.div.style.height = this.height + 'px';
		document.getElementById("main").appendChild(this.div);

		window.onkeyup = keyUpHandler;
	};

	/* All parameters are optional */
	PLAYER.showSequence = function (sequenceId, link, time) {
		// If a sequence is given as a parameter, it is displayed.
		// Otherwise, we try to display the sequence specified in the url.
		if (!sequenceId) {
			sequenceId = Hashtag.toSequenceId();
			// We display the main sequence if we still don't have a sequenceId, or if the specified sequence is not found.
			if (!data.sequences[sequenceId]) {
				sequenceId = data.mainSequence;
			}
			link = null;
		}
		
		var frameSequence = (link && link.overlay)? showOverlayFrame(sequenceId, link) : showNormalFrame(sequenceId, link, time);
		
		frameSequence.contentWindow.addEventListener(Constants.SEQUENCE_READY, function(event){ 
			if (STATE.fullScreenActive)
				getFrameSequence(frameSequence).enterFullScreen();
		});

		/*if (link && link.overlay) {
			showOverlayFrame(createFrame(sequenceId, link.automaticClose, link.closeButton, link.closeButtonX, link.closeButtonY), link);
		} else {
			showNormalFrame(createFrame(sequenceId), link);
		}*/
	};

	PLAYER.closeOverlay = function () {
		removeFrame(STATE.getOverlayFrame());
	};

	PLAYER.runLink = function (link) {
		switch (link.linkType) {
			case "linkToMenu":
				PLAYER.showMenu();
				break;
			case "linkToMap":
				PLAYER.showMap();
				break;
			case "linkToURL":
				window.open(link.targetURL, link.window);
				break;
			case "linkToSequence":
				PLAYER.showSequence(link.targetSequence, link);
				break;
		}
	};

	PLAYER.updateTime = function (time, sequence) {
		if (sequence == STATE.getActiveSequence()) {
			updateTimer(time);
		}
	};

	PLAYER.togglePause = function () {
		STATE.pausedByUser ? PLAYER.resume() : PLAYER.pause();
	};

	PLAYER.pause = function () {
		if (!STATE.pausedByUser) {
			STATE.pausedByUser = true;
			STATE.getActiveSequence().pause();
		}
	};

	PLAYER.resume = function () {
		if (STATE.pausedByUser) {
			STATE.pausedByUser = false;
			STATE.getActiveSequence().resume();
		}
	};

	PLAYER.seek = function (time) {
		STATE.getActiveSequence().seek(parseFloat(time));
	};

	PLAYER.toggleMute = function () {
		STATE.mutedByUser ? PLAYER.unmute() : PLAYER.mute();
	};

	PLAYER.mute = function () {
		if (!STATE.mutedByUser) {
			STATE.mutedByUser = true;
			STATE.getCurrentSequences().forEach(function (sequence) {
				sequence.mute();
			});
		}
	};

	PLAYER.unmute = function () {
		if (STATE.mutedByUser) {
			STATE.mutedByUser = false;
			STATE.getCurrentSequences().forEach(function (sequence) {
				sequence.unmute();
			});
		}
	};

	PLAYER.showMenu = function () {
		PLAYER.pause();
		showMenu();
	};

	PLAYER.hideMenu = function () {
		hideMenu();
		PLAYER.resume();
	};

	PLAYER.showMap = function () {
		if (STATE.mapsEnabled) {
			PLAYER.pause();
			showMap();
		}
	};

	PLAYER.hideMap = function () {
		if (STATE.mapsEnabled) {
			hideMap();
			PLAYER.resume();
		}
	};

	PLAYER.setMapsEnabled = function(enabled) {
		STATE.mapsEnabled = enabled;
	};

	PLAYER.toggleFullScreen = function () {
		STATE.fullScreenActive ? PLAYER.exitFullScreen() : PLAYER.enterFullScreen();
	};

	PLAYER.enterFullScreen = function() {
		if (!STATE.fullScreenActive) {
			fullScreenBrowser();
			fullScreen("main");
			if($.browser.chrome) {
				STATE.getCurrentSequences().forEach(function(sequence) {
					sequence.enterFullScreen();
				});
			}
			STATE.fullScreenActive = true;
		}
	};

	PLAYER.exitFullScreen = function() {
		if (STATE.fullScreenActive) {
			cancelFullScreen();
			fullScreenCancel("main");
			if($.browser.chrome) {
				STATE.getCurrentSequences().forEach(function(sequence) {
					sequence.exitFullScreen();
				});
			}
			STATE.fullScreenActive = false;
		}
	};

	PLAYER.setSequenceResourceFiles = function (cssFiles, scriptFiles) {
		sequenceCssFiles = cssFiles;
		sequenceScriptFiles = scriptFiles;
	};

	/* Sequence creation */

	function showNormalFrame(sequenceId, link, time) {
		var oldFrames = STATE.getCurrentFrames();

		var sequenceFrame = createFrame(sequenceId, function() {
			if (time) {
				getFrameSequence(sequenceFrame).seek(time);
			}
			sequenceFrame.style.visibility = "visible";
			if (link) {
				TRANSITION.applyToSequence(sequenceFrame, link.transition, function () {
					oldFrames.forEach(removeFrame);
				});
			} else {
				oldFrames.forEach(removeFrame);
			}
		});

		sequenceFrame.style.visibility = "hidden";
		PLAYER.div.appendChild(sequenceFrame);
		STATE.setMainFrame(sequenceFrame);

		//updatePlayerURL(sequenceId);
		Hashtag.currentSequence = sequenceId;
		return sequenceFrame;
	}

	function showOverlayFrame(sequenceId, link) {
		var currentOverlay = STATE.getOverlayFrame();
		if (currentOverlay) {
			removeFrame(currentOverlay);
		}

		var sequenceFrame = createFrame(sequenceId, function() {
			sequenceFrame.style.visibility = "visible";
			TRANSITION.applyToSequence(sequenceFrame, link.transition);
		}, link.automaticClose, link.closeButton, link.closeButtonX, link.closeButtonY);

		sequenceFrame.style.visibility = "hidden";
		STATE.setOverlayFrame(sequenceFrame);
		PLAYER.div.appendChild(sequenceFrame);

		if (link.pauseParent) {
			STATE.mainDeactivatedByOverlay = true;
			STATE.getMainSequence().pause("overlayVolume");
		}
		return sequenceFrame;
	}

	function createFrame(sequenceId, callback, autoClose, closeButton, closeButtonX, closeButtonY) {
		var frame = document.createElement('iframe');
		frame.id = sequenceId;
		//frame.frameBorder = 0;//Not supported in HTML5.
		//frame.scrolling = "no";//Not supported in HTML5.
		//frame.seamless = "seamless";
		//new in HTML 5, Chrome OK, others KO
		//frame.sandbox =	""; //[allow-forms|allow-same-origin|allow-scripts|allow-top-navigation
		//new in HTML 5 moz safari et chrome OK - Opera et IE KO
		frame.style.position = 'absolute';
		frame.style.left = '0px';
		frame.style.top = '0px';
		frame.style.width = PLAYER.width + 'px';
		frame.style.height = PLAYER.height + 'px';
		frame.style.border = '0px';
		frame.style.overflow = 'hidden';

		frame.onload = function () {
			frame.contentWindow.DATA = data.sequences[sequenceId];
			frame.contentWindow.PLAYER = PLAYER;
			frame.contentWindow.autoClose = autoClose;
			frame.contentWindow.mediaControls = window.mediaControls;
			frame.contentWindow.callBackFn = callback;
			frame.contentWindow.onkeyup = keyUpHandler;

			var frameDocument = getFrameDocument(frame);
			frameDocument.body.style.padding = 0;
			frameDocument.body.style.margin = 0;
			frameDocument.body.style.width = PLAYER.width + 'px';
			frameDocument.body.style.height = PLAYER.height + 'px';
			frameDocument.body.style.overflow = 'hidden';

			frameDocument.createElement('title');
			frameDocument.title = frame.contentWindow.DATA.name;
			
			if (closeButton) {
				addCloseButton(frame, closeButtonX, closeButtonY);
			}
			
			var head = frameDocument.getElementsByTagName("head")[0];
			
			// Disable cache
			
			function addMetaTag(httpEquiv, content) {
				var metaTag = frameDocument.createElement('meta');
				metaTag.httpEquiv = httpEquiv;
				metaTag.content = content;
				head.appendChild(metaTag);
			}
			
			/*
			addMetaTag('cache-control', 'max-age=0');
			addMetaTag('cache-control', 'no-cache');
			addMetaTag('expires', '0');
			addMetaTag('expires', 'Tue, 01 Jan 1980 1:00:00 GMT');
			addMetaTag('pragma', 'no-cache');
			*/
			
			sequenceCssFiles.forEach(function (href) {
				var cssLink = frameDocument.createElement('link');
				cssLink.href = href;
				cssLink.rel = 'stylesheet';
				cssLink.type = 'text/css';
				head.appendChild(cssLink);
			});

			// Load scripts sequentially
			loadNextScript(sequenceScriptFiles.slice(0));

			function loadNextScript(queue) {
				if (queue && queue.length) {
					var script = frameDocument.createElement('script');
					script.src = queue.shift();
					script.type = 'text/javascript';
					script.onload = function() {
						loadNextScript(queue);
					};
					script.onreadystatechange = function () { // same as onload for IE
						if (this.readyState == 'complete') {
							loadNextScript(queue);
						}
					};
					head.appendChild(script);
				}
			}
		};

		return frame;
	}

	function removeFrame(sequenceFrame) {
		getFrameSequence(sequenceFrame).dispose();
			
		PLAYER.div.removeChild(sequenceFrame);

		if (sequenceFrame == STATE.getOverlayFrame()) {
			STATE.setOverlayFrame(null);
			var mainSequence = STATE.getMainSequence();
			if (/*STATE.mainDeactivatedByOverlay && */!STATE.pausedByUser) {
				mainSequence.resume(true);
			}
			PLAYER.updateTime(mainSequence.getCurrentTime(), mainSequence);
		}
		STATE.mainDeactivatedByOverlay = false;
	}

	/* Player state */

	var STATE = (function () {
		/*
		 * The storage variables mainFrame and overlayFrame refer
		 * to the sequence frame and not the SEQUENCE object in their doms.
		 * Setter methods accept the frame as a parameter, and there are getter methods
		 * for both the frame and the SEQUENCE object.
		 */

		var mainFrame,
			overlayFrame;

		var STATE = {
			pausedByUser:false, // Indicates whether the user has paused the player.
			mutedByUser:false, // Indicates whether the user has muted the player.
			mainDeactivatedByOverlay:false, // Indicates whether the main sequence was deactivated by an overlay sequence.
			fullScreenActive:false,
			mapsEnabled:false
		};

		STATE.getActiveFrame = function () {
			return overlayFrame || mainFrame;
		};

		STATE.getActiveSequence = function () {
			return getFrameSequence(STATE.getActiveFrame());
		};

		STATE.getCurrentFrames = function () {
			var sequences = [];
			if (mainFrame) {
				sequences.push(mainFrame);
			}
			if (overlayFrame) {
				sequences.push(overlayFrame);
			}
			return sequences;
		};

		STATE.getCurrentSequences = function () {
			return STATE.getCurrentFrames().map(getFrameSequence);
		};

		STATE.getMainFrame = function () {
			return mainFrame;
		};

		STATE.getMainSequence = function () {
			return getFrameSequence(STATE.getMainFrame());
		};

		STATE.setMainFrame = function (frame) {
			mainFrame = frame;
		};

		STATE.getOverlayFrame = function () {
			return overlayFrame;
		};

		STATE.getOverlaySequence = function () {
			return getFrameSequence(STATE.getOverlayFrame());
		};

		STATE.setOverlayFrame = function (frame) {
			overlayFrame = frame;
		};

		return STATE;
	})();

	/* Utils */

	function keyUpHandler(event) {
		switch (event.keyCode) {
			case 27: // Escape key
				PLAYER.exitFullScreen();
				break;
			case 32: // Space key
				PLAYER.togglePause();
				break;
		}
	}

	/* Returns the document object of an iframe. */
	function getFrameDocument(frame) {
		return frame.contentDocument || frame.contentWindow.document;
	}

	/* Returns the sequence object of an iframe. */
	function getFrameSequence(frame) {
		return frame.contentWindow.SEQUENCE;
	}

	/* Adds a close button to the given sequence frame. */
	function addCloseButton(sequenceFrame, closeButtonX, closeButtonY) {
		var frameDocument = getFrameDocument(sequenceFrame);
		var button = frameDocument.createElement("div");
		button.setAttribute("name", "closeOverlay");
		button.className = "closeOverlay";
		button.style.position = "absolute";
		button.style.left = closeButtonX + 'px';
		button.style.top = closeButtonY + 'px';
		button.style.width = '46px';
		button.style.height = '46px';
		button.style.zIndex = 600;
		button.setAttribute("onClick", "PLAYER.closeOverlay();");
		frameDocument.body.appendChild(button);
	}
	
	var Hashtag = (function(){
	
		var ignorePendingHashChange = false;
		var currentSequenceIdOrHash;
	
		var HashtagClass = function(){
			window.addEventListener('hashchange', this.onHashChange);
		};
		HashtagClass.prototype = {			
			get hashtag(){
				var hashtag = window.location.hash.split('?');
				return hashtag[0].split('#')[1];
			},
			
			get currentSequence(){
				return currentSequenceIdOrHash;
			},
			set currentSequence(value){
				currentSequenceIdOrHash = value;
				this.setSequenceAliasAsHashtag();
			}
		};
		
		HashtagClass.prototype.toSequenceId = function(){
			var hashtag = this.hashtag;
			return getSequenceIdByAlias(hashtag) || hashtag;
		};
		
		HashtagClass.prototype.onHashChange = function(event){
			if (ignorePendingHashChange)
				ignorePendingHashChange = false;
			else
				PLAYER.showSequence(getSequenceIdByAlias(this.hashtag));
		}
		
		HashtagClass.prototype.setSequenceAliasAsHashtag = function(){
			var displayedHashtag = getAliasBySequenceId(currentSequenceIdOrHash) || currentSequenceIdOrHash;
			var currentHashtag = this.hashtag;
			
			if (!displayedMatches())
				changeHashtag();
			
			function displayedMatches(){
				return (displayedHashtag == currentHashtag);
			}
			
			function changeHashtag(){	
				ignorePendingHashChange = true;
				location.hash = "#" + displayedHashtag;
			}
		}
		
		function getSequenceIdByAlias(alias){
			return data.aliases.aliasToId[alias];
		}
		
		function getAliasBySequenceId(sequenceId){
			return data.aliases.idToAlias[sequenceId];
		}
		
		return new HashtagClass();
	})();

	return PLAYER;
})();
