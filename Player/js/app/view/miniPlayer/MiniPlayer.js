/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.MiniPlayer = function (type, data) {
        this._data = data;
        this._type = type;
        this._touch = this.checkTouch();

        var info = this.checkFullscreen() ? 'fullscreenInfoWording' : 'fullscreenAlertWording';
        var touch = ' info-hide"';

        if (this._type === 'horizontal') {

            var playButton = '<svg version="1.1"' +
                'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"' +
                'x="0px" y="0px" width="10px" height="17px" viewBox="-0.33 -0.672 45 73"' +
                'overflow="visible" enable-background="new -0.33 -0.672 45 73" xml:space="preserve" style="position:absolute; top:36px; left:50px">' +
                '<defs>' +
                '</defs>' +
                '<polygon class="miniplayer-button-color" stroke-width="4" stroke-linejoin="round" stroke-miterlimit="10" points="2,69.99 2,2 42.667,35.996 "/>' +
                '</svg>';

            this._template =
                '<div class="horizontal miniplayer-info' + touch + '">' +
                '<span class="horizontal miniplayer-info-content">{{' + info + '}}</span>' +
                '</div>' +
                '<div class="horizontal miniplayer-menu">' +
                '<div class="horizontal miniplayer-button">' + playButton + '</div>' +
                '<div class="horizontal miniplayer-menu-text">' +
                '<h1 class="horizontal miniplayer-menu-title">{{title}}</h1>' +
                '<p class="horizontal miniplayer-menu-subtitle">{{description}}</p>' +
                '</div>' +
                '</div>' +
                '<div class="horizontal miniplayer-return klynt-primary-color-bg-80">' +
                '<h1 class="horizontal miniplayer-return-info">{{thanksForWatchingWording}}</h1>' +
                '<p class="horizontal miniplayer-return-question">{{resumePlaybackWording}}</p>' +
                '<div class="horizontal miniplayer-return-buttons">' +
                '<div class="no">{{noWording}}</div>' +
                '<div class="yes">{{yesWording}}</div>' +
                '</div>' +
                '</div>';
        } else {

            var playButton = '<svg version="1.1"' +
                'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"' +
                'x="0px" y="0px" width="10px" height="17px" viewBox="-0.33 -0.672 45 73"' +
                'overflow="visible" enable-background="new -0.33 -0.672 45 73" xml:space="preserve" style="position:absolute; top:16px; left:21px">' +
                '<defs>' +
                '</defs>' +
                '<polygon class="miniplayer-button-color" stroke-width="4" stroke-linejoin="round" stroke-miterlimit="10" points="2,69.99 2,2 42.667,35.996 "/>' +
                '</svg>';

            this._template =
                '<div class="vertical miniplayer-poster">' +
                '<div class="vertical miniplayer-info' + touch + '">' +
                '<span class="vertical miniplayer-info-content">{{' + info + '}}</span>' +
                '</div>' +
                '<div class="vertical miniplayer-button">' + playButton + '</div>' +
                '</div>' +
                '<div class="vertical miniplayer-text">' +
                '<h1 class="vertical miniplayer-text-title">{{title}}</h1>' +
                '<p class="vertical miniplayer-text-subtitle">{{description}}</p>' +
                '</div>' +
                '<div class="vertical miniplayer-return klynt-primary-color-bg-80">' +
                '<h1 class="vertical miniplayer-return-info">{{thanksForWatchingWording}}</h1>' +
                '<p class="vertical miniplayer-return-question">{{resumePlaybackWording}}</p>' +
                '<div class="vertical miniplayer-return-buttons">' +
                '<div class="no">{{noWording}}</div>' +
                '<div class="yes">{{yesWording}}</div>' +
                '</div>' +
                '</div>';
        }

        this.init();
        this.render();
        $('body').append(this.$element);
        $('.horizontal#miniPlayer, .vertical.miniplayer-poster').css('background-image', 'url(' + klynt.miniPlayerData.thumbnail + ')');
    };

    klynt.MiniPlayer.prototype = {
        _$element: null,
        get $element() {
            return this._$element;
        }
    };

    klynt.MiniPlayer.prototype.init = function () {
        this._$element = $('<div>').attr('id', 'miniPlayer');

        if (this._type === 'horizontal') {
            this._$element.addClass('horizontal');
        } else {
            this._$element.addClass('vertical');
        }

        if (!this._touch) {
            this._$element.hover(
                function () {
                    $(this).find('.miniplayer-info').removeClass('info-hide');
                }, function () {
                    $(this).find('.miniplayer-info').addClass('info-hide');
                }
            )
        }

    };

    klynt.MiniPlayer.prototype.render = function () {
        this._$element.html(Mustache.render(this._template, this._data));
    };

    klynt.MiniPlayer.prototype.checkFullscreen = function () {
        return document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
    };

    klynt.MiniPlayer.prototype.checkTouch = function () {
        return typeof window.ontouchstart !== 'undefined';
    };

})(window.klynt);