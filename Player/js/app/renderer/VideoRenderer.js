/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.VideoRenderer = function (video, sequence) {
        klynt.MediaRenderer.call(this, video, sequence);
    };

    klynt.VideoRenderer.prototype = {
        dataRate: 0
    };

    klynt.VideoRenderer.prototype._initDOM = function () {
        klynt.MediaRenderer.prototype._initDOM.call(this);
        this._$element.addClass('video');
    };

    klynt.VideoRenderer.prototype._createMediaElement = function () {
        this._$mediaElement = $('<video webkit-playsinline>');
        klynt.MediaRenderer.prototype._createMediaElement.call(this);
    };

    klynt.VideoRenderer.prototype._initWithMediaAPI = function () {
        klynt.MediaRenderer.prototype._initWithMediaAPI.call(this);

        this._mediaAPI.addEventListener('loadedmetadata', this._onMetadataLoaded.bind(this), false);
        setTimeout(this._updateVideoDimensions.bind(this), 50);
    };

    klynt.VideoRenderer.prototype.updateSize = function (ratio) {
        klynt.ElementRenderer.prototype.updateSize.call(this, ratio);

        this._updateVideoDimensions();
    };

    klynt.VideoRenderer.prototype._onMetadataLoaded = function () { 
        if (klynt.player.scaleToFullWindow) {
            this._updateVideoDimensions();
        }
    };

    klynt.VideoRenderer.prototype._updateVideoDimensions = function () {
        var video = typeof this.pluginElement !== 'undefined' ? $(this.pluginElement) : $(this._mediaAPI);
        if (typeof this.pluginElement !== 'undefined') {
            video.children().first().css({
                width: 'inherit',
                height: 'inherit'
            });
        }

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
        var css = {
            width: Math.round(mediaWidth) + 'px',
            height: Math.round(mediaHeight) + 'px',
            marginLeft: Math.round((parentWidth - mediaWidth) * leftMultiplier) + 'px',
            marginTop: Math.round((parentHeight - mediaHeight) * topMultiplier) + 'px'
        };

        video.css(css);
        this.$element.find('.me-plugin').css(css);
    };

    klynt.VideoRenderer.prototype.getImagePositionCSS = function (data) {
        var video = typeof this.pluginElement !== 'undefined' ? $(this.pluginElement) : $(this._mediaAPI);
        if (typeof this.pluginElement !== 'undefined') {
            video.children().first().css({
                width: 'inherit',
                height: 'inherit'
            });
        }

        var horizontalAlign = this.element.horizontalAlign;
        var verticalAlign = this.element.verticalAlign;
        var parentWidth = data.fitToWindow ? klynt.sequenceContainer.currentRenderer.$element.width() : this.element.width;
        var parentHeight = data.fitToWindow ? klynt.sequenceContainer.currentRenderer.$element.height() : this.element.height;
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

        var css = {
            width: Math.round(mediaWidth) + 'px',
            height: Math.round(mediaHeight) + 'px',
            marginLeft: Math.round((parentWidth - mediaWidth) * leftMultiplier) + 'px',
            marginTop: Math.round((parentHeight - mediaHeight) * topMultiplier) + 'px'
        };
        
        return css;
    };

    klynt.VideoRenderer.prototype = klynt.utils.mergePrototypes(klynt.MediaRenderer, klynt.VideoRenderer);
})(window.klynt);