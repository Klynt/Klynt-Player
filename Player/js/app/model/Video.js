/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
	klynt.Video = function (data) {
		klynt.Media.call(this, data);
	};

	klynt.Video.prototype = klynt.utils.mergePrototypes(klynt.Media, klynt.Video);
})(window.klynt);