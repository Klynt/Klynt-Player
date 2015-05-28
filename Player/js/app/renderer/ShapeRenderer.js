/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
	klynt.ShapeRenderer = function (element, sequence) {
		klynt.ElementRenderer.call(this, element, sequence);
	};

	klynt.ShapeRenderer.prototype = {
		timeline: null
	};

	klynt.ShapeRenderer.prototype._init = function () {
		klynt.ElementRenderer.prototype._init.call(this);
		if (this.element.type == 'pulsar') {
			this._addPulsar();
		}
	};

	klynt.ShapeRenderer.prototype._initDOM = function () {
		klynt.ElementRenderer.prototype._initDOM.call(this);
		this._$element.addClass('shape');
	};

	klynt.ShapeRenderer.prototype._addPulsar = function () {
		this.$element.css('background-color', 'transparent');

		var $svg = $(
			'<svg class="pulsar">' +
			'	<ellipse class="pulsar-circle pulsar-circle-0" cx="0" cy="0" rx="0" ry="0" fill-opacity="1" fill="' + this.element.style.backgroundColor + '"/>' +
			'	<ellipse class="pulsar-circle pulsar-circle-1" cx="0" cy="0" rx="0" ry="0" fill-opacity="1" fill="' + this.element.style.backgroundColor + '"/>' +
			'	<ellipse class="pulsar-circle pulsar-circle-2" cx="0" cy="0" rx="0" ry="0" fill-opacity="1" fill="' + this.element.style.backgroundColor + '"/>' +
			'	<ellipse class="pulsar-circle pulsar-circle-3" cx="0" cy="0" rx="0" ry="0" fill-opacity="1" fill="' + this.element.style.backgroundColor + '"/>' +
			'</svg>'
		).appendTo(this.$element);

		this._resetPulsar();
	};

	klynt.ShapeRenderer.prototype._resetPulsar = function () {
		var w = this.$element.width();
		var h = this.$element.height();
		
		if (this.timeline) {
			this.timeline.kill();
		}

		TweenMax.set(this.$element.find('.pulsar-circle'), {
			attr: {
				cx: w / 2,
				cy: h / 2,
				rx: 0,
				ry: 0,
				'fill-opacity': 1
			}
		});

		for (var i= 0; i < 4; i++) {
			var t2 = new TweenMax.to(this.$element.find('.pulsar-circle-' + i), 4, {
				attr: {
					rx: w / 2,
					ry: h / 2,
					'fill-opacity': 0.1
				},
				ease: Cubic.easeIn,
				repeat: -1
			}).delay(i);
		}
	};

	klynt.ShapeRenderer.prototype.updateSize = function (ratio) {
		klynt.ElementRenderer.prototype.updateSize.call(this, ratio);

		this._resetPulsar();
	};

	klynt.ShapeRenderer.prototype.destroy = function () {
		klynt.ElementRenderer.prototype.destroy.call(this);

		if (this.timeline) {
			this.timeline.kill();
			this.timeline = null;
		}
	};

	klynt.ShapeRenderer.prototype = klynt.utils.mergePrototypes(klynt.ElementRenderer, klynt.ShapeRenderer);
})(window.klynt);