/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.Animation = function (data) {
        this._data = data;
    };

    klynt.Animation.prototype = {
        _data: null,

        get type() {
            return this._data.type;
        },

        get duration() {
            return klynt.utils.getTimeFromString(this._data.duration);
        },

        get left() {
            return this._data.left;
        },

        get right() {
            return this._data.right;
        },

        get centerX() {
            return this._data.centerX;
        },

        get width() {
            return this._data.width;
        },

        get top() {
            return this._data.top;
        },

        get bottom() {
            return this._data.bottom;
        },

        get centerY() {
            return this._data.centerY;
        },

        get height() {
            return this._data.height;
        }
    };
})(window.klynt);