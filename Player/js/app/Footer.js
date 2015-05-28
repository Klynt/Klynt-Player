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
    var isMenuOpened = false;
    var mobileMenuWidth = 150;

    var $element, $buttons, $items;
    var template =
        '<ul class="footer-buttons" style="line-height: ' + data.height + 'px;">' +
        '{{#buttons}}' +
        '<li class="footer-button klynt-secondary-color klynt-tertiary-color-hover" data-type="{{type}}"">{{#label}}<span>{{label}}</span>{{/label}}<span class="icon-{{icon}} icon-footer"></span></li>' +
        '{{/buttons}}' +
        '</ul>' +
        '<ul class="footer-items footer-btn-lag" style="line-height: ' + data.height + 'px;">' +
        '{{#items}}' +
        '<li class="footer-item klynt-secondary-color klynt-tertiary-color-hover">{{label}}</li>' +
        '{{/items}}' +
        '</ul>';

    template += '<span class="footer-mobile-button klynt-secondary-color-border klynt-tertiary-border-hover" style="top:' + ((data.height - 10) / 2) + 'px"></span>';

    var mobileMenuTemplate =
        '<ul class="mobile-menu-items klynt-secondary-border-color nano-content">' +
        '{{#items}}' +
        '<li class="mobile-menu-item klynt-secondary-border-color">{{label}}</li>' +
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

        var calc = klynt.utils.browser.webkit ? '-webkit-calc' : 'calc';

        $element = $('<div>')
            .attr('id', 'footer')
            .addClass('footer')
            .css('height', data.height + 'px')
            .appendTo(klynt.player.$element)
            .html(Mustache.render(template, data))
            .hammer()
            .on('click', '.footer-btn-menu', onClickMenu)
            .on('click', '.footer-item', onClickFooter)
            .on('click', '.footer-button', onClickButton);

        $mobileMenu = $('<div>')
            .attr('id', 'mobile-menu')
            .addClass('mobile-menu')
            .addClass('klynt-primary-color-bg')
            .addClass('klynt-secondary-color')
            .addClass('nano-container')
            .css('top', 0)
            .css('bottom', klynt.footer.height + 'px')
            .css('left', -mobileMenuWidth + 'px')
            .css('width', mobileMenuWidth + 'px')
            .css('height', calc + '(100% - ' + klynt.footer.height + 'px)')
            .appendTo(klynt.player.$element)
            .html(Mustache.render(mobileMenuTemplate, data))
            .hammer()
            .on('click', '.mobile-menu-item', onClickFooter)
            .on('click', '.mobile-menu-item', closeMobileMenu);

        setTimeout(function () {
            $('.nano-container').nanoScroller({
                paneClass: 'nano-pane',
                contentClass: 'nano-content'
            });
        }, 0);

        $items = $element.find('.footer-item');
        $buttons = $element.find('.footer-button');
        $mobileButton = $element.find('.footer-mobile-button');

        $mobileButton.hammer().on('click', toggleMobileMenu);

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

        // BREAK POINTS //

        var itemsWidth, buttonsWidth, breakPoint1, breakPoint2;

        // FIRST BREAK POINT //

        itemsWidth = 0;
        $items.each(function () {
            itemsWidth += $(this).outerWidth(true);
        });
        buttonsWidth = $('.footer-buttons').width();
        breakPoint1 = itemsWidth + buttonsWidth + 15 + 30;

        $buttons.find('span:first-child').hide();

        // SECOND BREAK POINT //

        itemsWidth = 0;
        $items.each(function () {
            itemsWidth += $(this).outerWidth(true);
        });
        buttonsWidth = $('.footer-buttons').width();
        breakPoint2 = itemsWidth + buttonsWidth + 15 + 30;
        $buttons.find('span:first-child').show();

        changeFooter(breakPoint1, breakPoint2);

        $(window).on('resize', function () {
            changeFooter(breakPoint1, breakPoint2);
        });
    }

    function changeFooter(breakPoint1, breakPoint2) {
        var footerWidth = $element.width();
        var mobileButton = $('.footer-mobile-button');

        if (footerWidth > breakPoint1) {
            $buttons.find('span:first-child').show();
            $('.footer-items').show();
            closeMobileMenu();
            mobileButton.hide();
        } else if (footerWidth > breakPoint2) {
            $buttons.find('span:first-child').hide();
            $('.footer-items').show();
            closeMobileMenu();
            mobileButton.hide();
        } else {
            $buttons.find('span:first-child').hide();
            $('.footer-items').hide();
            mobileButton.show();
        }
    }

    function toggleMobileMenu() {
        if (!isMenuOpened) {
            openMobileMenu();
        } else {
            closeMobileMenu();
        }
    }

    function openMobileMenu() {
        var animationParams = {
            duration: 0.2,
            properties: {
                left: '0px'
            }
        };

        klynt.animation.to(animationParams, $mobileMenu);
        isMenuOpened = true;
    }

    function closeMobileMenu() {
        var animationParams = {
            duration: 0.2,
            properties: {
                left: -mobileMenuWidth + 'px'
            }
        };

        klynt.animation.to(animationParams, $mobileMenu);
        isMenuOpened = false;
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