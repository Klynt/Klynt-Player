/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.Credits = function (data) {

        this._data = data.params;
        this._data.id = data.id;
        this._data.aboutColumnTextLines = splitLines(this._data.aboutColumnText);
        this._data.creditsColumnTextLines = splitLines(this._data.creditsColumnText);
        this._data.type = data.type;
        this._data.label = data.label;

        this._template =
            '<div class="credits-header">' +
            '   <h1 class="klynt-secondary-color">{{title}}</h1>' +
            '   <h2>{{subtitle}}</h2>' +
            '</div>' +
            '<div class="credits-content">' +
            '   <div class="credits-content-about">' +
            '       <h3>{{aboutColumnTitle}}</h3>' +
            '       <div class="nano-container credits-scroll"><p class="nano-content">{{#aboutColumnTextLines}}{{line}}<br>{{/aboutColumnTextLines}}</p></div>' +
            '   </div>' +
            '   <div class="credits-content-separator klynt-secondary-color-border-80"></div>' +
            '   <div class="credits-content-crew">' +
            '       <h3>{{creditsColumnTitle}}</h3>' +
            '       <div class="nano-container credits-scroll"><p class="nano-content">{{#creditsColumnTextLines}}{{line}}<br>{{/creditsColumnTextLines}}</p></div>' +
            '   </div>' +
            '</div>';

        klynt.MenuItem.call(this, this._data);
    };

    klynt.Credits.prototype = {};

    klynt.Credits.prototype.init = function () {
        klynt.MenuItem.prototype.init.call(this);
        this._$element.addClass('menu-credits klynt-secondary-color-80');
    };

    function splitLines(string) {
        return (string || '').split(/[\r\n]/).map(function (line) {
            return {
                line: line
            };
        });
    }

    klynt.Credits.prototype = klynt.utils.mergePrototypes(klynt.MenuItem, klynt.Credits);
})(window.klynt);