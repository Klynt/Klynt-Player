/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
	klynt.EffectInteractionRenderer = function (model, sequence) {
		klynt.InteractionRenderer.call(this, model, sequence);
	};

	klynt.EffectInteractionRenderer.prototype = {
		_tween: null
	};

	klynt.EffectInteractionRenderer.prototype._doExecute = function () {
		klynt.InteractionRenderer.prototype._doExecute.call(this);

		if (this._tween && this._model.reversible) {
			this._tween.restart();
		} else {
			this._tween = klynt.animation.to(this._getAnimProperties(this._model), this._targetRenderer.$element);
		}
	};

	klynt.EffectInteractionRenderer.prototype._doPause = function () {
		klynt.InteractionRenderer.prototype._doPause.call(this);

		if (this._tween) {
			this._tween.pause();
		}
	};

	klynt.EffectInteractionRenderer.prototype._doReverse = function () {
		klynt.InteractionRenderer.prototype._doReverse.call(this);

		if (this._tween) {
			this._tween.reverse();
		}
	};

	klynt.EffectInteractionRenderer.prototype._doKill = function () {
		klynt.InteractionRenderer.prototype._doKill.call(this);

		if (this._tween) {
			this._tween.kill();
		}
	};

	klynt.EffectInteractionRenderer.prototype._getAnimProperties = function () {
		var value = this._model.value;
		var properties = {};

		switch (this._model.name) {
		case 'opacity':
			properties.opacity = value;
			break;
		case 'background':
			properties.background = value;
			break;
		case 'border':
			var parts = value ? value.split(" | ") : [];
			if (parts.length > 0) {
				properties.border = parts[0];
			}
			if (parts.length > 1) {
				properties.borderRadius = parts[1];
			}
			break;
		case 'shadow':
			properties.boxShadow = value;
			break;
		}

		return {
			duration: this._model.duration,
			easing: this._model.easing,
			properties: properties
		};
	};

	klynt.EffectInteractionRenderer.prototype = klynt.utils.mergePrototypes(klynt.InteractionRenderer, klynt.EffectInteractionRenderer);
})(window.klynt);