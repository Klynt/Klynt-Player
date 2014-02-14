/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.ExternalVideo = function (data) {
        klynt.Video.call(this, data);
    };

    klynt.ExternalVideo.prototype = {
        get externalId() {
            return this._data.externalId;
        },

        get sources() {
            return this.externalId ? [{
                src: 'http://www.youtube.com/watch?v=' + this.externalId,
                type: 'video/youtube'
            }] : [];
        }
    };

    klynt.ExternalVideo.prototype = klynt.utils.mergePrototypes(klynt.Video, klynt.ExternalVideo);
})(window.klynt);