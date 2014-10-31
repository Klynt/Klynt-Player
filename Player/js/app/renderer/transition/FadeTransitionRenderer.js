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

        var sourceParams = {
            duration: duration,
            fromProperties: {
                opacity: 1
            },
            toProperties: {
                opacity: 0
            }
        }

        var targetParams = {
            duration: duration,
            fromProperties: {
                opacity: 0
            },
            toProperties: {
                opacity: 1
            }
        }

        if (source) {
            klynt.animation.killTweens(source.$element);
            klynt.animation.fromTo(sourceParams, source.$element);
        }

        targetParams.toProperties.onComplete = function () {
            this._notifyComplete();
        }.bind(this);

        klynt.animation.killTweens(target.$element);
        klynt.animation.fromTo(targetParams, target.$element);
    };

    klynt.FadeTransitionRenderer.prototype = klynt.utils.mergePrototypes(klynt.TransitionRenderer, klynt.FadeTransitionRenderer);
})(window.klynt);