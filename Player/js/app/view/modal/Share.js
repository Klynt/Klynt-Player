/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.ShareModal = function (data) {
        data = klynt.data.share;
        this._data = data;

        var size = 24;
        var minisize = 15;
        var url = (document.URL).split('#')[0];

        var tip = '<svg version="1.1" baseProfile="basic" class="help-tip"' +
            'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"' +
            'x="0px" y="0px" width="9px" height="6px" viewBox="0 -0.2 9 6" overflow="visible" enable-background="new 0 -0.2 9 6"' +
            'xml:space="preserve">' +
            '<defs>' +
            '</defs>' +
            '<polygon class="klynt-secondary-color-fill" points="4.5,5.8 0,0 9,0 "/>' +
            '</svg>';

        this._embedCode = '<iframe height="' +
            klynt.player.height +
            '" width="' +
            klynt.player.width +
            '" src="' +
            url +
            '" frameborder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>';

        this._miniPlayer = '<iframe src="' +
            url +
            '?miniPlayer=horizontal" style="width:534px;height:300px;top:0px;left:0px;margin:0;padding:0" frameBorder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>';

        this._checkedButton = '<svg version="1.0"' +
            'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"' +
            'x="0px" y="0px" width="' + size + 'px" height="' + size + 'px" viewBox="-0.563 -0.897 24 24"' +
            'overflow="visible" enable-background="new -0.563 -0.897 24 24" xml:space="preserve">' +
            '<circle fill="#F3F3F3" stroke="#D3D3D3" stroke-miterlimit="10" cx="11.437" cy="11.437" r="10.937"/>' +
            '<circle class="klynt-tertiary-color-fill" cx="11.437" cy="11.437" r="4.333"/>' +
            '</svg>';

        this._uncheckedButton = '<svg version="1.0"' +
            'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"' +
            'x="0px" y="0px" width="' + size + 'px" height="' + size + 'px" viewBox="-0.813 -0.063 24 23"' +
            'overflow="visible" enable-background="new -0.813 -0.063 24 23" xml:space="preserve">' +
            '<circle fill="#F3F3F3" stroke="#D3D3D3" stroke-miterlimit="10" cx="11.437" cy="11.437" r="10.997"/>' +
            '</svg>';

        this._miniCheckedButton = '<svg version="1.0"' +
            'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"' +
            'x="0px" y="0px" width="' + minisize + 'px" height="' + minisize + 'px" viewBox="-0.563 -0.897 24 24"' +
            'overflow="visible" enable-background="new -0.563 -0.897 24 24" xml:space="preserve">' +
            '<circle fill="#F3F3F3" stroke="#D3D3D3" stroke-miterlimit="10" cx="11.437" cy="11.437" r="10.937"/>' +
            '<circle class="klynt-tertiary-color-fill" cx="11.437" cy="11.437" r="5.333"/>' +
            '</svg>';

        this._miniUncheckedButton = '<svg version="1.0"' +
            'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"' +
            'x="0px" y="0px" width="' + minisize + 'px" height="' + minisize + 'px" viewBox="-0.813 -0.063 24 23"' +
            'overflow="visible" enable-background="new -0.813 -0.063 24 23" xml:space="preserve">' +
            '<circle fill="#F3F3F3" stroke="#D3D3D3" stroke-miterlimit="10" cx="11.437" cy="11.437" r="10.937"/>' +
            '</svg>';

        this._helpButton = '<svg version="1.0"' +
            'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"' +
            'x="0px" y="0px" width="18px" height="18px" viewBox="-0.438 -0.562 18 18"' +
            'overflow="visible" enable-background="new -0.438 -0.562 18 18" xml:space="preserve">' +
            '<defs>' +
            '</defs>' +
            '<circle class="klynt-tertiary-color-fill" cx="8.438" cy="8.438" r="8.438"/>' +
            '<path fill="#FFFFFF" d="M7.635,10.336V10.02c0-0.457,0.07-0.833,0.211-1.128s0.402-0.606,0.785-0.935' +
            'C9.162,7.508,9.497,7.17,9.636,6.943s0.208-0.5,0.208-0.82c0-0.398-0.128-0.706-0.384-0.923S8.836,4.875,8.355,4.875' +
            'c-0.309,0-0.609,0.036-0.902,0.108S6.824,5.188,6.445,5.379L6.1,4.588c0.738-0.387,1.51-0.58,2.314-0.58' +
            'c0.746,0,1.326,0.184,1.74,0.551s0.621,0.885,0.621,1.553c0,0.285-0.038,0.536-0.114,0.753s-0.188,0.422-0.337,0.615' +
            'S9.855,7.984,9.363,8.414C8.969,8.75,8.708,9.029,8.581,9.252s-0.19,0.52-0.19,0.891v0.193H7.635z M7.348,12.076' +
            'c0-0.531,0.234-0.797,0.703-0.797c0.227,0,0.401,0.068,0.524,0.205s0.185,0.334,0.185,0.592c0,0.25-0.062,0.444-0.188,0.583' +
            's-0.299,0.208-0.521,0.208c-0.203,0-0.371-0.062-0.504-0.185S7.348,12.357,7.348,12.076z"/>' +
            '</svg>';

        this._template =
            '<div class="modal-header klynt-primary-color-bg klynt-tertiary-color">' +
            '<i class="icon modal-share"></i> <span>{{shareSequenceWording}}</span>' +
            '<a href="#" class="modal-close klynt-tertiary-color">&times;</a>' +
            '</div>' +
            '<div class="modal-content modal-link">' +
            '<span class="modal-title">{{linkWording}}</span>' +
        // '<div class="modal-content-line modal-content-line-left">' +
        // '<div id="share-program" data-check="true">' + this._checkedButton + '</div><label class="" for="programme">{{programWording}}</label>' +
        // '</div>' +
        // '<div class="modal-content-line modal-content-line-right">' +
        // '<div id="share-sequence" data-check="false">' + this._uncheckedButton + '</div></img><label class="" for="sequence">{{currentSequenceWording}}</label>' +
        // '</div>' +
        '<div class="copy"><input name="inputLink" class="klynt-secondary-colo-80r link" type="text" class="link" value="' + url /*à remplacer par l'URL en dur de l'éditeur */ + '" disabled></input></div>' +
            '</div>' +
            '<div class="modal-content modal-share">' +
            '<span class="modal-title">{{socialNetworksWording}}</span>' +
            '<div class="modal-share-buttons">' +
            '<div class="modal-share-buttons-facebook"></div>' +
            '<div class="modal-share-buttons-twitter"></div>' +
            '<div class="modal-share-buttons-tumblr"></div>' +
            '<div class="modal-share-buttons-google"></div>' +
            '<div class="modal-share-buttons-linkedin"></div>' +
            '</div>' +
            '</div>' +
            '<hr>';

        if (data.displayMiniPlayerWording) {

            this._template += '<div class="modal-content modal-iframe">' +
                '<span class="modal-title">{{embedWording}}</span>' +
                '<div class="modal-content-line modal-content-line-left">' +
                '<div id="embed-iframe" data-check="true">' + this._checkedButton + '</div><label class="" for="original">{{originalSizeWording}}</label>' +
                '</div>' +
                '<div class="modal-content-line modal-content-line-right">' +
                '<div id="embed-miniplayer" data-check="false">' + this._uncheckedButton + '</div><label class="" for="mini">{{miniPlayerWording}}</label>' +
            // '<div id="help">' + this._helpButton + '</div>' +
            '</div>' +
                '<div class="modal-miniplayer">' +
                '<div class="modal-miniplayer-horizontal" data-check="true">' +
                this._miniCheckedButton +
                '</div>' +
                '<label class="" for="horizontal">Horizontal</label>' +
                '<div class="modal-miniplayer-vertical" data-check="false">' +
                this._miniUncheckedButton +
                '</div>' +
                '<label class="" for="vertical">Vertical</label>' +
                '<input name="width" class="miniplayer-width" type="text" value="534" maxlength="3"></input>' +
                '<span class="">px</span>' +
                '<span class="modal-miniplayer-separator">x</span>' +
                '<span class="miniplayer-height">300px</span>' +
                '</div>' +
                '<div id="embed" class="copy"><input name="inputEmbed" class="" type="text" value=\'<iframe height="' +
                klynt.player.height +
                '" width="' +
                klynt.player.width +
                '" src="' +
                url +
                '" frameborder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>' +
                '\' disabled></input></div>' +
                '</div>';

        } else {

            this._template += '<div class="modal-content modal-iframe">' +
                '<span class="modal-title">{{embedWording}}</span>' +
            // '<div class="modal-content-line modal-content-line-left">' +
            // '<label class="" for="original" style="margin:0">{{originalSizeWording}}</label>' +
            // '</div>' +
            '<div id="embed" class="copy"><input name="inputEmbed" class="" type="text" value=\'<iframe height="' +
                klynt.player.height +
                '" width="' +
                klynt.player.width +
                '" src="' +
                url +
                '" frameborder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>' +
                '\' disabled></input></div>' +
                '</div>';

        }

        this._template_partials = {};

        this._template_help = '<div class="modal-help klynt-primary-color klynt-secondary-color-bg"><p>Permet de partager une vue de plus petite taille' +
            'sur votre site, en proposant de à vos lecteurs de lancer le programme en plein' +
            'écran ou de le consulter directement sur le site du programme</p>' + tip + '</div>';

        this.init(data);
        this.render();
    };

    klynt.ShareModal.prototype = {
        _template: '',
        _template_partials: {},
        _$element: null,
        _$link: null,
        _$embed: null,
        _link_to_share_program: '',
        _link_to_share_sequence: ''
    };

    klynt.ShareModal.prototype.init = function (data) {
        var uncheckedButton = this._uncheckedButton;
        var checkedButton = this._checkedButton;
        var miniuncheckedButton = this._miniUncheckedButton;
        var minicheckedButton = this._miniCheckedButton;
        var embedCode = this._embedCode;
        var miniPlayer = this._miniPlayer;
        var link_to_share_program = (document.URL).split('#')[0];
        var link_to_share_sequence = document.URL;
        var miniPlayerType = 'horizontal';

        this._$element = $('<div>')
            .addClass('modal share-modal')
            .appendTo(klynt.player.$element);

        this.open(this._checkedButton);

        // SHARE BUTTONS
        this._$element.on('click', '.modal-share-buttons-facebook', function (e) {
            link.call(this, 'facebook');
        }.bind(this));
        this._$element.on('click', '.modal-share-buttons-twitter', function (e) {
            link.call(this, 'twitter');
        }.bind(this));
        this._$element.on('click', '.modal-share-buttons-tumblr', function (e) {
            link.call(this, 'tumblr');
        }.bind(this));
        this._$element.on('click', '.modal-share-buttons-google', function (e) {
            link.call(this, 'googlePlus');
        }.bind(this));

        this._$element.on('click', '.modal-share-buttons-linkedin', function (e) {
            link.call(this, 'linkedIn');
        }.bind(this));

        //CLOSE BUTTON
        this._$element.on('click', '.modal-close', function (e) {
            e.preventDefault();
            klynt.modal.close();
        });

        //RADIO BUTTONS
        this._$element.on('click', '#share-program', function (e) {
            if ($(this).data('check') === false) {
                $('input[name="inputLink"]').val(link_to_share_program);
                $(this).data('check', true);
                $(this).html(checkedButton);

                $('#share-sequence').data('check', false).html(uncheckedButton);
            }
        });

        this._$element.on('click', '#share-sequence', function (e) {
            if ($(this).data('check') === false) {
                $('input[name="inputLink"]').val(link_to_share_sequence);
                $(this).data('check', true);
                $(this).html(checkedButton);

                $('#share-program').data('check', false).html(uncheckedButton);
            }
        });

        this._$element.on('click', '#embed-iframe', function (e) {
            if ($(this).data('check') === false) {
                $('input[name="inputEmbed"]').val(embedCode);
                $(this).data('check', true);
                $(this).html(checkedButton);

                $('#embed-miniplayer').data('check', false).html(uncheckedButton);

                $('.modal-miniplayer').hide();

                $('.modal-help').css('bottom', '204px');
            }
        });

        this._$element.on('click', '#embed-miniplayer', function (e) {
            if ($(this).data('check') === false) {
                $('input[name="inputEmbed"]').val(miniPlayer);
                $(this).data('check', true);
                $(this).html(checkedButton);

                $('#embed-iframe').data('check', false).html(uncheckedButton);

                $('.modal-miniplayer').show();

                $('.modal-help').css('bottom', '233px');
            }
        });

        this._$element.on('click', '.modal-miniplayer-horizontal', function (e) {
            if ($(this).data('check') === false) {
                $(this).data('check', true);
                $(this).html(minicheckedButton);

                $('.modal-miniplayer-vertical').html(miniuncheckedButton).data('check', false);

                $('input[name="inputEmbed"]').removeClass('error').val(miniplayerCode('horizontal'));
                miniPlayerType = 'horizontal';
                initplayerSize('horizontal');
            }
        });

        this._$element.on('click', '.modal-miniplayer-vertical', function (e) {
            if ($(this).data('check') === false) {
                $(this).data('check', true);
                $(this).html(minicheckedButton);

                $('.modal-miniplayer-horizontal').html(miniuncheckedButton).data('check', false);

                $('input[name="inputEmbed"]').removeClass('error').val(miniplayerCode('vertical'));
                miniPlayerType = 'vertical';
                initplayerSize('vertical');
            }
        });

        //HELP HOVER
        this._$element.on('mouseover', '#help', function (e) {
            $('.modal-help').show();
        });

        this._$element.on('mouseout', '#help', function (e) {
            $('.modal-help').hide();
        });

        //COPY TEXT INPUT
        this._$element.on('click', '.copy', function (e) {
            $(this).find('input').select();
        });

        //LISTEN KEYDOWN SIZE MINI PLAYER
        this._$element.on('keyup', '.miniplayer-width', function (e) {
            miniplayerSize();
        });

        function initplayerSize(type) {
            if (type === 'horizontal') {
                $('.miniplayer-width').val('534');
                $('.miniplayer-height').html('300px');
            } else {
                $('.miniplayer-width').val('300');
                $('.miniplayer-height').html('304px');
            }
        }

        function miniplayerSize() {
            var width = $('.miniplayer-width').val();
            var ratio, height, max, min;
            if (miniPlayerType === 'horizontal') {
                ratio = 9 / 16;
                min = 534;
            } else {
                ratio = 1;
                min = 300;
            }

            if ((isNaN(width)) || (width > max) || (width < min)) {
                if (isNaN(width)) {
                    errorMessage('letter');
                } else if (width < min) {
                    errorMessage(miniPlayerType);
                }
            } else {
                height = Math.round(width * ratio);

                $('input[name="inputEmbed"]').removeClass('error').val(miniplayerCode(miniPlayerType, width, height));
                $('.miniplayer-height').html(height + 'px');
            }
        }

        function miniplayerCode(type, width, height) {
            var code;
            var url = (document.URL).split('#')[0];

            if ((typeof width === 'undefined') || (typeof width === 'undefined')) {
                if (type === 'horizontal') {
                    width = 534;
                    height = 300;
                } else {
                    width = 300;
                    height = 304;
                }
            }

            code = '<iframe src="' + url +
                '?miniPlayer=' + type +
                '" style="width: ' + width +
                'px;height:' + height +
                'px;top:0px;left:0px;margin:0;padding:0" frameBorder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>';

            return code;
        }

        function errorMessage(type) {
            var message;

            if (type === 'letter') {
                message = 'Largeur en chiffres';
            } else if (type === 'horizontal') {
                message = 'minimum 534px';
            } else {
                message = 'minimum 300px';
            }

            $('input[name="inputEmbed"]').addClass('error').val(message);
        }

        function link(socialNetwork) {
            var baseURL = document.location.origin + document.location.pathname;
            baseURL = baseURL.substring(0, baseURL.lastIndexOf("/") + 1);

            var url = encodeURIComponent(this._data.link);
            var thumbnail = encodeURIComponent(baseURL + this._data.thumbnail);
            var title = encodeURIComponent(this._data.title);
            var summary = encodeURIComponent(this._data.message);
            var shortMessage = encodeURIComponent(this._data.shortMessage);

            switch (socialNetwork) {
            case 'facebook':
                facebook();
                break;
            case 'twitter':
                twitter();
                break;
            case 'tumblr':
                tumblr();
                break;
            case 'googlePlus':
                googlePlus();
                break;
            case 'linkedIn':
                linkedIn();
                break;
            default:
                break;
            }

            function facebook() {
                var openLink = 'http://www.facebook.com/sharer/sharer.php?s=100' +
                    '&p[url]=' + url +
                    '&p[images][0]=' + thumbnail +
                    '&p[title]=' + title +
                    '&p[summary]=' + summary;

                openWindow(openLink);
            }

            function twitter() {
                var openLink = 'http://twitter.com/intent/tweet?' + /*'&hashtags=' + 'hi,hello' +*/
                    'original_referer=' + url +
                    '&url=' + url +
                    '&via=' + 'klynt_app' +
                    '&text=' + shortMessage;

                openWindow(openLink);
            }

            function tumblr() {
                var openLink = 'http://tumblr.com/share?s=&v=3' +
                    '&t=' + title +
                    '&u=' + url;

                openWindow(openLink);
            }

            function googlePlus() {
                var openLink = 'https://plus.google.com/share?url=' + url;

                openWindow(openLink);
            }

            function linkedIn() {
                var openLink = 'http://www.linkedin.com/shareArticle?mini=true' +
                    '&url=' + url +
                    '&title=' + title +
                    '&summary=' + summary +
                    '&source=';

                openWindow(openLink);
            }

            function openWindow(url) {
                var width = 600;
                var height = 400;
                var top = (screen.height - height) / 3;
                var left = (screen.width - width) / 2;

                window.open(url, 'newwindow', 'width=500, height=400, top=' + top + ', left=' + left);
            }
        }
    };

    klynt.ShareModal.prototype.render = function () {
        this._$element.html(Mustache.render(this._template, this._data, this._template_partials));
        this._$element.append(this._template_help);
    };

    klynt.ShareModal.prototype.toggle = function () {
        if (this._$element.css('display') === 'block')
            klynt.modal.close();
        else
            klynt.modal.open();
    };

    klynt.ShareModal.prototype.open = function () {
        $('.modal-background').show().animate({
            opacity: 1
        }, 500);

        klynt.player.pause();

        this._$element
            .show()
            .addClass('animated fadeInUp ');
    };

    klynt.ShareModal.prototype.close = function () {
        this._$element.toggleClass('fadeInUp fadeOutDown');

        setTimeout(klynt.modal.hide.bind(this), 600);
    };

    klynt.ShareModal.prototype.hide = function () {
        // klynt.player.play();

        $('.modal-background').animate({
            opacity: 0
        }, 500, function () {
            $(this).hide();
        });

        this._$element
            .hide()
            .removeClass('animated fadeInUp fadeOutDown');
    };
})(window.klynt);