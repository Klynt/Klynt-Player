/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of the footer module which manages and allows the interaction with the footer.
 * */

(function (klynt) {
    var data = klynt.data.footer || {
        height: 0
    };

    if (!data.items) {
        data.items = [];
    }
    if (!data.buttons) {
        data.buttons = [];
    }

    if (!klynt.fullscreen.enabled) {
        removeButtonWithType('fullscreen');
    }

    if (klynt.utils.browser.iOS) {
        removeButtonWithType('sound');
    }

    var currentIndex;

    var $element, $buttons, $items;
    var template =
        '<ul class="footer-buttons" style="line-height: ' + data.height + 'px;">' +
        '{{#buttons}}' +
        '<li class="footer-button klynt-secondary-color klynt-tertiary-color-hover" data-type="{{type}}"">{{#label}}<span>{{label}}</span>{{/label}}<span class="icon-{{icon}}"></span></li>' +
        '{{/buttons}}' +
        '</ul>' +
        '<ul class="footer-items footer-btn-lag" style="line-height: ' + data.height + 'px;">' +
        '{{#items}}' +
        '<li class="footer-item klynt-secondary-color klynt-tertiary-color-hover">{{label}}</li>' +
        '{{/items}}' +
        '</ul>';

    var accessors = {
        get height() {
            return data ? data.height : 0;
        }
    };

    klynt.getModule('footer', accessors).expose(init, index, activate, enable, activateId);

    function init() {
        data.useMenu = typeof klynt.data.menu !== 'undefined';

        $element = $('<div>')
            .attr('id', 'footer')
            .addClass('footer')
            .css('height', data.height + 'px')
            .appendTo(klynt.player.$element)
            .html(Mustache.render(template, data))
            .on(Modernizr.touch ? 'touchstart' : 'click', '.footer-btn-menu', onClickMenu)
            .on(Modernizr.touch ? 'touchstart' : 'click', '.footer-item', onClickFooter)
            .on(Modernizr.touch ? 'touchstart' : 'click', '.footer-button', onClickButton);

        $items = $element.find('.footer-item');
        $buttons = $element.find('.footer-button');

        if (data.useMenu) {
            $element.hammer({
                drag_lock_to_axis: true
            }).on("release dragup dragdown", klynt.menu.onSwipeFooter);
        }

        $element.find('.footer-item').each(function () {
            if ($('.footer-item:first-child').offset().top !== $(this).offset().top) {
                $element.find('.footer-items').addClass('too-many-items');
            }
        });

        $(klynt.player.$element)
            .on('open.menu close.menu', onMenuChange)
            .on('open.fullscreen close.fullscreen', onFullscreenChange)
            .on('on.sound off.sound', onMuteChange);
    }

    function onClickFooter() {
        var index = $(this).index();
        var item = data.items[index];

        currentIndex = index;

        switch (item.action.type) {
        case 'openWidget':
            klynt.menu.initWidget(item.action.target, index);
            break;
        case 'openSequence':
            klynt.menu.close();
            $('.footer-item').removeClass('active');
            setTimeout(function () {
                klynt.sequenceManager.open(item.action.target);
            }, 500);
            break;
        case 'openOverlay':
            klynt.menu.close();
            $('.footer-item').removeClass('active');
            setTimeout(function () {
                klynt.sequenceManager.open(item.action);
            }, 500);
            break;
        case 'openURL':
            window.open(item.action.target, '_blank');
            break;
        default:
            break;
        }
    }

    function onClickButton() {

        var buttonIndex = $(this).index();

        switch ($(this).data('type')) {
        case 'parcours':
            currentIndex = data.items.length + buttonIndex + 1;
            klynt.menu.initWidget('dashboard', currentIndex);
            break;
        case 'share':
            klynt.player.toggleModal(klynt.ShareModal);
            break;
        case 'sound':
            klynt.player.toggleMute();
            break;
        case 'fullscreen':
            klynt.fullscreen.toggle();
            break;
        case 'klynt':
            klynt.analytics.trackEvent('footer', 'made with klynt');
            window.open('http://klynt.net', '_blank');
            break;
        default:
            break;
        }
    }

    function onClickMenu(e) {
        e.preventDefault();
        window.open(data.logo.url, '_blank');
    }

    function onMenuChange(e) {
        var $btn = $('.footer-btn-menu');
        var $icon = $btn.find('.icon');
        if (e.type === 'open') {
            $btn.addClass('active klynt-tertiary-color');
            $icon.removeClass('icon-open').addClass('icon-close');
        } else if (e.type === 'close') {
            $btn.removeClass('active klynt-tertiary-color');
            $icon.removeClass('icon-close').addClass('icon-open');
        }
    }

    function onFullscreenChange(e) {
        if (e.type === 'open') {
            $element.find('.icon-fullscreen').removeClass('icon-fullscreen').addClass('icon-reduce');
        } else if (e.type === 'close') {
            $element.find('.icon-reduce').removeClass('icon-reduce').addClass('icon-fullscreen');
        }
    }

    function onMuteChange(e) {
        if (e.type === 'on') {
            $element.find('.icon-no-sound').removeClass('icon-no-sound').addClass('icon-sound');
        } else if (e.type === 'off') {
            $element.find('.icon-sound').removeClass('icon-sound').addClass('icon-no-sound');
        }
    }

    function index() {
        return currentIndex;
    }

    function activateId(id) {

        data.items.forEach(function (item, index) {
            if (id === item.action.target) {
                activate(index);
            }
        });

    }

    function activate(index) {
        if (index > data.items.length) {
            index = index - data.items.length - 1;
            $('.footer-button:eq(' + index + ')').addClass('active');
        } else {
            $('.footer-item:eq(' + index + ')').addClass('active');
        }
    }

    function enable(type) {
        switch (type) {
        case 'item':
            $buttons.removeClass('active');
            break;
        case 'button':
            $items.removeClass('active');
            break;
        default:
            $buttons.removeClass('active');
            $items.removeClass('active');
            break;
        }
    }

    function removeButtonWithType(type) {
        var index = -1;
        for (var i = 0; i < data.buttons.length; i++) {
            if (data.buttons[i].type === type) {
                index = i;
                break;
            }
        }

        if (index > -1) {
            data.buttons.splice(index, 1);
        }
    }
})(window.klynt);