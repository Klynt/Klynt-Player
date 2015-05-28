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

		var duration = this.duration / 1000;
		
		var fromProperties = {
			opacity: 0,
			scale: 0.2
		};

		var toProperties = {
			opacity: 1,
			scale: 1,
			onComplete : this._notifyComplete.bind(this)
		}

		klynt.animation.to({duration: 0, properties: fromProperties}, target.$element);

		this.prepareForTarget(source, target, function () {
			klynt.animation.to({duration: duration, properties: toProperties}, target.$element);
		});
	};

	klynt.PopTransitionRenderer.prototype = klynt.utils.mergePrototypes(klynt.TransitionRenderer, klynt.PopTransitionRenderer);
})(window.klynt);