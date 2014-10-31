/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.Interaction = function (data) {
        this._data = data;
    };

    klynt.Interaction.prototype = {
        _data: null,

        get name() {
            return this._data.name;
        },

        get type() {
            if (forceIntoAction.indexOf(this._data.name) != -1) {
                return 'action';
            } else {
                return this._data.type;
            }
        },

        get target() {
            return this._data.target;
        },

        get delay() {
            return this._data.delay;
        },

        get duration() {
            return this._data.duration;
        },

        get easing() {
            return this._data.easing;
        },

        get reversible() {
            return this._data.reversible || this.isDispatch;
        },

        get value() {
            return this._data.value;
        },

        get isDispatch() {
            return this.type == 'dispatch';
        },

        get syncronous() {
            return this.isDispatch || this.name.toLowerCase().indexOf('fullscreen') != -1;
        }
    };

    var forceIntoAction = [
        'zIndex',
        'bringToFront',
        'bringToBack',
        'fitToWindow',
        'scale',
        'rotation'
    ];
})(window.klynt);