/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.Action = function (data) {
        this._data = data;
    };

    klynt.Action.prototype = {
        _data: null,

        get name() {
            return this._data.name;
        },

        get params() {
            return this._data.params;
        }
    };

    klynt.Action.prototype.execute = function () {
        this._shareFacebook() || this._shareTwitter() || this._openModal() || this._closeOverlay() || this._toggleFullscreen() || this._togglePlayPause() || this._seekTo();
    };

    klynt.Action.prototype._shareFacebook = function () {
        if (this.name !== 'shareToFacebook') {
            return false;
        } else {
            alert('shareToFacebook - to implement');
            return true;
        }
    };

    klynt.Action.prototype._shareTwitter = function () {
        if (this.name !== 'shareToTwitter') {
            return false;
        } else {
            alert('shareToTwitter - to implement');
            return true;
        }
    };

    klynt.Action.prototype._openModal = function () {
        if (this.name !== 'showEmbedCode') {
            return false;
        } else {
            klynt.player.toggleModal(klynt.ShareModal);
            return true;
        }
    };

    klynt.Action.prototype._closeOverlay = function () {
        if (this.name !== 'closeOverlay') {
            return false;
        } else {
            klynt.sequenceManager.closeOverlay();
            return true;
        }
    };

    klynt.Action.prototype._toggleFullscreen = function () {
        if (this.name !== 'toggleFullScreen') {
            return false;
        } else {
            klynt.fullscreen.toggle();
            return true;
        }
    };

    klynt.Action.prototype._togglePlayPause = function () {
        if (this.name !== 'togglePlayPause') {
            return false;
        } else {
            klynt.player.togglePlayPause();
            return true;
        }
    };

    klynt.Action.prototype._seekTo = function () {
        if (this.name !== 'seek') {
            return false;
        } else {
            klynt.sequenceManager.seekTo(this.params);
            return true;
        }
    };

})(window.klynt);