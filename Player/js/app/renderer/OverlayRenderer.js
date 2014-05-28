/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.OverlayRenderer = function (sequence, $parent, params) {
        this._params = params;
        klynt.SequenceRenderer.call(this, sequence, $parent);
    };

    klynt.OverlayRenderer.prototype = {
        _params: null,

        get automaticClose () {
            return this._params ? this._params.automaticClose : false; 
        },

        get closeButton () {
            return this._params ? this._params.closeButton : true; 
        },

        get closeButtonLeft() {
            return this._params ? this._params.closeButtonLeft : klynt.data.general.overlayCloseButtonLeft;
        },

        get closeButtonRight() {
            return this._params ? this._params.closeButtonRight : klynt.data.general.overlayCloseButtonRight;
        },

        get closeButtonTop() {
            return this._params ? this._params.closeButtonTop : klynt.data.general.overlayCloseButtonTop;
        },

        get closeButtonBottom() {
            return this._params ? this._params.closeButtonBottom : klynt.data.general.overlayCloseButtonBottom;
        },
    };

    klynt.OverlayRenderer.prototype._initDOM = function () {
        klynt.SequenceRenderer.prototype._initDOM.call(this);
        this._$element.addClass('overlay');
        if (this.closeButton) {
            this._addCloseButton();
        }
    };

    klynt.OverlayRenderer.prototype._addCloseButton = function () {
        $('<div/>')
            .addClass('overlay-close-button')
            .appendTo(this._$element)
            .on('click', klynt.sequenceManager.closeOverlay)
            .css({
                left: this.closeButtonLeft + 'px',
                right: this.closeButtonRight + 'px',
                top: this.closeButtonTop + 'px',
                bottom: this.closeButtonBottom + 'px'
            });
    };

    klynt.OverlayRenderer.prototype._end = function () {
        var autoClose = this.automaticClose && !this._ended;

        klynt.SequenceRenderer.prototype._end.call(this);

        if (autoClose) {
            klynt.sequenceManager.closeOverlay();
        }
    };

    klynt.OverlayRenderer.prototype = klynt.utils.mergePrototypes(klynt.SequenceRenderer, klynt.OverlayRenderer);
})(window.klynt);