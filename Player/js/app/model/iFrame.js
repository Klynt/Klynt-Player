/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
	klynt.iFrame = function (data) {
		klynt.Element.call(this, data);
	};

	klynt.iFrame.prototype = {
		get code() {
			return prependProtocol(this._data.code);
		}
	};

	klynt.iFrame.prototype = klynt.utils.mergePrototypes(klynt.Element, klynt.iFrame);

	function prependProtocol(code) {
		if (code && klynt.utils.browser.local) {
			return code.replace(/(src=["'])\/\//, "$1http://");
		} else {
			return code;
		}
	}
})(window.klynt);