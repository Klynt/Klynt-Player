/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
var SEQUENCE = (function (PLAYER) {

	var finished = false,
		endExecuted = false;

	var SEQUENCE = {
		data: DATA,
		width: PLAYER.width,
		height: PLAYER.height,
		syncMaster: DATA.syncMaster,
		container: null,
		automaticLink: null
	};

	SEQUENCE.init = function () {
		addTimeSheetContainer();
		addSequenceElements();
		addSequenceEndMetaElement();
		initializeTimesheet();
		if (callBackFn) {
			callBackFn();
		}
		
		// Override onTimeUpdate()
		/*var onTimeUpdate = SEQUENCE.container.timing.onTimeUpdate;
		SEQUENCE.container.timing.onTimeUpdate = function () {
			onTimeUpdate.call(SEQUENCE.container.timing);
			PLAYER.updateTime(SEQUENCE.container.timing.getCurrentTime(), SEQUENCE);
		};*/

		function addTimeSheetContainer() {
			SEQUENCE.container = document.createElement('div');
			SEQUENCE.container.id = "container";
			SEQUENCE.container.name = "container";
			SEQUENCE.container.className = "container";
			SEQUENCE.container.style.position = "absolute";
			SEQUENCE.container.style.overflow = 'hidden';
			SEQUENCE.container.style.width = SEQUENCE.width + "px";
			SEQUENCE.container.style.height = SEQUENCE.height + "px";
			SEQUENCE.container.style.backgroundColor = SEQUENCE.data.backgroundColor;
			SEQUENCE.container.setAttribute("data-timecontainer", "par");
			SEQUENCE.container.setAttribute("data-timeaction", "visibility");
			document.body.appendChild(SEQUENCE.container);
		}

		function addSequenceElements() {
			$.each({
				images: addImage,
				videos: addVideo,
				//externalVideos: addExternalVideo,
				audios: addAudio,
				shapes: addShape,
				buttons: addButton,
				texts: addText,
				iframes: addFrame
			}, function (arrayName, fn) {
				SEQUENCE.data[arrayName].forEach(fn);
			});
		}

		function addSequenceEndMetaElement() {
			SEQUENCE.addMetaElement(SEQUENCE.data.duration, "SEQUENCE.executeEnd();");
		}

		function initializeTimesheet() {
			// Dispatch a DOMContentLoaded event to make timesheet parse the dom.
			var event = document.createEvent("Event");
			event.initEvent("DOMContentLoaded", true, true);
			document.dispatchEvent(event);
		}
	};
	
	SEQUENCE.executeEnd = function () {
		if (!endExecuted) {
			endExecuted = true;
			console.log('SEQUENCE.executeEnd()');
			if (SEQUENCE.automaticLink) {
				PLAYER.runLink(SEQUENCE.automaticLink);
			} else if (window.autoClose) {
				PLAYER.closeOverlay();
			} else {
				SEQUENCE.stop();
			}
		}
	};

	SEQUENCE.dispose = function () {
		document.body.removeChild(SEQUENCE.container);
	};

	SEQUENCE.stop = function () {
		SEQUENCE.pause("sequenceEndVolume");
		finished = true;
	};

	/*
	 * When continuousAudioVolumeProperty is not set, all audios are paused.
	 * Otherwise, continuous audios are not paused, and their volume is changed.
	 */
	SEQUENCE.pause = function (continuousAudioVolumeProperty) {
		if (!finished) {
			try {
				SEQUENCE.container.timing.Pause();
				SEQUENCE.data.videos.forEach(function (video) {
					pauseMedia(video.id);
				});
				SEQUENCE.data.audios.forEach(function (audio) {
					if (continuousAudioVolumeProperty && audio.continuous) {
						setMediaVolume(audio.id, audio[continuousAudioVolumeProperty]);
					} else {
						pauseMedia(audio.id);
					}
				});
			} catch (e) {
			}
		} else if (continuousAudioVolumeProperty) {
			SEQUENCE.data.audios.forEach(function (audio) {
				if (audio.continuous) {
					setMediaVolume(audio.id, audio[continuousAudioVolumeProperty]);
				}
			});
		}
	};

	SEQUENCE.resume = function (resetContinuousAudioVolume) {
		if (!finished) {
			try {
				SEQUENCE.container.timing.Play();
				SEQUENCE.data.videos.forEach(function (video) {
					playMedia(video.id);
				});
				SEQUENCE.data.audios.forEach(function (audio) {
					if (audio.continuous && resetContinuousAudioVolume) {
						setMediaVolume(audio.id, audio.volume);
					}
					playMedia(audio.id);
				});
			} catch (e) {
			}
		} else {
			SEQUENCE.data.audios.forEach(function (audio) {
				if (audio.continuous) {
					setMediaVolume(audio.id, audio.sequenceEndVolume);
					playMedia(audio.id);
				}
			});
		}
	};

	SEQUENCE.seek = function (time) {
		if (!finished) {
			var duration = getTimeFromString(SEQUENCE.data.duration);
			time = Math.max(Math.min(time, duration), 0);
			SEQUENCE.container.timing.setCurrentTime(time);
			/*
			SEQUENCE.data.videos.forEach(function (video) {
				var start = getTimeFromString(video.databegin);
				var end = getTimeFromString(video.dataend);
				if (start < time && time < end) {
					seekMedia(video.id, time - start);
					playMedia(video.id);
				}
			});
			*/
		}
	};

	SEQUENCE.mute = function () {
		SEQUENCE.data.videos.forEach(function (video) {
			setMediaVolume(video.id, 0);
		});
		SEQUENCE.data.audios.forEach(function (audio) {
			setMediaVolume(audio.id, 0);
		});
	};

	SEQUENCE.unmute = function () {
		SEQUENCE.data.videos.forEach(function (video) {
			setMediaVolume(video.id, video.volume);
		});
		SEQUENCE.data.audios.forEach(function (audio) {
			setMediaVolume(audio.id, audio.volume);
		});
	};

	SEQUENCE.runLink = function (itemId) {
		var item = document.getElementById(itemId);
		if (item && item.linkData) {
			PLAYER.runLink(item.linkData);
		}
	};

	SEQUENCE.enterFullScreen = function () {
		fullScreenBrowser(Fullscreen.PARENT_IS_SEQUENCE);
	};

	SEQUENCE.exitFullScreen = function () {
		cancelFullScreen();
	};

	SEQUENCE.addMetaElement = function (begin, onBegin) {
		var meta = document.createElement('div');
		meta.setAttribute('data-begin', begin);
		meta.setAttribute('data-dur', 1);
		meta.setAttribute('data-onbegin', onBegin);
		SEQUENCE.container.appendChild(meta);
	};

	SEQUENCE.getCurrentTime = function () {
		return SEQUENCE.container.timing.getCurrentTime();
	};

	return SEQUENCE;
})(PLAYER);

SEQUENCE.init();

var Constants = {
	SEQUENCE_READY:		"sequenceReady"
}
var event = document.createEvent("Event");
event.initEvent(Constants.SEQUENCE_READY, true, false);
dispatchEvent(event);

function updateSequenceTime(time) {
	PLAYER.updateTime(time, SEQUENCE);
}

/**
 * Returns time in seconds from a time string in the format
 * h:m:s.s, m:s.s or s.s where the number of digits in each part is variable.
 */
function getTimeFromString(timeString) {
	var timeParts = timeString.split(':');
	var time = 0;
	while (timeParts.length) {
		time *= 60;
		time += parseFloat(timeParts.shift());
	}
	return time;
}
