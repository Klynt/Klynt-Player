/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of the player main module.
 * */

(function (klynt) {
    var scrollTimer = true;
    var scrollTimerDelay = 1000;
    var minimumMouseWheelDelta = 20;

    var accessors = {
        get keyboardNavigationEnabled() {
            return klynt.data.advanced && klynt.data.advanced.enableKeyboardNavigation;
        },

        get scrollNavigationEnabled() {
            return klynt.data.advanced && klynt.data.advanced.enableScrollNavigation;
        }
    };

    klynt.getModule('events', accessors).expose(init, move);

    function init() {
        document.addEventListener('keydown', onKeyDown);

        if (this.scrollNavigationEnabled) {
            document.addEventListener('mousewheel', onMouseWheel);
            document.addEventListener('DOMMouseScroll', onMouseWheel);
        }
    }

    function onKeyDown(event) {
        if (event.keyCode == 32) {
            klynt.player.togglePlayPause();
        } else if (this.keyboardNavigationEnabled) {
            var direction = getDirectionFromKeyCode(event.keyCode);
            if (direction) {
                move(direction, 'keyboard');
            }
        }
    }

    function onMouseWheel(event) {
        var delta = event.wheelDeltaY || event.wheelDelta;

        if (Math.abs(delta) > minimumMouseWheelDelta) {
            move(delta < 0 ? 'right' : 'left', 'scroll');
        }
    }

    function move(direction, moveType, closeMenu) {

        if (!scrollTimer || (!closeMenu && klynt.menu.isOpen)) {
            return;
        }

        var selectedLink = findLinkInDirection(direction);

        if (selectedLink) {
            klynt.player.open(selectedLink);

            if (moveType == 'scroll') {
                scrollTimer = false;
                klynt.utils.callLater(function () {
                    scrollTimer = true
                }, scrollTimerDelay);
            }
        }
    }

    function getDirectionFromKeyCode(keyCode) {
        switch (keyCode) {
        case 37:
            return 'left';
        case 38:
            return 'top';
        case 39:
            return 'right';
        case 40:
            return 'bottom';
        default:
            return null;
        }
    }

    function findLinkInDirection(direction) {
        var arrowButtons = findArrowsWithDirection('btn-arrow-' + direction);
        var selectedLink = arrowButtons.length === 1 ? arrowButtons[0].link : null;

        return selectedLink && selectedLink.target && !selectedLink.overlay ? selectedLink : null;
    }

    function findArrowsWithDirection(arrowDirection) {
        return klynt.sequenceContainer.currentSequence.buttons.filter(function (button) {
            if (button.link && button.link.automaticTransition) {
                return false;
            }
            if (button.type !== arrowDirection) {
                return false;
            }

            var currentSequenceTime = klynt.sequenceContainer.currentRenderer.currentTime;
            if (button.begin > currentSequenceTime || button.end < currentSequenceTime) {
                return false;
            }

            return true;
        });
    }
})(window.klynt);