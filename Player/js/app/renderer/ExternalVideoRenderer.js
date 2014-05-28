/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.ExternalVideoRenderer = function (video, sequence) {
        klynt.VideoRenderer.call(this, video, sequence);
    };

    klynt.ExternalVideoRenderer.prototype = {};

    klynt.ExternalVideoRenderer.prototype._initDOM = function () {
        klynt.MediaRenderer.prototype._initDOM.call(this);
        this._$element.addClass('externalVideo youtube');
    };

    klynt.ExternalVideoRenderer.prototype._createMediaElement = function () {
        if (klynt.utils.browser.local && (klynt.utils.browser.chrome || klynt.utils.browser.safari)) {
            window.alert('Oops! Youtube does not allow its videos to be displayed with Chrome or Safari in offline mode.\n\n' +
                'Please set Firefox as your default browser instead of Chrome or Safari to preview your' +
                'sequences when using Youtube videos.\n\nNB. Once your project is published online, Youtube videos' +
                'will display properly on any browser, including Chrome and Safari.');
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