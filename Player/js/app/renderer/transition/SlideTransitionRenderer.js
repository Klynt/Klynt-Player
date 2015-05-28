/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.SlideTransitionRenderer = function (model) {
        klynt.TransitionRenderer.call(this, model);
    };

    klynt.SlideTransitionRenderer.prototype = {
        get direction() {
            return this._model.type;
        }
    };

    klynt.SlideTransitionRenderer.prototype.execute = function (source, target) {
        klynt.TransitionRenderer.prototype.execute.call(this, source, target);

        var duration = this.duration / 1000;

        var animation = this._getAnimationDescription();
        animation.target.to.onComplete = this._notifyComplete.bind(this);

        if (source) {
            klynt.animation.killTweens(source.$element);
            klynt.animation.to({duration: 0, properties: animation.source.from}, source.$element);
        }

        klynt.animation.killTweens(target.$element);
        klynt.animation.to({duration: 0, properties: animation.target.from}, target.$element);

        this.prepareForTarget(source, target, function () {
            if (source) {
                klynt.animation.to({duration: duration, properties: animation.source.to}, source.$element);
            }

            klynt.animation.to({duration: duration, properties: animation.target.to}, target.$element);
        });
    };

    klynt.SlideTransitionRenderer.prototype._getAnimationDescription = function () {
        var width = klynt.sequenceContainer.$fullscreenWrapper.width();
        var height = klynt.sequenceContainer.$fullscreenWrapper.height();

        var source = {
            from: {
                left: 0,
                top: 0
            },
            to: {
                left: 0,
                top: 0
            }
        };
        var target = {
            from: {
                left: 0,
                top: 0
            },
            to: {
                left: 0,
                top: 0
            }
        };

        switch (this.direction) {
        case DIRECTION.UP:
            source.to.top = -height;
            target.from.top = height;
            break;
        case DIRECTION.DOWN:
            source.to.top = height;
            target.from.top = -height;
            break;
        case DIRECTION.LEFT:
            source.to.left = -width;
            target.from.left = width;
            break;
        case DIRECTION.RIGHT:
            source.to.left = width;
            target.from.left = -width;
        }

        return {
            source: source,
            target: target
        };
    };

    klynt.SlideTransitionRenderer.prototype = klynt.utils.mergePrototypes(klynt.TransitionRenderer, klynt.SlideTransitionRenderer);

    var DIRECTION = klynt.SlideTransitionRenderer.DIRECTION = {
        UP: 'slideUp',
        DOWN: 'slideDown',
        LEFT: 'slideLeft',
        RIGHT: 'slideRight'
    }
})(window.klynt);