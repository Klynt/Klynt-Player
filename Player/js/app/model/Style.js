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

        get rollOverOpacity() {
            return this._data.rollOverOpacity;
        },

        get backgroundColor() {
            return this._data.backgroundColor;
        },

        get rollOverBackgroundColor() {
            return this._data.rollOverBackgroundColor;
        },

        get borderSize() {
            return this._data.borderSize;
        },

        get rollOverBorderSize() {
            return this._data.rollOverBorderSize;
        },

        get borderColor() {
            return this._data.borderColor;
        },

        get rollOverBorderColor() {
            return this._data.rollOverBorderColor;
        },

        get borderRadius() {
            return this._data.borderRadius;
        },

        get rollOverBorderRadius() {
            return this._data.rollOverBorderRadius;
        },

        get dropShadowX() {
            return this._data.dropShadowX;
        },

        get rollOverDropShadowX() {
            return this._data.rollOverDropShadowX;
        },

        get dropShadowY() {
            return this._data.dropShadowY;
        },

        get rollOverDropShadowY() {
            return this._data.rollOverDropShadowY;
        },

        get dropShadowBlur() {
            return this._data.dropShadowBlur;
        },

        get rollOverDropShadowBlur() {
            return this._data.rollOverDropShadowBlur;
        },

        get dropShadowColor() {
            return this._data.dropShadowColor;
        },

        get rollOverDropShadowColor() {
            return this._data.rollOverDropShadowColor;
        },

        get rotation() {
            return this._data.rotation;
        },

        get rollOverRotation() {
            return this._data.rollOverRotation;
        },

        get rollOverAnimationDuration() {
            return this._data.rollOverAnimationDuration;
        },

        get rollOverAnimationEasing() {
            return this._data.rollOverAnimationEasing;
        },

        get rollOverAnimationReversible() {
            return this._data.rollOverAnimationReversible;
        }
    };
})(window.klynt);