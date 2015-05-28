/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
	klynt.Shape = function (data) {
		klynt.Element.call(this, data);
	};

    klynt.Shape.prototype = {
        get type() {
            return this._data.type;
        }
    };

	klynt.Shape.prototype = klynt.utils.mergePrototypes(klynt.Element, klynt.Shape);
})(window.klynt);