/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of the sequence manager module which manages the sequences state.
 * */

(function (klynt) {
    var muted = false;
    var currentSequence;

    var accessors = {
        get playing() {
            return klynt.sequenceContainer.currentRenderer && klynt.sequenceContainer.currentRenderer.playing;
        },

        get muted() {
            return muted;
        },

        get currentSequence() {
            return currentSequence;
        }
    };

    klynt.getModule('sequenceManager')
        .expose(accessors)
        .expose(open, closeOverlay)
        .expose(togglePlayPause, play, pause, seekTo)
        .expose(toggleMute, mute, unmute)
        .expose(openLink);

    function open(token) {
        if (typeof token === 'string' || token instanceof klynt.Sequence) {
            openSequence(klynt.sequences.find(token));
        } else if (token instanceof klynt.Link) {
            openLink(token);
        } else {
            var target = klynt.sequences.find(token.target);
            if (target && token.hasOwnProperty('type')) {
                if (token.type === 'openSequence') {
                    openSequence(klynt.sequences.find(token.target));
                } else if (token.type === 'openOverlay') {
                    openOverlay(klynt.sequences.find(token.target));
                }
            }
        }
    }

    function openLink(link) {
        if (link.overlay) {
            openOverlay(link.target, link);
        } else {
            openSequence(link.target, link);
        }
    }

    function openSequence(sequence, link) {
        currentSequence = sequence;

        if (klynt.data.watermark) {
            if ((sequence.id === klynt.data.mainSequence) && !klynt.data.watermark.displayOnStartSequence) {
                klynt.sequenceContainer.$watermark.hide();
            } else {
                klynt.sequenceContainer.$watermark.show();
            }
        }

        var transitionRenderer = klynt.utils.getTransitionRenderer(link && link.transition);

        if (klynt.sequenceContainer.currentOverlayRenderer) {
            klynt.sequenceContainer.currentOverlayRenderer.destroy();
        }

        $(transitionRenderer).on('complete.animation', function (event, transitionRenderer) {
            if (transitionRenderer.discarded) {
                transitionRenderer.discarded.destroy();
            }
            klynt.sequenceContainer.currentSequenceRenderer = transitionRenderer.result;
        });

        var nextRenderer = klynt.sequenceContainer.addSequence(sequence);
        transitionRenderer.execute(klynt.sequenceContainer.currentSequenceRenderer, nextRenderer);
        if (!klynt.sequenceContainer.currentSequenceRenderer) {
            klynt.sequenceContainer.currentSequenceRenderer = nextRenderer;
        }

        klynt.hashtag.setCurrentSequence(sequence.id);
        klynt.player.$element.trigger('open.sequence', sequence);
    }

    function openOverlay(sequence, link) {
        var transitionRenderer = klynt.utils.getTransitionRenderer(link && link.transition);

        $(transitionRenderer).on('complete.animation', function (event, transitionRenderer) {
            if (transitionRenderer.discarded) {
                transitionRenderer.discarded.destroy();
            }
            klynt.sequenceContainer.currentOverlayRenderer = transitionRenderer.result;

            if (klynt.sequenceContainer.currentSequenceRenderer && (!link || link.pauseParent)) {
                klynt.sequenceContainer.currentSequenceRenderer.pause();
            }
        });

        var params = {
            automaticClose: link ? link.automaticClose : false,
            closeButton: link ? link.closeButton : true
        };
        var nextRenderer = klynt.sequenceContainer.addOverlay(sequence, params);
        transitionRenderer.execute(klynt.sequenceContainer.currentOverlayRenderer, nextRenderer);

        klynt.player.$element.trigger('open.overlay', sequence);
    }

    function closeOverlay() {
        if (klynt.sequenceContainer.currentOverlayRenderer) {
            klynt.sequenceContainer.currentOverlayRenderer.destroy();
            klynt.sequenceContainer.currentOverlayRenderer = null;
        }

        if (klynt.sequenceContainer.currentSequenceRenderer) {
            klynt.sequenceContainer.currentSequenceRenderer.play();
        }
    }

    function togglePlayPause() {
        if (this.playing) {
            this.pause();
        } else {
            this.play();
        }

    }

    function play() {
        klynt.sequenceContainer.currentRenderer.play();
    }

    function pause() {
        klynt.sequenceContainer.currentRenderer.pause();
    }

    function seekTo(time) {
        if (typeof time === 'string') {
            time = klynt.utils.getTimeFromString(time);
        }

        klynt.sequenceContainer.currentRenderer.seekTo(time);
    }

    function toggleMute() {
        muted ? unmute() : mute();
    }

    function mute() {
        muted = true;
        klynt.sequenceContainer.currentRenderer.mute();
        klynt.player.$element.trigger('off.sound');
    }

    function unmute() {
        muted = false;
        klynt.sequenceContainer.currentRenderer.unmute();
        klynt.player.$element.trigger('on.sound');
    }
})(window.klynt);