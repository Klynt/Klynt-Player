/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.NoTransitionRenderer = function (model) {
        klynt.TransitionRenderer.call(this, model);
    };

    klynt.NoTransitionRenderer.prototype = {};

    klynt.NoTransitionRenderer.prototype.execute = function (source, target) {
        klynt.TransitionRenderer.prototype.execute.call(this, source, target);

        this.prepareForTarget(source, target, this._notifyComplete.bind(this));
    };

    klynt.NoTransitionRenderer.prototype = klynt.utils.mergePrototypes(klynt.TransitionRenderer, klynt.NoTransitionRenderer);
})(window.klynt);