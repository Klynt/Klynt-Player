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
	var $splashscreen, $logo, loader;
	var count = 0;

	var playerCssFiles = [
		'Player/js/libs/jquery-ui-1.10.3.custom/css/ui-lightness/jquery-ui-1.10.3.custom.css',
		'Player/css/player/media-element/mediaelementplayer.css',
		'Player/css/player/media-element/mejs-skin.css',
		'Player/css/player/player.css',
		'Player/css/player/message.css',
		'Player/css/player/nanoscroller.css',
		'Player/css/editor/mejs-skin.css',
		'Player/css/editor/player.css',
		'Player/css/editor/texts.css',
		'Player/css/editor/fonts.css',
		'Player/css/editor/buttons.css',
		'Resources/css/player.css'
	];

	var playerLibFiles = [
		'Player/js/libs/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.js',
		'Player/js/libs/jquery.cookie.js',
		'Player/js/libs/jquery.hammer.min.js',
		'Player/js/libs/modernizr.custom.93084.js',
		'Player/js/libs/jquery.nanoscroller.min.js',
		'Player/js/libs/TweenMax.min.js',
		'Player/js/libs/mediaelement/mediaelement-and-player.js',
		'Player/js/libs/timesheets.js',
		'Player/js/libs/jquery.autoellipsis.js',
		'Player/js/libs/sigmajs/sigma.min.js'
	];

	var playerJSFiles = [
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
		'Player/js/app/model/Annotation.js',
		'Player/js/app/model/Transition.js',
		'Player/js/app/model/ElementTransition.js',
		'Player/js/app/model/Animation.js',
		'Player/js/app/model/Interaction.js',
		'Player/js/app/Animation.js',
		'Player/js/app/Action.js',
		'Player/js/app/Sequences.js',
		'Player/js/app/Hashtag.js',
		'Player/js/app/Fullscreen.js',
		'Player/js/app/Metadata.js',
		'Player/js/app/Stats.js',
		'Player/js/app/Events.js',
		'Player/js/app/Loader.js',
		'Player/js/app/SequenceManager.js',
		'Player/js/app/SequenceContainer.js',
		'Player/js/app/ContinuousAudio.js',
		'Player/js/app/renderer/ElementRenderer.js',
		'Player/js/app/renderer/ButtonRenderer.js',
		'Player/js/app/renderer/TextRenderer.js',
		'Player/js/app/renderer/ShapeRenderer.js',
		'Player/js/app/renderer/iFrameRenderer.js',
		'Player/js/app/renderer/ImageRenderer.js',
		'Player/js/app/renderer/MediaRenderer.js',
		'Player/js/app/renderer/VideoRenderer.js',
		'Player/js/app/renderer/AudioRenderer.js',
		'Player/js/app/renderer/AnnotationRenderer.js',
		'Player/js/app/renderer/SequenceRenderer.js',
		'Player/js/app/renderer/OverlayRenderer.js',
		'Player/js/app/renderer/interaction/InteractionRenderer.js',
		'Player/js/app/renderer/interaction/ActionInteractionRenderer.js',
		'Player/js/app/renderer/interaction/StyleInteractionRenderer.js',
		'Player/js/app/renderer/interaction/LayoutInteractionRenderer.js',
		'Player/js/app/renderer/transition/TransitionRenderer.js',
		'Player/js/app/renderer/transition/NoTransitionRenderer.js',
		'Player/js/app/renderer/transition/SlideTransitionRenderer.js',
		'Player/js/app/renderer/transition/FadeTransitionRenderer.js',
		'Player/js/app/renderer/transition/PopTransitionRenderer.js',
		'Player/js/app/renderer/transition/FlipTransitionRenderer.js',
		'Player/js/app/renderer/transition/TouchTransitionRenderer.js',
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
		'Player/js/app/view/menu/sigmaRenderers/sigma.canvas.edges.klynt.js',
		'Player/js/app/view/menu/sigmaRenderers/sigma.canvas.nodes.klynt.js',
		'Player/js/app/view/menu/sigmaRenderers/sigma.canvas.labels.klynt.js',
		'Player/js/app/view/menu/sigmaRenderers/sigma.canvas.hovers.klynt.js',
		'Player/js/app/view/menu/Mindmap.js',
		'Player/js/app/Menu.js',
		'Player/js/app/KlyntAPIHandler.js',
		'Player/js/app/KlyntAPICore.js'
	];
	if (!klynt.analytics) {
		playerJSFiles.unshift('Player/js/app/Analytics.js');
	}
	if (!klynt.utils) {
		playerJSFiles.unshift('Player/js/app/Utils.js');
	}

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

		$splashscreen = $('<div id="splashscreen">').appendTo($('#player-container'));
		$logo = $('<div id="logo">').appendTo($splashscreen);


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

		loadPlayer();

		setTimeout(function () {
			hideSplashscreen();
		}, 500);
	}

	function loadPlayer() {
		var referenceTime = new Date().getTime();

		var count = playerCssFiles.length + playerLibFiles.length + playerJSFiles.length;
		this.loader = new klynt.LoaderView($splashscreen, count, function () {
			hideSplashscreen();
		});

		LazyLoad.css(playerCssFiles, function () {
			LazyLoad.js(playerLibFiles, function () {
				LazyLoad.js(playerJSFiles, function () {
					if (klynt.data.general.level === 0 && !klynt.utils.browser.local) {
						errorMessage();
					} else if (klynt.data.advanced.hasRemoteVideos && !klynt.utils.browser.local) {
						estimateBandwith();
					} else {
						handlePlayerLoaded();
					}
				}, this.loader);
			}, this.loader);
		}, this.loader);

		function estimateBandwith() {
			LazyLoad.js('Player/js/app/Bandwidth.js', function () {
				var filesLoadTime = new Date().getTime() - referenceTime;
				klynt.bandwidth.estimateBandwidth(filesLoadTime, handlePlayerLoaded);
			});
		}

		function handlePlayerLoaded() {
			initPlayer();
			
			var startupImages = klynt.loader.getSequenceStartupImages(klynt.sequences.startupSequence);
			this.loader.addImageFilesToQueue(startupImages ? startupImages.length : 0);

			klynt.loader.prepareForSequence(klynt.sequences.startupSequence, function() {
				hideSplashscreen();

				if (klynt.params.miniPlayer) {
					klynt.miniPlayer.initBind();
				}
			}, null, function () {
				this.loader.incrementLoaded();
			}.bind(this));
		}

		function initPlayer() {
			klynt.player.init();
			klynt.sequences.init();
			klynt.metadata.init();
			klynt.hashtag.init();
			klynt.stats.init();
			klynt.analytics.init();
			klynt.sequenceContainer.init();
			klynt.continuousAudio.init();
			klynt.menu.init();
			klynt.footer.init();
			klynt.events.init();
			klynt.player.$element.on('open.sequence open.overlay', klynt.analytics.handleSequenceEvent);
			klynt.player.prefetchStartSequenceVideos();
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
		if (count > 2) {
			if (this.loader) {
				this.loader.hide();
			}

			$logo.animate({
				opacity: 0,
				backgroundPositionY: '53%'
			}, 500, 'swing', function () {
				if (klynt.params.miniPlayer) {
					if (!klynt.player.scaleToFullWindow) {
						klynt.player.setDimensions(screen.width, screen.height);
						klynt.menu.resetDimensions();
					}
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