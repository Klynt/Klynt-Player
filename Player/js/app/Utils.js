/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of the utils module.
 */

(function (klynt) {
    klynt.getModule('utils').expose(merge, mergePrototypes, link, localURL, localDomain);

    function mergePrototypes(args) {
        return merge.apply(this, Array.prototype.map.call(arguments, getPrototype));
    }

    function getPrototype(constructor) {
        return constructor.prototype;
    }

    function merge(args) {
        var result = {};
        for (var i = 0, length = arguments.length; i < length; i++) {
            copyObject(arguments[i], result);
        }
        return result;
    }

    function copyObject(source, destination) {
        Object.getOwnPropertyNames(source).map(function (property) {
            copyProperty(source, property, destination);
        });
    }

    function copyProperty(source, property, destination) {
        Object.defineProperty(destination, property, Object.getOwnPropertyDescriptor(source, property));
    }

    function link(socialNetwork) {

        var url = encodeURIComponent(klynt.data.share.link || localURL());
        var twitterMessage = encodeURIComponent(klynt.data.share.shortMessage);

        klynt.analytics.trackEvent('share', socialNetwork);

        switch (socialNetwork) {
        case 'facebook':
            facebook();
            break;
        case 'twitter':
            twitter();
            break;
        case 'tumblr':
            tumblr();
            break;
        case 'googlePlus':
            googlePlus();
            break;
        case 'linkedIn':
            linkedIn();
            break;
        default:
            break;
        }

        function facebook() {
            var openLink = 'https://www.facebook.com/sharer/sharer.php?u=' + url;

            openWindow(openLink);
        }

        function twitter() {
            var openLink = 'http://twitter.com/intent/tweet?' +
                'original_referer=' + url +
                '&url=' + url +
                '&via=' + 'klynt_app' +
                '&text=' + twitterMessage;

            openWindow(openLink);
        }

        function tumblr() {
            var openLink = 'http://www.tumblr.com/share/link?url=' + url;

            openWindow(openLink);
        }

        function googlePlus() {
            var openLink = 'https://plus.google.com/share?url=' + url;

            openWindow(openLink);
        }

        function linkedIn() {
            var openLink = 'http://www.linkedin.com/shareArticle?url=' + url;

            openWindow(openLink);
        }

        function openWindow(url) {
            var width = 600;
            var height = 400;
            var top = (screen.height - height) / 3;
            var left = (screen.width - width) / 2;

            if (klynt.fullscreen.active) {
                window.open(url);
            } else {
                window.open(url, 'newwindow', 'width=500, height=400, top=' + top + ', left=' + left);
            }

        }
    }

    function localURL() {
        var url = document.location.origin + document.location.pathname;
        url = url.substring(0, url.lastIndexOf("/") + 1) + 'index.html';

        return url;
    }

    function localDomain() {
        var domain = document.location.origin + document.location.pathname;
        domain = domain.substring(0, domain.lastIndexOf("/") + 1);

        return domain;
    }
})(window.klynt);

(function transitionUtils(klynt) {
    klynt.getModule('utils').expose(getTransitionRenderer);

    function getTransitionRenderer(link) {
        var transition = link && link.transition;

        switch (transition && transition.type) {
        case klynt.SlideTransitionRenderer.DIRECTION.UP:
        case klynt.SlideTransitionRenderer.DIRECTION.DOWN:
        case klynt.SlideTransitionRenderer.DIRECTION.LEFT:
        case klynt.SlideTransitionRenderer.DIRECTION.RIGHT:
            return new klynt.SlideTransitionRenderer(transition);
        case 'pop':
            return new klynt.PopTransitionRenderer(transition);
        case 'flip':
            return new klynt.FlipTransitionRenderer(transition);
        case 'none':
            return new klynt.NoTransitionRenderer(transition);
        case 'touch':
            return new klynt.TouchTransitionRenderer(transition);
        default:
            return new klynt.FadeTransitionRenderer(transition);
        }
    }
})(window.klynt);

$(function() {
    //FastClick.attach(document.body);
});

(function browserUtils(klynt) {
    var userAgent = navigator.userAgent.toLowerCase();

    klynt.getModule('utils').expose({
        browser: {
            local: document.location.protocol === 'file:',
            IE: /msie|trident/.test(userAgent),
            iOS: /ip(hone|od|ad)/.test(userAgent),
            chrome: /chrome/.test(userAgent),
            safari: /safari/.test(userAgent) && !/chrome/.test(userAgent),
            android: /android/.test(userAgent),
            webkit: isWebkit(),
            touch: Modernizr.touch ? 'touchstart' : 'click'
        }
    });

    klynt.utils.browser.mouseDetected = false;
    function onMouseMove(e) {
        $(document).off('mousemove', onMouseMove);
        klynt.utils.browser.mouseDetected = true;
    }
    $(document).on('mousemove', onMouseMove);

    function isWebkit() {
        var documentStyles = window.getComputedStyle(document.documentElement, '');
        var stylesString = Array.prototype.slice.call(documentStyles).join('');
        return stylesString.indexOf('-webkit-') != -1;
    }
})(window.klynt);

