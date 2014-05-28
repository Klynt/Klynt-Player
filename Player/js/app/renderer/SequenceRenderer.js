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
        _playing: true,
        _ended: false,

        get $element() {
            return this._$element;
        },

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

        get ended() {
            return this._ended;
        },

        get currentTime() {
            return this._$element ? this._$element[0].timing.getCurrentTime() : 0;
        },

        get audioRenderers() {
            return this._audioRenderers;
        },

        get isOverlay() {
            return this instanceof klynt.OverlayRenderer;
        },

        _renderers: [],
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
        this.$element.bind('dragstart', function () {
            return false;
        });
    };

    klynt.SequenceRenderer.prototype.destroy = function (skipCleaningContinuousAudio) {
        this._end();
        this._$element.remove();

        if (!skipCleaningContinuousAudio) {
            klynt.continuousAudio.clean(this.isOverlay);
        }

        this._renderers.forEach(function (element) {
            element.sequence = null;
        });
    };

    klynt.SequenceRenderer.prototype._initDOM = function () {
        this._$element = $('<div>')
            .attr('id', 'sequence_' + this._sequence.id)
            .addClass('sequence_' + this._sequence.id)
            .addClass('sequence')
            .css('visibility', 'hidden')
            .addClass(this._sequence.classNames)
            .css('backgroundColor', this._sequence.backgroundColor)
            .appendTo(this._$parent);
    };

    klynt.SequenceRenderer.prototype._initChildren = function () {
        this._videoRenderers = this.createRendrers(this.sequence.videos, klynt.VideoRenderer);
        this._externalVideoRenderers = this.createRendrers(this.sequence.externalVideos, klynt.ExternalVideoRenderer);
        this._audioRenderers = this.createRendrers(this.sequence.audios, klynt.AudioRenderer);

        this._imageRenderers = this.createRendrers(this.sequence.images, klynt.ImageRenderer, this);
        this._shapeRenderers = this.createRendrers(this.sequence.shapes, klynt.ShapeRenderer, this);
        this._buttonRenderers = this.createRendrers(this.sequence.buttons, klynt.ButtonRenderer, this);
        this._textRenderers = this.createRendrers(this.sequence.texts, klynt.TextRenderer, this);
        this._iframeRenderers = this.createRendrers(this.sequence.iframes, klynt.iFrameRenderer, this);

        this._$element.tooltip({
            track: true,
            tooltipContainer: $('.player-container'),
            items: ".element"
        });
        this._$element.find(".nano-container").nanoScroller({
            paneClass: 'nano-pane',
            contentClass: 'nano-content'
        });
    };

    klynt.SequenceRenderer.prototype.createRendrers = function (elements, rendererClass) {
        function createRenderer(element) {
            var renderer = new rendererClass(element, this);
            this._renderers.push(renderer);
            return renderer;
        }

        return elements.map(createRenderer.bind(this));
    };

    klynt.SequenceRenderer.prototype.updateSize = function (ratio) {
        if (klynt.player.scaleToFullWindow) {
            this._renderers.forEach(function (renderer) {
                renderer.updateSize(ratio);
            });
        }
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

    klynt.SequenceRenderer.prototype.pause = function (overlay) {
        var ended = this._ended;

        this._mediaRenderers.forEach(function playMedia(media) {
            media.saveStatus();
            media.pause(ended, overlay);
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
            this._ended = true;
            klynt.utils.callLater(function () {
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
            }.bind(this));
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