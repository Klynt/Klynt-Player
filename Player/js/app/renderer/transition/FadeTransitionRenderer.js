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

        var duration = this.duration / 1000;

        var sourceFrom = {opacity: 1};
        var sourceTo = {opacity: 0};
        var targetFrom = {opacity: 0};
        var targetTo = {opacity: 1};
        targetTo.onComplete = this._notifyComplete.bind(this);

        if (source) {
            klynt.animation.killTweens(source.$element);
            klynt.animation.to({duration: 0, properties: sourceFrom}, source.$element);
        }

        klynt.animation.killTweens(target.$element);
        klynt.animation.to({duration: 0, properties: targetFrom}, target.$element);

        this.prepareForTarget(source, target, function () {
            if (source) {
                klynt.animation.to({duration: duration, properties: sourceTo}, source.$element);
            }

            klynt.animation.to({duration: duration, properties: targetTo}, target.$element);
        });
    };

    klynt.FadeTransitionRenderer.prototype = klynt.utils.mergePrototypes(klynt.TransitionRenderer, klynt.FadeTransitionRenderer);
})(window.klynt);