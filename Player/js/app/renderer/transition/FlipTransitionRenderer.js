/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
	klynt.FlipTransitionRenderer = function (model) {
		klynt.TransitionRenderer.call(this, model);
	};

	klynt.FlipTransitionRenderer.prototype = {};

	klynt.FlipTransitionRenderer.prototype.execute = function (source, target) {
		klynt.TransitionRenderer.prototype.execute.call(this, source, target);

		var duration = this.duration / 1000;

		var fromProperties = {
			opacity: 0,
			rotationY: 180
		}

		var toProperties = {
			opacity: 1,
			rotationY: 0,
			onComplete : this._notifyComplete.bind(this)
		}

		klynt.animation.to({duration: 0, properties: fromProperties}, target.$element);

		this.prepareForTarget(source, target, function () {
			klynt.animation.to({duration: duration, properties: toProperties}, target.$element);
		});
	};

	klynt.FlipTransitionRenderer.prototype = klynt.utils.mergePrototypes(klynt.TransitionRenderer, klynt.FlipTransitionRenderer);
})(window.klynt);