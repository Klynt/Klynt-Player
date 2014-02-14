/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.ExternalVideoRenderer = function (video, $parent) {
        klynt.VideoRenderer.call(this, video, $parent);
    };

    klynt.ExternalVideoRenderer.prototype = {};

    klynt.ExternalVideoRenderer.prototype._initDOM = function () {
        klynt.MediaRenderer.prototype._initDOM.call(this);
        this._$element.addClass('externalVideo youtube');
    };

    klynt.ExternalVideoRenderer.prototype._createMediaElement = function () {
        if (klynt.utils.browser.local && klynt.utils.browser.chrome) {
            window.alert('Oops! Youtube does not allow its videos to be displayed with Chrome in offline mode.\n\n' +
                'Please set either Safari or Firefox as your default browser instead of Chrome to preview your' +
                'sequences when using Youtube videos.\n\nNB. Once your project is published online, Youtube videos' +
                'will display properly on any browser, including Chrome.');
        } else {
            klynt.VideoRenderer.prototype._createMediaElement.call(this);
        }
    };

    klynt.ExternalVideoRenderer.prototype._initWithMediaAPI = function () {
        klynt.VideoRenderer.prototype._initWithMediaAPI.call(this);

        this._$element.find('.mejs-overlay-button').hide();
    };

    klynt.ExternalVideoRenderer.prototype = klynt.utils.mergePrototypes(klynt.VideoRenderer, klynt.ExternalVideoRenderer);
})(window.klynt);