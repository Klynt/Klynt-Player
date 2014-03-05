/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.FadeTransitionRenderer = function (model) {
        klynt.TransitionRenderer.call(this, model);
    };

    klynt.FadeTransitionRenderer.prototype = {};

    klynt.FadeTransitionRenderer.prototype.execute = function (source, target) {
        klynt.TransitionRenderer.prototype.execute.call(this, source, target);

        if (source) {
            source.$element
                .stop()
                .css({
                    opacity: 1
                })
                .fadeTo(this.duration, 0, this.easing);
        }

        target.$element
            .stop()
            .css({
                opacity: 0
            })
            .fadeTo(this.duration, 1, this.easing, this._notifyComplete.bind(this));
    };

    klynt.FadeTransitionRenderer.prototype = klynt.utils.mergePrototypes(klynt.TransitionRenderer, klynt.FadeTransitionRenderer);
})(window.klynt);