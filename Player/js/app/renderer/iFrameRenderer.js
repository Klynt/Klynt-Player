/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.iFrameRenderer = function (element, $parent) {
        klynt.ElementRenderer.call(this, element, $parent);
    };

    klynt.iFrameRenderer.prototype._initDOM = function () {
        klynt.ElementRenderer.prototype._initDOM.call(this);
        this._$element
            .addClass('iframe')
            .addClass(this.element.type);
    };

    klynt.iFrameRenderer.prototype._onBegin = function (event) {
        klynt.ElementRenderer.prototype._onBegin.call(this, event);
        this._$element.html(this.element.code);
    };

    klynt.iFrameRenderer.prototype._onEnd = function (event) {
        klynt.ElementRenderer.prototype._onEnd.call(this, event);
        this._$element.html(null);
    };

    klynt.iFrameRenderer.prototype = klynt.utils.mergePrototypes(klynt.ElementRenderer, klynt.iFrameRenderer);
})(window.klynt);