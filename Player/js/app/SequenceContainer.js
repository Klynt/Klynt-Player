/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of the sequence container module which manages the div that contains the
 * sequences renderers.
 * */

(function sequenceContainer(klynt) {
    var $element;
    var $fullscreenWrapper;
    var sequenceScale = 1;
    var watermark = klynt.data.watermark;

    var accessors = {
        get $element() {
            return $element;
        },

        get $fullscreenWrapper() {
            return $fullscreenWrapper;
        },

        get $watermark() {
            return $element.find('.watermark');
        },

        get sequenceScale() {
            return sequenceScale;
        },

        get unscaledWidth() {
            return klynt.data.general.width;
        },

        get unscaledHeight() {
            return klynt.data.general.height;
        },

        get width() {
            return this.unscaledWidth * this.sequenceScale;
        },

        get height() {
            return this.unscaledHeight * this.sequenceScale;
        }
    };

    klynt.getModule('sequenceContainer')
        .expose(accessors)
        .expose(init)
        .expose(resetDimensions, setDimensions);

    function init() {
        $element = $('<div>')
            .attr('id', 'sequence-container')
            .addClass('sequence-container')
            .css('height', this.height)
            .appendTo(klynt.player.$element);

        $fullscreenWrapper = $('<div>')
            .attr('id', 'fullscreen-wrapper')
            .addClass('fullscreen-wrapper')
            .css('width', this.width)
            .css('height', this.height)
            .appendTo($element);

        resetDimensions();

        if (watermark) {
            $element.append('<img src="Player/css/editor/img/watermark.png" class="watermark watermark-' + watermark.position + '"></img>');
            $element.on(Modernizr.touch ? 'touchstart' : 'click', '.watermark', actionWatermark);
        }
    }

    function resetDimensions() {
        sequenceScale = 1;
        if ($element) {
            $element
                .css('width', this.width)
                .css('height', this.height);
        }
        if ($fullscreenWrapper) {
            $fullscreenWrapper
                .css('transform', 'scale(1)')
                .css('transform-origin', null);
        }
    }

    function setDimensions(newWidth, newHeight) {
        sequenceScale = Math.min(newWidth / this.unscaledWidth, newHeight / this.unscaledHeight);

        this.$element
            .css('width', this.width)
            .css('height', this.height);

        this.$fullscreenWrapper
            .css('transform', 'scale(' + sequenceScale + ')')
            .css('transform-origin', '0 0 0');
    }

    function actionWatermark() {

        switch (watermark.action.type) {
        case 'openURL':
            window.open(watermark.action.target);
            break;
        case 'openOverlay':
            klynt.sequenceManager.open(watermark.action);
            break;
        case 'openSequence':
            klynt.sequenceManager.open(watermark.action);
            break;
        case 'openWidget':
            klynt.menu.initWidget(watermark.action.target, -1);
            break;
        default:
            break;
        }
    }
})(window.klynt);

(function sequenceContainerControl(klynt) {
    var currentSequenceRenderer;
    var currentOverlayRenderer;

    var accessors = {
        get currentSequenceRenderer() {
            return currentSequenceRenderer;
        },
        set currentSequenceRenderer(value) {
            currentSequenceRenderer = value;
        },

        get currentOverlayRenderer() {
            return currentOverlayRenderer;
        },
        set currentOverlayRenderer(value) {
            currentOverlayRenderer = value;
        },

        get currentRenderer() {
            return currentOverlayRenderer || currentSequenceRenderer;
        }
    };

    klynt.getModule('sequenceContainer').expose(accessors);
})(window.klynt);

(function sequenceContainerFactory(klynt) {
    klynt.getModule('sequenceContainer').expose(addSequence, addOverlay);

    function addSequence(sequence) {
        return new klynt.SequenceRenderer(sequence, klynt.sequenceContainer.$fullscreenWrapper);
    }

    function addOverlay(sequence, params) {
        return new klynt.OverlayRenderer(sequence, klynt.sequenceContainer.$fullscreenWrapper, params);
    }
})(window.klynt);