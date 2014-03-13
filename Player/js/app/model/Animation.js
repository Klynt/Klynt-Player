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
            return this._data.duration;
        },

        get left() {
            return this._data.left;
        },

        get top() {
            return this._data.top;
        },

        get width() {
            return this._data.width;
        },

        get height() {
            return this._data.height;
        }
    };
})(window.klynt);
