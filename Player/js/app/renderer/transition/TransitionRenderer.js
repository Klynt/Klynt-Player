/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    var DEFAULT_DURATION = 1000;
    var DEFAULT_EASING = null;

    klynt.TransitionRenderer = function (model) {
        this._model = model;
    };

    klynt.TransitionRenderer.prototype = {
        _model: null,

        _result: null,
        get result() {
            return this._result;
        },

        _discarded: null,
        get discarded() {
            return this._discarded;
        },

        get duration() {
            return DEFAULT_DURATION;
        },

        get easing() {
            return DEFAULT_EASING;
        }
    };

    klynt.TransitionRenderer.prototype.execute = function (source, target) {
        if (source) {
            source.$element.addClass('transition-running');
        }
        if (target) {
            target.$element.addClass('transition-running');
        }
    };

    klynt.TransitionRenderer.prototype._notifyComplete = function () {
        if (this.discarded) {
            this.discarded.$element.removeClass('transition-running');
        }
        if (this.result) {
            this.result.$element.removeClass('transition-running');
        }
        $(this).trigger('complete.animation', this);
    };
})(window.klynt);