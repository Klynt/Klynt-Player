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
        _$image: null,
        get $image() {
            return this._$image;
        }
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
            .attr('src', this.element.source)
            .attr('alt', this.element.alt)
            .appendTo(this._$element);
    };

    klynt.ImageRenderer.prototype.updateSize = function (ratio) {
        klynt.ElementRenderer.prototype.updateSize.call(this, ratio);

        this._updateImageDimensions();
    };

    klynt.ImageRenderer.prototype._updateImageDimensions = function () {
        if (this.element.scaleMode == 'stretch') {
            this._$image.css({
                width: '100%',
                height: '100%'
            });
        } else {
            var horizontalAlign = this.element.horizontalAlign;
            var verticalAlign = this.element.verticalAlign;
            var parentWidth = this.$element.innerWidth();
            var parentHeight = this.$element.innerHeight();
            var mediaWidth = this.element.mediaWidth;
            var mediaHeight = this.element.mediaHeight;
            var ratio, leftMultiplier, topMultiplier;

            if (this.element.scaleMode == 'zoom') {
                ratio = Math.max(parentWidth / mediaWidth, parentHeight / mediaHeight);
                leftMultiplier = horizontalAlign == 'left' ? 0 : horizontalAlign == 'right' ? 1 : 0.5;
                topMultiplier = verticalAlign == 'top' ? 0 : verticalAlign == 'bottom' ? 1 : 0.5;
            } else {
                ratio = Math.min(parentWidth / mediaWidth, parentHeight / mediaHeight);
                leftMultiplier = topMultiplier = 0.5;
            }

            mediaWidth *= ratio;
            mediaHeight *= ratio;
            this._$image.css({
                width: parseInt(mediaWidth, 10) + 'px',
                height: parseInt(mediaHeight, 10) + 'px',
                marginLeft: parseInt((parentWidth - mediaWidth) * leftMultiplier, 10) + 'px',
                marginTop: parseInt((parentHeight - mediaHeight) * topMultiplier, 10) + 'px'
            });
        }
    };

    klynt.ImageRenderer.prototype._onBegin = function (event) {
        klynt.ElementRenderer.prototype._onBegin.call(this);

        this._executePanAndZoom();
    };

    klynt.ImageRenderer.prototype._executePanAndZoom = function () {
        if (this._element.animation) {
            new klynt.AnimationRenderer(this._element.animation, this).execute(this.currentTime, this.sequence);
        }
    };

    klynt.ImageRenderer.prototype.getCroppingDimensions = function (containerWidth, containerHeight) {
        var ratio = Math.max(containerWidth / this.element.mediaWidth, containerHeight / this.element.mediaHeight);
        return {
            width: this.element.mediaWidth * ratio,
            height: this.element.mediaHeight * ratio
        };
    };
    klynt.ImageRenderer.prototype.getRatio = function (containerWidth, containerHeight) {
        return Math.max(containerWidth / this.this.element.mediaWidth, containerHeight / this.element.mediaHeight);
    };

    klynt.ImageRenderer.prototype = klynt.utils.mergePrototypes(klynt.ElementRenderer, klynt.ImageRenderer);
})(window.klynt);