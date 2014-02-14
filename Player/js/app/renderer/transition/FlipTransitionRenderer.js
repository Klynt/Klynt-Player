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

		this._result = target;
		this._discarded = source;

		target.$element.stop().addClass('flip');
		window.setTimeout(function () {
			target.$element.removeClass('flip');
			this._notifyComplete();
		}.bind(this), this.duration);
	};

	klynt.FlipTransitionRenderer.prototype = klynt.utils.mergePrototypes(klynt.TransitionRenderer, klynt.FlipTransitionRenderer);
})(window.klynt);