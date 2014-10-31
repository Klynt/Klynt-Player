/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.StyleRenderer = function (model, $element, element) {
        this._model = model;
        this._$element = $element;
        this._element = element;

        this.init();
    };

    klynt.StyleRenderer.prototype = {
        _model: null,
        _$element: null
    };

    klynt.StyleRenderer.prototype.init = function () {
        this._$element.css({
            opacity: this._model.opacity,
            backgroundColor: this._model.backgroundColor,
            border: this._model.borderSize + 'px solid ' + this._model.borderColor,
            borderRadius: this._model.borderRadius + 'px',
            boxShadow: this._model.dropShadowX + 'px ' + this._model.dropShadowY + 'px ' + this._model.dropShadowBlur + 'px ' + this._model.dropShadowColor,
            transform: 'rotate(' + this._model.rotation + 'deg)'
        });

        /*this._$element.hoverIntent({
            over: this.applyRollOverStyle.bind(this),
            out: this.applyNormalStyle.bind(this)
        });*/

        this._$element.hover(this.applyRollOverStyle.bind(this), this.applyNormalStyle.bind(this));
    };

    klynt.StyleRenderer.prototype.applyRollOverStyle = function () {
        var params = {
            ease: this._getEasing()
        };
        if (this._model.rollOverOpacity !== undefined) {
            params.opacity = this._model.rollOverOpacity;
        }
        if (this._model.rollOverBackgroundColor !== undefined) {
            params.backgroundColor = this._model.rollOverBackgroundColor;
        }
        if (this._model.rollOverBorderSize !== undefined && this._model.rollOverBorderColor !== undefined) {
            params.border = this._model.rollOverBorderSize + 'px solid ' + this._model.rollOverBorderColor;
        }
        if (this._model.rollOverBorderRadius !== undefined) {
            params.borderRadius = this._model.rollOverBorderRadius + 'px';
        }
        if (this._model.rollOverDropShadowX !== undefined && this._model.rollOverDropShadowY !== undefined && this._model.rollOverDropShadowBlur !== undefined && this._model.rollOverDropShadowColor !== undefined) {
            params.boxShadow = this._model.rollOverDropShadowX + 'px ' + this._model.rollOverDropShadowY + 'px ' + this._model.rollOverDropShadowBlur + 'px ' + this._model.rollOverDropShadowColor;
        }
        if (this._model.rollOverRotation !== undefined) {
            params.rotation = this._model.rollOverRotation;
        }

        if (this._element.scales && klynt.player.scaleToFullWindow) {
            //params.scale = klynt.player.getRatioToWindow();
        }

        TweenLite.to(this._$element[0], this._model.rollOverAnimationDuration, params);
    };

    klynt.StyleRenderer.prototype.applyNormalStyle = function () {
        if (this._model.rollOverAnimationReversible) {
            var params = {
                ease: this._getEasing()
            };
            if (this._model.opacity !== undefined) {
                params.opacity = this._model.opacity;
            }
            if (this._model.backgroundColor !== undefined) {
                params.backgroundColor = this._model.backgroundColor;
            }
            if (this._model.borderSize !== undefined && this._model.borderColor !== undefined) {
                params.border = this._model.borderSize + 'px solid ' + this._model.borderColor;
            }
            if (this._model.borderRadius !== undefined) {
                params.borderRadius = this._model.borderRadius + 'px';
            }
            if (this._model.dropShadowX !== undefined && this._model.dropShadowY !== undefined && this._model.dropShadowBlur !== undefined && this._model.dropShadowColor !== undefined) {
                params.boxShadow = this._model.dropShadowX + 'px ' + this._model.dropShadowY + 'px ' + this._model.dropShadowBlur + 'px ' + this._model.dropShadowColor;
            }
            if (this._model.rotation !== undefined) {
                params.rotation = this._model.rotation;
            }

            if (this._element.scales && klynt.player.scaleToFullWindow) {
                //params.scale = klynt.player.getRatioToWindow();
            }

            TweenLite.to(this._$element[0], this._model.rollOverAnimationDuration, params);
        }
    };

    klynt.StyleRenderer.prototype._getEasing = function () {
        switch (this._model.rollOverAnimationEasing) {
        case 'linear':
            return 'Linear.easeNone';
        case 'easeIn':
            return 'Power3.easeIn';
        case 'easeOut':
            return 'Power3.easeOut';
        case 'easeInOut':
            return 'Power3.easeInOut';
        default:
            return null;
        }
    };
})(window.klynt);