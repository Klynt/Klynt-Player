/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.ScoutRenderer = function (begin, $parent, callback) {
        this._begin = begin;
        this._$parent = $parent;
        this._callback = callback;
        this._init();
    };

    klynt.ScoutRenderer.prototype = {
        _begin: null,
        _$parent: null,
        _callback: null
    };

    klynt.ScoutRenderer.prototype._init = function () {
        var $element = $('<div/>')
            .attr('data-begin', this._begin)
            .attr('data-dur', 1)
            .attr('data-end', this._begin + 1)
            .appendTo(this._$parent);

        $element[0].addEventListener('begin', this._callback);
    };
})(window.klynt);