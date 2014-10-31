/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
	klynt.PositionInteractionRenderer = function (model, sequence) {
		klynt.InteractionRenderer.call(this, model, sequence);
	};

	klynt.PositionInteractionRenderer.prototype = {
		_tween: null,
		_position: {}
	};

	klynt.PositionInteractionRenderer.prototype._doExecute = function () {
		klynt.InteractionRenderer.prototype._doExecute.call(this);

		if (this._tween && this._model.reversible) {
			this._tween.restart();
		} else {
			this._tween = klynt.animation.to(this._getAnimProperties(this._model), this._targetRenderer.$element);
		}
	};

	klynt.PositionInteractionRenderer.prototype._doPause = function () {
		klynt.InteractionRenderer.prototype._doPause.call(this);

		if (this._tween) {
			this._tween.pause();
		}
	};

	klynt.PositionInteractionRenderer.prototype._doReverse = function () {
		klynt.InteractionRenderer.prototype._doReverse.call(this);

		if (this._tween) {
			this._tween.reverse();
		}
	};

	klynt.PositionInteractionRenderer.prototype._getAnimProperties = function () {
		var value = parseFloat(this._model.value);
		var element = this._targetRenderer.element;
		var calc = klynt.utils.browser.webkit ? '-webkit-calc' : 'calc';
		var properties = {};
		var positions = this._targetRenderer.getPositionFromDOM();

		switch (this._model.name) {
		case 'top':
			if (hasProperty('top')) {
				properties.top = value;
			}
			break;
		case 'left':
			if (hasProperty('left')) {
				properties.left = value;
			}
			break;
		case 'right':
			if (hasProperty('right')) {
				properties.right = value;
			}
			break;
		case 'bottom':
			if (hasProperty('bottom')) {
				properties.bottom = value;
			}
			break;
		case 'width':
			if (hasProperty('width')) {
				properties.width = value;
			}
			if (hasProperty('centerX')) {
				properties.left = calc + '(50% + ' + (positions.centerX - value / 2) + 'px)';
			}
			break;
		case 'height':
			if (hasProperty('height')) {
				properties.height = value;
			}
			if (hasProperty('centerY')) {
				properties.top = calc + '(50% + ' + (positions.centerY - value / 2) + 'px)';
			}
			break;
		case 'centerX':
			if (hasProperty('centerX')) {
				properties.left = calc + '(50% + ' + (value - positions.width / 2) + 'px)';
			}
			break;
		case 'centerY':
			if (hasProperty('centerY')) {
				properties.top = calc + '(50% + ' + (value - positions.height / 2) + 'px)';
			}
			break;
		case 'moveX':
			if (hasProperty('centerX')) {
				properties.left = calc + '(50% + ' + (positions.centerX + value - positions.width / 2) + 'px)';
			}
			if (hasProperty('left')) {
				properties.left = positions.left + value;
			}
			if (hasProperty('right')) {
				properties.right = positions.right - value;
			}
			break;
		case 'moveY':
			if (hasProperty('centerY')) {
				properties.top = calc + '(50% + ' + (positions.centerY + value - positions.height / 2) + 'px)';
			}
			if (hasProperty('top')) {
				properties.top = positions.top + value;
			}
			if (hasProperty('bottom')) {
				properties.bottom = positions.bottom - value;
			}
			break;
		}

		return {
			duration: this._model.duration,
			easing: this._model.easing,
			properties: properties
		};

		function hasProperty(property) {
			return element[property] !== undefined;
		}
	};

	klynt.PositionInteractionRenderer.prototype = klynt.utils.mergePrototypes(klynt.InteractionRenderer, klynt.PositionInteractionRenderer);
})(window.klynt);