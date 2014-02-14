/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.StyleRenderer = function (model, $element) {
        this._model = model;
        this._$element = $element;

        this._apply();
    };

    klynt.StyleRenderer.prototype = {
        _model: null,
        _$element: null
    };

    klynt.StyleRenderer.prototype._apply = function () {
        this._$element.css({
            opacity: this._model.opacity,
            backgroundColor: this._model.backgroundColor,
            border: this._model.borderSize + 'px solid ' + this._model.borderColor,
            borderRadius: this._model.borderRadius + 'px',
            boxShadow: this._model.dropShadowX + 'px ' + this._model.dropShadowY + 'px ' + this._model.dropShadowBlur + 'px ' + this._model.dropShadowColor,
            transform: 'rotate(' + this._model.rotation + 'deg)'
        });
    };
})(window.klynt);