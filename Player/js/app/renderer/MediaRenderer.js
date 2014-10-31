/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.MediaRenderer = function (media, sequence) {
        klynt.ElementRenderer.call(this, media, sequence);
    };

    klynt.MediaRenderer.prototype = {
        _$mediaElement: null,
        _volumeSet: false,

        get $mediaElement() {
            return this._$mediaElement;
        },

        _mediaAPI: null,
        get mediaAPI() {
            return this._mediaAPI;
        },
        set mediaAPI(value) {
            if (this._mediaAPI != value) {
                this._mediaAPI = value;
                if (value) {
                    this._initWithMediaAPI();
                }
            }
        },

        _pluginElement: null,
        get pluginElement() {
            return this._pluginElement;
        },
        set pluginElement(value) {
            this._pluginElement = value;
        },

        _wasPlaying: false
    };

    klynt.MediaRenderer.prototype._initDOM = function () {
        klynt.ElementRenderer.prototype._initDOM.call(this);
        this._createMediaElement();
    };

    klynt.MediaRenderer.prototype._createMediaElement = function () {
        if (this._$mediaElement) {
            this._addSources();
            this._addProperties();
            this._$element[0].renderer = this;
            this._$mediaElement.appendTo(this._$element);
        }
    };

    klynt.MediaRenderer.prototype._addSources = function () {
        this.element.sources.map(createSource).forEach(appendToMedia.bind(this));

        function createSource(source) {
            var $source = $('<source>').attr('src', source.src);
            if (source.type) {
                $source.attr('type', source.type);
            }
            return $source;
        }

        function appendToMedia($source) {
            $source.appendTo(this._$mediaElement);
        }
    };

    klynt.MediaRenderer.prototype._addProperties = function () {
        var autoplay = this.element.autoplay && (this.element.syncMaster || this.element.begin < 1);

        this._$mediaElement
            .prop('autoplay', autoplay)
            .prop('controls', this.element.controls)
            .prop('loop', this.element.loop)
            .attr('width', this.element.width)
            .attr('height', this.element.height)
            .attr('poster', this.element.poster)
            .attr('volume', this.element.volume);
    };

    klynt.MediaRenderer.prototype._initTimesheets = function () {
        if (this.element.syncMaster) {
            this._$element
                .attr('data-syncmaster', true)
                .attr('data-timeaction', 'none');
        } else {
            klynt.ElementRenderer.prototype._initTimesheets.call(this);
            this.show();
        }
    };

    klynt.MediaRenderer.prototype.play = function () {
        if (this.element.syncMaster || this.$element[0].timing.isActive()) {
            this.mediaAPI.play();
            this._wasPlaying = false;
        }
    };

    klynt.MediaRenderer.prototype.pause = function () {
        this.mediaAPI.pause();
    };

    klynt.MediaRenderer.prototype.togglePlayPause = function () {
        if (this.mediaAPI.paused) {
            this.play();
        } else {
            this.pause();
        }
    };

    klynt.MediaRenderer.prototype.stop = function () {
        this.mediaAPI.pause();
        this.mediaAPI.setCurrentTime(0);
    };

    klynt.MediaRenderer.prototype.seekTo = function (time) {
        if (time < 1) {
            this.stop();
        } else {
            this.mediaAPI.setCurrentTime(Math.min(time, this.mediaAPI.duration));
        }
    };

    klynt.MediaRenderer.prototype._load = function () {
        this.mediaAPI.load();
    };

    klynt.MediaRenderer.prototype.setVolume = function (volume) {
        try {
            this.mediaAPI.setVolume(volume);
            this._volumeSet = true;
        } catch (error) {

        }
    };

    klynt.MediaRenderer.prototype.getVolume = function () {
        return this.mediaAPI.volume;
    };

    klynt.MediaRenderer.prototype.mute = function () {
        this.mediaAPI.setMuted(true);
    };

    klynt.MediaRenderer.prototype.unmute = function () {
        this.mediaAPI.setMuted(false);
    };

    klynt.MediaRenderer.prototype.toggleMute = function () {
        if (this.mediaAPI.muted) {
            this.unmute();
        } else {
            this.mute();
        }
    };

    klynt.MediaRenderer.prototype.saveStatus = function () {
        this._wasPlaying = this.mediaAPI.duration && !this.mediaAPI.ended && !this.mediaAPI.paused
    };

    klynt.MediaRenderer.prototype.resumeFromStatus = function (overlay) {
        if (this._wasPlaying || this.element.syncMaster) {
            this.play(overlay);
        };
    };

    klynt.MediaRenderer.prototype._initWithMediaAPI = function () {
        this._mediaAPI.addEventListener('play', this._onPlay.bind(this), false);
        this._mediaAPI.addEventListener('pause', this._onPause.bind(this), false);

        this.$element.find('.mejs-overlay-play').hide();

        if (this._element.syncMaster) {
            this._mediaAPI.addEventListener('ended', this._onSyncMasterEnd.bind(this), false);
        } else {
            this.hide();
        }

        if (klynt.utils.browser.iOS && this._element.autoplay) {
            this._load();
        }

        if (!this.element.syncMaster) {
            $('.control_' + this.element.id).hide();
            this.$element.find('.mejs-controls').hide();
        }
    };

    klynt.MediaRenderer.prototype._onSyncMasterEnd = function () {
        if (this.sequence) {
            this.sequence.onSyncMasterEnd();
        }
    };

    klynt.MediaRenderer.prototype._onPlay = function (event) {
        if (!this._volumeSet) {
            this.setVolume(this.element.volume);
        }
        klynt.sequenceManager.muted ? this.mute() : this.unmute();
        if (this._element.syncMaster) {
            this.sequence.play();
        }
    };

    klynt.MediaRenderer.prototype._onPause = function (event) {
        if (this.mediaAPI.ended || this.sequence.ended) {
            this.$element.find('.mejs-overlay-play').hide();
        }
        if (this._element.syncMaster) {
            this.sequence.pause();
        }
    };

    klynt.MediaRenderer.prototype._onBegin = function (event) {
        klynt.ElementRenderer.prototype._onBegin.call(this);
        if (this.element.autoplay) {
            this.play();
        }
        if (this.element.controls && !this.element.syncMaster) {
            $('.control_' + this.element.id).show();
            this.$element.find('.mejs-controls').show();
        }
    };

    klynt.MediaRenderer.prototype._onEnd = function (event) {
        klynt.ElementRenderer.prototype._onEnd.call(this);
        this.pause();
        if (!this.element.syncMaster) {
            $('.control_' + this.element.id).hide();
            this.$element.find('.mejs-controls').hide();
        }
    };

    klynt.MediaRenderer.prototype = klynt.utils.mergePrototypes(klynt.ElementRenderer, klynt.MediaRenderer);
})(window.klynt);