/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of the api commands.
 * */

APIHandler.defineCommand('openUrl', function (url) {
	klynt.action.openUrl(url);
});

APIHandler.defineCommand('share', function () {
	klynt.action.openModalShare();
});

APIHandler.defineCommand('toggleMute', function (id) {
	klynt.action.toggleMute(id);
});

APIHandler.defineCommand('mute', function (id) {
	klynt.action.mute(id);
});

APIHandler.defineCommand('unmute', function (id) {
	klynt.action.unmute(id);
});

APIHandler.defineCommand('toggleFullScreen', function () {
	klynt.action.toggleFullScreen();
});

APIHandler.defineCommand('enterFullScreen', function () {
	klynt.action.requestFullscreen();
});

APIHandler.defineCommand('exitFullScreen', function () {
	klynt.action.exitFullScreen();
});

APIHandler.defineCommand('togglePlayPause', function (id) {
	klynt.action.togglePlayPause(id);
});

APIHandler.defineCommand('play', function (id) {
	klynt.action.play(id);
});

APIHandler.defineCommand('pause', function (id) {
	klynt.action.pause(id);
});

APIHandler.defineCommand('seek', function (time, id) {
	klynt.action.seekTo(time, id);
});

APIHandler.defineCommand('seekDelta', function (delta, id) {
	klynt.action.seekDelta(delta, id);
});

APIHandler.defineCommand('openSequence', function (params) {
	klynt.player.open(APIHandler.getLinkFromParams(params, false));
});

APIHandler.defineCommand('openOverlay', function (params) {
	klynt.player.open(APIHandler.getLinkFromParams(params, true));
});

APIHandler.getLinkFromParams = function (params, overlay) {
	if (typeof params === 'string') {
		params = {
			targetSequence: params
		}
	}

	params.overlay = overlay || params.overlay;
	params.type = 'linkToSequence';

	return new klynt.Link(params);
};

APIHandler.defineCommand('openWidget', function (id) {
	klynt.action.openWidget(id);
});

APIHandler.defineCommand('closeOverlay', function () {
	klynt.action.closeOverlay();
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