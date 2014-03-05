/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.ElementRenderer = function (element, $parent) {
        this._element = element;
        this._$parent = $parent;
        this._init();
    };

    klynt.ElementRenderer.prototype = {
        _element: null,
        get element() {
            return this._element;
        },

        _$element: null,
        get $element() {
            return this._$element;
        },

        _$parent: null,
        _styleRenderer: null,
        _transitionInRenderer: null,
        _transitionOutRenderer: null
    };

    klynt.ElementRenderer.prototype.show = function () {
        this._$element.css('visibility', 'visible');
    };

    klynt.ElementRenderer.prototype.hide = function () {
        this._$element.css('visibility', 'hidden');
    };

    klynt.ElementRenderer.prototype._init = function () {
        this._initDOM();
        this._initStyles();
        this._initTransitions();
        this._initScouts();
        this._addEventListeners();
        this._initTimesheets();
    };

    klynt.ElementRenderer.prototype._initDOM = function () {
        this._$element = $('<div>')
            .attr('id', 'element_' + this.element.id)
            .addClass('element_' + this.element.id)
            .addClass('element')
            .css('left', this.element.left)
            .css('top', this.element.top)
            .css('width', this.element.width)
            .css('height', this.element.height)
            .css('zIndex', this.element.zIndex)
            .appendTo(this._$parent);

        if (!this._element.syncMaster) {
            this.hide();
        }

        if (this._element.link || this._element.action) {
            this._$element.addClass('has-link');
        }

        if (this._element.link && this._element.link.tooltip) {
            this._$element.prop('title', this._element.link.tooltip);
        }
    };

    klynt.ElementRenderer.prototype._initStyles = function () {
        if (this._element.style) {
            this._styleRenderer = new klynt.StyleRenderer(this._element.style, this._$element);
        }
    };

    klynt.ElementRenderer.prototype._initTimesheets = function () {
        this._$element
            .attr('data-begin', this.element.begin)
            .attr('data-dur', this.element.duration)
            .attr('data-end', this.element.end);

        this.hide();
    };

    klynt.ElementRenderer.prototype._addEventListeners = function () {
        this._$element
            .click(this._onClick.bind(this));

        var domElement = this._$element[0];
        domElement.addEventListener('begin', this._onBegin.bind(this));
        domElement.addEventListener('end', this._onEnd.bind(this));
    };

    klynt.ElementRenderer.prototype._onClick = function (event) {
        if (this._element.link) {
            this._element.link.execute();
        }

        if (this._element.action) {
            test = this._element.action.execute();
        }
    };

    klynt.ElementRenderer.prototype._onBegin = function (event) {
        if (this._transitionInRenderer) {
            this._transitionInRenderer.execute();
        }
    };

    klynt.ElementRenderer.prototype._onEnd = function (event) {
        if (this._transitionOutRenderer) {
            this._transitionOutRenderer.reset();
        }
    };

    klynt.ElementRenderer.prototype._initTransitions = function () {
        if (this._element.transitionIn) {
            this._transitionInRenderer = new klynt.ElementTransitionRenderer(this, klynt.ElementTransitionRenderer.IN);
        }

        if (this._element.transitionOut) {
            this._transitionOutRenderer = new klynt.ElementTransitionRenderer(this, klynt.ElementTransitionRenderer.OUT);
        }
    };

    klynt.ElementRenderer.prototype._initScouts = function () {
        if (this._element.transitionOut) {
            var scoutBegin = this._element.end - this._element.transitionOut.duration;
            new klynt.ScoutRenderer(scoutBegin, this._$parent, this._transitionOutRenderer.execute.bind(this._transitionOutRenderer));
        }
    };
})(window.klynt);