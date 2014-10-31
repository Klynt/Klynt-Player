/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.ElementTransitionRenderer = function (elementRenderer, direction) {
        this._elementRenderer = elementRenderer;
        this._$element = elementRenderer.$element;
        this._element = elementRenderer.element;
        this._direction = direction;
        this._transition = direction === klynt.ElementTransitionRenderer.IN ? this._element.transitionIn : this._element.transitionOut;
    };

    klynt.ElementTransitionRenderer.prototype = {
        _transition: null,
        _elementRenderer: null,
        _$element: null,
        _element: null,
        _direction: null,

        get duration() {
            return this._transition ? this._transition.duration * 1000 : 1000;
        },
    };

    klynt.ElementTransitionRenderer.prototype.execute = function () {
        switch (this._transition.type) {
        case 'fade':
            this._executeFadeTransition();
            break;
        case 'barWipe':
            this._executeBarWipeTransition();
            break;
        }
    };

    klynt.ElementTransitionRenderer.prototype.reset = function () {
        switch (this._transition.type) {
        case 'fade':
            this._resetFadeTransition();
            break;
        case 'barwipe':
            this._resetBarWipeTransition();
            break;
        }
    };

    klynt.ElementTransitionRenderer.prototype._executeFadeTransition = function () {
        switch (this._direction) {
        case klynt.ElementTransitionRenderer.IN:
            this._$element
                .stop()
                .css({
                    opacity: 0
                })
                .fadeTo(this.duration, this._getElementOpacity());
            break;
        case klynt.ElementTransitionRenderer.OUT:
            this._$element
                .stop()
                .fadeOut(this.duration);
            break;
        }
    };

    klynt.ElementTransitionRenderer.prototype._resetFadeTransition = function () {
        this._$element.css({
            opacity: this._getElementOpacity(),
            display: 'block'
        });
    };

    klynt.ElementTransitionRenderer.prototype._getElementOpacity = function () {
        return this._element.style ? this._element.style.opacity : 1;
    };

    klynt.ElementTransitionRenderer.prototype._executeBarWipeTransition = function () {
        var params, duration = this.duration / 1000;

        switch (this._direction) {
        case klynt.ElementTransitionRenderer.IN:
            params = {
                duration: duration,
                fromProperties: {
                    clip: getClipString(this._$element, 0, 0)
                },
                toProperties: {
                    clip: getClipString(this._$element, 0, 1)
                }
            }
            klynt.animation.killTweens(this._$element);
            klynt.animation.fromTo(params, this._$element);
            break;
        case klynt.ElementTransitionRenderer.OUT:
            params = {
                duration: duration,
                fromProperties: {
                    clip: getClipString(this._$element, 0, 1)
                },
                toProperties: {
                    clip: getClipString(this._$element, 1, 1)
                }
            }
            klynt.animation.killTweens(this._$element);
            klynt.animation.fromTo(params, this._$element);
        }
    };

    klynt.ElementTransitionRenderer.prototype._resetBarWipeTransition = function () {
        this._$element.css({
            clip: null
        });
    };

    function getClipString($element, leftFactor, rightFactor) {
        var width = $element.width();
        var height = $element.height();
        return 'rect(' + 0 + 'px ' + parseInt(width * rightFactor) + 'px ' + height + 'px ' + parseInt(width * leftFactor) + 'px)';
    }

    klynt.ElementTransitionRenderer.IN = 'in';
    klynt.ElementTransitionRenderer.OUT = 'out';
})(window.klynt);