/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.AudioRenderer = function (audio, $parent) {
        klynt.MediaRenderer.call(this, audio, $parent);
    };

    klynt.AudioRenderer.prototype = {};

    klynt.AudioRenderer.prototype._initDOM = function () {
        klynt.MediaRenderer.prototype._initDOM.call(this);
        this._$element.addClass('audio');
    };

    klynt.AudioRenderer.prototype._createMediaElement = function () {
        this._$mediaElement = $('<audio>');
    };

    klynt.AudioRenderer.prototype.play = function () {
        if (this.element.continuous) {
            this.setVolume(this.element.volume);
        }
        klynt.MediaRenderer.prototype.play.call(this);
    };

    klynt.AudioRenderer.prototype.pause = function (sequenceEnded, overlay) {
        if (this.element.continuous) {
            if (sequenceEnded) {
                this.setVolume(this.element.sequenceEndVolume);
            } else if (overlay) {
                this.setVolume(this.element.overlayVolume);
            } else {
                klynt.MediaRenderer.prototype.pause.call(this);
            }
        } else {
            klynt.MediaRenderer.prototype.pause.call(this);
        }
    };

    klynt.AudioRenderer.prototype.unmute = function (sequenceEnded, overlay) {
        if (this.element.continuous) {
            if (sequenceEnded) {
                this.setVolume(this.element.sequenceEndVolume);
            } else if (overlay) {
                this.setVolume(this.element.overlayVolume);
            } else {
                this.setVolume(this.element.volume);
            }
        } else {
            klynt.MediaRenderer.prototype.unmute.call(this);
        }
    };

    klynt.AudioRenderer.prototype = klynt.utils.mergePrototypes(klynt.MediaRenderer, klynt.AudioRenderer);
})(window.klynt);