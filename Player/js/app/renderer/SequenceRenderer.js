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
    };

    klynt.SequenceRenderer.prototype = {
        _sequence: null,
        _$parent: null,
        _$element: null,
        _playing: true,
        _ended: false,
        _willDestroy: false,
        _automaticLinkExecuted: false,
        _$loaderContainer: null,

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
            return this._$element && this._$element[0].timing ? this._$element[0].timing.getCurrentTime() : 0;
        },

        get audioRenderers() {
            return this._audioRenderers;
        },

        get isOverlay() {
            return this instanceof klynt.OverlayRenderer;
        },

        get willDestroy() {
            return this._willDestroy;
        },

        set willDestroy(value) {
            return this._willDestroy;
        },

        _buttonRenderers: null,
        _textRenderers: null,
        _iframeRenderers: null,
        _shapeRenderers: null,
        _imageRenderers: null,
        _videoRenderers: null,
        _externalVideoRenderers: null,
        _audioRenderers: null,
        _renderers: null,
        _mediaRenderers: null,
        _annotationRenderers: null
    };

    klynt.SequenceRenderer.prototype._init = function () {
        this._initDOM();
        this._initChildren();
        this._initScouts();
        this._initTimesheets();
        this.$element.bind('dragstart', function () {
            return false;
        });
        this._prefetchNextVideosData();
    };

    klynt.SequenceRenderer.prototype.destroy = function (skipCleaningContinuousAudio) {
        if (!this._ended) {
            this._end();
        }
        this._$element[0].sequence = null;
        this._$element.remove();

        if (!skipCleaningContinuousAudio) {
            klynt.continuousAudio.clean(this.isOverlay);
        }

        this._renderers.forEach(function (element) {
            element.destroy();
            element.sequence = null;
        });

        if (this._$loaderContainer) {
            this._$loaderContainer.remove();
        }
    };

    klynt.SequenceRenderer.prototype._initDOM = function () {
        this._$element = $('<div>')
            .attr('id', 'sequence_' + this._sequence.id)
            .addClass('sequence_' + this._sequence.id)
            .addClass('sequence')
            .addClass('mejs-klynt')
            .css('visibility', 'hidden')
            .addClass(this._sequence.classNames)
            .css('backgroundColor', this._sequence.backgroundColor)
            .appendTo(this._$parent);
        this._$element[0].sequence = this;
    };

    klynt.SequenceRenderer.prototype._initChildren = function () {
        this._renderers = [];
        this._videoRenderers = this.createRendrers(this.sequence.videos, klynt.VideoRenderer);
        this._externalVideoRenderers = this.createRendrers(this.sequence.externalVideos, klynt.VideoRenderer);
        this._audioRenderers = this.createRendrers(this.sequence.audios, klynt.AudioRenderer);

        this._imageRenderers = this.createRendrers(this.sequence.images, klynt.ImageRenderer, this);
        this._shapeRenderers = this.createRendrers(this.sequence.shapes, klynt.ShapeRenderer, this);
        this._buttonRenderers = this.createRendrers(this.sequence.buttons, klynt.ButtonRenderer, this);
        this._textRenderers = this.createRendrers(this.sequence.texts, klynt.TextRenderer, this);
        this._iframeRenderers = this.createRendrers(this.sequence.iframes, klynt.iFrameRenderer, this);

        this._mediaRenderers = this._videoRenderers.concat(this._externalVideoRenderers).concat(this._audioRenderers);

        this._annotationRenderers = this.createRendrers(this.sequence.annotations, klynt.AnnotationRenderer, this);

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

    klynt.SequenceRenderer.prototype.getElementRenderer = function (id) {
        for (var i = 0; i < this._renderers.length; i++) {
            var renderer = this._renderers[i];
            if (renderer.element.id == id) {
                return renderer;
            }
        }

        return null;
    };

    klynt.SequenceRenderer.prototype.getMediaRenderer = function (id) {
        for (var i = 0; i < this._mediaRenderers.length; i++) {
            var renderer = this._mediaRenderers[i];
            if (renderer.element.id == id) {
                return renderer;
            }
        }

        return null;
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

    klynt.SequenceRenderer.prototype.play = function (overlayOrMenu) {
        if (!this._playing && !(overlayOrMenu && this.ended)) {
            if (this._ended) {
                this._ended = false;
                this.seekTo(0, true);
            }
            this._playing = true;

            this._mediaRenderers.forEach(function playMedia(media) {
                media.resumeFromStatus(overlayOrMenu);
            });

            if (!this._ended) {
                try {this._$element[0].timing.Play();} catch (e) {};
            }
        }

    };

    klynt.SequenceRenderer.prototype.pause = function (overlayOrMenu) {
        var ended = this._ended;

        if (this._playing) {
            this._mediaRenderers.forEach(function playMedia(media) {
                media.saveStatus();
                media.pause(ended, overlayOrMenu);
            });
            this._playing = false;
            try {this._$element[0].timing.Pause();} catch (e) {};
        }
    };

    klynt.SequenceRenderer.prototype.seekTo = function (time) {
        time = Math.max(0, Math.min(time, this.sequence.duration));

        var wasPaused = !this._playing;
        if (wasPaused && !this.sequence.syncMaster) {
            this._$element[0].timing.Play();
        }
        this._$element[0].timing.setCurrentTime(time);
        if (wasPaused && !this.sequence.syncMaster) {
            this._$element[0].timing.Pause();
        }

        this._mediaRenderers.forEach(function seekMedia(media) {
            var mediaTime = time - media.element.begin;
            if (!media.element.syncMaster && mediaTime >= 0 && mediaTime <= media.element.duration) {
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
        if (this._willDestroy) {
            return;
        }

        if (!link) {
            for (var i = 0; i < this.sequence.buttons.length; i++) {
                var button = this.sequence.buttons[i];
                if (button.link && button.link.automaticTransition) {
                    link = button.link;
                    break;
                }
            }
        }
        
        klynt.utils.callLater(function () {
            if (!this._ended) {
                this._end();
            }
            if (link && !this._automaticLinkExecuted) {
                this._automaticLinkExecuted = true;
                link.execute();
            }
        }.bind(this));
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

    klynt.SequenceRenderer.prototype._prefetchNextVideosData = function () {
        var linkedSequences = [];
        this._renderers.forEach(function (renderer) {
            linkedSequences = linkedSequences.concat(renderer.element.getLinkedSequences() || []);
        });

        var linkedVideos = [];
        linkedSequences.forEach(function (sequence) {
            (sequence.externalVideos || []).forEach(function (video) {
                if (video.externalId && video.platform && video.platform != 'youtube') {
                    linkedVideos.push(video);
                }
            });
        });

        klynt.utils.getVideosDataFromAPI(linkedVideos);
    };

    klynt.SequenceRenderer.prototype.updateTime = function (time) {
        klynt.loader.setCurrentTime(this.sequence, time);

        if (this._annotationRenderers) {
            this._annotationRenderers.forEach(function (renderer) {
                renderer.updateTime(time);
            });
        }
    };

    klynt.SequenceRenderer.prototype.showSequenceLoader = function() {
        if (this._$loaderContainer) {
            this._$loaderContainer.remove();
        }
        this._$loaderContainer = $('<div class="sequence-loader-background">').appendTo(this.$element);
        var loader = new klynt.LoaderView(this._$loaderContainer);

        TweenLite.to(this._$loaderContainer, 0.5, {delay: 0.3, opacity: 1});
    };

    klynt.SequenceRenderer.prototype.hideSequenceLoader = function() {
        TweenLite.killTweensOf(this._$loaderContainer);
        TweenLite.to(this._$loaderContainer, 0.5, {delay: 0, opacity: 0});
    };

    klynt.SequenceRenderer.prototype.setControlsHidden = function (hidden) {
        if (this._annotationRenderers) {
            this._annotationRenderers.forEach(function (renderer) {
                renderer.setControlsHidden(hidden);
            });
        }
    };
})(window.klynt);