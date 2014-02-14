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
    var resizeTimeout;

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
        }
    };

    klynt.getModule('player', accessors)
        .expose(init, start)
        .expose(togglePlayPause, open, play, pause, seekTo)
        .expose(toggleMute, mute, unmute)
        .expose(toggleModal)
        .expose(resetDimensions, setDimensions)
        .expose(show, hide);

    $(window).bind('resize', onResize);

    function init() {
        $('body, .player-container').addClass('klynt-background-color');
        $element = $('#player');
        this.resetDimensions();
        $element.append('<div class="modal-background" style="height:' + klynt.sequenceContainer.height + 'px"></div>');
        $('.player-container').append('<div class="fullscreen-hide"></div>');
    }

    function start() {
        if (klynt.sequenceContainer.currentRenderer) {
            klynt.player.play();
        } else {
            this.open(klynt.hashtag.toSequenceId() || klynt.sequences.mainSequence);
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

    function togglePlayPause() {
        klynt.sequenceManager.togglePlayPause();
    }

    function play() {
        klynt.sequenceManager.play();
    }

    function pause() {
        klynt.sequenceManager.pause();
    }

    function seekTo(time) {
        klynt.sequenceManager.seekTo(time);
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
            'width': this.width + 'px',
            'height': this.height + 'px',
            'top': 0
        });

        $('.fullscreen-hide').css('height', '0px');
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
        }
    }

    function onResize() {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(klynt.menu.resetDimensions, 100);
    }

    function hide() {
        $element.hide();
    }

    function show() {
        $element.show();
    }
})(window.klynt);