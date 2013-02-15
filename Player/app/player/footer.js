/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
function addFooter() {
	if (data.footer.showLogo) {
		var onclick = data.footer.logoLink ? 'window.open("' + data.footer.logoLink + '", "_blank");' : '';
		var klyntLogo = addButton("data.menuLogo", "klyntLogo", onclick);
		klyntLogo.style.cursor = 'pointer';
		if (data.footer.logoTooltip) {
			klyntLogo.title = data.footer.logoTooltip;
		}
	}

	if (data.footer.showIndexMenu) {
		var menu = addButton("data.menu_footer", "menu_footer", 'PLAYER.showMenu()');
		menu.innerHTML = data.footer.indexMenuButtonLabel;
	}

	if (data.footer.showMapMenu) {
		var map = addButton("map_footer", "map_footer", 'PLAYER.showMap()');
		map.innerHTML = data.footer.mapMenuButtonLabel;
	}
	
	addCustomButtons();

	if (data.footer.showFacebook) {
		addButton("data.facebook", "facebook", getFacebookOnClick());
	}

	if (data.footer.showTwitter) {
		addButton("data.twitter", "twitter", getTwitterLink());
	}
	
	addButton("player-embed", "embed", "showEmbedCode()");

	addButton("data.sound", "sound", "PLAYER.toggleMute()");

	addButton("fullscreen", "fullscreen", 'PLAYER.toggleFullScreen();');

	var cancelfullscreen = addButton("cancelfullscreen", "cancelfullscreen", "PLAYER.toggleFullScreen()");
	cancelfullscreen.style.visibility = "hidden";

	function addButton(id, className, onClick) {
		var button = document.createElement('div');
		button.id = id;
		button.className = className;
		button.setAttribute('onclick', onClick);
		$("#player").append(button);
		return button;
	}
	
	function addCustomButtons() {
		if (window.footerButtons) {
			for (var i = 0; i < window.footerButtons.length; i++) {
				var data = window.footerButtons[i];
				var button = addButton("footerButton" + i, data.className, getOnClick(data.click, data.clickParams));
				if (data.label) {
					button.innerHTML = data.label;
				}
				if (data.tooltip) {
					button.setAttribute("title", data.tooltip);
				}
			}
		}
		
		function getOnClick(click, params) {
			switch (click) {
				case "openUrl":
					return params ? 'window.open("' + params + '", "_blank");' : '';
				case "openIndexMenu":
					return 'PLAYER.showMenu()';
				case "openMapMenu":
					return 'PLAYER.showMap()';
				case "shareToFacebook":
					return getFacebookOnClick();
				case "shareToTwitter":
					return getTwitterLink();
				case "showEmbedCode":
					return "showEmbedCode()";
				case "toggleMute":
					return "PLAYER.toggleMute()";
				case "mute":
					return "PLAYER.mute()";
				case "unmute":
					return "PLAYER.unmute()";
				case "toggleFullScreen":
					return "PLAYER.toggleFullScreen()";
				case "enterFullScreen":
					return "PLAYER.enterFullScreen()";
				case "exitFullScreen":
					return "PLAYER.exitFullScreen()";
				case "togglePlayPause":
					return "PLAYER.togglePause()";
				case "play":
					return "PLAYER.resume()";
				case "pause":
					return "PLAYER.pause()";
				case "openSequence":
					return params ? 'PLAYER.showSequence("' + params + '")' : '';
				default:
					return '';
			}
		}
	}
	
	function getFacebookOnClick() {
		return 'window.open("http://www.facebook.com/sharer.php?' +
			's=100' +
			'&p[url]=' + data.social.facebookLink +
			'&p[title]=' + data.social.facebookTitle +
			'&p[images][0]=' + data.social.facebookLogo +
			'&p[summary]=' + data.social.facebookMessage +
			'", "_blank");';
	}
	
	function getTwitterLink() {
		return 'window.open("http://twitter.com/intent/tweet?' +
			'original_referer=' + data.social.twitterLink +
			'/&text=' + data.social.twitterMessage + ' - ' + data.social.twitterLink +
			'", "_blank");';
	}
}
