/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.Audio = function (data) {
        klynt.Media.call(this, data);
    };

    klynt.Audio.prototype = {
        get continuous() {
            return this._data.continuous;
        },

        get mediaId() {
            return this._data.mediaId;
        },

        get sources() {
            return klynt.utils.replaceSource(this._data.src || [], klynt.player.baseAudioURL, 'Medias/Audios/');
        },

        // Overrides Media's loop property.
        get loop() {
            return !!this._data.loop || this.continuous;
        },

        get sequenceEndVolume() {
            return this._data.sequenceEndVolume;
        },

        get overlayVolume() {
            return this._data.overlayVolume;
        }
    };

    klynt.Audio.prototype = klynt.utils.mergePrototypes(klynt.Media, klynt.Audio);
})(window.klynt);