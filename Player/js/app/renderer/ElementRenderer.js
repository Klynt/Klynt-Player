/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.ElementRenderer = function (element, sequence) {
        this._element = element;
        this._sequence = sequence;
        this._$parent = sequence.$element;
        this._init();
    };

    klynt.ElementRenderer.prototype = {
        _sequence: null,
        get sequence() {
            return this._sequence;
        },

        _element: null,
        get element() {
            return this._element;
        },

        _$element: null,
        get $element() {
            return this._$element;
        },

        get currentTime() {
            return this.sequence.currentTime - this.element.begin;
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
        this._initPosition();
        this._initStyles();
        this.updateSize();
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

    klynt.ElementRenderer.prototype._initPosition = function () {
        if (this.element.fitToWindow) {
            this._$element.css({
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            });
        } else {
            if (this.element.left !== undefined) {
                this._$element.css('left', this.element.left + 'px');
            }
            if (this.element.right !== undefined) {
                this._$element.css('right', this.element.right + 'px');
            }
            if (this.element.width !== undefined) {
                this._$element.css('width', this.element.width + 'px');
            }
            if (this.element.centerX !== undefined) {
                this._$element.css('left', 'calc(50% + ' + (this.element.centerX - this.element.width / 2) + 'px)');
                this._$element.css('left', '-webkit-calc(50% + ' + (this.element.centerX - this.element.width / 2) + 'px)');
            }
            if (this.element.top !== undefined) {
                this._$element.css('top', this.element.top + 'px');
            }
            if (this.element.bottom !== undefined) {
                this._$element.css('bottom', this.element.bottom + 'px');
            }
            if (this.element.height !== undefined) {
                this._$element.css('height', this.element.height + 'px');
            }
            if (this.element.centerY !== undefined) {
                this._$element.css('top', 'calc(50% + ' + (this.element.centerY - this.element.height / 2) + 'px)');
                this._$element.css('top', '-webkit-calc(50% + ' + (this.element.centerY - this.element.height / 2) + 'px)');
            }
        }
    };

    klynt.ElementRenderer.prototype.updateSize = function (ratio) {
        if (this.element.scales && klynt.player.scaleToFullWindow) {
            ratio = ratio || klynt.player.getRatioToWindow();

            var transform = '';

            // Rotation
            var rotation = this._element.style ? this._element.style.rotation || 0 : 0;
            transform += 'rotate(' + rotation + 'deg)';

            // Scale
            transform += 'scale(' + ratio + ')';

            // Translation
            if (!this.element.animation || this.element.animation.type !== 'panZoom') {
                var tx = 0;
                var ty = 0;

                if (this.element.width === undefined) {

                } else if (this.element.centerX !== undefined) {
                    tx = this.element.centerX;
                } else if (this.element.left !== undefined) {
                    tx = this.element.left + this.element.width / 2;
                } else if (this.element.right !== undefined) {
                    tx = -this.element.right - this.element.width / 2;
                }

                if (this.element.height === undefined) {

                } else if (this.element.centerY !== undefined) {
                    ty = this.element.centerY;
                } else if (this.element.top !== undefined) {
                    ty = this.element.top + this.element.height / 2;
                } else if (this.element.bottom !== undefined) {
                    ty = -this.element.bottom - this.element.height / 2;
                }

                transform = 'translate(' + -tx + 'px, ' + -ty + 'px)' + transform + 'translate(' + tx + 'px, ' + ty + 'px)';
            }

            this._$element.css({
                'transform': transform,
                'transform-origin': '50% 50%'
            }).addClass('scale');
        }
    };

    klynt.ElementRenderer.prototype._initStyles = function () {
        if (this._element.style) {
            this._styleRenderer = new klynt.StyleRenderer(this._element.style, this._$element, this._element);
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
        this._$element.click(this._onClick.bind(this));

        var domElement = this._$element[0];
        domElement.addEventListener('begin', this._onBegin.bind(this));
        domElement.addEventListener('end', this._onEnd.bind(this));
        domElement.addEventListener('reset', this._onReset.bind(this));
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

    klynt.ElementRenderer.prototype._onReset = function (event) {

        if (this.element.animation) {
            this._$element
                .css('left', this.element.left)
                .css('top', this.element.top)
                .css('width', this.element.width)
                .css('height', this.element.height);

            this._$element.children()
                .css('width', this.element.width)
                .css('height', this.element.height);
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