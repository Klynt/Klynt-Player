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
        this._style = data.style ? new klynt.Style(data.style) : null;
        this._transitionIn = data.transitionIn ? new klynt.ElementTransition(data.transitionIn) : null;
        this._transitionOut = data.transitionOut ? new klynt.ElementTransition(data.transitionOut) : null;

        this._rollOver = data.rollOver ? data.rollOver.map(createInteraction) : null;
        this._rollOut = data.rollOut ? data.rollOut.map(createInteraction) : null;
        this._click = data.click ? data.click.map(createInteraction) : null;
    };

    klynt.Element.prototype = {
        _data: null,

        get id() {
            return this._data.id;
        },

        get fitToWindow() {
            return this._data.fitToWindow;
        },

        get ignoreMouseEvents() {
            return this._data.ignoreMouseEvents;
        },

        get scales() {
            return this._data.scales;
        },

        get left() {
            return this._data.left !== undefined ? parseInt(this._data.left, 10) : undefined;
        },

        get right() {
            return this._data.right !== undefined ? parseInt(this._data.right, 10) : undefined;
        },

        get centerX() {
            return this._data.centerX !== undefined ? parseInt(this._data.centerX, 10) : undefined;
        },

        get width() {
            return this._data.width !== undefined ? parseInt(this._data.width, 10) : undefined;
        },

        get top() {
            return this._data.top !== undefined ? parseInt(this._data.top, 10) : undefined;
        },

        get bottom() {
            return this._data.bottom !== undefined ? parseInt(this._data.bottom, 10) : undefined;
        },

        get centerY() {
            return this._data.centerY !== undefined ? parseInt(this._data.centerY, 10) : undefined;
        },

        get height() {
            return this._data.height !== undefined ? parseInt(this._data.height, 10) : undefined;
        },

        get zIndex() {
            return this._data.zIndex;
        },

        get mediaWidth() {
            return this._data.mediaWidth || undefined;
        },

        get mediaHeight() {
            return this._data.mediaHeight || undefined;
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

        _rollOver: null,
        get rollOver() {
            return this._rollOver;
        },

        _rollOut: null,
        get rollOut() {
            return this._rollOut;
        },

        _click: null,
        get click() {
            return this._click;
        },

        get classNames() {
            return this._data.classNames || null;
        },

        get attributes() {
            return this._data.attributes || null;
        },

        get annotation() {
            return this._data.annotation;
        }
    }

    klynt.Element.prototype.getLinkedSequences = function () {
        var sequences = [];

        var linkTarget = this.link && this.link.target;
        if (linkTarget) {
            sequences.push(linkTarget);
        }

        return sequences;
    }

    function createInteraction(data) {
        return new klynt.Interaction(data);
    }
})(window.klynt);