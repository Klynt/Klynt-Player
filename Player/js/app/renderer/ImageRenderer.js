/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.ImageRenderer = function (element, sequence) {
        klynt.ElementRenderer.call(this, element, sequence);
    };

    klynt.ImageRenderer.prototype = {
        _animationRenderer: null,

        _$image: null,
        get $image() {
            return this._$image;
        },

        _zoomValue: 1
    };

    klynt.ImageRenderer.prototype._init = function () {
        if (this._element.animation) {
            this._animationRenderer = new klynt.AnimationRenderer(this._element.animation, this);
        }

        klynt.ElementRenderer.prototype._init.call(this);
    };

    klynt.ImageRenderer.prototype._initDOM = function () {
        klynt.ElementRenderer.prototype._initDOM.call(this);
        this._$element
            .addClass('image');

        this._$image = $('<img>')
            .css('position', 'absolute')
            .css('overflow', 'hidden')
            .attr('id', 'img_' + this.element.id)
            .addClass('img_' + this.element.id)
            //.attr('src', this.element.source)
            .attr('alt', this.element.alt)
            .appendTo(this._$element);
    };

    klynt.ImageRenderer.prototype.updateSize = function (ratio, data) {
        var data;
        if (this.element.animation && this.element.animation.type == 'panZoom' && this.currentTime >= this.element.animation.duration) {
            data = this.element.animation;
        } else {
            data = this.element;
        }

        klynt.ElementRenderer.prototype.updateSize.call(this, ratio, data);

        this._$image.css(this.getImagePositionCSS(data));
        this._executePanAndZoom();
    };

    klynt.ImageRenderer.prototype.zoom = function (zoom) {
        this._zoomValue = zoom;
        return this.getImagePositionCSS(this.element);
    }

    klynt.ImageRenderer.prototype.getImagePositionCSS = function (data) {

        var css = {};
        var zoom = this._zoomValue;

        if (this.element.scaleMode == 'stretch') {
            css.width = '100%';
            css.height = '100%';
        } else {
            var horizontalAlign = this.element.horizontalAlign;
            var verticalAlign = this.element.verticalAlign;
            var mediaWidth = this.element.mediaWidth;
            var mediaHeight = this.element.mediaHeight;

            var currentLeft = this.$element.css('left');
            var currentRight = this.$element.css('right');
            var currentTop = this.$element.css('top');
            var currentBottom = this.$element.css('bottom');

            var parentWidth;
            if (data.fitToWindow || this.FTW) {
                parentWidth = this.sequence.$element.width();
            } else if (data.width != undefined) {
                parentWidth = data.width;
            } else {
                parentWidth = this.sequence.$element.width() - data.left - data.right;
            }

            var parentHeight;
            if (data.fitToWindow || this.FTW) {
                parentHeight = this.sequence.$element.height();
            } else if (data.height != undefined) {
                parentHeight = data.height;
            } else {
                parentHeight = this.sequence.$element.height() - data.top - data.bottom;
            }

            var ratio, leftMultiplier, topMultiplier;
            if (this.element.scaleMode == 'zoom') {
                ratio = Math.max(parentWidth / mediaWidth, parentHeight / mediaHeight);
                leftMultiplier = horizontalAlign == 'left' ? 0 : horizontalAlign == 'right' ? 1 : 0.5;
                topMultiplier = verticalAlign == 'top' ? 0 : verticalAlign == 'bottom' ? 1 : 0.5;
            } else {
                ratio = Math.min(parentWidth / mediaWidth, parentHeight / mediaHeight);
                leftMultiplier = topMultiplier = 0.5;
            }

            mediaWidth *= ratio * zoom;
            mediaHeight *= ratio * zoom;

            css.width = parseInt(mediaWidth, 10) + 'px',
            css.height = parseInt(mediaHeight, 10) + 'px',
            css.marginLeft = parseInt((parentWidth - mediaWidth) * leftMultiplier, 10) + 'px',
            css.marginTop = parseInt((parentHeight - mediaHeight) * topMultiplier, 10) + 'px'
        }

        return css;
    };

    klynt.ImageRenderer.prototype._onBegin = function (event) {
        klynt.ElementRenderer.prototype._onBegin.call(this);
        if (!this._$image.attr('src')) {
           this._$image.attr('src', this.element.source);
        }
        this._executePanAndZoom();
    };

    klynt.ImageRenderer.prototype._executePanAndZoom = function () {
        if (this._animationRenderer) {
            this._animationRenderer.execute();
        }
    };

    klynt.ImageRenderer.prototype = klynt.utils.mergePrototypes(klynt.ElementRenderer, klynt.ImageRenderer);
})(window.klynt);