/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of continuous audio.
 * */

(function (klynt) {
	klynt.getModule('continuousAudio').expose(init, add, retrieve, clean);

	var $sequenceAudiosContainer = null;
	var $overlayAudiosContainer = null;
	var sequenceContinuousAudios = [];
	var overlayContinuousAudios = [];

	function init() {
		$sequenceAudiosContainer = $('<div>').attr('id', 'sequence-audio-container');
		$overlayAudiosContainer = $('<div>').attr('id', 'overlay-audio-container');

		$('<div id="continuous-audio-container">')
			.appendTo(klynt.sequenceContainer.$element)
			.append($sequenceAudiosContainer)
			.append($overlayAudiosContainer);
	}

	function add($audio, mediaId, overlay) {
		$audio[0].continuousMediaId = mediaId;

		var $container = overlay ? $overlayAudiosContainer : $sequenceAudiosContainer;
		$container.append($audio);
	}

	function retrieve(mediaId, overlay) {
		var continuousAudios = overlay ? overlayContinuousAudios : sequenceContinuousAudios;
		for (var i = 0; i < continuousAudios.length; i++) {
			var audio = continuousAudios[i];

			if (audio.continuousMediaId == mediaId && !audio.paused) {
				continuousAudios.splice(i, 1);
				return $(audio);
			}
		}

		return null;
	}

	function clean(overlay) {
		var continuousAudios = [];
		var $container = overlay ? $overlayAudiosContainer : $sequenceAudiosContainer;

		klynt.sequenceContainer.currentRenderers.forEach(function (sequenceRenderer) {
			if (sequenceRenderer.isOverlay == overlay) {
				sequenceRenderer.audioRenderers.forEach(function (audioRenderer) {
					if (audioRenderer.$mediaElement[0].continuousMediaId) {
						continuousAudios.push(audioRenderer.$mediaElement[0]);
					};
				});
			}
		});

		$container.children().each(function () {
			if (continuousAudios.indexOf(this) == -1) {
				$(this).remove();
			}
		});

		if (overlay) {
			overlayContinuousAudios = continuousAudios;
		} else {
			sequenceContinuousAudios = continuousAudios;
		}
	}
})(window.klynt);