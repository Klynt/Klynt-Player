/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.ExternalVideoRenderer = function (video, sequence) {
        klynt.VideoRenderer.call(this, video, sequence);
    };

    klynt.ExternalVideoRenderer.prototype = {};

    klynt.ExternalVideoRenderer.prototype._initDOM = function () {
        klynt.MediaRenderer.prototype._initDOM.call(this);
        this._$element.addClass('externalVideo youtube');
    };

    klynt.ExternalVideoRenderer.prototype._createMediaElement = function () {
        if (klynt.utils.browser.local && (klynt.utils.browser.chrome || klynt.utils.browser.safari)) {
            window.alert('Oops! Youtube does not allow its videos to be displayed with Chrome or Safari in offline mode.\n\n' +
                'Please set Firefox as your default browser instead of Chrome or Safari to preview your' +
                'sequences when using Youtube videos.\n\nNB. Once your project is published online, Youtube videos' +
                'will display properly on any browser, including Chrome and Safari.');
        } else {
            klynt.VideoRenderer.prototype._createMediaElement.call(this);
        }
    };

    klynt.ExternalVideoRenderer.prototype._initWithMediaAPI = function () {
        klynt.VideoRenderer.prototype._initWithMediaAPI.call(this);
        this._$element.find('.mejs-overlay-button').hide();
    };

    klynt.ExternalVideoRenderer.prototype._updateVideoDimensions = function () {
        var video = typeof this.pluginElement !== 'undefined' ? $(this.pluginElement) : $(this._mediaAPI);
        if (typeof this.pluginElement !== 'undefined') {
            video.children().first().css({
                width: 'inherit',
                height: 'inherit'
            });
        }

        var horizontalAlign = this.element.horizontalAlign;
        var verticalAlign = this.element.verticalAlign;
        var parentWidth = this.FTW ? klynt.sequenceContainer.currentRenderer.$element.width() : this.element.width;
        var parentHeight = this.FTW ? klynt.sequenceContainer.currentRenderer.$element.height() : this.element.height;
        var mediaWidth = this.FTW ? klynt.sequenceContainer.currentRenderer.$element.width() : this.element.mediaWidth;
        var mediaHeight = this.FTW ? klynt.sequenceContainer.currentRenderer.$element.height() : this.element.mediaHeight;
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
            width: parseInt(mediaWidth, 10) + 'px',
            height: parseInt(mediaHeight, 10) + 'px',
            marginLeft: parseInt((parentWidth - mediaWidth) * leftMultiplier, 10) + 'px',
            marginTop: parseInt((parentHeight - mediaHeight) * topMultiplier, 10) + 'px'
        };

        this.$element.find('iframe').css(css);
        this.$element.find('.mejs-poster,.me-plugin').css(css);
    };

    klynt.ExternalVideoRenderer.prototype = klynt.utils.mergePrototypes(klynt.VideoRenderer, klynt.ExternalVideoRenderer);
})(window.klynt);