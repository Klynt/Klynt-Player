/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.Button = function (data) {
        klynt.Element.call(this, data);
    };

    klynt.Button.prototype = {
        get label() {
            return this._data.label;
        },

        get tooltip() {
            return this._data.tooltip || this.label;
        },

        get type() {
            return this._data.type;
        }
    };

    klynt.Button.prototype = klynt.utils.mergePrototypes(klynt.Element, klynt.Button);
})(window.klynt);