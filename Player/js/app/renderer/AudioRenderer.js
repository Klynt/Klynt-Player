/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.AudioRenderer = function (audio, sequence) {
        klynt.MediaRenderer.call(this, audio, sequence);
    };

    klynt.AudioRenderer.prototype = {};

    klynt.AudioRenderer.prototype._initDOM = function () {
        klynt.MediaRenderer.prototype._initDOM.call(this);
        this._$element.addClass('audio');
    };

    klynt.AudioRenderer.prototype._createContinuousAudio = function () {
        if (!klynt.utils.browser.iOS && !this.element.controls && this.element.continuous) {
            if (this.element.begin < 1) {
                this._$mediaElement = klynt.continuousAudio.retrieve(this.element.mediaId, this.sequence.isOverlay);
            }

            if (this._$mediaElement) {
                this.mediaAPI = this._$mediaElement[0].mediaAPI;
            } else {
                this._$mediaElement = $('<audio>');
                klynt.MediaRenderer.prototype._createMediaElement.call(this);
                klynt.continuousAudio.add(this._$mediaElement, this.element.mediaId, this.sequence.isOverlay);

                var nodeDiv = this._$mediaElement[0];
                var renderer = this;
                // Mediaelement initialization
                new MediaElement(this._$mediaElement[0], {
                    autoRewind: false,
                    enablePluginSmoothing: true,
                    clickToPlayPause: true,
                    alwaysShowControls: true,
                    pauseOtherPlayers: false,
                    features: ["playpause", "progress"],
                    playpauseText: '',
                    stopText: '',
                    muteText: '',
                    fullscreenText: '',
                    success: function (mediaAPI, element) {
                        if ((/^(flash|silverlight)$/i).test(mediaAPI.pluginType)) {
                            var pluginElement = element.previousSibling;
                            if (element.firstChild &&
                                (/^(object|embed)$/i).test(element.firstChild.nodeName)) {
                                pluginElement = element.firstChild;
                            } else if (pluginElement && (
                                (/^me_flash/).test(pluginElement.id) || // IE<9 + Flash
                                (/^me_silverlight/).test(pluginElement.id) || // IE<9 + Silverlight
                                (pluginElement.className == "me-plugin")
                            )) {
                                pluginElement.setAttribute("timeAction", "none");
                            }
                            nodeDiv.pluginElement = pluginElement;
                            nodeDiv.mediaAPI = renderer.mediaAPI = mediaAPI;
                        }
                        nodeDiv.mediaAPI = renderer.mediaAPI = element.mediaAPI || mediaAPI || element;
                    },
                    error: function () {
                        alert("MediaElement error");
                    }
                });
            }
        }
    }

    klynt.AudioRenderer.prototype._createMediaElement = function () {
        this._createContinuousAudio();

        if (!this._$mediaElement) {
            this._$mediaElement = $('<audio>');
            klynt.MediaRenderer.prototype._createMediaElement.call(this);
        }
    };

    klynt.AudioRenderer.prototype.destroy = function () {
        if (this._$mediaElement.closest('#continuous-audio-container').length == 0) {
            klynt.MediaRenderer.prototype.destroy.call(this);
        }
    }

    klynt.AudioRenderer.prototype.play = function (overlay) {
        if (this.element.continuous) {
            if (overlay) {
                klynt.action.volume(this, this.element.volume, 1);
            } else {
                this.setVolume(this.element.volume);
            }
        }
        klynt.MediaRenderer.prototype.play.call(this);
    };

    klynt.AudioRenderer.prototype.pause = function (sequenceEnded, overlay) {
        if (this.element.continuous) {
            if (sequenceEnded) {
                klynt.action.volume(this, this.element.sequenceEndVolume, 1);
            } else if (overlay) {
                klynt.action.volume(this, this.element.overlayVolume, 1);
            } else {
                klynt.MediaRenderer.prototype.pause.call(this);
            }
        } else {
            if (sequenceEnded) {
                klynt.action.volume(this, 0, 3);
            } else {
                klynt.MediaRenderer.prototype.pause.call(this);
            }
        }
    };

    klynt.AudioRenderer.prototype.unmute = function (sequenceEnded, overlay) {
        if (this.element.continuous) {
            if (sequenceEnded) {
                this.setVolume(this.element.sequenceEndVolume);
            } else if (overlay) {
                this.setVolume(this.element.overlayVolume);
            } else {
                klynt.MediaRenderer.prototype.unmute.call(this);
            }
        } else {
            klynt.MediaRenderer.prototype.unmute.call(this);
        }
    };

    klynt.AudioRenderer.prototype = klynt.utils.mergePrototypes(klynt.MediaRenderer, klynt.AudioRenderer);
})(window.klynt);