(function parsingUtils(klynt) {
    klynt.getModule('utils').expose(getTimeFromString, getStringFromTime);

    function getTimeFromString(timeString) {
        var timeParts = timeString ? timeString.split(':') : [];
        var time = 0;
        while (timeParts.length) {
            time *= 60;
            time += parseFloat(timeParts.shift());
        }
        return time;
    }

    function getStringFromTime(timeInSeconds) {
        var min = Math.floor(timeInSeconds / 60);
        var sec = timeInSeconds - 60 * min;
        if (sec < 10) {
            return min + ":0" + sec;
        } else {
            return min + ":" + sec;
        }

    }
})(window.klynt);

(function miscUtils(klynt) {
    klynt.getModule('utils').expose(callLater);

    function callLater(func, delay) {
        setTimeout(func, delay || 0);
    }
})(window.klynt);

(function mediaUtils(klynt) {
    klynt.getModule('utils').expose(getVideoDataFromAPI, getVideosDataFromAPI, getCachedVideoData, replaceSource);

    var apiVideos = {};

    function getVideoDataFromAPI(video, callback) {
        var cacheKey = video.platform + '-' + video.externalId;
        var cachedVideo = apiVideos[cacheKey];

        if (cachedVideo) {
            if (callback) {
                callback(selectURL(cachedVideo));
            }
        } else {
            var url = klynt.player.remoteVideosAPIURL;
            $.ajax({
                url: url,
                type: "GET",
                crossDomain: true,
                dataType: 'json',
                data: {
                    video_id: video.externalId,
                    platform: video.platform
                }
            }).done(function (data) {
                apiVideos[cacheKey] = data;
                if (callback) {
                    callback(selectURL(data));
                }
            }).error(function (e) {
                //console.log(e.responseText);
            });
        }
    }

    function getVideosDataFromAPI(videos) {
        (videos || []).forEach(function (video) {
            getVideoDataFromAPI(video);
        });
    }

    function getCachedVideoData(video) {
        var cacheKey = video.platform + '-' + video.externalId;
        var cachedVideo = apiVideos[cacheKey];
        return cachedVideo ? selectURL(cachedVideo) : null;
    }

    function selectURL(data) {
        var bandwidth = 0;
        if (klynt.bandwidth) {
            bandwidth = Math.round(klynt.bandwidth.bandwidth * 0.8);
        } else if (klynt.data.advanced.remoteVideosAPILocalBitrate == 'best') {
            bandwidth = Number.MAX_VALUE;
        } else if (!isNaN(klynt.data.advanced.remoteVideosAPILocalBitrate)) {
            bandwidth = parseInt(klynt.data.advanced.remoteVideosAPILocalBitrate);
        }
        var maxBandwidth = 0;
        var minBandwidth = Number.MAX_VALUE;
        var selectedRate = 0;
        var rates = [];
        for (rate in data.urls) {
            rate = parseFloat(rate);
            rates.push(rate);

            minBandwidth = Math.min(minBandwidth, rate);
            maxBandwidth = Math.max(maxBandwidth, rate);
            if (rate < bandwidth) {
                selectedRate = Math.max(selectedRate, rate);
            }
        }

        if (!selectedRate) {
            selectedRate = minBandwidth;
        }
        /*
        console.log("\nVideo: ", data.name);
        console.log(klynt.bandwidth ? "Bandwidth(80%): " : "Local Bandwidth: ", bandwidth);
        console.log("Rates: ", rates);
        console.log("Selected rate: ", selectedRate);
        */
        return {
            rate: selectedRate,
            url: data.urls[selectedRate]
        };
    }

    function replaceSource(source, baseURL, defaultBaseURL) {
        if (source && baseURL && baseURL != defaultBaseURL) {
            var regrex = new RegExp('^' + defaultBaseURL);
            if ($.isArray(source)) {
                return source.map(function (item) {
                    return item ? {
                        src: item.src ? item.src.replace(regrex, baseURL) : item.src,
                        type: item.type
                    } : null;
                });
            } else {
                return source.replace(regrex, baseURL);
            }
        } else {
            return source;
        }
    }
})(window.klynt);