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

        _active: false,
        get active() {
            return this._active || this.element.syncMaster;
        },

        _rotation: NaN,
        get rotation() {
            return this._rotation;
        },
        set rotation(value) {
            this._rotation = value;
        },

        _scale: 1,
        get scale() {
            return this._scale;
        },
        set scale(value) {
            this._scale = value;
        },

        _FTW: null,
        get FTW() {
            return this._FTW;
        },
        set FTW(value) {
            this._FTW = value;
        },

        _$parent: null,
        _styleRenderer: null,
        _transitionInRenderer: null,
        _transitionOutRenderer: null,
        _interactionsParams: null
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
        this._addInteractions();
        this._initTimesheets();
    };

    klynt.ElementRenderer.prototype.destroy = function () {
        [].concat(this._clickInteractions, this._rolloverInteractions, this._rolloutInteractions).forEach(function (interaction) {
            if (interaction) {
                interaction.kill();
            }
        });

        clearTimeout(this._rollOverTimeout);
        this._rollOverTimeout = null;
    };

    klynt.ElementRenderer.prototype._initDOM = function () {
        this._$element = $('<div ' + (this.element.attributes ? ' ' + this.element.attributes : '') + '>')
            .attr('id', 'element_' + this.element.id)
            .addClass('element_' + this.element.id)
            .addClass('element')
            .addClass(this.element.classNames)
            .css('zIndex', this.element.zIndex)
            .appendTo(this._$parent);

        if (this._element.click) {
            this._$element.addClass('pointer');
        }

        if (this._element.ignoreMouseEvents) {
            this._$element.css('pointer-events', 'none');
        }

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
        this._$element.css(this.getPositionCSS(this.element));
    };

    klynt.ElementRenderer.prototype.getPositionCSS = function (data) {
        var css = {};

        if (data.fitToWindow) {
            css.left = 0;
            css.right = 0;
            css.top = 0;
            css.bottom = 0;
        } else {
            var calc = klynt.utils.browser.webkit ? '-webkit-calc' : 'calc';

            if (data.left !== undefined) {
                css.left = data.left + 'px';
            }
            if (data.right !== undefined) {
                css.right = data.right + 'px';
            }
            if (data.width !== undefined) {
                css.width = data.width + 'px';
            }
            if (data.centerX !== undefined) {
                css.left = calc + '(50% + ' + (data.centerX - data.width / 2) + 'px)';
            }
            if (data.top !== undefined) {
                css.top = data.top + 'px';
            }
            if (data.bottom !== undefined) {
                css.bottom = data.bottom + 'px';
            }
            if (data.height !== undefined) {
                css.height = data.height + 'px';
            }
            if (data.centerY !== undefined) {
                css.top = calc + '(50% + ' + (data.centerY - data.height / 2) + 'px)';
            }
        }

        return css;
    };

    klynt.ElementRenderer.prototype.getPositionFromDOM = function () {
        var sequenceWidth = parseFloat(klynt.sequenceContainer.currentRenderer.$element.width());
        var sequenceHeight = parseFloat(klynt.sequenceContainer.currentRenderer.$element.height());
        var width = this.$element.width();
        var height = this.$element.height();
        var position = this.$element.position();
        var left = parseFloat(position.left);
        var right = parseFloat(position.right);
        var top = parseFloat(position.top);
        var bottom = parseFloat(position.bottom);

        var transformOrigin = this.$element.css("transform-origin");
        transformOrigin = transformOrigin.replace(/px/g, '');
        transformOrigin = transformOrigin.split(" ");

        transformOrigin = transformOrigin.map(function (x) {
            return parseFloat(x);
        });

        var matrix = this.$element.css("transform");
        matrix = matrix.substring(7, matrix.length - 1);
        matrix = matrix.replace(/\s+/g, '');
        matrix = matrix.split(",");

        matrix = matrix.map(function (x) {
            return parseFloat(x);
        });

        if (!hasValue(width)) {
            width = sequenceWidth - left - right;
        }
        if (!hasValue(height)) {
            height = sequenceHeight - top - bottom;
        }
        if (!hasValue(left)) {
            left = sequenceWidth - width - right;
        }
        if (!hasValue(right)) {
            right = sequenceWidth - width - left;
        }
        if (!hasValue(top)) {
            top = sequenceHeight - height - bottom;
        }
        if (!hasValue(bottom)) {
            bottom = sequenceHeight - height - top;
        }

        return {
            width: parseFloat(width),
            height: parseFloat(height),
            left: parseFloat(left),
            right: parseFloat(right),
            top: parseFloat(top),
            bottom: parseFloat(bottom),
            centerX: -(sequenceWidth - parseFloat(width) - 2 * left) / 2,
            centerY: -(sequenceHeight - parseFloat(height) - 2 * top) / 2,
            matrix: matrix,
            transformOrigin: transformOrigin
        }
    };

    klynt.ElementRenderer.prototype.getPositionFromJSON = function () {
        var sequenceWidth = klynt.sequenceContainer.currentRenderer.$element.width();
        var sequenceHeight = klynt.sequenceContainer.currentRenderer.$element.height();
        var width = this.element.width;
        var height = this.element.height;
        var left = this.element.left;
        var right = this.element.right;
        var top = this.element.top;
        var bottom = this.element.bottom;
        var centerX = this.element.centerX;
        var centerY = this.element.centerY;

        if (hasValue(centerX)) {
            if (!hasValue(left)) {
                left = centerX + (sequenceWidth / 2) - (width / 2);
            }

            if (!hasValue(right)) {
                right = sequenceWidth - left - width;
            }
        } else {
            if (!hasValue(left)) {
                left = sequenceWidth - width - right;
            }

            if (!hasValue(right)) {
                right = sequenceWidth - width - left;
            }
        }

        if (hasValue(centerY)) {
            if (!hasValue(top)) {
                top = centerY + (sequenceHeight / 2) - (height / 2);
            }

            if (!hasValue(bottom)) {
                bottom = sequenceHeight - top - height;
            }
        } else {
            if (!hasValue(top)) {
                top = sequenceHeight - height - bottom;
            }

            if (!hasValue(bottom)) {
                bottom = sequenceHeight - height - top;
            }
        }

        return {
            left: left,
            right: right,
            top: top,
            bottom: bottom
        }
    };

    klynt.ElementRenderer.prototype.updateSize = function (ratio) {
        if (this.element.scales && klynt.player.scaleToFullWindow) {
            var scale = this.FTW ? 1 : (ratio || klynt.player.getRatioToWindow()) * this.scale;
            var rotation = this.rotation;
            if (isNaN(rotation)) {
                rotation = this._element.style ? this._element.style.rotation || 0 : 0;
            }

            var data = this.element;
            var ts;
            var tsScale = 'scale(' + scale + ')';
            var tsRotation = 'rotate(' + rotation + 'deg)';
            var tsTranslate;
            var tx = 0;
            var ty = 0;

            if ((hasValue(data.left) && hasValue(data.right)) || hasValue(data.centerX)) {
                if (hasValue(data.centerX)) {
                    tx = data.centerX * (scale - 1);
                } else {
                    tx = 0
                }
            } else {
                tx = ((hasValue(data.left) ? data.left : data.right) + 0.5 * data.width) * (scale - 1);
                tx *= hasValue(data.left) ? 1 : -1;
            }

            if ((hasValue(data.top) && hasValue(data.bottom)) || hasValue(data.centerY)) {
                if (hasValue(data.centerY)) {
                    ty = data.centerY * (scale - 1);
                } else {
                    ty = 0
                }
            } else {
                ty = ((hasValue(data.top) ? data.top : data.bottom) + 0.5 * data.height) * (scale - 1);
                ty *= hasValue(data.top) ? 1 : -1;
            }

            tsTranslate = 'translate(' + tx + 'px, ' + ty + 'px)';

            var tsOringinX = hasValue(data.width) ? (data.width / 2) + 'px' : '50%';
            var tsOringinY = hasValue(data.height) ? (data.height / 2) + 'px' : '50%';
            var tsOringin = tsOringinX + ' ' + tsOringinY;

            TweenLite.set(this.$element, {
                transform: tsTranslate + ' ' + tsScale + ' ' + tsRotation,
                transformOrigin: tsOringin
            });

            this._updateLayoutInteractions();
        }
    };

    klynt.ElementRenderer.prototype._updateLayoutInteractions = function () {
        var interaction,
            interactions = this._interactionsParams;

        for (var interactionType in interactions) {
            if (interactions.hasOwnProperty(interactionType)) {
                interaction = interactions[interactionType].interactions;
                if (interaction.length != 0) {
                    for (var i = 0; i < interaction.length; i++) {
                        var layoutInteraction = interaction[i];
                        if (layoutInteraction instanceof klynt.LayoutInteractionRenderer) {
                            layoutInteraction._upadteRatio();
                        }
                    }
                }
            }
        }
    };

    klynt.ElementRenderer.prototype.getTranslate = function () {
        var scale = klynt.player.getRatioToWindow() * this.scale;
        var data = this.element;
        var ts;
        var tsTranslate;
        var tx = 0;
        var ty = 0;

        if ((hasValue(data.left) && hasValue(data.right)) || hasValue(data.centerX)) {
            tx = 0
        } else {
            tx = ((hasValue(data.left) ? data.left : data.right) + 0.5 * data.width) * (scale - 1);
            tx *= hasValue(data.left) ? 1 : -1;
        }

        if ((hasValue(data.top) && hasValue(data.bottom)) || hasValue(data.centerY)) {
            ty = 0
        } else {
            ty = ((hasValue(data.top) ? data.top : data.bottom) + 0.5 * data.height) * (scale - 1);
            ty *= hasValue(data.top) ? 1 : -1;
        }
        return {
            x: tx,
            y: ty
        };
    }

    klynt.ElementRenderer.prototype._initStyles = function () {
        var style = this.element.style;
        if (style) {
            this.$element.css({
                opacity: style.opacity,
                backgroundColor: style.backgroundColor,
                border: style.borderSize + 'px solid ' + style.borderColor,
                borderRadius: style.borderRadius + 'px',
                boxShadow: style.dropShadowX + 'px ' + style.dropShadowY + 'px ' + style.dropShadowBlur + 'px ' + style.dropShadowColor,
                transform: 'rotate(' + style.rotation + 'deg)'
            });
        }
    };

    klynt.ElementRenderer.prototype._initTimesheets = function () {
        this._$element
            .attr('data-begin', this.element.begin)
            .attr('data-dur', this.element.duration)
            .attr('data-end', this.element.end);

        this.hide();
    };

    klynt.ElementRenderer.prototype._addInteractions = function () {
        this._interactionsParams = {
            click: {
                interactions: this._createInteractionsRenderers(this.element.click, false),
                dispatchInteractions: this._createInteractionsRenderers(this.element.click, true),
                delay: getInteractionsDelay(this.element.click),
                timeOut: 0
            },
            rollOver: {
                interactions: this._createInteractionsRenderers(this.element.rollOver, false),
                dispatchInteractions: this._createInteractionsRenderers(this.element.rollOver, true),
                delay: getInteractionsDelay(this.element.rollOver),
                timeOut: 0
            },
            rollOut: {
                interactions: this._createInteractionsRenderers(this.element.rollOut, false),
                dispatchInteractions: this._createInteractionsRenderers(this.element.rollOut, true),
                delay: getInteractionsDelay(this.element.rollOut),
                timeOut: 0
            }
        }
    };

    klynt.ElementRenderer.prototype._createInteractionsRenderers = function (interactions, syncronous) {
        var result = [];
        if (interactions) {
            for (var i = 0; i < interactions.length; i++) {
                var interaction = interactions[i];

                if (interaction.syncronous == syncronous) {
                    switch (interaction.type) {
                    case 'style':
                        result.push(new klynt.StyleInteractionRenderer(interaction, this));
                        break;
                    case 'layout':
                        result.push(new klynt.LayoutInteractionRenderer(interaction, this));
                        break;
                    default:
                        result.push(new klynt.ActionInteractionRenderer(interaction, this));
                    }
                }
            }
        }

        return result;
    }

    klynt.ElementRenderer.prototype._addEventListeners = function () {
        this._$element.hammer().on('tap', this._onClick.bind(this)); // ADD TOUCH INTERACTION //

        //if (klynt.utils.browser.touch != 'touchstart')
        this._$element.hover(this._onRollover.bind(this), this._onRollout.bind(this));

        var domElement = this._$element[0];
        domElement.addEventListener('begin', this._onBegin.bind(this));
        domElement.addEventListener('end', this._onEnd.bind(this));
        domElement.addEventListener('reset', this._onReset.bind(this));
    };

    klynt.ElementRenderer.prototype._onClick = function (event) {
        if (this.sequence.willDestroy) {
            return;
        }

        if (!klynt.utils.browser.mouseDetected && klynt.utils.browser.touch == 'touchstart') {
            var hasClickEvent = this._interactionsParams['click'].interactions.length > 0 || this._interactionsParams['click'].dispatchInteractions.length > 0;

            if (hasClickEvent) {
                this.executeInteractions('click');
            } else {
                this.executeInteractions('rollOver');
            }
        } else {
            this.executeInteractions('click');
        }

        if (this._element.link) {
            this._element.link.execute();
        }
    };

    klynt.ElementRenderer.prototype._onRollover = function (event) {
        this.executeInteractions('rollOver', false);
        this.executeInteractions('rollOut', true);
    };

    klynt.ElementRenderer.prototype._onRollout = function (event) {
        this.executeInteractions('rollOut', false);
        this.executeInteractions('rollOver', true);
    };

    klynt.ElementRenderer.prototype.executeInteractions = function (interactionEvent, reverse, dispatchChain) {
        var params = this._interactionsParams[interactionEvent];
        var isTouchDevice = !klynt.utils.browser.mouseDetected && klynt.utils.browser.touch == 'touchstart';

        if (!dispatchChain || dispatchChain.indexOf(this) == -1) {
            params.dispatchInteractions.forEach(function (interaction) {
                if (interactionEvent == 'click' || isTouchDevice) {
                    if (interaction.started && interaction.reversible) {
                        interaction.reverse(this._clickDelay, dispatchChain);
                    } else {
                        interaction.execute(dispatchChain);
                    }
                } else {
                    reverse ? interaction.reverse(params.delay) : interaction.execute();
                }
            });
        }

        if (params.timeOut) {
            clearTimeout(params.timeOut);
            params.timeOut = 0;
        } else if (params.interactions && params.interactions.length) {
            params.timeOut = setTimeout(this._doExecuteInteractions.bind(this, interactionEvent, reverse), 10);
        }
    }

    klynt.ElementRenderer.prototype._doExecuteInteractions = function (interactionEvent, reverse, dispatchChain) {
        var params = this._interactionsParams[interactionEvent];
        var isTouchDevice = !klynt.utils.browser.mouseDetected && klynt.utils.browser.touch == 'touchstart';

        clearTimeout(params.timeOut);
        params.timeOut = 0;

        params.interactions.forEach(function (interaction) {
            if (interactionEvent == 'click' || isTouchDevice) {
                if (interaction.started && interaction.reversible) {
                    interaction.reverse(this._clickDelay, dispatchChain);
                } else {
                    interaction.execute(dispatchChain);
                }
            } else {
                reverse ? interaction.reverse(params.delay) : interaction.execute();
            }
        });
    }

    klynt.ElementRenderer.prototype._onBegin = function (event) {
        this._active = true;
        if (this._transitionInRenderer) {
            this._transitionInRenderer.execute();
        }
    };

    klynt.ElementRenderer.prototype._onEnd = function (event) {
        this._active = false;
        
        if (this._transitionInRenderer) {
            this._transitionInRenderer.reset();
        }
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

        this._active = false;
        if (this._transitionInRenderer) {
            this._transitionInRenderer.reset();
        }
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

    function getInteractionsDelay(interactions) {
        var max = 0;
        if (interactions) {
            interactions.forEach(function (interaction)  {
                if (interaction.delay > max) {
                    max = interaction.delay;
                }
            });
        }
        return max;
    }

    function hasValue(value) {
        return value !== undefined && !isNaN(value);
    }
})(window.klynt);