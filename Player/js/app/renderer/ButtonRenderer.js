/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.ButtonRenderer = function (element, sequence) {
        klynt.ElementRenderer.call(this, element, sequence);
    };

    klynt.ButtonRenderer.prototype._initDOM = function () {
        klynt.ElementRenderer.prototype._initDOM.call(this);

        var buttonType = this.element.type;

        this._$element.addClass('button');

        if (buttonType.indexOf('arrow') !== -1) {

            this._$element
                .attr('id', 'container')
                .addClass('btn-arrow_container');

            switch (buttonType) {
            case 'btn-arrow-right':
                this._$element
                    .append('<div id="arrow" class="btn-arrow-right"></div>')
                    .append('<div id="button" class="btn-arrow-right_tooltip transparent">' + this.element.label + '</div>');
                break;
            case 'btn-arrow-left':
                this._$element
                    .append('<div id="arrow" class="btn-arrow-left"></div>')
                    .append('<div id="button" class="btn-arrow-left_tooltip transparent">' + this.element.label + '</div>');
                break;
            case 'btn-arrow-top':
                this._$element
                    .append('<div id="arrow" class="btn-arrow-top"></div>')
                    .append('<div id="button" class="btn-arrow-top_tooltip transparent">' + this.element.label + '</div>');
                break;
            case 'btn-arrow-bottom':
                this._$element
                    .append('<div id="arrow" class="btn-arrow-bottom"></div>')
                    .append('<div id="button" class="btn-arrow-bottom_tooltip transparent">' + this.element.label + '</div>');
                break;
            }

            this._$element.find('#arrow').hover(
                function () {
                    $(this).siblings().removeClass('transparent');
                },
                function () {
                    $(this).siblings().addClass('transparent');
                }
            )

            this._updateLabelWidth();

        } else {
            this._$element
                .addClass('button')
                .addClass(this.element.type)
                .html(this.element.label);
        }

    };

    klynt.ButtonRenderer.prototype._onBegin = function (event) {
        klynt.ElementRenderer.prototype._onBegin.call(this);
        if (this._element.link && this._element.link.automaticTransition) {
            this.hide();
            klynt.sequenceContainer.currentRenderer.runAutomaticLink(this._element.link);
        }
    };

    klynt.ButtonRenderer.prototype._initStyles = function () {

    };

    klynt.ButtonRenderer.prototype._updateLabelWidth = function () {

        var labelwidth;
        var containerWidth = this.element.width;
        var arrowWidth = this._$element.find('#arrow').width();
        var label = this._$element.find('#button');
        var labelMarginLeft = label.css('marginLeft');
        var labelMarginRight = label.css('marginRight');
        var labelPaddingLeft = label.css('paddingLeft');
        var labelPaddingRight = label.css('paddingRight');

        labelMarginLeft = parseInt(labelMarginLeft.substring(0, labelMarginLeft.length - 2));
        labelMarginRight = parseInt(labelMarginRight.substring(0, labelMarginRight.length - 2));
        labelPaddingLeft = parseInt(labelPaddingLeft.substring(0, labelPaddingLeft.length - 2));
        labelPaddingRight = parseInt(labelPaddingRight.substring(0, labelPaddingRight.length - 2));
        labelwidth = containerWidth - arrowWidth - labelMarginLeft - labelMarginRight - labelPaddingLeft - labelPaddingRight;

        if (containerWidth > 75) {
            this._$element.find('#button').width(labelwidth);
        } else {
            this._$element.find('#button').remove();
        }

    };

    klynt.ButtonRenderer.prototype = klynt.utils.mergePrototypes(klynt.ElementRenderer, klynt.ButtonRenderer);
})(window.klynt);