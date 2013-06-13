/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
function addExternalVideo(data, sequence) {
	switch (data.platform) {
		case "youtube":
			return addYoutubeVideo(data, sequence);
		case "vimeo":
			return addVimeoVideo(data, sequence);
		case "dailymotion":
			return addDailymotionVideo(sequence.div, data.id, data.externalId, data.platform, data.volume, data.loop, data.player, data.autoplay, data.databegin, data.dataend, data.duration, data.left, data.top, data.width, data.height, data.style, data.zIndex);
		default:
			return null;
	}
}

function addYoutubeVideo(data, sequence) {
	var isLocal = document.location.protocol == 'file:';
	var isChrome = $.browser.chrome;
	
	if (isLocal && isChrome) {
		alert("Oops! Youtube does not allow its videos to be displayed with Chrome in offline mode.\n\nPlease set either Safari or Firefox as your default browser instead of Chrome to preview your sequences when using Youtube videos.\n\nNB. Once your project is published online, Youtube videos will display properly on any browser, including Chrome.");
	}
	
	data.src = [{
		src: "http://www.youtube.com/watch?v=" + data.externalId,
		type: "video/youtube"
	}];
	var video = addVideo(data, sequence);
	$(video).addClass("youtube");
	return video;
}

function addVimeoVideo(data, sequence) {
	data.src = [{
		src: "http://www.vimeo.com/" + data.externalId,
		type: "video/vimeo"
	}];
	return addVideo(data, sequence);
}

/* Video Dailymotion */

function addDailymotionVideo(seqId, videoId, externalId, volume, loop, controls, autoplay, databegin, dataend, duration, left, top, width, height, style, videoZindex) {
	var PARAMS = {}; //logo:0 pour ne pas afficher le logo dailymotion
	var onbegin = "showDailymotion('" + videoId + "');";
	var onend = "hideDailymotion('" + videoId + "');";
	if (autoplay == true) {
		onbegin = onbegin + "playDailymotion('" + videoId + "');";
	}
	$(seqId).append('<div id="_DM' + videoId + '" style="position:absolute;z-index:' + videoZindex + ';left: ' + left + 'px;top:' + top +
		'px; width:' + width + 'px; height:' + height + 'px;" data-begin="' + databegin + '" data-end="' + dataend + '" data-dur="' + duration +
		'" data-onbegin="' + onbegin + '" data-onend="' + onend + '"><div id="DM' + videoId + '"></div>');

	var player = DM.player("DM" + videoId, {video:externalId, width:width, height:height, params:PARAMS});
	adjustVolumeDailymotion(videoId, volume);
}

function playDailymotion(videoId) {
	var player = document.getElementById("DM" + videoId);
	player.play();
}

function pauseDailymotion(videoId) {
	var player = document.getElementById("DM" + videoId);
	player.pause();
}

function stopDailymotion(videoId) {
	var player = document.getElementById("DM" + videoId);
	player.seek(0);
	player.pause();
}

function seekDailymotion(videoId, time) {
	var player = document.getElementById("DM" + videoId);
	player.seek(time);
}

function adjustVolumeDailymotion(videoId, volume) {
	var player = document.getElementById("DM" + videoId);
	player.setVolume(volume); // 0-1
}

function hideDailymotion(videoId) {
	$("#DM" + videoId).hide();
}

function showDailymotion(videoId) {
	$("#DM" + videoId).show();
}
