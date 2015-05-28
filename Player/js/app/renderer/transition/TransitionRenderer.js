/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    var DEFAULT_DURATION = 500;
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
        },

        _killed: false,
        get killed() {
            return this._killed;
        }
    };

    klynt.TransitionRenderer.prototype.execute = function (source, target) {
        this._source = source;
        this._target = target;

        if (source) {
            source.$element.addClass('transition-running');
        }
        if (target) {
            target.$element.addClass('transition-running')
                .css('visibility', 'visible');
            //target.$element.find('.video').css('display', 'block');
            //target.$element.find('.audio').css('display', 'block');
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
        
        if (!this.killed) {
            $(this).trigger('complete.animation', this);
        }
    };

    klynt.TransitionRenderer.prototype.prepareForTarget = function (source, target, callback) {
        if (source) {
            source.showSequenceLoader();
            source._end();
        }

        var shouldPauseTarget = true;
        var didPauseTarget = false;

        klynt.loader.prepareForSequence(target.sequence, function() {
            shouldPauseTarget = false;
            klynt.utils.callLater(function () {
                if (source) {
                    source.hideSequenceLoader();
                }

                klynt.utils.callLater(function () {
                    if (target && didPauseTarget) {
                        target.play();
                    }
                });

                if (callback) {
                    callback();
                }
            }, 150);
        });

        klynt.utils.callLater(function () {
            if (target && shouldPauseTarget) {
                target.pause();
                didPauseTarget = true;
            }
        }, 150);
    };

    klynt.TransitionRenderer.prototype.kill = function () {
        this._notifyComplete();
        this._killed = true;
    };
})(window.klynt);