/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.AnimationRenderer = function (animation, image) {
        this._animation = animation;
        this._image = image;
    };

    klynt.AnimationRenderer.prototype = {
        _animation: null,
        _image: null
    };

    klynt.AnimationRenderer.prototype.execute = function () {
        var croppingDemensions = this._image.getCroppingDimensions(this._animation.width, this._animation.height);

        TweenLite.to(this._image.$element[0], this._animation.duration, {
            left: this._animation.left + 'px',
            top: this._animation.top + 'px',
            width: this._animation.width + 'px',
            height: this._animation.height + 'px'
        });

        TweenLite.to(this._image.$image[0], this._animation.duration, {
            width: croppingDemensions.width + 'px',
            height: croppingDemensions.height + 'px'
        });
    };
})(window.klynt);
