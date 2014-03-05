/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the base widgets class MenuItem.
 * */

(function (klynt) {
    klynt.MenuItem = function (data) {
        this._data = data;
        this.init();
        //this.render();
    };

    // MenuItem prototype with the list of publicly available accessors and private properties.
    klynt.MenuItem.prototype = {
        // widget's data.
        _data: null,

        // Widget's Mustache template.
        _template: 'Menu Item',

        // Widget's Mustache template partials.
        _template_partials: {},

        // Widget's jQuery element.
        _$element: null,
        get $element() {
            return this._$element;
        },

        // Widget's id.
        get id() {
            return this._data.id;
        },

        // Widget's type.
        get type() {
            return this._data.type;
        }
    };

    // Initialises the widget div.
    klynt.MenuItem.prototype.init = function () {
        this._$element = $('<div>')
            .addClass('menu-item');
    };

    // Renders the Mustache template and partials.
    klynt.MenuItem.prototype.render = function () {
        this._$element.html(Mustache.render(this._template, this._data, this._template_partials));
    };

    // Updates the view.
    klynt.MenuItem.prototype.update = function () {
        this.render();
    };
})(window.klynt);