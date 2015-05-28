/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
	klynt.ActionInteractionRenderer = function (model, sequence) {
		klynt.InteractionRenderer.call(this, model, sequence);
		this._reverseActionName = getReverseActionName(this._model.name);
	};

	klynt.ActionInteractionRenderer.prototype = {
		_reverseActionName: null,
		_zIndex: null,
		_computedPositions: null,
		_notComputedPositions: null,
		_volume: null
	};

	klynt.ActionInteractionRenderer.prototype._doExecute = function (dispatchChain) {
		klynt.InteractionRenderer.prototype._doExecute.call(this);

		this._executeAction(this._model.name, dispatchChain);
	}

	klynt.ActionInteractionRenderer.prototype._doReverse = function (dispatchChain) {
		klynt.InteractionRenderer.prototype._doReverse.call(this);

		if (this._reverseActionName) {
			this._executeAction(this._reverseActionName, dispatchChain);
		}
	}

	klynt.ActionInteractionRenderer.prototype._executeAction = function (actionName, dispatchChain) {
		var value = parseFloat(this._model.value);

		switch (actionName) {
		case 'share':
			klynt.action.openModalShare();
			break;
		case 'enterFullscreen':
			klynt.action.enterFullScreen();
			break;
		case 'exitFullscreen':
			klynt.action.exitFullScreen();
			break;
		case 'toggleFullscreen':
			klynt.action.toggleFullScreen();
			break;
		case 'previous':
			klynt.action.previous();
			break;
		case 'refresh':
			klynt.action.refresh();
			break;
		case 'closeOverlay':
			klynt.action.closeOverlay();
			break;
		case 'seekDelta':
			klynt.action.seekDelta(value, this.targetRenderer);
			break;
		case 'seekTo':
			klynt.action.seekTo(value, this.targetRenderer);
			break;
		case 'play':
			klynt.action.play(this.targetRenderer);
			break;
		case 'pause':
			klynt.action.pause(this.targetRenderer);
			break;
		case 'togglePlayPause':
			klynt.action.togglePlayPause(this.targetRenderer);
			break;
		case 'stop':
			klynt.action.stop(this.targetRenderer);
			break;
		case 'mute':
			klynt.action.mute(this.targetRenderer);
			break;
		case 'unmute':
			klynt.action.unmute(this.targetRenderer);
			break;
		case 'toggleMute':
			klynt.action.toggleMute(this.targetRenderer);
		case 'showControls':
			klynt.action.showControls(this.targetRenderer);
			break;
		case 'hideControls':
			klynt.action.hideControls(this.targetRenderer);
			break;
		case 'toggleControls':
			klynt.action.toggleControls(this.targetRenderer);
			break;
		case 'volume':
			if (this._volume && this._model.duration != 0) {
				this._volume.restart();
			} else {
				this._volume = klynt.action.volume(this.targetRenderer, value, this._model.duration);
			}
			break;
		case 'reverseVolume':
			if (this._model.duration == 0) {
				klynt.action.volume(this.targetRenderer, this._volume, this._model.duration);
			} else {
				this._volume.reverse();
			}
			break;
		case 'dispatchClick':
			if (!dispatchChain) {
				dispatchChain = [];
			}
			dispatchChain.push(this._elementRenderer);
			this.targetRenderer.executeInteractions('click', false, dispatchChain);
			break;
		case 'dispatchRollOver':
			if (!dispatchChain) {
				dispatchChain = [];
			}
			dispatchChain.push(this._elementRenderer);
			this.targetRenderer.executeInteractions('rollOver', false, dispatchChain);
			break;
		case 'dispatchRollOut':
			if (!dispatchChain) {
				dispatchChain = [];
			}
			dispatchChain.push(this._elementRenderer);
			this.targetRenderer.executeInteractions('rollOut', false, dispatchChain);
			break;
		case 'dispatchReverseRollOver':
			if (!dispatchChain) {
				dispatchChain = [];
			}
			dispatchChain.push(this._elementRenderer);
			this.targetRenderer.executeInteractions('rollOver', true, dispatchChain);
			break;
		case 'dispatchReverseRollOut':
			if (!dispatchChain) {
				dispatchChain = [];
			}
			dispatchChain.push(this._elementRenderer);
			this.targetRenderer.executeInteractions('rollOut', true, dispatchChain);
			break;
		case 'zIndex':
			this._zIndex = this.targetRenderer.$element.css('z-index');
			klynt.action.zIndex(this.targetRenderer, value);
			break;
		case 'bringToFront':
			this._zIndex = this.targetRenderer.$element.css('z-index');
			klynt.action.bringToFront(this.targetRenderer);
			break;
		case 'bringToBack':
			this._zIndex = this.targetRenderer.$element.css('z-index');
			klynt.action.bringToBack(this.targetRenderer);
			break;
		case 'reverseZIndex':
			klynt.action.zIndex(this.targetRenderer, this._zIndex);
			break;
		case 'reverseBringToFront':
			klynt.action.reverseBringToFront(this.targetRenderer, this._zIndex);
			break;
		case 'reverseBringToBack':
			klynt.action.reverseBringToBack(this.targetRenderer, this._zIndex);
			break;
		case 'fitToWindow':
			var renderer = this.targetRenderer;
			var $element = renderer.$element;
			var element = renderer.element;

			renderer.FTW = true;

			var properties = {
				duration: this._model.duration,
				easing: this._model.easing,
				properties: {
					top: 0,
					bottom: 0,
					left: 0,
					right: 0,
					scale: 1,
					x: 0,
					y: 0
				}
			};

			var computedPositions = renderer.getPositionFromJSON();
			this._notComputedPositions = this._notComputedPositions || getNotComputedPosition($element);

			$element.css({
				width: '',
				height: '',
				left: computedPositions.left + 'px',
				right: computedPositions.right + 'px',
				top: computedPositions.top + 'px',
				bottom: computedPositions.bottom + 'px'
			});

			var position;

			if (renderer instanceof klynt.ShapeRenderer) {
				klynt.animation.to(properties, $element);
			} else {

				var position = renderer.getImagePositionCSS({
					fitToWindow: true
				});

				klynt.animation.rendererTo(properties, renderer, position);
			}

			break;
		case 'reverseFitToWindow':
			var renderer = this.targetRenderer;
			var $element = renderer.$element;
			var notComputedPositions = this._notComputedPositions;
			var computedPositions = renderer.getPositionFromJSON();
			var translation = renderer.element.scales ? renderer.getTranslate() : {
				x: 0,
				y: 0
			};

			renderer.FTW = false;

			var properties = {
				duration: this._model.duration,
				easing: this._model.easing,
				properties: {
					left: computedPositions.left + 'px',
					right: computedPositions.right + 'px',
					top: computedPositions.top + 'px',
					bottom: computedPositions.bottom + 'px',
					scale: this.targetRenderer.scale * (this.targetRenderer.element.scales ? klynt.player.getRatioToWindow() : 1),
					x: translation.x,
					y: translation.y,
					onComplete: function () {
						$element.css(notComputedPositions);
					}
				}
			};

			var position;

			if (renderer instanceof klynt.ShapeRenderer) {
				klynt.animation.to(properties, $element);
			} else {
				var position = renderer.getImagePositionCSS({
					left: computedPositions.left,
					right: computedPositions.right,
					top: computedPositions.top,
					bottom: computedPositions.bottom
				});

				klynt.animation.rendererTo(properties, renderer, position);
			}
			break;
		case 'scale':
			this.targetRenderer.scale = value;
			var rotation = this.targetRenderer.rotation;
			if (isNaN(rotation)) {
				rotation = this.targetRenderer.element.style ? this.targetRenderer.element.style.rotation || 0 : 0;
			}
			klynt.animation.to({
				duration: this._model.duration,
				easing: this._model.easing,
				properties: {
					scale: value * (this.targetRenderer.element.scales ? klynt.player.getRatioToWindow() : 1),
					rotation: rotation
				}
			}, this.targetRenderer.$element);
			break;
		case 'reverseScale':
			this.targetRenderer.scale = 1;
			var rotation = this.targetRenderer.rotation;
			if (isNaN(rotation)) {
				rotation = this.targetRenderer.element.style ? this.targetRenderer.element.style.rotation || 0 : 0;
			}
			klynt.animation.to({
				duration: this._model.duration,
				easing: this._model.easing,
				properties: {
					scale: (this.targetRenderer.element.scales ? klynt.player.getRatioToWindow() : 1),
					rotation: rotation
				}
			}, this.targetRenderer.$element);
			break;
		case 'rotation':
			this.targetRenderer.rotation = value;
			klynt.animation.to({
				duration: this._model.duration,
				easing: this._model.easing,
				properties: {
					scale: this.targetRenderer.scale * klynt.player.getRatioToWindow(),
					rotation: value
				}
			}, this.targetRenderer.$element);
			break;
		case 'reverseRotation':
			this.targetRenderer.rotation = NaN;
			klynt.animation.to({
				duration: this._model.duration,
				easing: this._model.easing,
				properties: {
					scale: this.targetRenderer.scale * klynt.player.getRatioToWindow(),
					rotation: this.targetRenderer.element.style ? this.targetRenderer.element.style.rotation || 0 : 0
				}
			}, this.targetRenderer.$element);
			break;
		}
	};

	function getReverseActionName(actionName) {
		switch (actionName) {
		case 'enterFullscreen':
			return 'exitFullscreen';
		case 'exitFullscreen':
			return 'enterFullscreen';
		case 'toggleFullscreen':
			return 'toggleFullscreen';
		case 'play':
			return 'pause';
		case 'pause':
			return 'play';
		case 'togglePlayPause':
			return 'togglePlayPause';
		case 'mute':
			return 'unmute';
		case 'unmute':
			return 'mute';
		case 'toggleMute':
			return 'toggleMute';
		case 'showControls':
			return 'hideControls';
		case 'hideControls':
			return 'showControls';
		case 'toggleControls':
			return 'toggleControls';
		case 'volume':
			return 'reverseVolume';
		case 'dispatchClick':
			return 'dispatchClick';
		case 'dispatchRollOver':
			return 'dispatchReverseRollOver';
		case 'dispatchRollOut':
			return 'dispatchReverseRollOut';
		case 'zIndex':
			return 'reverseZIndex'
		case 'bringToFront':
			return 'reverseBringToFront'
		case 'bringToBack':
			return 'reverseBringToBack'
		case 'fitToWindow':
			return 'reverseFitToWindow';
		case 'scale':
			return 'reverseScale';
		case 'rotation':
			return 'reverseRotation';
		}
	};

	function getNotComputedPosition($element) {
		var style = $element.get(0).style;

		return {
			width: style.width,
			height: style.height,
			left: style.left,
			right: style.right,
			top: style.top,
			bottom: style.bottom
		}
	}

	klynt.ActionInteractionRenderer.prototype = klynt.utils.mergePrototypes(klynt.InteractionRenderer, klynt.ActionInteractionRenderer);
})(window.klynt);