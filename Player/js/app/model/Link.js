/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.Link = function (data) {
        this._data = data;
        this._transition = new klynt.Transition(data.transition);
    };

    klynt.Link.prototype = {
        _data: null,

        get type() {
            return this._data.linkType;
        },

        get tooltip() {
            return this._data.tooltip;
        },

        // Link to sequence and overlay
        get target() {
            return klynt.sequences.find(this._data.targetSequence);
        },

        _transition: null,
        get transition() {
            return this._transition;
        },

        get automaticTransition() {
            return !!this._data.automaticTransition;
        },

        // Link to overlay
        get overlay() {
            return !!this._data.overlay;
        },

        get pauseParent() {
            return !!this._data.pauseParent;
        },

        get automaticClose() {
            return !!this._data.automaticClose;
        },

        get closeButton() {
            return !!this._data.closeButton;
        },

        // Link to url
        get targetURL() {
            return this._data.targetURL;
        },

        get window() {
            return this._data.window;
        },

        // Link to widget
        get widget() {
            return this._data.widget;
        }
    };

    klynt.Link.prototype.execute = function () {
        switch (this.type) {
        case 'linkToURL':
            this._openURL();
            break;
        case 'linkToSequence':
            this._openSequence();
            break;
        case 'linkToWidget':
            this._openWidget();
            break;
        }
    };

    klynt.Link.prototype._openURL = function () {
        if (this.targetURL) {
            window.open(this.targetURL, this.window);
        }
    };

    klynt.Link.prototype._openSequence = function () {
        klynt.sequenceManager.open(this);
    };

    klynt.Link.prototype._openWidget = function () {
        klynt.menu.initWidget(this.widget);
    };
})(window.klynt);