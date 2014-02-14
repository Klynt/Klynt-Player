/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.VideoRenderer = function (video, $parent) {
        klynt.MediaRenderer.call(this, video, $parent);
    };

    klynt.VideoRenderer.prototype = {};

    klynt.VideoRenderer.prototype._initDOM = function () {
        klynt.MediaRenderer.prototype._initDOM.call(this);
        this._$element.addClass('video');
    };

    klynt.VideoRenderer.prototype._createMediaElement = function () {
        this._$mediaElement = $('<video>');
    };

    klynt.VideoRenderer.prototype = klynt.utils.mergePrototypes(klynt.MediaRenderer, klynt.VideoRenderer);
})(window.klynt);