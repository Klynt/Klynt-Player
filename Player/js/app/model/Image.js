/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.Image = function (data) {
        klynt.Element.call(this, data);
        if (this._data.animation) {
            this._animation = this._data.animation ? new klynt.Animation(this._data.animation) : null;
        }
    };

    klynt.Image.prototype = {
        get source() {
            return this._data.src;
        },

        get alt() {
            return this._data.name;
        },

        _animation: null,
        get animation() {
            return this._animation;
        }
    };

    klynt.Image.prototype = klynt.utils.mergePrototypes(klynt.Element, klynt.Image);
})(window.klynt);