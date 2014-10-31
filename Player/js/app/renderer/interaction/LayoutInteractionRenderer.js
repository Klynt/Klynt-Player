/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
	klynt.LayoutInteractionRenderer = function (model, sequence) {
		klynt.InteractionRenderer.call(this, model, sequence);
	};

	klynt.LayoutInteractionRenderer.prototype = {
		_tween: null,
		_position: {},
		_changedRatio: false,
		_state: false
	};

	klynt.LayoutInteractionRenderer.prototype._doExecute = function () {
		klynt.InteractionRenderer.prototype._doExecute.call(this);

		if (this._tween && this._model.reversible && !this._changedRatio) {
			this._tween.restart();
		} else {
			this._tween = klynt.animation.to(this._getAnimProperties(), this.targetRenderer.$element);
			this._changedRatio = false;
			this._state = true;
		}
	};

	klynt.LayoutInteractionRenderer.prototype._doPause = function () {
		klynt.InteractionRenderer.prototype._doPause.call(this);

		if (this._tween) {
			this._tween.pause();
		}
	};

	klynt.LayoutInteractionRenderer.prototype._doReverse = function () {
		klynt.InteractionRenderer.prototype._doReverse.call(this);

		if (this._tween) {
			this._tween.reverse();
			this._state = false;
		}
	};

	klynt.LayoutInteractionRenderer.prototype._upadteRatio = function () {
		this._changedRatio = true;

		if (this._state) {
			var stopTime = this._tween.totalProgress() * this._tween.totalDuration();
			this._tween.pause(0).kill();
			this._doExecute();
			this._tween.seek(stopTime);

			if (this._tween._onUpdate) {
				this._tween._onUpdate(this._tween);
			}
		}
	};

	klynt.LayoutInteractionRenderer.prototype._getAnimProperties = function () {
		var value = parseFloat(this._model.value);
		var renderer = this.targetRenderer;
		var element = renderer.element;
		var calc = klynt.utils.browser.webkit ? '-webkit-calc' : 'calc';
		var properties = {};
		var positions = this.targetRenderer.getPositionFromDOM();

		var transformOrigin = positions.transformOrigin;
		var scale = positions.matrix[0] || 1;
		var tx = positions.matrix[4] || 0;
		var ty = positions.matrix[5] || 0;

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
				properties.left = calc + '(50% + ' + (parseFloat(element.centerX) - value / 2) + 'px)';

				properties.onUpdate = function (tween) {
					var progress = tween.totalProgress();
					var tsOrigin = (progress * ((value / 2) - transformOrigin[0]) + transformOrigin[0]) + 'px ' + transformOrigin[1] + 'px';

					TweenLite.set(tween._targets[0], {
						transformOrigin: tsOrigin
					});
				}
				properties.onUpdateParams = ['{self}'];
			}
			break;
		case 'height':
			if (hasProperty('height')) {
				properties.height = value;
			}
			if (hasProperty('centerY')) {
				properties.top = calc + '(50% + ' + (parseFloat(element.centerY) - value / 2) + 'px)';

				properties.onUpdate = function (tween) {
					var progress = tween.totalProgress();
					var tsOrigin = transformOrigin[0] + 'px ' + (progress * ((value / 2) - transformOrigin[1]) + transformOrigin[1]) + 'px';

					TweenLite.set(tween._targets[0], {
						transformOrigin: tsOrigin
					});
				}
				properties.onUpdateParams = ['{self}'];
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
			var originalValue;
			var newValue = value * scale;

			if (hasProperty('centerX')) {
				originalValue = parseFloat((positions.centerX - positions.width / 2) / scale);
				properties.left = calc + '(50% + ' + (originalValue + newValue) + 'px)';
			}
			if (hasProperty('left')) {
				originalValue = positions.left / scale;
				properties.left = originalValue + newValue;
			}
			if (hasProperty('right')) {
				originalValue = positions.right / scale;
				properties.right = positions.right - newValue;
			}
			break;
		case 'moveY':
			var originalValue;
			var newValue = value * scale;

			if (hasProperty('centerY')) {
				originalValue = parseFloat((positions.centerY - positions.height / 2) / scale);
				properties.top = calc + '(50% + ' + (originalValue + newValue) + 'px)';
			}
			if (hasProperty('top')) {
				originalValue = positions.top / scale;
				properties.top = originalValue + newValue;
			}
			if (hasProperty('bottom')) {
				originalValue = positions.bottom / scale;
				properties.bottom = originalValue - newValue;
			}
			break;
		case 'zoom':
			properties.onUpdate = function (tween) {
				var value = 3;
				var initValue = 1;
				var diff = value - initValue;
				var progress = tween.totalProgress();
				var css = renderer.zoom(initValue + diff * progress);
				renderer.$image.css(css);
			};
			properties.onUpdateParams = ['{self}'];
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

	klynt.LayoutInteractionRenderer.prototype = klynt.utils.mergePrototypes(klynt.InteractionRenderer, klynt.LayoutInteractionRenderer);
})(window.klynt);