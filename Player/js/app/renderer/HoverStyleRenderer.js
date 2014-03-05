/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.HoverStyleRenderer = function (model, $element) {
        this._model = model;
        this._$element = $element;
    };

    klynt.HoverStyleRenderer.prototype = {
        _model: null,
        _$element: null
    };

    klynt.HoverStyleRenderer.prototype.apply = function () {
        
    };
})(window.klynt);