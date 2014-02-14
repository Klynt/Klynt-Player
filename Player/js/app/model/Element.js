/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.Element = function (data) {
        this._data = data;
        this._begin = klynt.utils.getTimeFromString(this._data.databegin);
        this._end = klynt.utils.getTimeFromString(this._data.dataend);
        this._duration = klynt.utils.getTimeFromString(this._data.duration);

        this._link = data.link ? new klynt.Link(data.link) : null;
        this._action = data.action ? new klynt.Action(data.action) : null;
        this._style = data.style ? new klynt.Style(data.style) : null;
        this._transitionIn = data.transitionIn ? new klynt.ElementTransition(data.transitionIn) : null;
        this._transitionOut = data.transitionOut ? new klynt.ElementTransition(data.transitionOut) : null;
    };

    klynt.Element.prototype = {
        _data: null,

        get id() {
            return this._data.id;
        },

        get left() {
            return this._data.left;
        },

        get top() {
            return this._data.top;
        },

        get width() {
            return this._data.width;
        },

        get height() {
            return this._data.height;
        },

        get zIndex() {
            return this._data.zIndex;
        },

        _begin: 0,
        get begin() {
            return this._begin;
        },

        _end: 0,
        get end() {
            return this._end;
        },

        _duration: 0,
        get duration() {
            return this._duration;
        },

        _transitionIn: null,
        get transitionIn() {
            return this._transitionIn;
        },

        _transitionOut: null,
        get transitionOut() {
            return this._transitionOut;
        },

        _style: null,
        get style() {
            return this._style;
        },

        _link: null,
        get link() {
            return this._link;
        },

        _action: null,
        get action() {
            return this._action;
        }
    }
})(window.klynt);