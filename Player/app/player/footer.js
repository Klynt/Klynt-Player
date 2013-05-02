/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
function addFooter() {
	if (data.footer.showLogo) {
		var klyntLogo = addButton("data.menuLogo", "klyntLogo", function () {
			if (data.footer.logoLink) {
				window.open(data.footer.logoLink, "_blank");
			}
		});
		klyntLogo.style.cursor = 'pointer';
		klyntLogo.title = data.footer.logoTooltip;
		if (data.footer.logoTooltip) {
			klyntLogo.title = data.footer.logoTooltip;
		}
	}

	if (data.footer.showIndexMenu) {
		var menu = addButton("data.menu_footer", "menu_footer", PLAYER.showMenu);
		menu.innerHTML = data.footer.indexMenuButtonLabel;
	}

	if (data.footer.showMapMenu) {
		var map = addButton("map_footer", "map_footer", PLAYER.showMap);
		map.innerHTML = data.footer.mapMenuButtonLabel;
	}

	addCustomButtons(data.footer.footerButtons);
	addCustomButtons(window.footerButtons);

	if (data.footer.showFacebook) {
		addButton("data.facebook", "facebook", getFacebookOnClick());
	}

	if (data.footer.showTwitter) {
		addButton("data.twitter", "twitter", getTwitterLink());
	}
	
	addButton("player-embed", "embed", showEmbedCode);

	addButton("data.sound", "sound", PLAYER.toggleMute);

	addButton("fullscreen", "fullscreen", PLAYER.toggleFullScreen);
	
	function addCustomButtons(buttons) {
		if (buttons) {
			for (var i = 0; i < buttons.length; i++) {
				var data = buttons[i];
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
					return params ? function () {
						window.open(params, "_blank");
					} : null;
				case "openIndexMenu":
					return PLAYER.showMenu;
				case "openMapMenu":
					return PLAYER.showMap;
				case "shareToFacebook":
					return getFacebookOnClick();
				case "shareToTwitter":
					return getTwitterLink();
				case "showEmbedCode":
					return showEmbedCode;
				case "toggleMute":
					return PLAYER.toggleMute;
				case "mute":
					return PLAYER.mute;
				case "unmute":
					return PLAYER.unmute;
				case "toggleFullScreen":
					return PLAYER.toggleFullScreen;
				case "enterFullScreen":
					return PLAYER.enterFullScreen;
				case "exitFullScreen":
					return PLAYER.exitFullScreen;
				case "togglePlayPause":
					return PLAYER.togglePause;
				case "play":
					return PLAYER.resume;
				case "pause":
					return PLAYER.pause;
				case "openSequence":
					return params ? function () {
						PLAYER.openSequence(params);
					} : null;
				case "openOverlay":
					return params ? function () {
						PLAYER.openOverlay(params);
					} : null;
				default:
					return null;
			}
		}
	}
	
	function getFacebookOnClick() {
		return function () {
			var baseURL = document.location.origin + document.location.pathname;
			baseURL = baseURL.substring(0, baseURL.lastIndexOf("/") + 1);
			var url = 'http://www.facebook.com/sharer.php?s=100' +
				'&p[url]=' + data.social.facebookLink +
				'&p[title]=' + data.social.facebookTitle +
				'&p[images][0]=' + baseURL + data.social.facebookLogo +
				'&p[summary]=' + data.social.facebookMessage;
						
			window.open(url, '_blank');
		};
	}
	
	function getTwitterLink() {
		return function () {
			var url = 'http://twitter.com/intent/tweet?' +
				'original_referer=' + data.social.twitterLink +
				'/&text=' + data.social.twitterMessage + ' - ' + data.social.twitterLink;
						
			window.open(url, '_blank');
		};
	}

	function addButton(id, className, onClick) {
		var button = document.createElement('div');
		button.id = id;
		button.className = className;
		$(button).click(onClick);
		$("#player").append(button);
		$(button).tooltip({
	      track: true
	    });
		return button;
	}
}
