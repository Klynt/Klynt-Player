/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of the actions module which manages the actions.
 * */

(function (klynt) {

    klynt.getModule('action')
        .expose(openModalShare)
        .expose(enterFullScreen, exitFullScreen, toggleFullScreen)
        .expose(previous, openSequence, openOverlay, closeOverlay)
        .expose(openWidget)
        .expose(openURL)
        .expose(seekTo, seekDelta, play, pause, stop, togglePlayPause)
        .expose(mute, unmute, toggleMute)
        .expose(showControls, hideControls, toggleControls)
        .expose(volume)
        .expose(refresh)
        .expose(zIndex, bringToFront, bringToBack, reverseBringToFront, reverseBringToBack);

    function openModalShare() {
        klynt.player.toggleModal(klynt.ShareModal);
    }

    function enterFullScreen() {
        klynt.fullscreen.requestFullscreen();
    }

    function exitFullScreen() {
        klynt.fullscreen.cancelFullscreen();
    }

    function toggleFullScreen() {
        klynt.fullscreen.toggle();
    }

    function previous() {
        window.history.back();
    }

    function refresh() {
        window.location.reload();
    }

    function openSequence(id) {
        klynt.player.open(id);
    }

    function openOverlay(id) {
        klynt.sequenceManager.openLink(new klynt.Link({
            targetSequence: id,
            overlay: true,
            closeButton: true,
            type: 'linkToSequence'
        }));
    }

    function closeOverlay() {
        klynt.sequenceManager.closeOverlay();
    }

    function openWidget(id) {
        var index = getIndex(id);

        klynt.menu.initWidget(id, index);

        function getIndex(id) {
            var widgets = klynt.data.footer.items;

            for (var key in widgets) {
                if (widgets[key].action.target == id) {
                    return key;
                }
            }
            return -1;
        }
    }

    function openURL(url) {
        if (url) {
            window.open(url, '_blank');
        }
    }

    function seekDelta(delta, idOrRenderer) {
        var renderer = getMediaRenderer(idOrRenderer);
        var currentTime = renderer ? renderer.mediaAPI.currentTime : klynt.sequenceContainer.currentRenderer.currentTime;

        klynt.action.seekTo(parseFloat(currentTime) + parseFloat(delta), idOrRenderer);
    }

    function seekTo(time, idOrRenderer) {
        if (idOrRenderer) {
            var renderer = getMediaRenderer(idOrRenderer);
            if (renderer) {
                renderer.seekTo(time);
            }
        } else {
            klynt.player.seekTo(time);
        }
    }

    function play(idOrRenderer) {
        if (idOrRenderer) {
            var renderer = getMediaRenderer(idOrRenderer);
            if (renderer) {
                renderer.play();
            }
        } else {
            klynt.player.play();
        }
    }

    function pause(idOrRenderer) {
        if (idOrRenderer) {
            var renderer = getMediaRenderer(idOrRenderer);
            if (renderer) {
                renderer.pause();
            }
        } else {
            klynt.player.pause();
        }
    }

    function stop(idOrRenderer) {
        if (idOrRenderer) {
            var renderer = getMediaRenderer(idOrRenderer);
            if (renderer) {
                renderer.stop();
            }
        }
    }

    function togglePlayPause(idOrRenderer) {
        if (idOrRenderer) {
            var renderer = getMediaRenderer(idOrRenderer);
            if (renderer) {
                renderer.togglePlayPause();
            }
        } else {
            klynt.player.togglePlayPause();
        }
    }

    function mute(idOrRenderer) {
        if (idOrRenderer) {
            var renderer = getMediaRenderer(idOrRenderer);
            if (renderer) {
                renderer.mute();
            }
        } else {
            klynt.player.mute();
        }
    }

    function unmute(idOrRenderer) {
        if (idOrRenderer) {
            var renderer = getMediaRenderer(idOrRenderer);
            if (renderer) {
                renderer.unmute();
            }
        } else {
            klynt.player.unmute();
        }
    }

    function toggleMute(idOrRenderer) {
        if (idOrRenderer) {
            var renderer = getMediaRenderer(idOrRenderer);
            if (renderer) {
                renderer.toggleMute();
            }
        } else {
            klynt.player.toggleMute();
        }
    }

    function showControls(idOrRenderer) {
        var renderer = getMediaRenderer(idOrRenderer);
        if (renderer) {
            var $controls = renderer.$element.find('.mejs-controls');
            $controls.show();
        }
    }

    function hideControls(idOrRenderer) {
        var renderer = getMediaRenderer(idOrRenderer);
        if (renderer) {
            var $controls = renderer.$element.find('.mejs-controls');
            $controls.hide();
        }
    }

    function toggleControls(idOrRenderer) {
        var renderer = getMediaRenderer(idOrRenderer);
        var $controls = renderer ? renderer.$element.find('.mejs-controls') : null;
        if ($controls) {
            if ($controls.css('display') == 'none') {
                showControls(idOrRenderer);
            } else {
                hideControls(idOrRenderer);
            }
        }
    }

    function volume(idOrRenderer, value, duration) {
        var renderer = getMediaRenderer(idOrRenderer);
        if (renderer) {
            var initialVolume = renderer.getVolume();
            if (duration == 0) {
                renderer.setVolume(value);
                return initialVolume;
            } else {
                var diffVolume = initialVolume - value;
                var properties = {
                    onUpdate: function (tween) {
                        var progress = tween.totalProgress();
                        var volume = initialVolume - (diffVolume * progress);
                        renderer.setVolume(volume);
                    },
                    onComplete: function () {
                        var finalVolume = Math.round(renderer.getVolume() * 10) / 10;
                        renderer.setVolume(finalVolume);
                    },
                    onUpdateParams: ['{self}']
                }
                return TweenLite.to(renderer, duration, properties);
            }
        }
    }

    function zIndex(idOrRenderer, value) {
        var renderer = getElementRenderer(idOrRenderer);
        if (renderer) {
            renderer.$element.css('z-index', value);
        }
    }

    function bringToFront(idOrRenderer) {
        var renderer = getElementRenderer(idOrRenderer);
        if (renderer) {
            var rendererZIndex = renderer.$element.css('z-index');
            var maxZIndex = -Number.MAX_VALUE;

            renderer.sequence._renderers.forEach(function (otherRenderer) {
                var otherZindex = otherRenderer.$element.css('z-index');

                if (maxZIndex < otherZindex) {
                    maxZIndex = otherZindex;
                }

                if (rendererZIndex < otherZindex) {
                    otherRenderer.$element.css('z-index', otherZindex - 1);
                }

            });

            renderer.$element.css('z-index', maxZIndex);
        }
    }

    function bringToBack(idOrRenderer) {
        var renderer = getElementRenderer(idOrRenderer);
        if (renderer) {
            var rendererZIndex = renderer.$element.css('z-index');
            var minZIndex = Number.MAX_VALUE;

            renderer.sequence._renderers.forEach(function (otherRenderer) {
                var otherZindex = otherRenderer.$element.css('z-index');

                if (minZIndex > otherZindex) {
                    minZIndex = otherZindex;
                }

                if (rendererZIndex > otherZindex) {
                    otherRenderer.$element.css('z-index', parseInt(otherZindex) + 1);
                }
            });

            renderer.$element.css('z-index', minZIndex);
        }
    }

    function reverseBringToFront(idOrRenderer, value) {
        var renderer = getElementRenderer(idOrRenderer);
        if (renderer) {
            renderer.sequence._renderers.forEach(function (otherRenderer) {
                var otherZindex = otherRenderer.$element.css('z-index');

                if (value <= otherZindex) {
                    otherRenderer.$element.css('z-index', parseInt(otherZindex) + 1);
                }
            });

            renderer.$element.css('z-index', value);
        }
    }

    function reverseBringToBack(idOrRenderer, value) {
        var renderer = getElementRenderer(idOrRenderer);
        if (renderer) {
            renderer.sequence._renderers.forEach(function (otherRenderer) {
                var otherZindex = otherRenderer.$element.css('z-index');

                if (value >= otherZindex) {
                    otherRenderer.$element.css('z-index', parseInt(otherZindex) - 1);
                }
            });

            renderer.$element.css('z-index', value);
        }
    }

    function getElementRenderer(idOrRenderer) {
        if (typeof idOrRenderer == 'string') {
            return klynt.sequenceContainer.currentRenderer.getElementRenderer(idOrRenderer);
        } else {
            return idOrRenderer;
        }
    }

    function getMediaRenderer(idOrRenderer) {
        if (typeof idOrRenderer == 'string') {
            return klynt.sequenceContainer.currentRenderer.getMediaRenderer(idOrRenderer);
        } else {
            return idOrRenderer;
        }
    }

})(window.klynt);