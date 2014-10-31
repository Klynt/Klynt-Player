/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.Style = function (data) {
        this._data = data;
    };

    klynt.Style.prototype = {
        _data: null,

        get opacity() {
            return typeof this._data.opacity !== 'undefined' ? this._data.opacity : 1;
        },

        get backgroundColor() {
            return this._data.backgroundColor;
        },

        get borderSize() {
            return this._data.borderSize;
        },

        get borderColor() {
            return this._data.borderColor;
        },

        get borderRadius() {
            return this._data.borderRadius;
        },

        get dropShadowX() {
            return this._data.dropShadowX;
        },

        get dropShadowY() {
            return this._data.dropShadowY;
        },

        get dropShadowBlur() {
            return this._data.dropShadowBlur;
        },

        get dropShadowColor() {
            return this._data.dropShadowColor;
        },

        get rotation() {
            return this._data.rotation;
        },
    };
})(window.klynt);