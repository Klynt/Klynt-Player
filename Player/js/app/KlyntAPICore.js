/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of the api commands.
 * */

APIHandler.defineCommand('openUrl', function (url) {
	if (url) {
		window.open(url, '_blank');
	}
});

APIHandler.defineCommand('share', function () {
	klynt.player.toggleModal(klynt.ShareModal);
});

APIHandler.defineCommand('toggleMute', function () {
	klynt.player.toggleMute();
});

APIHandler.defineCommand('mute', function () {
	klynt.player.mute();
});

APIHandler.defineCommand('unmute', function () {
	klynt.player.unmute();
});

APIHandler.defineCommand('toggleFullScreen', function () {
	klynt.fullscreen.toggle();
});

APIHandler.defineCommand('enterFullScreen', function () {
	klynt.fullscreen.toggle();
});

APIHandler.defineCommand('exitFullScreen', function () {
	klynt.fullscreen.toggle();
});

APIHandler.defineCommand('togglePlayPause', function () {
	klynt.player.togglePlayPause();
});

APIHandler.defineCommand('seek', function (time) {
	klynt.player.seekTo(time);
});

APIHandler.defineCommand('play', function () {
	klynt.player.play();
});

APIHandler.defineCommand('pause', function () {
	klynt.player.pause();
});

APIHandler.defineCommand('openSequence', function (params) {
	klynt.player.open(params);
});

APIHandler.defineCommand('openOverlay', function (params) {
	if (typeof params === 'string') {
		klynt.sequenceManager.openLink({
			target: params,
			overlay: true,
			type: 'linkToSequence'
		});
	}
});

APIHandler.defineCommand('openWidget', function (id) {
	klynt.menu.initWidget(id, -1);
});

APIHandler.defineCommand('closeOverlay', function () {
	klynt.sequenceManager.closeOverlay();
});

/* Old commands kept for compatibility*/

APIHandler.defineCommand('shareToFacebook', function () {
	klynt.player.toggleModal(klynt.ShareModal);
});

APIHandler.defineCommand('shareToTwitter', function () {
	klynt.player.toggleModal(klynt.ShareModal);
});

APIHandler.defineCommand('showEmbedCode', function () {
	klynt.player.toggleModal(klynt.ShareModal);
});

APIHandler.defineCommand('openLogoLink', function () {
	if (klynt.data.footer.logoLink) {
		window.open(klynt.data.footer.logoLink, '_blank');
	}
});