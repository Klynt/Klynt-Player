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

		var paramsAnimation = {
			duration: this.duration / 1000,
			fromProperties: {
				opacity: 0.8,
				rotationY: 180

			},
			toProperties: {
				opacity: 1,
				rotationY: 0
			}
		}

		paramsAnimation.toProperties.onComplete = function () {
			this._notifyComplete();
		}.bind(this);

		klynt.animation.fromTo(paramsAnimation, target.$element);
	};

	klynt.FlipTransitionRenderer.prototype = klynt.utils.mergePrototypes(klynt.TransitionRenderer, klynt.FlipTransitionRenderer);
})(window.klynt);