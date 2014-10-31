/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
	klynt.PopTransitionRenderer = function (model) {
		klynt.TransitionRenderer.call(this, model);
	};

	klynt.PopTransitionRenderer.prototype = {};

	klynt.PopTransitionRenderer.prototype.execute = function (source, target) {
		klynt.TransitionRenderer.prototype.execute.call(this, source, target);

		var paramsAnimation = {
			duration: this.duration / 1000,
			fromProperties: {
				opacity: 0,
				scale: 0.2

			},
			toProperties: {
				opacity: 1,
				scale: 1
			}
		}

		paramsAnimation.toProperties.onComplete = function () {
			this._notifyComplete();
		}.bind(this);

		klynt.animation.fromTo(paramsAnimation, target.$element);
	};

	klynt.PopTransitionRenderer.prototype = klynt.utils.mergePrototypes(klynt.TransitionRenderer, klynt.PopTransitionRenderer);
})(window.klynt);