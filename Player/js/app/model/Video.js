/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
	var DEFAULT_BASE_URL = 'Medias/Videos/';

	klynt.Video = function (data) {
		klynt.Media.call(this, data);
	};

	klynt.Video.prototype = {
        get sources() {
            return klynt.utils.replaceSource(this._data.src || [], klynt.player.baseVideoURL, 'Medias/Videos/');
        },

		get scaleMode() {
			return this._data.scaleMode;
		},

		get horizontalAlign() {
			return this._data.horizontalAlign;
		},

		get verticalAlign() {
			return this._data.verticalAlign;
		}
	};

	klynt.Video.prototype = klynt.utils.mergePrototypes(klynt.Media, klynt.Video);
})(window.klynt);