/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of the sequence manager module which manages the sequences state.
 * */

(function (klynt) {
    var muted = false;
    var transitionRenderer;
    var testStorage = false;

    var accessors = {
        get playing() {
            return klynt.sequenceContainer.currentRenderer && klynt.sequenceContainer.currentRenderer.playing;
        },

        get muted() {
            return muted;
        }
    };

    klynt.getModule('sequenceManager')
        .expose(accessors)
        .expose(open, openSequenceWithTouch, closeOverlay)
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

    function openSequenceWithTouch(direction) {
        var arrowButtons = klynt.sequenceContainer.currentSequence.buttons.filter(function (button) {
            if (button.link && button.link.automaticTransition) {
                return false;
            }
            switch (direction) {
            case klynt.TouchTransitionRenderer.DIRECTION.UP:
                return button.type === 'btn-arrow-bottom';
            case klynt.TouchTransitionRenderer.DIRECTION.DOWN:
                return button.type === 'btn-arrow-top';
            case klynt.TouchTransitionRenderer.DIRECTION.LEFT:
                return button.type === 'btn-arrow-right';
            case klynt.TouchTransitionRenderer.DIRECTION.RIGHT:
                return button.type === 'btn-arrow-left';
            default:
                return false;
            }
        });

        var selectedLink = arrowButtons.length === 1 ? arrowButtons[0].link : null;

        return selectedLink && selectedLink.target && !selectedLink.overlay ? openSequence(selectedLink.target, {
            transition: {
                type: 'touch',
                direction: direction
            }
        }) : null;
    }

    function openSequence(sequence, link) {
        if (klynt.sequenceContainer.currentOverlayRenderer) {
            klynt.sequenceContainer.currentOverlayRenderer.destroy();
            klynt.sequenceContainer.currentOverlayRenderer = null;
            klynt.continuousAudio.clean(true);
        }

        var nextRenderer = klynt.sequenceContainer.addSequence(sequence);

        if (transitionRenderer) {
            transitionRenderer.kill();
        }

        transitionRenderer = klynt.utils.getTransitionRenderer(link);

        $(transitionRenderer).on('validate.animation', function (event) {
            if (klynt.data.watermark) {
                if ((sequence.id === klynt.data.mainSequence) && !klynt.data.watermark.displayOnStartSequence) {
                    klynt.sequenceContainer.$watermark.hide();
                } else {
                    klynt.sequenceContainer.$watermark.show();
                }
            }

            if (klynt.sequenceContainer.currentSequenceRenderer) {
                klynt.sequenceContainer.currentSequenceRenderer.willDestroy = true;
            }

            if (!klynt.sequenceContainer.currentSequenceRenderer) {
                klynt.sequenceContainer.currentSequenceRenderer = nextRenderer;
            }

            klynt.hashtag.setCurrentSequence(sequence.id);
            klynt.player.$element.trigger('open.sequence', sequence);
            klynt.loader.setCurrentSequence(sequence);
        });

        $(transitionRenderer).on('complete.animation', function (event) {
            if (transitionRenderer.discarded) {
                transitionRenderer.discarded.destroy(true);
            }
            klynt.sequenceContainer.currentSequenceRenderer = transitionRenderer.result;

            klynt.continuousAudio.clean(false);
            transitionRenderer = null;
        });

        $(transitionRenderer).on('cancel.animation', function (event) {
            if (klynt.sequenceContainer.currentSequenceRenderer) {
                klynt.sequenceContainer.currentSequenceRenderer.willDestroy = false;
            }

            if (transitionRenderer.target) {
                transitionRenderer.target.destroy(true);
                klynt.continuousAudio.clean(false);
            }

            transitionRenderer = null;
        });

        transitionRenderer.execute(klynt.sequenceContainer.currentSequenceRenderer, nextRenderer);

        return transitionRenderer;
    }

    function openOverlay(sequence, link) {
        var nextRenderer = klynt.sequenceContainer.addOverlay(sequence, link);

        if (transitionRenderer) {
            transitionRenderer.kill();
        }

        transitionRenderer = klynt.utils.getTransitionRenderer(link);

        $(transitionRenderer).on('validate.animation', function (event) {
            klynt.player.$element.trigger('open.overlay', sequence);
            klynt.loader.setCurrentSequence(sequence);
        });

        $(transitionRenderer).on('complete.animation', function (event) {
            if (transitionRenderer.discarded) {
                transitionRenderer.discarded.destroy(true);
            }
            klynt.sequenceContainer.currentOverlayRenderer = transitionRenderer.result;
            klynt.continuousAudio.clean(true);

            if (klynt.sequenceContainer.currentSequenceRenderer && (!link || link.pauseParent)) {
                klynt.sequenceContainer.currentSequenceRenderer.pause(true);
            }
            transitionRenderer = null;
        });

        $(transitionRenderer).on('cancel.animation', function (event) {
            if (transitionRenderer.target) {
                transitionRenderer.target.destroy(true);
            }
            klynt.continuousAudio.clean(true);

            transitionRenderer = null;
        });

        transitionRenderer.execute(klynt.sequenceContainer.currentOverlayRenderer, nextRenderer);

        return transitionRenderer;
    }

    function closeOverlay() {
        if (klynt.sequenceContainer.currentOverlayRenderer) {
            klynt.sequenceContainer.currentOverlayRenderer.destroy();
            klynt.sequenceContainer.currentOverlayRenderer = null;
            klynt.continuousAudio.clean(true);
        }

        if (klynt.sequenceContainer.currentSequenceRenderer) {
            klynt.loader.setCurrentSequence(klynt.sequenceContainer.currentSequence);
            klynt.sequenceContainer.currentSequenceRenderer.play(true);
        }
    }

    function togglePlayPause() {
        if (this.playing) {
            this.pause();
        } else {
            this.play();
        }
    }

    function play(overlayOrMenu) {
        klynt.sequenceContainer.currentRenderer.play(overlayOrMenu);
    }

    function pause(overlayOrMenu) {
        klynt.sequenceContainer.currentRenderers.forEach(function (renderer) {
            renderer.pause(overlayOrMenu);
        });
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

        klynt.sequenceContainer.currentRenderers.forEach(function (renderer) {
            renderer.mute();
        });

        klynt.player.$element.trigger('off.sound');
    }

    // function storeLink(id) {

    //     if (id != klynt.sequenceContainer.currentSequence.id) {
    //         var storage = localStorage.getItem(klynt.sequenceContainer.currentSequence.id);
    //         storage = JSON.parse(storage);

    //         if (storage == null) {
    //             storage = [];
    //         }

    //         if (storage.indexOf(id) == -1) {
    //             storage.push(id);
    //         }

    //         storage = JSON.stringify(storage);
    //         localStorage.setItem(klynt.sequenceContainer.currentSequence.id, storage);
    //     }
    // }

    function unmute() {
        muted = false;

        klynt.sequenceContainer.currentRenderers.forEach(function (renderer) {
            renderer.unmute();
        });

        klynt.player.$element.trigger('on.sound');
    }
})(window.klynt);