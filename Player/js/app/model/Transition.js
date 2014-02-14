/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
	klynt.Transition = function (type) {
		this._type = type;
	};

	klynt.Transition.prototype = {
		_type: null,
		get type() {
			return this._type;
		}
	};
})(window.klynt);