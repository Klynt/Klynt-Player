/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
function addExternalVideo(data) {
	addExternalVideo_old("#" + SEQUENCE.container.id, data.id, data.externalId, data.platform, data.volume, data.loop, data.player, data.autoplay, data.databegin, data.dataend, data.duration, data.left, data.top, data.width, data.height, data.style, data.zIndex);
}

function addExternalVideo_old(seqId, videoId, externalId, platform, volume, loop, controls, autoplay, databegin, dataend, duration, left, top, width, height, style, videoZindex) {
	if (platform == "youtube") {
		addYoutubeVideo(seqId, videoId, externalId, volume, loop, controls, autoplay, databegin, dataend, duration, left, top, width, height, style, videoZindex);
	} else if (platform == "dailymotion") {
		addDailymotionVideo(seqId, videoId, externalId, volume, loop, controls, autoplay, databegin, dataend, duration, left, top, width, height, style, videoZindex);
	} else if (platform == "vimeo") {
		addVimeoVideo(seqId, videoId, externalId, volume, loop, controls, autoplay, databegin, dataend, duration, left, top, width, height, style, videoZindex);
	}
}
/* ***** Video Youtube ***** */
function addYoutubeVideo(seqId, videoId, externalId, volume, loop, controls, autoplay, databegin, dataend, duration, left, top, width, height, style, videoZindex) {
	var onbegin = "showYoutube('" + videoId + "');";
	var onend = "hideYoutube('" + videoId + "');";
	if (autoplay == true) {
		onbegin = onbegin + "playYoutube('" + videoId + "');";
	}
	if (!/Chrome/.test(navigator.appVersion)) { //non chrome
		$(seqId).append('<div id="_YT' + videoId + '" style="position:absolute;float:left;z-index:' + videoZindex + ';left: ' + left + 'px;top:' + top +
			'px; width:' + width + 'px; height:' + height + 'px;" data-begin="' + databegin + '" data-end="' + dataend + '" data-dur="' + duration +
			'" data-onbegin="' + onbegin + '" data-onend="' + onend + '"><div id="ytapiplayer"></div></div>');

		var params = { allowScriptAccess:"always"};
		var atts = { id:"YT" + videoId };
		var url = "http://www.youtube.com/v/" + externalId + "?enablejsapi=1&playerapiid=ytplayer&version=3";

		//faut aussi ajouter une div pour les data-begin...
		//expressInstall was removed
		swfobject.embedSWF(url, "ytapiplayer", width, height, "8", "Player/libs/expressInstall.swf", null, params, atts);

		//adjustVolumeYoutube(videoId,volume); // marche sur FF et AirBrowser mais pas sur chrome
	}
}

function onYouTubePlayerReady(ytplayer, videoId) {
	myYt = document.getElementById("YT" + videoId);
}
// les méthodes suivantes ne marchent pas sur chrome
function playYoutube(videoId) {
	myYt = document.getElementById("YT" + videoId);
	myYt.playVideo();
}

function pauseYoutube(videoId) {
	myYt = document.getElementById("YT" + videoId);
	myYt.pauseVideo();
}

function stopYoutube(videoId) {
	myYt = document.getElementById("YT" + videoId);
	myYt.seekTo(0);
	myYt.pauseVideo();
}

function loadYoutube(videoId, externalId) { // ça load la vidéo et la play
	myYt = document.getElementById("YT" + videoId);
	myYt.loadVideoById(externalId, 0); // load and play video a la seconde 0
}

function seekYoutube(videoId, time) {
	myYt = document.getElementById("YT" + videoId);
	myYt.seekTo(time); //secondes
}

function adjustVolumeYoutube(videoId, volume) {
	myYt = document.getElementById("YT" + videoId);
	myYt.setVolume(volume * 100);
}

function hideYoutube(videoId) {
	$("#YT" + videoId).hide();
}

function showYoutube(videoId) {
	$("#YT" + videoId).show();
}

/* ***** Video Vimeo ***** */
function addVimeoVideo(seqId, videoId, externalId, volume, loop, controls, autoplay, databegin, dataend, duration, left, top, width, height, style, videoZindex) {
	var onbegin = "showVimeo('" + videoId + "');";
	var onend = "hideVimeo('" + videoId + "');";
	var videoSrc = "http://player.vimeo.com/video/" + externalId + "?api=1&amp;player_id=VM" + videoId;
	if (loop == true) {
		videoSrc = videoSrc + "&amp;loop=1";
	}
	if (autoplay == true) {
		onbegin = onbegin + "playVimeo('" + videoId + "');";
	}
	$(seqId).append('<div id="_VM' + videoId + '" style="position:absolute;z-index:' + videoZindex + ';left: ' + left + 'px;top:' + top +
		'px; width:' + width + 'px; height:' + height + 'px;" data-begin="' + databegin + '" data-end="' + dataend + '" data-dur="' + duration +
		'" data-onbegin="' + onbegin + '" data-onend="' + onend + '"></div>');

	$("#_VM" + videoId).append('<iframe id="VM' + videoId + '" src="' + videoSrc + '" width="' + width + '" height="' + height + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
	adjustVolumeVimeo(videoId, volume);
}

function playVimeo(videoId) {
	var myVideo = $f(document.getElementById('VM' + videoId));
	myVideo.api('play');
}

function pauseVimeo(videoId) {
	var myVideo = $f(document.getElementById('VM' + videoId));
	myVideo.api('pause');
}
function stopVimeo(videoId) {
	var myVideo = $f(document.getElementById('VM' + videoId));
	myVideo.api('seekTo', 0);
	myVideo.api('pause');
}

function seekVimeo(videoId, time) {
	var myVideo = $f(document.getElementById('VM' + videoId));
	myVideo.api('seekTo', time);
}

function adjustVolumeVimeo(videoId, volume) {
	var myVideo = $f(document.getElementById('VM' + videoId));
	myVideo.api('setVolume', volume); // 0-1
}

function hideVimeo(videoId) {
	$("#VM" + videoId).hide();
}

function showVimeo(videoId) {
	$("#VM" + videoId).show();
}

/* ***** Video Dailymotion ***** */
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
