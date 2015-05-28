/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of the player main module.
 * */

(function (klynt) {
    var $element;
    var currentRenderer;

    var accessors = {
        get currentSequence() {
            return currentRenderer && currentRenderer.sequence;
        },

        get $element() {
            return $element;
        },

        get width() {
            return klynt.sequenceContainer.width;
        },

        get height() {
            return klynt.sequenceContainer.height + klynt.footer.height;
        },

        get unscaledWidth() {
            return klynt.sequenceContainer.unscaledWidth;
        },

        get unscaledHeight() {
            return klynt.sequenceContainer.unscaledHeight + klynt.footer.height;
        },

        get playerScale() {
            return 1;
        },

        get scaleToFullWindow() {
            return klynt.data.advanced && klynt.data.advanced.enableFullWindowMode;
        },

        get basePhotoURL() {
            return !klynt.utils.browser.local ? klynt.data.advanced.basePhotoURL : null;
        },

        get baseAudioURL() {
            return !klynt.utils.browser.local ? klynt.data.advanced.baseAudioURL : null;
        },

        get baseVideoURL() {
            return !klynt.utils.browser.local ? klynt.data.advanced.baseVideoURL : null;
        },

        get basePosterURL() {
            return !klynt.utils.browser.local ? klynt.data.advanced.basePosterURL : null;
        },

        get baseThumbnailURL() {
            return !klynt.utils.browser.local ? klynt.data.advanced.baseThumbnailURL : null;
        },

        get remoteVideosAPIURL() {
            return klynt.data.advanced.remoteVideosAPIURL;
        }
    };

    klynt.getModule('player', accessors)
        .expose(init, start)
        .expose(togglePlayPause, open, openFromMenu, play, pause, seekTo)
        .expose(toggleMute, mute, unmute)
        .expose(toggleModal)
        .expose(resetDimensions, setDimensions)
        .expose(show, hide)
        .expose(getRatioToWindow)
        .expose(prefetchStartSequenceVideos);

    function init() {
        var shadowHeight = klynt.sequenceContainer.height;
        var calc = klynt.utils.browser.webkit ? '-webkit-calc' : 'calc';

        $('body, .player-container').addClass('klynt-background-color');
        $element = $('#player');
        this.resetDimensions();

        $element.append('<div class="modal-background" style="height:' + calc + '(100% - ' + klynt.footer.height + 'px)"></div>');

        if (this.scaleToFullWindow) {
            $element.css('margin', 0);

            if (klynt.utils.browser.iOS) {
                $('.player-container').css('overflowX', 'hidden');
            }
        } else {
            $('.player-container').append('<div class="fullscreen-hide"></div>');
            $('.player-container').append('<div class="fullscreen-hide-left"></div>');
            $('.player-container').append('<div class="fullscreen-hide-right"></div>');
        }

        $(window).bind('resize', onResize);
    }

    function prefetchStartSequenceVideos() {
        var startSequence = klynt.sequences.find(klynt.hashtag.toSequenceId() || klynt.sequences.mainSequence);
            var linkedVideos = [];
            if (startSequence) {
                (startSequence.externalVideos || []).forEach(function (video) {
                    if (video.externalId && video.platform && video.platform != 'youtube') {
                        linkedVideos.push(video);
                    }
                });
            }
            klynt.utils.getVideosDataFromAPI(linkedVideos);
    }

    function start() {
        if (klynt.sequenceContainer.currentRenderer) {
            klynt.player.play();
        } else {
            this.open(klynt.sequences.startupSequence);
            runURLParams();
        }
    }

    function runURLParams() {
        if (klynt.params.seek) {
            klynt.player.seekTo(klynt.params.seek);
        }
        if (klynt.params.share) {
            klynt.player.toggleModal(klynt.ShareModal);
        }
        if (klynt.params.widget) {
            klynt.menu.initWidget(klynt.params.widget, -1);
        }
    }

    function open(sequence) {
        klynt.sequenceManager.open(sequence);
        klynt.menu.close();
    }

    function openFromMenu(sequence) {
        if (sequence != klynt.sequenceContainer.currentSequence.id) {
            klynt.sequenceManager.open(sequence);
        }
        klynt.menu.close();
    }

    function togglePlayPause() {
        klynt.sequenceManager.togglePlayPause();
    }

    function play(overlayOrMenu) {
        klynt.sequenceManager.play(overlayOrMenu);
    }

    function pause(overlayOrMenu) {
        klynt.sequenceManager.pause(overlayOrMenu);
    }

    function stop() {
        this.pause();
        klynt.sequenceManager.seekTo(0);
    }

    function seekTo(time) {
        klynt.sequenceManager.seekTo(Math.min(time, klynt.sequenceContainer.currentRenderer.sequence.duration));
    }

    function mute() {
        klynt.sequenceManager.mute();
    }

    function toggleMute() {
        klynt.sequenceManager.toggleMute();
    }

    function unmute() {
        klynt.sequenceManager.unmute();
    }

    function toggleModal(modal) {
        if (typeof klynt.modal === 'undefined')
            klynt.modal = new modal({});
        else
            klynt.modal.toggle();
    }

    function resetDimensions() {
        klynt.sequenceContainer.resetDimensions();

        $element.css({
            'width': this.scaleToFullWindow ? '100%' : this.width + 'px',
            'height': this.scaleToFullWindow ? '100%' : this.height + 'px',
            'top': 0
        });

        $('.fullscreen-hide').css('height', '0px');
        $('.fullscreen-hide-left, .fullscreen-hide-right ').css('width', '0px');
    }

    function setDimensions(width, height) {
        klynt.sequenceContainer.setDimensions(width, height - klynt.footer.height);

        $element.css({
            'height': this.height + 'px',
            'width': this.width + 'px'
        });

        if (klynt.fullscreen.active) {
            var top = screen.height - this.height;
            if (top != 0) {
                $element.css('top', top + 'px');
                $('.fullscreen-hide').css('height', top + 'px');
            }

            var width = (screen.width - this.width) / 2;
            if (width != 0) {
                $('.fullscreen-hide-left, .fullscreen-hide-right ').css('width', width + 'px');
            }
        }
    }

    function onResize() {
        klynt.menu.resetDimensions();
        klynt.sequenceContainer.currentRenderers.forEach(function (sequenceRenderer) {
            sequenceRenderer.updateSize(getRatioToWindow());
        });
    }

    function hide() {
        $element.hide();
    }

    function show() {
        $element.show();
    }

    function getRatioToWindow() {
        return klynt.player.scaleToFullWindow ? Math.min(window.innerWidth / klynt.player.width, (window.innerHeight - klynt.footer.height) / (klynt.player.height - klynt.footer.height)) : 1;
    }
})(window.klynt);