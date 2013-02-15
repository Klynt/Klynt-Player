/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
function getMediaHTML(tag, data) {
	
	var mediaHTML =
		'<' + tag + getMediaProperties() + '>' +
			getSourcesFromData(data) +
		'</' + tag + '>';

	addMediaScout();
	
	return mediaHTML;
	
	function getSourcesFromData() {
		return data.src.map(function (src) {
			var source = '<source src="' + src.src + '"';
			if (src.type) {
				source += ' type="' + src.type + '"';
			}
			source += '>';
			return source;
		}).join('');
	}
	
	function getMediaProperties() {
		var properties = "";
		
		properties += ' id = "' + data.id + 'Element"';
		properties += ' width="' + data.width +'"';
		properties += ' height="' + data.height +'"';
		
		var autoplay = false;
		var controls = false;
		if (data.id == SEQUENCE.syncMaster) {
			controls = true;
			autoplay = data.autoplay;
		} else {
			controls = data.player;
			data.autoplay = data.autoplay || !data.player;
			//autoplay = data.autoplay || !data.player;
		}
		
		properties += autoplay ? " autoplay" : "";
		properties += controls ? " controls" : "";
		properties += data.loop || data.continuous ? " loop" : "";
		properties += ' volume="' + 0.0 +'"';
		
		var iOS = !!navigator.userAgent.match(/(iPad|iPhone|iPod)/i);
		if (iOS || !autoplay) {
			properties += !!data.poster ? ' poster="' + data.poster +'"' : '';
		}
		
		return properties;
	}

	function addMediaScout() {
		 // Disables preloading in firefox because calling load()
		 // on flash videos prevents them from playing.
		if (!$.browser.mozilla) {
			var databegin = getTimeFromString(data.databegin);
			 // Prevents preloading media that start at 0.
			if (databegin > 0) {
				SEQUENCE.addMetaElement(Math.max(0, databegin - 2), "loadMedia('" + data.id + "');");
			}
		}
	}
}

function playMedia(mediaId) {
	var media = document.getElementById(mediaId);
	if (media.timing.isActive() || mediaId == SEQUENCE.syncMaster) {
		showMedia(mediaId);
		getMediaAPI(mediaId).play();
	}
}

function pauseMedia(mediaId) {
	getMediaAPI(mediaId).pause();
}

function seekMedia(mediaId, time) {
	getMediaAPI(mediaId).setCurrentTime(time);
}

function setMediaVolume(mediaId, volume) {
	getMediaAPI(mediaId).setVolume(volume);
}

function loadMedia(mediaId) {
	getMediaAPI(mediaId).load();
}

function getMediaAPI(mediaId) {
	var media = document.getElementById(mediaId + "Element");
	return media.mediaAPI || media;
}

function stopMedia(mediaId) {
	getMediaAPI(mediaId).stop();
}

function hideMedia(mediaId) {
	$('#' + mediaId).hide();
}

function showMedia(mediaId) {
	$('#' + mediaId).show();
}

function getMediaControlFeatures(media) {
	var features = ["progress"];
	if (mediaControls) {
		var mediaTagName = media.tagName.toLowerCase();
		if (mediaTagName == "video") {
			if (mediaControls.videoFeatures && mediaControls.videoFeatures.length > 0) {
				features = mediaControls.videoFeatures;
			}
		} else if (mediaTagName == "audio") {
			if (mediaControls.audioFeatures && mediaControls.audioFeatures.length > 0) {
				features = mediaControls.audioFeatures;
			}
		}
	}
	return features;
}
