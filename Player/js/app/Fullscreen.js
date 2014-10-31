/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of the fullscreen module.
 * */

(function (klynt) {
    var accessors = {
        get enabled() {
            return document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
        },

        get active() {
            return !!(document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement);
        },

        set active(value) {
            if (!this.enabled || value === this.active) {
                return;
            }

            if (value) {
                requestFullscreen();
            } else {
                cancelFullscreen();
            }
        }
    };

    klynt.getModule('fullscreen', accessors).expose(toggle, requestFullscreen, cancelFullscreen);

    $(document).on('fullscreenchange MSFullscreenChange mozfullscreenchange webkitfullscreenchange', onFullscreenChange);

    function toggle() {
        this.active = !this.active;
    }

    function requestFullscreen() {
        var container = klynt.player.$element.parent()[0];
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
            container.mozRequestFullScreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    }

    function cancelFullscreen() {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }

    function onFullscreenChange(event) {
        if (klynt.fullscreen.active) {
            if (!klynt.player.scaleToFullWindow) {
                klynt.player.setDimensions(screen.width, screen.height);
            }

            klynt.player.$element.trigger('open.fullscreen');
            klynt.analytics.trackEvent('fullscreen', 'request');
        } else {
            if (!klynt.player.scaleToFullWindow) {
                klynt.player.resetDimensions();
            }

            klynt.player.$element.trigger('close.fullscreen');
            klynt.analytics.trackEvent('fullscreen', 'cancel');

            if (klynt.params.miniPlayer) {
                klynt.miniPlayer.changeMode(true);
            }
        }
    }
})(window.klynt);