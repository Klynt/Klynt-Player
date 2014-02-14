/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.ElementTransition = function (data) {
        this._data = data;
    };

    klynt.ElementTransition.prototype = {
        _data: null,

        get type() {
            return this._data.type;
        },

        get duration() {
            return this._data.duration;
        }
    };
})(window.klynt);