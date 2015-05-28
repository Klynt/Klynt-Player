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

        get url() {
            return this._data.url;
        },

        get platform() {
            return this._data.platform;
        },

        get sources() {
            if (this.platform == 'youtube') {
                return this.externalId ? [{
                    src: 'http://www.youtube.com/watch?v=' + this.externalId,
                    type: 'video/youtube'
                }] : [];
            } else if (this.platform == 'http') {
                return this.url ? [{
                    src: this.url,
                    type: 'video/mp4'
                }] : [];
            } else {
                return null;
                /*var cachedURL = klynt.utils.getCachedVideoData(this);
                return cachedURL ? [{
                    src: cachedURL,
                    type: 'video/mp4'
                }] : []*/
            }
        }
    };

    klynt.ExternalVideo.prototype = klynt.utils.mergePrototypes(klynt.Video, klynt.ExternalVideo);
})(window.klynt);