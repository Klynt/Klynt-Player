/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
$(function () {

	PLAYER.init();
	SPLASHSCREEN.show();
	PLAYER.setSequenceResourceFiles(getSequenceCSSFiles(), getSequenceJsFiles());
	window.setTimeout("startPlayer()", 1000);
	
	function getSequenceCSSFiles() {
		var sequenceCssFiles = [
			"Player/resources/buttons/btn-style.css",
			"Player/resources/texts/txt-style.css",
			"Player/resources/texts/fonts.css",
			"Player/resources/index-menu/index-menu.css",
			"Player/resources/map-menu/map-menu.css",
			"Player/resources/misc/player.css",
			"Player/resources/footer/footer.css",
			"Player/app/player/player.css",
		];

		if (window.mediaControls && window.mediaControls.customSkin) {
			sequenceCssFiles.push(window.mediaControls.customSkin);
		} else {
			sequenceCssFiles.push("Player/resources/media-controls/mediaelementplayer.css");
		}
		
		return sequenceCssFiles;
	}
	
	function getSequenceJsFiles() {
		return [
			"Player/libs/jquery/jquery-1.8.2.js",
			"Player/libs/mediaelement/mediaelement-and-player.js",
			"Player/libs/timesheets/timesheets.js",
			"Player/app/player/fullscreen.js",
			"Player/app/sequence/transition.js",
			"Player/app/sequence/element.js",
			"Player/app/sequence/media.js",
			"Player/app/sequence/image.js",
			"Player/app/sequence/video.js",
			"Player/app/sequence/externalVideo.js",
			"Player/app/sequence/audio.js",
			"Player/app/sequence/text.js",
			"Player/app/sequence/button.js",
			"Player/app/sequence/iframe.js",
			"Player/app/sequence/shape.js",
			"Player/app/sequence/sequence.js"
		];
	}
});

/* Updates the timer in the editor. */
/* The implementation of this function will be overriden by the editor. */
function updateTimer(time) {
	$('#chrono').html(time);
}

function showEmbedCode(){
	var embedCode = '<iframe height="' + data.general.height + '" width="' + data.general.width + ' "src="' + window.location + '" frameborder="0" webkitallowfullscreen allowfullscreen></iframe>';
	alert(embedCode);
}

function startPlayer() {
	if (getProtocol() != "file:" && isDemo()) {
		addLayer('#splash');
		$('#splashSubtitle').html('this project is made with a demo version');
		$('#splashLoader').hide();
	} else {
		PLAYER.showSequence(null, null, getPlayerParam("timer"));
		addFooter();
		addMenu('#player', data.general.width, data.general.height, data.menu.menuTitle, data.menu.showMenuDescription);
		loadMapScript(data.general.mapsKey);
		SPLASHSCREEN.hide();
	}

	function getProtocol() {
		return document.location.protocol;
	}

	function isDemo() {
		return data.general.level == 0;
	}

	function getPlayerParam(paramName) {
		var request = window.location.search.substr(1, window.location.search.length);
		var requestItems = request.split('&');

		for (var i = 0; i < requestItems.length; i++) {
			var item = requestItems[i];
			var nameLength = item.indexOf('=');
			if (item.substring(0, nameLength) == paramName) {
				return unescape(item.substring(nameLength + 1, item.length));
			}
		}
		return null;
	}

	function addLayer(elemId, timeContainer, timeAction, begin, dur){
		var txt = document.createElement('div');
		txt.id = elemId + 'dk';
		txt.innerHTML = 'Demo';
		txt.className = 'layer';
		$(elemId).append(txt);
	}

	function loadMapScript(mapsKey) {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "http://maps.googleapis.com/maps/api/js?key=" + mapsKey + "&sensor=false" + "&async=2&callback=addMapToPlayer";
		document.getElementsByTagName("head")[0].appendChild(script);
	}
}

function addMapToPlayer() {
	addMap('#player', data.general.width, data.general.height, data.map.mapTitle, data.map.showMapDescription, data.map.mapLongitude, data.map.mapLatitude, data.map.mapDefaultZoom, data.map.mapMinZoom, data.map.mapMaxZoom);
}

var Constants = {
	SEQUENCE_READY:		"sequenceReady"
}
