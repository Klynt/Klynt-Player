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

		target.$element.stop().addClass('pop');

		window.setTimeout(function () {
			target.$element.removeClass('pop');
			this._notifyComplete();
		}.bind(this), this.duration);
	};

	klynt.PopTransitionRenderer.prototype = klynt.utils.mergePrototypes(klynt.TransitionRenderer, klynt.PopTransitionRenderer);
})(window.klynt);