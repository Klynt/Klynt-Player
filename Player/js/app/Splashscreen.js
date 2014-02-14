/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of the splashscreen module which displays the splashscreen view,
 * loads the remaining player files then initializes the player and removes the splashscreen.
 * */

(function (klynt) {
	var accessors = {
		get finished() {
			return finished;
		}
	};

	klynt.getModule('splashscreen').expose(accessors, init);

	var finished = false;
	var $splashscreen, $logo;
	var count = 0;

	var playerCssFiles = [
		'Player/js/libs/jquery-ui-1.10.3.custom/css/ui-lightness/jquery-ui-1.10.3.custom.css',
		'Player/css/player/media-element/mediaelementplayer.css',
		'Player/css/player/player.css',
		'Player/css/player/message.css',
		'Player/css/player/nanoscroller.css',
		'Player/css/editor/player.css',
		'Player/css/editor/texts.css',
		'Player/css/editor/fonts.css',
		'Player/css/editor/buttons.css',
		'Resources/css/player.css'
	];

	var playerJSFiles = [
		'Player/js/libs/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.min.js',
		'Player/js/libs/jquery.cookie.js',
		'Player/js/libs/jquery.hammer.min.js',
		'Player/js/libs/modernizr.custom.93084.js',
		'Player/js/libs/jquery.nanoscroller.min.js',
		'Player/js/libs/mediaelement/mediaelement-and-player.js',
		'Player/js/libs/timesheets.js',
		'Player/js/app/Utils.js',
		'data.js',
		'Player/js/app/model/Sequence.js',
		'Player/js/app/model/Link.js',
		'Player/js/app/model/Style.js',
		'Player/js/app/model/Element.js',
		'Player/js/app/model/Button.js',
		'Player/js/app/model/Text.js',
		'Player/js/app/model/Shape.js',
		'Player/js/app/model/iFrame.js',
		'Player/js/app/model/Image.js',
		'Player/js/app/model/Media.js',
		'Player/js/app/model/Video.js',
		'Player/js/app/model/ExternalVideo.js',
		'Player/js/app/model/Audio.js',
		'Player/js/app/model/Transition.js',
		'Player/js/app/model/ElementTransition.js',
		'Player/js/app/model/Animation.js',
		'Player/js/app/model/Action.js',
		'Player/js/app/Sequences.js',
		'Player/js/app/Hashtag.js',
		'Player/js/app/Fullscreen.js',
		'Player/js/app/Metadata.js',
		'Player/js/app/Stats.js',
		'Player/js/app/Analytics.js',
		'Player/js/app/SequenceManager.js',
		'Player/js/app/SequenceContainer.js',
		'Player/js/app/renderer/StyleRenderer.js',
		'Player/js/app/renderer/ElementRenderer.js',
		'Player/js/app/renderer/ButtonRenderer.js',
		'Player/js/app/renderer/TextRenderer.js',
		'Player/js/app/renderer/ShapeRenderer.js',
		'Player/js/app/renderer/iFrameRenderer.js',
		'Player/js/app/renderer/ImageRenderer.js',
		'Player/js/app/renderer/MediaRenderer.js',
		'Player/js/app/renderer/VideoRenderer.js',
		'Player/js/app/renderer/ExternalVideoRenderer.js',
		'Player/js/app/renderer/AudioRenderer.js',
		'Player/js/app/renderer/SequenceRenderer.js',
		'Player/js/app/renderer/OverlayRenderer.js',
		'Player/js/app/renderer/transition/TransitionRenderer.js',
		'Player/js/app/renderer/transition/NoTransitionRenderer.js',
		'Player/js/app/renderer/transition/SlideTransitionRenderer.js',
		'Player/js/app/renderer/transition/FadeTransitionRenderer.js',
		'Player/js/app/renderer/transition/PopTransitionRenderer.js',
		'Player/js/app/renderer/transition/FlipTransitionRenderer.js',
		'Player/js/app/renderer/ElementTransitionRenderer.js',
		'Player/js/app/renderer/AnimationRenderer.js',
		'Player/js/app/renderer/ScoutRenderer.js',
		'Player/js/app/Player.js',
		'Player/js/app/Footer.js',
		'Player/js/app/view/modal/Share.js',
		'Player/js/app/view/menu/MenuItem.js',
		'Player/js/app/view/menu/Dashboard.js',
		'Player/js/app/view/menu/Index.js',
		'Player/js/app/view/menu/Map.js',
		'Player/js/app/view/menu/Search.js',
		'Player/js/app/view/menu/Credits.js',
		'Player/js/app/Menu.js',
		'Player/js/app/KlyntAPIHandler.js',
		'Player/js/app/KlyntAPICore.js'
	];

	function init() {

		if (!('backgroundPositionY' in document.createElement('div').style)) {
			$.cssHooks.backgroundPositionY = {
				get: function (elem, computed, extra) {
					return $.css(elem, 'backgroundPosition').split(' ')[1];
				},
				set: function (elem, value) {
					elem.style.backgroundPosition = $.css(elem, 'backgroundPosition').split(' ')[0] + ' ' + value;
				}
			};
		}

		if (klynt.params.miniPlayer) {
			$(document).on('fullscreenchange mozfullscreenchange webkitfullscreenchange MSFullscreenChange', onFullscreenChange);
		}

		$splashscreen = $('<div>', {
			id: 'splashscreen'
		});

		$logo = $('<div>', {
			id: 'logo'
		});

		$('#player-container').append($splashscreen.append($logo));

		if (klynt.params.miniPlayer) {
			$splashscreen.css({
				width: screen.width,
				height: screen.height,
				top: 0
			});
		}

		$logo.animate({
			opacity: 1,
			backgroundPositionY: '50%'
		}, 500, 'swing');

		loadSequence();

		setTimeout(function () {
			hideSplashscreen();
		}, 500);
	}

	function loadSequence() {
		LazyLoad.css(playerCssFiles, function () {
			LazyLoad.js(playerJSFiles, function () {
				if ((klynt.data.general.level === 0) && (document.location.protocol !== 'file:')) {
					errorMessage();
				} else {
					initPlayer();

					hideSplashscreen();

					if (klynt.params.miniPlayer) {
						klynt.miniPlayer.initBind();
					}
				}
			});
		});

		function initPlayer() {
			klynt.player.init();
			klynt.sequences.init();
			klynt.metadata.init();
			klynt.hashtag.init();
			klynt.stats.init();
			klynt.analytics.init();
			klynt.sequenceContainer.init();
			klynt.menu.init();
			klynt.footer.init();
		}

		function errorMessage() {
			var $messageDiv = $('<div>', {
				id: 'message'
			});
			$messageDiv.append('<p>You still use the trial version of Klynt<br/>To publish online, <a href="http://www.klynt.net/pricingklynt/" target="_blank">see our different offers and upgrade</a></p>');
			$('#player-container').append($messageDiv);
			$splashscreen.remove();
		}
	}

	function hideSplashscreen() {
		count++;
		if (count > 1) {
			$logo.animate({
				opacity: 0,
				backgroundPositionY: '53%'
			}, 500, 'swing', function () {
				if (klynt.params.miniPlayer) {
					klynt.player.setDimensions(screen.width, screen.height);
					klynt.menu.resetDimensions();
					klynt.player.$element.trigger('open.fullscreen');
				}

				$splashscreen.fadeOut(500, function () {
					finished = true;

					if ((document.fullscreen === true) || (document.mozFullScreen === true) || (document.webkitIsFullScreen === true)) {
						klynt.player.show();
						klynt.player.start();
					} else if (!klynt.params.miniPlayer) {
						klynt.player.start();
					}

					$(document).off('fullscreenchange mozfullscreenchange webkitfullscreenchange MSFullscreenChange', onFullscreenChange);
					$(this).remove();
				});
			});
		}
	}

	function onFullscreenChange() {
		if ((document.fullscreen == false) || (document.mozFullScreen === false) || (document.webkitIsFullScreen == false)) {
			$splashscreen.hide();
			if (klynt.params.miniPlayer) {
				klynt.miniPlayer.changeMode(true);
			}
		} else if (!finished) {
			$splashscreen.show();
		}
	}
})(window.klynt);