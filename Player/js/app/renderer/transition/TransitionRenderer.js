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
        _automatic: true,
        get automatic() {
            return this._automatic;
        },

        _source: null,
        get source() {
            return this._source;
        },

        _target: null,
        get target() {
            return this._target;
        },

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
        this._source = source;
        this._target = target;

        if (source) {
            source.$element.addClass('transition-running');
        }
        if (target) {
            target.$element.addClass('transition-running');
        }

        if (this.automatic) {
            $(this).trigger('validate.animation', this);
        }
    };

    klynt.TransitionRenderer.prototype._notifyComplete = function () {
        this._discarded = this.source;
        if (this.discarded) {
            this.discarded.$element.removeClass('transition-running');
        }

        this._result = this.target;
        if (this.result) {
            this.result.$element.removeClass('transition-running');
        }

        $(this).trigger('complete.animation', this);
    };

    klynt.TransitionRenderer.prototype.kill = function () {
        this._notifyComplete();
    };
})(window.klynt);