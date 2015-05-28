/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of the menu module which manages and allows the interaction with the menu and
 * the different widgets that it contains.
 * */

(function (klynt) {
    var data = klynt.data.menu;
    data.displaySearch = data.searchWidget !== null;
    var $element;
    var widgets = [];
    var indexFooter;
    var label = '';
    var searchTest = false;
    var dimensions = {};
    var isOpen = false;
    var $items;
    var $bar;
    var $barPhantom;
    var $barItems;
    var $itemsContainer;
    var $background;
    var currentItemIndex = 0;
    var mapIndex;
    var minWidth = 970;
    var fullWidth = screen.width;
    var ratio = fullWidth / minWidth;
    var template =
        '{{> bar}}' +
        '{{#displayBackgroundImage}}<div class="menu-background"></div>{{/displayBackgroundImage}}' +
        '{{^displayBackgroundImage}}<div class="menu-texture"></div>{{/displayBackgroundImage}}' +
        '<div class="menu-items"></div>';
    var templatePartials = {
        'bar': '<div class="menu-bar-phantom"></div>' +
            '<div class="menu-bar">' +
            '   <span class="menu-bar-btn menu-btn-close klynt-secondary-color klynt-secondary-color-bg-5 klynt-transition-20"><i class="icon icon-close-top"></i></span>' +
            '   <span class="menu-bar-item klynt-secondary-color klynt-tertiary-color-border{{^displaySearch}} lag{{/displaySearch}}"></span>' +
            '   {{#displaySearch}}<span class="menu-bar-btn menu-btn-search klynt-secondary-color klynt-secondary-color-bg-5 klynt-tertiary-color-border"><i class="icon icon-search"></i></span>{{/displaySearch}}' +
            '</div>'
    };
    var accessors = {
        get $itemsContainer() {
            return $itemsContainer;
        },
        get isOpen() {
            return isOpen;
        }
    };
    klynt.getModule('menu', accessors).expose(resetDimensions, toggle, open, close, init, initWidget, renderMaps, searchButton);

    function init() {
        $element = $('<div>')
            .attr('id', 'menu')
            .addClass('menu')
            .addClass('klynt-primary-color-bg')
            .prependTo(klynt.player.$element)
            .html(Mustache.render(template, data, templatePartials))
            .css('paddingTop', data.offset_sequence)
            .hammer()
            .on('click', '.menu-btn-close', close)
            .on('click', '.menu-btn-search', search);
        $bar = $element.find('.menu-bar');
        $barPhantom = $element.find('.menu-bar-phantom');
        $background = $element.find('.menu-background');
        $buttonSearch = $element.find('.menu-btn-search');
        $itemsContainer = $element.find('.menu-items');
        resetDimensions();
    }

    function resetDimensions() {
        if (klynt.fullscreen.active) {
            dimensions.height = klynt.player.scaleToFullWindow ? $(window).height() - klynt.footer.height : klynt.sequenceContainer.height;
            dimensions.width = klynt.player.scaleToFullWindow ? $(window).width() : klynt.sequenceContainer.width;
        } else {
            dimensions.height = klynt.player.scaleToFullWindow ? $(window).height() - klynt.footer.height : klynt.sequenceContainer.unscaledHeight;
            dimensions.width = klynt.player.scaleToFullWindow ? $(window).width() : klynt.sequenceContainer.unscaledWidth;
        }
        dimensions.itemsContainer = {
            height: dimensions.height - $bar.height() - data.offset_sequence,
            width: dimensions.width
        };
        dimensions.items = {
            height: dimensions.itemsContainer.height,
            width: dimensions.width
        };
        $element.css({
            height: dimensions.height + 'px'
        });
        $background.css({
            height: dimensions.itemsContainer.height + 'px',
            width: dimensions.width + 'px'
        });
        $itemsContainer.css({
            height: dimensions.itemsContainer.height + 'px',
            width: dimensions.itemsContainer.width + 'px'
        });
        $barPhantom.css({
            height: data.offset_sequence + 'px',
            marginTop: '-' + data.offset_sequence + 'px',
            width: dimensions.width + 'px'
        });
        if (isOpen) {
            setSequenceContainerOffset(data.offset_sequence - dimensions.height, true);
        }
    }

    function toggle() {
        isOpen ? close() : open();
    }

    function open() {
        if (!isOpen) {
            isOpen = true;
            klynt.player.pause(true);
            resetDimensions();
            klynt.player.$element.trigger('open.menu');
        }
    }

    function close() {
        if (isOpen) {
            isOpen = false;
            setSequenceContainerOffset(0, true);
            setTimeout(function () {
                emptyWidgetContainer();
                klynt.player.play(true);
            }, 500);
            klynt.player.$element.trigger('close.menu');
            widgets = [];
            indexFooter = -1;
            klynt.footer.enable();
            searchTest = false;
        }
    }

    function setSequenceContainerOffset(px) {
        var $sequenceContainer = klynt.sequenceContainer.$element;
        var animationParams = {
            duration: 0.5
        }

        if (Modernizr.csstransforms3d) {
            animationParams.properties = {
                transform: "translate3d(0," + px + "px,0)"
            }
        } else if (Modernizr.csstransforms) {
            animationParams.properties = {
                transform: "translate(0," + px + "px)"
            }
        } else {
            animationParams.properties = {
                top: px + "px"
            }
        }

        klynt.animation.to(animationParams, $sequenceContainer);

        $barPhantom.toggle(isOpen);
    }

    function renderMaps() {
        for (var i = 0; i < widgets.length; i++) {
            var widget = widgets[i];
            if (widget.type == 'map') {
                widget.render();
            }
        }
    }

    function initWidget(id, index) {
        var oldWidget = widgets[0];
        var widget = getWidgetWithId(id);

        if (searchTest) {
            changeWidget(widget, index)
            klynt.footer.enable();
            klynt.footer.activate(index);
            klynt.analytics.trackPageView('widget_' + widget.type + '_' + widget._data.label);
        } else {
            if (!isOpen) {
                addWidget(widget, index);
                if (index != -1) {
                    klynt.footer.activate(index);
                } else {
                    klynt.footer.activateId(id);
                }
                klynt.analytics.trackPageView('widget_' + widget.type + '_' + widget._data.label);
            } else  if (oldWidget.id == id) {
                klynt.menu.close();
            } else {
                changeWidget(widget, index)
                klynt.footer.enable();
                if (index != -1) {
                    klynt.footer.activate(index);
                } else {
                    klynt.footer.activateId(id);
                }
                klynt.analytics.trackPageView('widget_' + widget.type + '_' + widget._data.label);
            }
        }
    }

    function getWidgetWithId(id) {
        var widgets = data.widgets;
        var widget;

        for (var key in widgets) {
            if (widgets[key].id == id) {
                widget = widgets[key];
                label = widget.label;
            }
        }
        if (!widget) {
            return null
        };

        switch (widget.type) {
        case 'search':
            return new klynt.Search(widget);
        case 'credits':
            return new klynt.Credits(widget);
        case 'index':
            return new klynt.Index(widget);
        case 'map':
            return new klynt.Map(widget);
        case 'mindmap':
            return new klynt.Mindmap(widget);
        default:
            return null;
        }
    }

    function addWidget(widget, index) {
        indexFooter = index;
        klynt.menu.open();
        widgets.push(widget);
        widget.$element.css({
            position: 'absolute',
            top: '0px',
            left: '0px'
        });
        $itemsContainer.append(widget.$element);
        widget.render();
        $element.find('.menu-bar-item').text(label);
        setTimeout(function () {
            $('.nano-container').nanoScroller({
                paneClass: 'nano-pane',
                contentClass: 'nano-content'
            });
        }, 100);
    }

    function changeWidget(widget, index) {
        if (searchTest) {
            widgetTransition(widget, 'left');
        } else {
            if (index < indexFooter) {
                widgetTransition(widget, 'left');
            } else {
                widgetTransition(widget, 'right');
            }
        }

        indexFooter = index;
        widgets = [];
        widgets.push(widget);
        klynt.footer.enable('button');
        searchButton(false);
        searchTest = false;
        $('.menu-bar-item').removeClass('menu-bar-border-none');
    }

    function widgetTransition(widget, transition) {
        var width, transition;
        var timer = 750;
        var width = isOpen ? fullWidth : minWidth;
        var newLabel = widget._data.label;
        var direction = transition == 'left' ? [-1 * width, width] : [width, -1 * width];

        widget.$element.css({
            position: 'absolute',
            top: '0px',
            left: direction[0] + 'px'
        });
        $itemsContainer.append(widget.$element);
        widget.render();
        setTimeout(function () {
            $('.nano-container').nanoScroller({
                paneClass: 'nano-pane',
                contentClass: 'nano-content'
            });
        }, 100);

        var newWidgetparamsAnimation = {
            duration: timer / 1000,
            properties: {
                left: '0px'
            }
        }

        klynt.animation.to(newWidgetparamsAnimation, widget.$element);

        var oldWidgetparamsAnimation = {
            duration: timer / 1000,
            properties: {
                left: direction[1] + 'px',
                onComplete: function () {
                    $(this.target).remove();

                    if (!searchTest) {
                        $element.find('.menu-bar-item').text(newLabel);
                    } else {
                        $element.find('.menu-bar-item').text('SEARCH');
                    }

                    if (searchButton) {
                        $('input[name="search"]').focus();
                    }
                }
            }
        }

        klynt.animation.to(oldWidgetparamsAnimation, widgets[0].$element);
    }

    function emptyWidgetContainer() {
        $itemsContainer.empty();
    }
    var oldWidgetSearch;
    var oldLabel;

    function search() {
        if (searchTest) {
            changeWidget(oldWidgetSearch, klynt.footer.index());
            searchTest = false;
            searchButton(false);
            klynt.footer.enable();
            klynt.footer.activate(klynt.footer.index());

        } else {
            var widget = getWidgetWithId(data.searchWidget);
            oldWidgetSearch = widgets[0];
            oldLabel = oldWidgetSearch._data.label;
            searchTest = true;
            widgetTransition(widget, 'right');
            indexFooter = -1;
            widgets = [widget];
            searchButton(true);
            klynt.analytics.trackPageView('widget_search');
        }
    }

    function searchButton(value) {
        if (value) {
            $buttonSearch.addClass('menu-btn-search-active');
            $buttonSearch.find('.icon').removeClass('icon-search').addClass('icon-left');
        } else {
            $buttonSearch.removeClass('menu-btn-search-active');
            $buttonSearch.find('.icon').removeClass('icon-left').addClass('icon-search');
        }
    }
})(window.klynt);