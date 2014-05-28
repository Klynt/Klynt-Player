/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.TextRenderer = function (element, sequence) {
        klynt.ElementRenderer.call(this, element, sequence);
    };

    klynt.TextRenderer.prototype._initDOM = function () {
        klynt.ElementRenderer.prototype._initDOM.call(this);
        this._$element
            .addClass('text nano-container')
            .addClass(this.element.type)
            .append($('<div class="nano-content">' + this.element.text + '</div>'));
    };

    klynt.TextRenderer.prototype = klynt.utils.mergePrototypes(klynt.ElementRenderer, klynt.TextRenderer);
})(window.klynt);