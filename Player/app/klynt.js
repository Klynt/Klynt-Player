/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */

(function () {
	if (window.mediaControls && window.mediaControls.customSkin) {
		loadCSSFile(window.mediaControls.customSkin);
	} else {
		loadCSSFile("Player/resources/media-controls/mediaelementplayer.css");
	}
})();
 
$(function () {
	PLAYER.init();
	SPLASHSCREEN.show();
	
	if (checkPlayer()) {
		window.setTimeout("startPlayer()", 1000);
	} else {
		displayBrowserNotSupported();
	}
});

function checkPlayer() {
	if (!Modernizr.video || !Modernizr.audio) {
		return false;
	}
	if (!Modernizr.postmessage) {
		return false;
	}
	if (!document.addEventListener) {
		return false;
	}
	return true;
}

function displayBrowserNotSupported() {
	$('#splashSubtitle').html('Your browser is not supported. Please upgrade to the latest version.');
	$('#splashLoader').hide();
}

/* Updates the timer in the editor. */
/* The implementation of this function will be overriden by the editor. */
function updateTimer(time) {
	$('#chrono').html(time);
}

function showEmbedCode(){
	var embedCode = '<iframe height="' + data.general.height + '" width="' + data.general.width + '" src="' + window.location + '" frameborder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>';
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
};

function loadCSSFile(href) {
	var cssLink = document.createElement('link');
	cssLink.rel = 'stylesheet';
	cssLink.type = 'text/css';
	cssLink.href = href;
	
	var head = document.getElementsByTagName("head")[0];
	head.appendChild(cssLink);
}

function loadScript(src) {
	var script = document.createElement('script');
	script.src = src;
	script.type = 'text/javascript';
	
	var head = document.getElementsByTagName("head")[0];
	head.appendChild(script);
}
