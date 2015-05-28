/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.LoaderView = function ($parent, totalFiles, callback) {
    	this._$parent = $parent;
        this._totalFiles = totalFiles;
        this._loadedFiles = 0;
        this._progressMultiplier = 0.75;
        this._progress = 0;
        this._callback = callback;
    	this._init();
    	this.animate();
    };

    klynt.LoaderView.prototype = {
    	_animatingSvg: null,
    	_loadingSvg: null,
    	_loadingCircle: null,
    	_circumf: null,
    	_strokeOffset: null,
        _totalFiles: 0,
        _loadedFiles: 0,
        _progressMultiplier: 0,
        _progress: 0,
        _animating: false,
        _callback: null,
        _$label: null,

        _$parent: null,
        get $parent() {
            return this._$parent;
        },

        _$container: null,
        get $container() {
            return this._$container;
        }
    };

	klynt.LoaderView.prototype._init = function () {
		this._$container = $('<div class="loader-svg-container">').appendTo(this.$parent);
		var $svg = $(
			'<svg id="loader-animated-svg" version="1.1" x="0px" y="0px" width="48px" height="48px" viewBox="0 0 48 48" style="enable-background:new 0 0 48 48;" xml:space="preserve">' +
			'	<g id="loader">' +
			'		<g id="loader-circle">' +
			'			<circle id="loader-circle-empty" class="loader-stroke loader-stroke-color-empty" cx="24" cy="24" r="22"/>' +
			'			<circle id="loader-circle-filled" class="loader-stroke loader-stroke-color-filled" cx="24" cy="24" r="22" transform="rotate(-90 24 24)"/>' +
			'		</g>' +
			'	</g>' +
			'</svg>'
		).appendTo(this.$container);

		this._animatingSvg = Snap($svg[0]);
		this._loadingSvg = this._animatingSvg.select('#loader');
		this._loadingCircle = this._animatingSvg.select('#loader-circle-filled');

		this._circumf = Math.PI * (this._loadingCircle.attr('r') * 2);
		this._loadingCircle.attr({
			'stroke-dasharray': this._circumf + ' ' + this._circumf,
			'stroke-dashoffset': this._circumf,
		});
		this._strokeOffset = this._loadingCircle.attr('stroke-dashoffset').replace('px', '');

        this._$label = $('<div class="loader-label">').appendTo(this.$container);
    };

    klynt.LoaderView.prototype.animate = function () {
        this._animating = true;
    	this._loop(1500);
    };

    klynt.LoaderView.prototype._loop = function (duration) {
    	Snap.animate(this._strokeOffset, '0', function (value) {
            if (this._totalFiles) {
                this._updateProgress();
                value = (1 - this._progress) * this._strokeOffset;
                var percentage = Math.round(this._progress * 100);
                var label = percentage.toFixed(0);
                if (label.length < 2) {
                    label = "0" + label;
                }
                this._$label.html(label);
            }
			this._loadingCircle.attr({
				'stroke-dashoffset': value
			});
		}.bind(this), (this._strokeOffset / this._circumf) * duration, mina.none /*mina.easein*/, function () {
            if (this._animating) {
                this._loop(duration);
            }
		}.bind(this));
    };

    klynt.LoaderView.prototype.hide = function () {
        this._animating = false;
    	this.$container.hide();
    };

    klynt.LoaderView.prototype.show = function () {
    	this.$container.show();
        this.animate();
    };

    klynt.LoaderView.prototype.incrementLoaded = function () {
        this._loadedFiles++;
    };

    klynt.LoaderView.prototype.addImageFilesToQueue = function (count) {
        this._totalFiles += count;
        this._progressMultiplier = 1;
    };

    klynt.LoaderView.prototype._updateProgress = function () {
        if (this._progress >= 1) {
            this._animating = false;

            if (this._callback) {
                var callback = this._callback;
                this._callback = null;
                klynt.utils.callLater(callback, 100);
            }
        } else {
            var progress = this._loadedFiles / this._totalFiles * this._progressMultiplier;
            this._progress = Math.min(Math.max(this._progress, progress), this._progress + 0.02);
        }
    };
})(window.klynt);