/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.Annotation = function (element) {
        klynt.Element.call(this, {
            id : 'annotation_' + element.id
        });
        this._elements = [];
        this.addElement(element);
    };

    klynt.Annotation.prototype = {
        _elements: null,
        get elements() {
            return (this._elements || []).sort(function (a, b) {
                return b.zIndex - a.zIndex;
            });
        },

        _time: NaN,
        get time() {
            return this._time;
        }
    };

    klynt.Annotation.prototype.addElement = function(element) {
        this._elements.push(element);

        if (isNaN(this.time) || this.time > element.begin) {
            this._time = element.begin;
        }
    };

    klynt.Annotation.prototype = klynt.utils.mergePrototypes(klynt.Element, klynt.Annotation);
})(window.klynt);