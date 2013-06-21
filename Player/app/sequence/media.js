/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
function getMediaHTML(tag, data, sequence) {
	
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
		
		properties += ' id="' + data.id + 'Element"';
		properties += ' width="' + data.width +'"';
		properties += ' height="' + data.height +'"';
		
		if (data.id == sequence.syncMaster) {
			data.player = true;
		}
		
		var isiOS = !!navigator.userAgent.match(/(iPad|iPhone|iPod)/i);
		if (isiOS) {
			data.autoplay = false;
		} else {
			data.autoplay = data.autoplay || !data.player;
		}
		
		properties += data.player ? " controls" : "";
		properties += data.loop || data.continuous ? " loop" : "";
		properties += ' volume="' + data.volume +'"';
		
		if (data.id == sequence.syncMaster || getTimeFromString(data.databegin) < 1) {
			properties += data.autoplay ? " autoplay" : "";
		}
		if (!data.autoplay) {
			properties += data.poster ? ' poster="' + data.poster +'"' : '';
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
				sequence.addMetaElement(Math.max(0, databegin - 2), "loadMedia('" + data.id + "');");
			}
		}
	}
}

function playMedia(mediaId) {
	var media = document.getElementById(mediaId);
	if (media.timing.isActive() || media.isSyncMaster) {
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
