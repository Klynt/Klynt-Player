/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
	klynt.ShapeRenderer = function (element, $parent) {
		klynt.ElementRenderer.call(this, element, $parent);
	};

	klynt.ShapeRenderer.prototype._initDOM = function () {
		klynt.ElementRenderer.prototype._initDOM.call(this);
		this._$element.addClass('shape');
	};

	klynt.ShapeRenderer.prototype = klynt.utils.mergePrototypes(klynt.ElementRenderer, klynt.ShapeRenderer);
})(window.klynt);