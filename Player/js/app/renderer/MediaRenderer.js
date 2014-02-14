/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.MediaRenderer = function (media, $parent) {
        klynt.ElementRenderer.call(this, media, $parent);
    };

    klynt.MediaRenderer.prototype = {
        _$mediaElement: null,

        _mediaAPI: null,
        get mediaAPI() {
            return this._mediaAPI;
        },
        set mediaAPI(value) {
            this._mediaAPI = value;
            if (value) {
                this._initWithMediaAPI();
            }
        },

        _wasPlaying: false
    };

    klynt.MediaRenderer.prototype._initDOM = function () {
        klynt.ElementRenderer.prototype._initDOM.call(this);
        this._createMediaElement();

        if (this._$mediaElement) {
            this._addSources();
            this._addProperties();

            this._$mediaElement.appendTo(this._$element);
            this._$element[0].renderer = this;
        }
    };

    klynt.MediaRenderer._createMediaElement = function () {
        //Override in child classes.
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

    klynt.MediaRenderer.prototype.seekTo = function (time) {
        this.mediaAPI.setCurrentTime(time);
    };

    klynt.MediaRenderer.prototype._load = function () {
        this.mediaAPI.load();
    };

    klynt.MediaRenderer.prototype.setVolume = function (volume) {
        this.mediaAPI.setVolume(klynt.sequenceManager.muted ? 0 : volume);
    };

    klynt.MediaRenderer.prototype.mute = function () {
        this.setVolume(0);
    };

    klynt.MediaRenderer.prototype.unmute = function () {
        this.setVolume(this.element.volume);
    };

    klynt.MediaRenderer.prototype.saveStatus = function () {
        this._wasPlaying = this.mediaAPI.duration && !this.mediaAPI.ended && !this.mediaAPI.paused
    };

    klynt.MediaRenderer.prototype.resumeFromStatus = function () {
        if (this._wasPlaying) {
            this.play();
        };
    };

    klynt.MediaRenderer.prototype._initWithMediaAPI = function () {
        this._mediaAPI.addEventListener('play', this._onPlay.bind(this), false);

        if (this._element.syncMaster) {
            this._mediaAPI.addEventListener('ended', this._onSyncMasterEnd.bind(this), false);
        } else {
            this.hide();
        }

        if (klynt.utils.browser.iOS && this._element.autoplay) {
            this._load();
        }
    };

    klynt.MediaRenderer.prototype._onSyncMasterEnd = function () {
        klynt.sequenceContainer.currentRenderer.onSyncMasterEnd();
    };

    klynt.MediaRenderer.prototype._onPlay = function (event) {
        klynt.sequenceManager.muted ? this.mute() : this.unmute();
    };

    klynt.MediaRenderer.prototype._onBegin = function (event) {
        klynt.ElementRenderer.prototype._onBegin.call(this);
        if (this.element.autoplay) {
            this.play();
        }
    };

    klynt.MediaRenderer.prototype = klynt.utils.mergePrototypes(klynt.ElementRenderer, klynt.MediaRenderer);
})(window.klynt);