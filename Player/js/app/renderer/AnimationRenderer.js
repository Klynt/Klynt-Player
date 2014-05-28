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

    klynt.AnimationRenderer.prototype.execute = function (t, sequence) {
        var croppingDemensions = this._image.getCroppingDimensions(this._animation.width, this._animation.height);
        var scaleMode = this._image._element.scaleMode;
        var parent = this._image.$element;
        var image = this._image.$image;
        var animation = this._animation;
        var dimensions = {
            width: this._image._element.mediaWidth,
            height: this._image._element.mediaHeight
        }
        var newProperties = {};
        var ratio;
        var animationWidth, animationHeight;

        if (animation.left !== undefined) {
            newProperties.left = animation.left + 'px';
        }
        if (animation.right !== undefined) {
            newProperties.right = animation.right + 'px';
        }
        if (animation.width !== undefined) {
            newProperties.width = animation.width + 'px';
            animationWidth = animation.width;
        } else {
            animationWidth = sequence.$element.width() - animation.left - animation.right;
        }
        if (animation.centerX !== undefined) {
            newProperties.left = 'calc(50% + ' + (animation.centerX - animation.width / 2) + 'px)';
            newProperties.left = '-webkit-calc(50% + ' + (animation.centerX - animation.width / 2) + 'px)';
        }
        if (animation.top !== undefined) {
            newProperties.top = animation.top + 'px';
        }
        if (animation.bottom !== undefined) {
            newProperties.bottom = animation.bottom + 'px';
        }
        if (animation.height !== undefined) {
            newProperties.height = animation.height + 'px';
            animationHeight = animation.height;
        } else {
            animationHeight = sequence.$element.height() - animation.top - animation.bottom;
        }
        if (animation.centerY !== undefined) {
            newProperties.top = 'calc(50% + ' + (animation.centerY - animation.height / 2) + 'px)';
            newProperties.top = '-webkit-calc(50% + ' + (animation.centerY - animation.height / 2) + 'px)';
        }

        TweenLite.to(parent[0], this._animation.duration, newProperties).seek(t);

        if (scaleMode == 'zoom') {
            ratio = Math.max(animationWidth / dimensions.width, animationHeight / dimensions.height);

            TweenLite.to(image[0], this._animation.duration, {
                width: ratio * dimensions.width + 'px',
                height: ratio * dimensions.height + 'px',
                marginLeft: (animationWidth - ratio * dimensions.width) / 2 + 'px',
                marginTop: (animationHeight - ratio * dimensions.height) / 2 + 'px',
                onComplete: function () {
                    $(window).trigger('resize');
                }
            }).seek(t);
        } else if (scaleMode == 'letterbox') {
            ratio = Math.min(animationWidth / dimensions.width, animationHeight / dimensions.height);

            TweenLite.to(image[0], this._animation.duration, {
                width: ratio * dimensions.width + 'px',
                height: ratio * dimensions.height + 'px',
                marginLeft: (animationWidth - ratio * dimensions.width) / 2 + 'px',
                marginTop: (animationHeight - ratio * dimensions.height) / 2 + 'px',
                onComplete: function () {
                    $(window).trigger('resize');
                }
            }).seek(t);
        } else if (scaleMode == 'zoomWithTopLeftAlign') {
            ratio = Math.max(animationWidth / dimensions.width, animationHeight / dimensions.height);

            TweenLite.to(image[0], this._animation.duration, {
                width: ratio * dimensions.width + 'px',
                height: ratio * dimensions.height + 'px',
                onComplete: function () {
                    $(window).trigger('resize');
                }
            }).seek(t);
        } else if (scaleMode == 'zoomWithTopRightAlign') {
            ratio = Math.max(animationWidth / dimensions.width, animationHeight / dimensions.height);

            console.log(animationWidth - ratio * dimensions.width);

            TweenLite.to(image[0], this._animation.duration, {
                width: ratio * dimensions.width + 'px',
                height: ratio * dimensions.height + 'px',
                marginLeft: (animationWidth - ratio * dimensions.width) + 'px',
                onComplete: function () {
                    $(window).trigger('resize');
                }
            }).seek(t);
        } else if (scaleMode == 'zoomWithBottomLeftAlign') {
            ratio = Math.max(animationWidth / dimensions.width, animationHeight / dimensions.height);

            TweenLite.to(image[0], this._animation.duration, {
                width: ratio * dimensions.width + 'px',
                height: ratio * dimensions.height + 'px',
                marginTop: (animationHeight - ratio * dimensions.height) + 'px',
                onComplete: function () {
                    $(window).trigger('resize');
                }
            }).seek(t);
        } else if (scaleMode == 'zoomWithBottomRightAlign') {
            ratio = Math.max(animationWidth / dimensions.width, animationHeight / dimensions.height);

            TweenLite.to(image[0], this._animation.duration, {
                width: ratio * dimensions.width + 'px',
                height: ratio * dimensions.height + 'px',
                marginLeft: (animationWidth - ratio * dimensions.width) + 'px',
                marginTop: (animationHeight - ratio * dimensions.height) + 'px',
                onComplete: function () {
                    $(window).trigger('resize');
                }
            }).seek(t);
        }
    }
})(window.klynt);