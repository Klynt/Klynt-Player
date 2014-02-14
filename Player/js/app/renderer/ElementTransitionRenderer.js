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
        switch (this._direction) {
        case klynt.ElementTransitionRenderer.IN:
            this._$element
                .stop()
                .css({
                    clip: getClipString(this._$element, 0, 0)
                })
                .animate({
                    clip: getClipString(this._$element, 0, 1)
                }, this.duration);
            break;
        case klynt.ElementTransitionRenderer.OUT:
            this._$element
                .stop()
                .css({
                    clip: getClipString(this._$element, 0, 1)
                })
                .animate({
                    clip: getClipString(this._$element, 1, 1)
                }, this.duration);
            break;
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

(function clipAniamtionPlugin(jQuery) {
    jQuery.fx.step.clip = function (fx) {
        if (fx.pos === 0) {
            var cRE = /rect\(([0-9]{1,})(px|em)[,]? ([0-9]{1,})(px|em)[,]? ([0-9]{1,})(px|em)[,]? ([0-9]{1,})(px|em)\)/;
            fx.start = cRE.exec(fx.elem.style.clip.replace(/,/g, ''));
            fx.end = cRE.exec(splitFxEnd());
        }
        var sarr = [],
            earr = [],
            spos = fx.start.length,
            epos = fx.end.length,
            emOffset = fx.start[ss + 1] === 'em' ? (parseInt($(fx.elem).css('fontSize')) * 1.333 * parseInt(fx.start[ss])) : 1;
        for (var ss = 1; ss < spos; ss += 2) {
            sarr.push(parseInt(emOffset * fx.start[ss]));
        }
        for (var es = 1; es < epos; es += 2) {
            earr.push(parseInt(emOffset * fx.end[es]));
        }
        fx.elem.style.clip = 'rect(' +
            parseInt((fx.pos * (earr[0] - sarr[0])) + sarr[0]) + 'px ' +
            parseInt((fx.pos * (earr[1] - sarr[1])) + sarr[1]) + 'px ' +
            parseInt((fx.pos * (earr[2] - sarr[2])) + sarr[2]) + 'px ' +
            parseInt((fx.pos * (earr[3] - sarr[3])) + sarr[3]) + 'px)';

        function splitFxEnd() {
            var end = (fx.end instanceof Array) ? fx.end[0] : fx.end;
            return end.replace(/,/g, '');
        }
    };
})(jQuery);