/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.ImageRenderer = function (element, $parent) {
        klynt.ElementRenderer.call(this, element, $parent);
    };

    klynt.ImageRenderer.prototype = {
        _$image: null,
        get $image() {
            return this._$image;
        },

        _originalImageWidth: 0,
        _originalImageHeight: 0
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
            .load(this._onImageLoad.bind(this))
            .appendTo(this._$element);
    };

    klynt.ImageRenderer.prototype._onImageLoad = function () {
        this._originalImageWidth = this._$image.width();
        this._originalImageHeight = this._$image.height();

        this._resizeImage();
        this._executePanAndZoom();
    };

    klynt.ImageRenderer.prototype._resizeImage = function () {
        var dimensions = this.getCroppingDimensions(this._$element.width(), this._$element.height());

        this._$image
            .width(dimensions.width)
            .height(dimensions.height);
    };

    klynt.ImageRenderer.prototype._onBegin = function (event) {
        klynt.ElementRenderer.prototype._onBegin.call(this);
    };

    klynt.ImageRenderer.prototype._executePanAndZoom = function () {
        if (this._element.animation) {
            new klynt.AnimationRenderer(this._element.animation, this).execute();
        }
    };

    klynt.ImageRenderer.prototype.getCroppingDimensions = function (containerWidth, containerHeight) {
        var ratio = Math.max(containerWidth / this._originalImageWidth, containerHeight / this._originalImageHeight);
        return {
            width: this._originalImageWidth * ratio,
            height: this._originalImageHeight * ratio
        };
    };

    klynt.ImageRenderer.prototype = klynt.utils.mergePrototypes(klynt.ElementRenderer, klynt.ImageRenderer);
})(window.klynt);
