/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */

var _gaq = _gaq || [];

(function () {
	var analyticsKey = data.general.analyticsKey;
	var isLocal = document.location.protocol == 'file:';
	if (analyticsKey && !isLocal) {
		initAnalytics();
		addAnalyticsScript();
	}
	
	function initAnalytics() {
		_gaq.push(['_require', 'inpage_linkid', '//www.google-analytics.com/plugins/ga/inpage_linkid.js']);
		_gaq.push(['_setAccount', data.general.analyticsKey]);
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
})();

function trackPageView(page) {
	if (_gaq) {
		_gaq.push(['_trackPageview', document.location.pathname + '#' + page]);
	}
}
