/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.Media = function (data) {
        klynt.Element.call(this, data);
    };

    klynt.Media.prototype = {
        get syncMaster() {
            return !!this._data.syncMaster;
        },

        get sources() {
            return this._data.src || [];
        },

        get poster() {
            //var value = this._data.poster || '';
            var value = klynt.utils.browser.iOS || !this.autoplay ? this._data.poster || '' : '';
            return klynt.utils.replaceSource(value, klynt.player.basePosterURL, 'Medias/Posters/');
        },

        get autoplay() {
            return !!this._data.autoplay; 
        },

        get controls() {
            return !!this._data.player || this.syncMaster || klynt.utils.browser.iOS;
        },

        get loop() {
            return !!this._data.loop;
        },

        get volume() {
            return this._data.volume || 0;
        },

        get subtitlesURL() {
            return this._data.subtitles ? 'Medias/Subtitles/' + this._data.subtitlesURL : null;
        }
    };

    klynt.Media.prototype = klynt.utils.mergePrototypes(klynt.Element, klynt.Media);
})(window.klynt);