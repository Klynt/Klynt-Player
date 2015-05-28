/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of the animation module which manages the animations.
 * */

(function (klynt) {

    klynt.getModule('animation').expose(from, to, rendererTo, fromTo, killTweens);

    function from(animation, element) {
        var duration = animation.duration;
        var properties = animation.properties;

        return TweenLite.from(element, duration, properties);
    }

    function rendererTo(animation, renderer, childPosition) {
        var $element = renderer.$element;

        if (renderer instanceof klynt.ImageRenderer) {
            var $image = renderer.$image;

            var imageProperties = {
                duration: animation.duration,
                easing: animation.easing,
                properties: childPosition
            };

            klynt.animation.to(imageProperties, $image);
        }

        if (renderer instanceof klynt.VideoRenderer) {
            var $video = renderer.$mediaElement;

            var videoProperties = {
                duration: animation.duration,
                easing: animation.easing,
                properties: childPosition
            };

            klynt.animation.to(videoProperties, $video);
            klynt.animation.to(videoProperties, $video.parent().parent().find('.mejs-poster'));
        }

        klynt.animation.to(animation, $element);
    }

    function to(animation, element) {
        var properties = animation.properties;
        properties.ease = getEasing(properties.easing || animation.easing);

        return TweenLite.to(element, animation.duration, properties);
    }

    function fromTo(animation, element) {
        var fromProperties = animation.fromProperties;
        var toProperties = animation.toProperties;

        fromProperties.ease = getEasing(fromProperties.easing || animation.easing);
        toProperties.ease = getEasing(toProperties.easing || animation.easing);

        return TweenLite.fromTo(element, animation.duration, fromProperties, toProperties);
    }

    function killTweens(element) {
        if (element instanceof Array) {
            for (var i = 0; i < element.length; i++) {
                TweenLite.killTweensOf(element[i]);
            }
        } else {
            TweenLite.killTweensOf(element);
        }
    }

    function getEasing(entry) {
        return entry || 'Linear.easeNone';
    }

})(window.klynt);