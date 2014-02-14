/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.Text = function (data) {
        klynt.Element.call(this, data);
    };

    klynt.Text.prototype = {
        get text() {
            return this._data.text;
        },

        get type() {
            return this._data.type;
        },

        get rawContent() {
            return this.text.replace(/<.*?>/g, ' ');
        }
    };

    klynt.Text.prototype = klynt.utils.mergePrototypes(klynt.Element, klynt.Text);
})(window.klynt);