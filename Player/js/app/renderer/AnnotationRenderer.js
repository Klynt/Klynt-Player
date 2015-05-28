/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.AnnotationRenderer = function (element, sequence) {
        klynt.ElementRenderer.call(this, element, sequence);
    };

    klynt.AnnotationRenderer.prototype = {
        get time() {
            return this.element.time;
        },

        get timePosition() {
            return this.time / this.sequence.sequence.duration;
        },

        get sequences() {
            return this._sequences;
        },

        _hasTooltip: false,
        get hasTooltip () {
            return this._hasTooltip;
        },

        _tooltipVisible: false,
        get tooltipVisible () {
            return this._tooltipVisible;
        },

        _$tooltipContainer: null,
        get $tooltipContainer() {
            return this._$tooltipContainer;
        },

        _$annotationMarker: null,
        get $annotationMarker() {
            return this._$annotationMarker;
        },

        _$tooltipArrow: null,
        get $tooltipArrow() {
            return this._$tooltipArrow;
        },

        _data: null,
        get data() {
            return this._data;
        }
    };

    klynt.AnnotationRenderer.prototype._initDOM = function () {
        klynt.ElementRenderer.prototype._initDOM.call(this);

        this.$element.addClass('annotation-marker-container');
        this._$annotationMarker = $('<div class="annotation-marker"></div>').appendTo(this.$element);

        this._data = this._getDataFromElements(this.element.elements);

        this._addTooltip();
        this._addMouseInteractions();
    };

    klynt.AnnotationRenderer.prototype._getDataFromElements = function (elements) {
        var data = {
            time : this.time,
            items : [],
            links : {}
        };

        elements.forEach(function (element) {
            var sequence = element.link ? element.link.target : null;
            var item = {
                id: element.id,
                label: element.annotation.label,
                formattedDuration: sequence ? sequence.formattedDuration : '', 
                image: sequence && element.annotation.thumbnail ? sequence.thumbnail : null
            };
            data.items.push(item);
            data.links[element.id] = element.link;
            this._hasTooltip = this._hasTooltip || !!item.label || !!item.image;
        }.bind(this));

        return data;
    };

    klynt.AnnotationRenderer.prototype._addTooltip = function () {
        if (this.hasTooltip) {
            var tooltipsTemplate =
                '<div class="annotation-tooltip-container" data-time="{{time}}">' +
                '<ul>'+
                '   {{#items}}' +
                '       <li class="annotation-tooltip klynt-secondary-color{{#image}} has-image{{/image}}" data-id="{{id}}">' +
                '           {{#image}}' +
                '               <div class="annotation-tooltip-image" style="background-image:url({{{image}}})">' +
                '                   <p class="klynt-tertiary-color">{{formattedDuration}}</p>' +
                '               </div>' +
                '           {{/image}}' +
                '           {{#label}}' +
                '               <div class="annotation-tooltip-label">{{{label}}}</div>' +
                '           {{/label}}' +
                '       </li>' +
                '   {{/items}}' +
                '   <div class="annotation-tooltip-arrow klynt-primary-color-border-top-70"></div>' +
                '</ul>'
                '</div>';

            this.sequence.$element.append(Mustache.render(tooltipsTemplate, this.data));
            this._$tooltipContainer = this.sequence.$element.find('.annotation-tooltip-container[data-time = "' + this.time + '"]');
            this._$tooltipArrow = this.$tooltipContainer.find('.annotation-tooltip-arrow');
        }
    };

    klynt.AnnotationRenderer.prototype._addMouseInteractions = function () {
        this.$element.hammer().on('tap', function () {
            if (klynt.utils.browser.mouseDetected && !Modernizr.touch) {
                klynt.player.seekTo(this.time);
            } else if (this._tooltipVisible) {
                this._hideTooltip();
            }
        }.bind(this));

        var timeOut;
        var onMouseOver = function () {
            this._showTooltip();
            clearTimeout(timeOut);
        }.bind(this);
        var onMouseOut = function () {
            timeOut = setTimeout(function () {
                this._hideTooltip();
            }.bind(this), 1000);
        }.bind(this);
        
        if (this.hasTooltip) {
            this._$element.hover(onMouseOver, onMouseOut);
            this._$tooltipContainer.hover(onMouseOver, onMouseOut);

            this.$tooltipContainer.find('.annotation-tooltip').hammer().on('tap', function (e) {
                var linkID = $(e.currentTarget).data('id');
                var link = this.data.links[linkID];
                if (link && link instanceof klynt.Link) {
                    link.execute();
                } else {
                    klynt.player.seekTo(this.time);
                }
            }.bind(this));

            this.$tooltipContainer.find('.annotation-tooltip:last').hover(function () {
                this.$tooltipContainer.find('.annotation-tooltip-arrow')
                    .addClass('klynt-primary-color-border-top annotation-tooltip-arrow-hover')
                    .removeClass('klynt-primary-color-border-top-70');
            }.bind(this), function () {
                this.$tooltipContainer.find('.annotation-tooltip-arrow')
                    .removeClass('klynt-primary-color-border-top annotation-tooltip-arrow-hover')
                    .addClass('klynt-primary-color-border-top-70');
            }.bind(this));
        }
    };

    klynt.AnnotationRenderer.prototype._showTooltip = function () {
        if (this.hasTooltip) {
            klynt.animation.to({
                duration: 0.5,
                properties: {
                    opacity: 1,
                    onStart: function (tween) {
                        TweenLite.set(tween.target, {
                            display: 'block'
                        });
                    },
                    onStartParams: ["{self}"]
                }
            }, this.$tooltipContainer);
            
            this._tooltipVisible = true;
        }
    };

    klynt.AnnotationRenderer.prototype._hideTooltip = function () {
        if (this.hasTooltip) {
            klynt.animation.to({
                duration: 0.5,
                properties: {
                    opacity: 0,
                    onComplete: function (tween) {
                        TweenLite.set(tween.target, {
                            display: 'none'
                        });
                    },
                    onCompleteParams: ["{self}"]
                }
            }, this.$tooltipContainer);

            this._tooltipVisible = false;
        }
    };

    klynt.AnnotationRenderer.prototype.setControlsHidden = function (hidden) {
        this._initPosition();
        if (hidden) {
            this.$element.stop(true, true).fadeOut(300);
        } else {
            this.$element.stop(true, false).fadeTo(300, 1);
        }
    };

    klynt.AnnotationRenderer.prototype.updateSize = function (ratio) {
        this.$element.css(this.getPositionCSS());

        if (this.hasTooltip) {
            var pointX = this.getXPosition() + this.$element.width() / 2;

            var minTooltipX = 4;
            var maxTooltipX = this.sequence.$element.width() - this.$tooltipContainer.width() - minTooltipX;
            var tooltipX = pointX - this.$tooltipContainer.width() / 2;
            tooltipX = Math.min(Math.max(minTooltipX, tooltipX), maxTooltipX);
            
            var arrowX = pointX - tooltipX - Math.abs(this.$tooltipArrow.width()) / 2;

            this.$tooltipContainer.css('left', tooltipX + 'px');
            this.$tooltipArrow.css('left', arrowX + 'px');
        }
    };

    klynt.AnnotationRenderer.prototype.getPositionCSS = function (data) {
        return {
            left: this.getXPosition() + 'px'
        };
    };

    klynt.AnnotationRenderer.prototype.getXPosition = function () {
        var startPosition = 32;
        var totalWidth = this.sequence.$element.width() - startPosition - 30;
        
        /*var $controlsBar = this.sequence.$element.find('.syncmaster-controls .mejs-time-total');
        if ($controlsBar && $controlsBar.length) {
            startPosition = $controlsBar.position().left + parseFloat($controlsBar.css('margin-left')) + parseFloat($controlsBar.css('padding-left'));
            totalWidth = $controlsBar.width();
        }*/

        return totalWidth * this.timePosition + startPosition - this.$element.width() / 2;
    }

    klynt.AnnotationRenderer.prototype.updateTime = function (time) {
        if (this.time <= time) {
            this._$annotationMarker.addClass('filled');
        } else {
            this._$annotationMarker.removeClass('filled');
        }
    };

    klynt.AnnotationRenderer.prototype._initTimesheets = function () {
        this._$element
            .attr('data-begin', 0)
            .attr('data-dur', this.sequence.sequence.duration+1)
            .attr('data-end', this.sequence.sequence.duration+1);

        this.hide();
    }

    klynt.AnnotationRenderer.prototype = klynt.utils.mergePrototypes(klynt.ElementRenderer, klynt.AnnotationRenderer);
})(window.klynt);