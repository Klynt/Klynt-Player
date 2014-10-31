/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.InteractionRenderer = function (model, elementRenderer) {
        this._model = model;
        this._elementRenderer = elementRenderer;
    };

    klynt.InteractionRenderer.prototype = {
        _model: null,
        _timeout: null,
        _elementRenderer: null,

        _started: false,
        get started() {
            return this._started;
        },

        get reversible() {
            return this._model.reversible && this.targetRenderer.active;
        },

        _targetRenderer: null,
        get targetRenderer() {
            if (!this._targetRenderer && this._model.target != 'player') {
                this._targetRenderer = this._model.target == 'self' ? this._elementRenderer : this._elementRenderer.sequence.getElementRenderer(this._model.target);
            }

            return this._targetRenderer;
        }
    };

    klynt.InteractionRenderer.prototype.execute = function (dispatchChain) {
        if (!this.targetRenderer || this.targetRenderer.active || this.targetRenderer.element.syncMaster) {
            this._started = true;
            if (this._model.syncronous) {
                this._doExecute(dispatchChain);
            } else {
                this._timeout = setTimeout(this._doExecute.bind(this, dispatchChain), this._model.delay * 1000);
            }
        }
    };

    klynt.InteractionRenderer.prototype.pause = function () {
        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }
        this._started = false;
        this._doPause();
    };

    klynt.InteractionRenderer.prototype.reverse = function (referenceDelay, dispatchChain) {
        this.pause();

        if (this.reversible) {
            this._timeout = setTimeout(this._doReverse.bind(this, dispatchChain), (referenceDelay - this._model.delay) * 1000);
        }
    };

    klynt.InteractionRenderer.prototype.kill = function () {
        this.pause();

        this._doKill();
    };

    klynt.InteractionRenderer.prototype._doExecute = function (dispatchChain) {
        // Run the interaction
    };

    klynt.InteractionRenderer.prototype._doPause = function () {
        // Stop the interaction
    };

    klynt.InteractionRenderer.prototype._doReverse = function (dispatchChain) {
        // Reverse the interaction
    };

    klynt.InteractionRenderer.prototype._doKill = function () {
        // Kill the interaction
    };
})(window.klynt);