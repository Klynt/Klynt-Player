/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

// Klynt namespace.
window.klynt = {};

// This utility function is used to generate and retrieve klynt modules by name.
// A klynt module is a javascript object that can expose some private methods and make them publicly available.
klynt.getModule = function (name, proto) {
    if (typeof klynt[name] !== "undefined") {
        return klynt[name];
    } else {
        return klynt[name] = createModule(proto);
    }

    function createModule(proto) {
        function Module() {}
        Module.prototype = proto || {};
        Module.prototype.expose = function () {
            var p = this;
            Array.prototype.forEach.call(arguments, function (argument) {
                if (typeof argument === "function") {
                    addFunctionToPrototype(argument);
                } else {
                    extendPrototype(argument);
                }
            });

            function addFunctionToPrototype(func) {
                p[func.name] = func;
            }

            function extendPrototype(properties) {
                Object.getOwnPropertyNames(properties).forEach(function addProperty(propertyName) {
                    var property = Object.getOwnPropertyDescriptor(properties, propertyName);
                    Object.defineProperty(p, propertyName, property);
                });
            }

            return p;
        };

        return new Module();
    }
};

// Initialises the splashscreen after loading necessary files.
klynt.loadSplashscreen = function () {
    var css = ['Player/css/player/splashscreen.css', 'Player/css/editor/splashscreen.css'];
    var js = ['Player/js/libs/snap.svg-min.js', 'Player/js/app/view/LoaderView.js', 'Player/js/app/Splashscreen.js', 'Player/js/libs/mustache.js'];
    LazyLoad.css(css, function () {
        LazyLoad.js(js, function () {
            klynt.splashscreen.init();
        });
    });
}

// Initialises the miniplayer after loading necessary files.
klynt.loadMiniPlayer = function () {
    var css = ['Player/css/player/mini-player.css', 'Player/css/editor/mini-player.css', 'Player/css/editor/fonts.css', ];
    var js = ['Player/js/libs/modernizr.custom.93084.js', 'Player/js/app/MiniPlayer.js', 'Player/js/libs/mustache.js', 'miniPlayerData.js', 'Player/js/app/view/miniPlayer/MiniPlayer.js', 'Player/js/app/Analytics.js', 'Player/js/app/Utils.js'];
    LazyLoad.css(css, function () {
        LazyLoad.js(js, function () {
            klynt.miniPlayer.init();
        });
    });
}

// Initialises the mobile miniplayer after loading necessary files.
klynt.loadMobileMiniPlayer = function () {
    var css = ['Player/css/player/mini-player.css', 'Player/css/editor/mini-player.css', 'Player/css/editor/fonts.css', ];
    var js = ['Player/js/app/MobileMiniPlayer.js', 'Player/js/app/Analytics.js'];
    
    LazyLoad.css(css, function () {
        LazyLoad.js(js, function () {
            klynt.mobileMiniPlayer.init();
        });
    });
}

// Launches the miniplayer or the splashscreen according to params set from the url.
$(function (klynt) {
    klynt.params = setParamsFromURL({
        miniPlayer: null, // null, 'horizontal' or 'vertical'
        widget: null, // null or id of a widget
        share: null, // null or true
        seek: null // null or time string (exp: '0.5')
    });

    if (isiPhoneSafari()) {
        LazyLoad.js(['miniPlayerData.js'], function () {
            if (klynt.miniPlayerData && klynt.miniPlayerData.redirectToMobileApp) {
                klynt.loadMobileMiniPlayer();
            } else {
                continueLoading();
            }
        });
    } else {
        continueLoading();
    }

    function continueLoading() {
        if (klynt.params.miniPlayer) {
            klynt.loadMiniPlayer();
        } else {
            klynt.loadSplashscreen();
        }
    }

    function isiPhoneSafari() {
        var iOSRegex = /(iPhone|iPod)/i;
        var inAppRegex = /(iPhone|iPod).*AppleWebKit(?!.*Safari)/i;
        var userAgent = navigator.userAgent.toLowerCase();

        return iOSRegex.test(userAgent) && !inAppRegex.test(userAgent);
    }

    function setParamsFromURL(params) {
        var paramsArray = window.location.search.substr(1, window.location.search.length).split('&');

        paramsArray.forEach(function readParam(paramString) {
            var nameLength = paramString.indexOf('=');
            var paramName = paramString.substring(0, nameLength);

            if (params.hasOwnProperty(paramName)) {
                params[paramName] = unescape(paramString.substring(nameLength + 1, paramString.length));
            }
        });

        return params;
    }
}(window.klynt));

// Adds the name property to the function prototype if it is not available (IE).
if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {
    Object.defineProperty(Function.prototype, 'name', {
        get: function () {
            var funcNameRegex = /function\s([^(]{1,})\(/;
            var results = (funcNameRegex).exec((this).toString());
            return (results && results.length > 1) ? results[1].trim() : "";
        },
        set: function (value) {}
    });
}