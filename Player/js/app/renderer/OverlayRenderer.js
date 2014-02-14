/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.OverlayRenderer = function (sequence, $parent, params) {
        this._automaticClose = params.automaticClose;
        this._closeButton = params.closeButton;
        klynt.SequenceRenderer.call(this, sequence, $parent);
    };

    klynt.OverlayRenderer.prototype = {
        _automaticClose: false,
        _closeButton: true
    };

    klynt.OverlayRenderer.prototype._initDOM = function () {
        klynt.SequenceRenderer.prototype._initDOM.call(this);
        this._$element.addClass('overlay');
        if (this._closeButton) {
            this._addCloseButton();
        }
    };

    klynt.OverlayRenderer.prototype._addCloseButton = function () {
        $('<div/>')
            .addClass('overlay-close-button')
            .appendTo(this._$element)
            .css('left', klynt.data.general.overlayCloseButtonX)
            .css('top', klynt.data.general.overlayCloseButtonY)
            .on('click', klynt.sequenceManager.closeOverlay);
    };

    klynt.OverlayRenderer.prototype._end = function () {
        klynt.SequenceRenderer.prototype._end.call(this);

        if (this._automaticClose) {
            klynt.sequenceManager.closeOverlay();
        }
    };

    klynt.OverlayRenderer.prototype = klynt.utils.mergePrototypes(klynt.SequenceRenderer, klynt.OverlayRenderer);
})(window.klynt);