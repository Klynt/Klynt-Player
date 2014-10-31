/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.AnimationRenderer = function (animation, element) {
        this._animation = animation;
        this._element = element;
    };

    klynt.AnimationRenderer.prototype = {
        _animation: null,
        _element: null
    };

    klynt.AnimationRenderer.prototype.execute = function () {
        if (this._element.currentTime >= 0 && this._element.currentTime <= this._animation.duration) {
            TweenLite.killTweensOf(this._element.$element);
            TweenLite.killTweensOf(this._element.$image);

            var elementPosition = this._element.getPositionCSS(this._animation);
            TweenLite.to(this._element.$element, this._animation.duration, elementPosition).seek(this._element.currentTime);

            var imagePosition = this._element.getImagePositionCSS(this._animation);
            TweenLite.to(this._element.$image, this._animation.duration, imagePosition).seek(this._element.currentTime);
        }
    }
})(window.klynt);