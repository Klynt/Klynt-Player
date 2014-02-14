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

        var animation = this._getAnimationDescription();

        this._result = target;
        this._discarded = source;

        if (source) {
            source.$element
                .stop()
                .css(animation.source.from)
                .animate(animation.source.to, this.duration, this.easing);
        }

        target.$element
            .stop()
            .css(animation.target.from)
            .animate(animation.target.to, this.duration, this.easing, this._notifyComplete.bind(this));
    };

    klynt.SlideTransitionRenderer.prototype._getAnimationDescription = function () {
        var width = klynt.sequenceContainer.width;
        var height = klynt.sequenceContainer.height;
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