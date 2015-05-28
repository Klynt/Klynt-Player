/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of the miniplayer module. A miniplayer allows the embed of the player in
 * another webpage in a space smaller sizes than actual player size.
 * */

(function (klynt) {
	klynt.getModule('miniPlayer').expose(init, initBind, changeMode);

	var testInit = true;
	var miniPlayer;

	function init() {
		miniPlayer = new klynt.MiniPlayer(klynt.params.miniPlayer, klynt.miniPlayerData);

		miniPlayer.$element.find('.miniplayer-button').click(function () {
			var ua = navigator.userAgent;
			var safariVersion;
			var safari = false;
			var chrome = false;

			if (ua.lastIndexOf('Safari/') > 0) {
				safari = true;
				safariVersion = parseInt(ua.substr(ua.lastIndexOf('Version/') + 8, 1));
			}

			if (ua.lastIndexOf('Chrome/') > 0) {
				chrome = true;
			}

			if (safari && !chrome && safariVersion < 7) {

				window.open('index.html', '_blank');
			} else {
				fullscreen();
			}
		});

		miniPlayer.$element.find('.yes').click(function () {
			fullscreen();
			klynt.player.start();
		});

		miniPlayer.$element.find('.no').click(function () {
			changeMode(false);
		});

		klynt.analytics.init();
		klynt.analytics.trackPageView('miniplayer');
	}

	function fullscreen() {
		var player = $('#player-container')[0];

		if (document.fullscreenEnabled) {
			player.requestFullScreen();
		} else if (document.msFullscreenEnabled) {
			player.msRequestFullscreen();
		} else if (document.webkitFullscreenEnabled) {
			player.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		} else if (document.mozFullScreenEnabled) {
			player.mozRequestFullScreen();
		} else {
			window.open(klynt.miniPlayerData.url, '_blank');
			return;
		}

		if (testInit) {
			klynt.loadSplashscreen();
			testInit = false;
		} else if (klynt.splashscreen.finished) {
			klynt.menu.close();
			klynt.player.show();
			klynt.player.start();
		}
	}

	function initBind() {
		klynt.player.$element.bind('close.fullscreen', function () {
			klynt.player.hide();

			if (klynt.splashscreen.finished) {
				klynt.player.pause();
			}

		});
	}

	function changeMode(test) {
		if (test) {
			miniPlayer.$element.find('.miniplayer-return').show();
			miniPlayer.$element.find('.miniplayer-info, .miniplayer-menu, .miniplayer-info, .miniplayer-button, .miniplayer-text-title, .miniplayer-text-subtitle').hide();
		} else {
			miniPlayer.$element.find('.miniplayer-return').hide();
			miniPlayer.$element.find('.miniplayer-info, .miniplayer-menu, .miniplayer-info, .miniplayer-button, .miniplayer-text-title, .miniplayer-text-subtitle').show();
		}
	}

})(window.klynt);