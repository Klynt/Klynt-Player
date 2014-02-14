/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.SequenceRenderer = function (sequence, $parent) {
        this._sequence = sequence;
        this._$parent = $parent;
        this._init();
        this._mediaRenderers = this._videoRenderers.concat(this._externalVideoRenderers).concat(this._audioRenderers);
    };

    klynt.SequenceRenderer.prototype = {
        _sequence: null,
        _$parent: null,
        _$element: null,

        get $element() {
            return this._$element;
        },

        _playing: true,
        _ended: false,

        get sequence() {
            return this._sequence;
        },

        get playing() {
            return this._playing;
        },

        set playing(value) {
            if (value) {
                this.play();
            } else {
                this.pause();
            }
        },

        _buttonRenderers: null,
        _textRenderers: null,
        _iframeRenderers: null,
        _shapeRenderers: null,
        _imageRenderers: null,
        _videoRenderers: null,
        _externalVideoRenderers: null,
        _audioRenderers: null,
        _mediaRenderers: null
    };

    klynt.SequenceRenderer.prototype._init = function () {
        this._initDOM();
        this._initChildren();
        this._initScouts();
        this._initTimesheets();
    };

    klynt.SequenceRenderer.prototype.destroy = function () {
        this._$element.remove();
    };

    klynt.SequenceRenderer.prototype._initDOM = function () {
        this._$element = $('<div>')
            .attr('id', 'sequence_' + this._sequence.id)
            .addClass('sequence_' + this._sequence.id)
            .addClass('sequence')
            .addClass(this._sequence.classNames)
            .css('backgroundColor', this._sequence.backgroundColor)
            .appendTo(this._$parent);
    };

    klynt.SequenceRenderer.prototype._initChildren = function () {
        this._videoRenderers = this.sequence.videos.map(createRenderer(klynt.VideoRenderer, this._$element));
        this._externalVideoRenderers = this.sequence.externalVideos.map(createRenderer(klynt.ExternalVideoRenderer, this._$element));
        this._audioRenderers = this.sequence.audios.map(createRenderer(klynt.AudioRenderer, this._$element));

        this._imageRenderers = this.sequence.images.map(createRenderer(klynt.ImageRenderer, this._$element));
        this._shapeRenderers = this.sequence.shapes.map(createRenderer(klynt.ShapeRenderer, this._$element));
        this._buttonRenderers = this.sequence.buttons.map(createRenderer(klynt.ButtonRenderer, this._$element));
        this._textRenderers = this.sequence.texts.map(createRenderer(klynt.TextRenderer, this._$element));
        this._iframeRenderers = this.sequence.iframes.map(createRenderer(klynt.iFrameRenderer, this._$element));

        this._$element.tooltip({
            track: true,
            parentDiv: this._$element[0]
        });
        this._$element.find(".nano-container").nanoScroller({
            paneClass: 'nano-pane',
            contentClass: 'nano-content'
        });
    };

    klynt.SequenceRenderer.prototype._initScouts = function () {
        new klynt.ScoutRenderer(this.sequence.duration, this._$element, this._end.bind(this));
    };

    klynt.SequenceRenderer.prototype._initTimesheets = function () {
        this._$element
            .attr('data-timecontainer', 'par')
            .attr('data-timeaction', 'visibility');

        this._notifyTimeSheets();
    };

    klynt.SequenceRenderer.prototype._notifyTimeSheets = function () {
        var event = document.createEvent('Event');
        event.sequence = this;
        event.initEvent('DOMContentLoaded', true, true);
        document.dispatchEvent(event);
    };

    function createRenderer(rendererClass, $parent) {
        return function (model) {
            return new rendererClass(model, $parent);
        };
    }

    klynt.SequenceRenderer.prototype.play = function () {
        if (!this._playing) {
            this._playing = true;
            /*if (this._ended) {
                this._ended = false;
                this.seekTo(0);
            }*/

            this._mediaRenderers.forEach(function playMedia(media) {
                media.resumeFromStatus();
                //media.play();
            });

            if (!this._ended) {
                this._$element[0].timing.Play();
            }
        }

    };

    klynt.SequenceRenderer.prototype.pause = function () {
        var ended = this._ended;
        var overlay = klynt.sequenceContainer.currentOverlayRenderer;
        overlay = overlay && overlay !== this;

        this._mediaRenderers.forEach(function playMedia(media) {
            media.saveStatus();
            media.pause(ended, overlay || klynt.menu.isOpen);
        });

        if (this._playing) {
            this._playing = false;

            this._$element[0].timing.Pause();
        }
    };

    klynt.SequenceRenderer.prototype.seekTo = function (time) {
        time = Math.max(0, Math.min(time, this.sequence.duration));

        this._$element[0].timing.setCurrentTime(time);
        this._mediaRenderers.forEach(function seekMedia(media) {
            var mediaTime = time - media.element.begin;
            if (mediaTime >= 0 && mediaTime <= media.element.duration) {
                media.seekTo(mediaTime);
            }
        });

        if (time === this.sequence.duration) {
            this._end();
        } else if (this._ended) {
            this._ended = false;
        }
    };

    klynt.SequenceRenderer.prototype._end = function () {
        this._ended = true;
        this.pause();
    };

    klynt.SequenceRenderer.prototype.onSyncMasterEnd = function () {
        this.runAutomaticLink();
    };

    klynt.SequenceRenderer.prototype.runAutomaticLink = function (link) {
        if (!this._ended) {
            this._end();

            if (link && link instanceof klynt.Link && link.automaticTransition) {
                link.execute();
            } else {
                for (var i = 0; i < this.sequence.buttons.length; i++) {
                    var button = this.sequence.buttons[i];
                    if (button.link && button.link.automaticTransition) {
                        button.link.execute();
                        break;
                    }
                }
            }
        }
    };

    klynt.SequenceRenderer.prototype.mute = function () {
        this._mediaRenderers.forEach(function seekMedia(media) {
            media.mute();
        });
    };

    klynt.SequenceRenderer.prototype.unmute = function () {
        var ended = this._ended;
        var overlay = klynt.sequenceContainer.currentOverlayRenderer;
        overlay = overlay && overlay !== this;

        this._mediaRenderers.forEach(function seekMedia(media) {
            media.unmute(ended, overlay);
        });
    };
})(window.klynt);