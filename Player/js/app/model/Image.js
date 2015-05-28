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
            return klynt.utils.replaceSource(this._data.src, klynt.player.basePhotoURL, 'Medias/Photos/');
        },

        get alt() {
            return this._data.name;
        },

        get scaleMode() {
            return this._data.scaleMode;
        },

        get horizontalAlign() {
            return this._data.horizontalAlign;
        },

        get verticalAlign() {
            return this._data.verticalAlign;
        },

        _animation: null,
        get animation() {
            return this._animation;
        }
    };

    klynt.Image.prototype = klynt.utils.mergePrototypes(klynt.Element, klynt.Image);
})(window.klynt);