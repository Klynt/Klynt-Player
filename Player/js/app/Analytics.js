/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of the google analytics module.
 * */

(function (klynt) {
    klynt.getModule('analytics').expose(init, trackPageView, trackEvent, handleSequenceEvent);

    var analyticsKey = null;
    window._gaq = window._gaq || [];

    function init() {

        if (analyticsKey == null) {

            analyticsKey = klynt.miniPlayerData ? klynt.miniPlayerData.analyticsKey : klynt.data.general.analyticsKey;

            if (analyticsKey && !klynt.utils.browser.local) {
                initAnalytics();
                addAnalyticsScript();
            }
        }
    }

    function initAnalytics() {
        _gaq.push(['_require', 'inpage_linkid', '//www.google-analytics.com/plugins/ga/inpage_linkid.js']);
        _gaq.push(['_setAccount', analyticsKey]);
        _gaq.push(['_setDomainName', 'auto']);
        _gaq.push(['_setAllowLinker', true]);
        _gaq.push(['_setAllowAnchor', true]);
    }

    function addAnalyticsScript() {
        var ga = document.createElement('script');

        ga.type = 'text/javascript';
        ga.async = true;
        var isHTTPS = document.location.protocol == 'https:';
        ga.src = (isHTTPS ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';

        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    }

    function handleSequenceEvent(event, sequence) {
        if (event.type === 'open') {
            trackPageView(sequence.alias);
        }
    }

    function handleMenuEvent(event) {
        if (event.type === 'open') {
            trackPageView('#Menu');
        }
    }

    function trackPageView(page) {
        if (_gaq) {
            _gaq.push(['_trackPageview', document.location.pathname + '_' + encodeURIComponent(page)]);
        }
    }

    function trackEvent(category, action, opt) {
        if (_gaq) {
            _gaq.push(['_trackEvent', category, action]);
        }
    }

})(window.klynt);