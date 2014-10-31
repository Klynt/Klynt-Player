/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
	klynt.StyleInteractionRenderer = function (model, sequence) {
		klynt.InteractionRenderer.call(this, model, sequence);
	};

	klynt.StyleInteractionRenderer.prototype = {
		_tween: null
	};

	klynt.StyleInteractionRenderer.prototype._doExecute = function () {
		klynt.InteractionRenderer.prototype._doExecute.call(this);

		/*if (this._tween && this._model.reversible) {
			this._tween.restart();
		} else {*/
		if (this.targetRenderer.element.transitionIn && (this.targetRenderer.element.transitionIn.duration > this.targetRenderer.sequence.currentTime)) {
			return;
		}
		this._tween = klynt.animation.fromTo(this._getAnimProperties(this._model), this.targetRenderer.$element);
		/*}*/
	};

	klynt.StyleInteractionRenderer.prototype._doPause = function () {
		klynt.InteractionRenderer.prototype._doPause.call(this);

		if (this._tween) {
			this._tween.pause();
		}
	};

	klynt.StyleInteractionRenderer.prototype._doReverse = function () {
		klynt.InteractionRenderer.prototype._doReverse.call(this);

		if (this._tween) {
			this._tween.reverse();
		}
	};

	klynt.StyleInteractionRenderer.prototype._doKill = function () {
		klynt.InteractionRenderer.prototype._doKill.call(this);

		if (this._tween) {
			this._tween.kill();
		}
	};

	klynt.StyleInteractionRenderer.prototype._getAnimProperties = function () {
		var value = this._model.value;
		var style = this.targetRenderer.element.style;
		var toProperties = {};
		var fromProperties = {};

		switch (this._model.name) {
		case 'opacity':
			toProperties.opacity = value;
			fromProperties.opacity = style ? style.opacity : 1;
			break;
		case 'background':
			toProperties.background = value;
			fromProperties.background = style ? style.backgroundColor : 'transparent';
			break;
		case 'border':
			var parts = value ? value.split(" | ") : [];
			if (parts.length > 0) {
				toProperties.border = parts[0];
				fromProperties.border = style ? style.borderSize + 'px solid ' + style.borderColor : '0px solid transparent';
			}
			if (parts.length > 1) {
				toProperties.borderRadius = parts[1];
				fromProperties.borderRadius = style ? style.borderRadius : 0;
			}
			break;
		case 'shadow':
			toProperties.boxShadow = value;
			fromProperties.boxShadow = style ? style.dropShadowX + 'px ' + style.dropShadowY + 'px ' + style.dropShadowBlur + 'px ' + style.dropShadowColor : '0px 0px 0px transparent';
			break;
		}

		return {
			duration: this._model.duration,
			easing: this._model.easing,
			toProperties: toProperties,
			fromProperties: fromProperties
		};
	};

	klynt.StyleInteractionRenderer.prototype = klynt.utils.mergePrototypes(klynt.InteractionRenderer, klynt.StyleInteractionRenderer);
})(window.klynt);