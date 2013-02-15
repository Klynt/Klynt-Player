/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
var SPLASHSCREEN = (function () {
	var SPLASHSCREEN = {
		width:data.general.width,
		height:data.general.height
	};

	SPLASHSCREEN.show = function () {
		var s = document.createElement('div');
		s.id = 'splash';
		s.style.position = 'absolute';
		s.style.top = '0px';
		s.style.left = '0px';
		s.style.zIndex = 500;
		s.style.backgroundColor = '#000000';
		s.className = 'splash';
		s.style.width = SPLASHSCREEN.width + 'px';
		s.style.height = SPLASHSCREEN.height + 'px';
		$('#main').append(s);
		$('#splash').append('<div style="display: table-cell; vertical-align: middle; text-align: center; height: ' + SPLASHSCREEN.height + 'px; width: ' + SPLASHSCREEN.width + 'px;"><img src="Player/resources/splashscreen/logo_klynt_splashcreen.png" /><br><br><span id="splashSubtitle" style="color:white; font-family:Open Sans;font-size:12px;">loading...</span><br><br><img id="splashLoader" src="Player/resources/splashscreen/loader.gif" /></div>');
	};

	SPLASHSCREEN.hide = function () {
		$('#splash').remove();
	};

	return SPLASHSCREEN;
})();
