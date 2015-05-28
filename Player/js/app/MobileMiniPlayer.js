/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
	klynt.getModule('mobileMiniPlayer').expose(init);
	
	function init() {
		$('body').append(
			'<div class="mobile-miniplayer">' +
			'	<div class="mobile-miniplayer-poster"></div>' +
			'	<div class="mobile-miniplayer-button"></div>' +
			'</div>'
		);
		$('.mobile-miniplayer-poster').css('background-image', 'url(' + klynt.miniPlayerData.thumbnail + ')');

		$('.mobile-miniplayer-button').click(function (e) {
			var referenceTime = new Date().getTime();

			var iFrame = document.createElement('iframe');
	    	iFrame.style.display = "none";
	    	$(iFrame).appendTo('body');
        	iFrame.src = 'klynt://open?' + localURL();

			setTimeout(function() {
				$(iFrame).remove();
				var hidden = document.webkitHidden || document.hidden;
		        if (!hidden && Math.abs(new Date().getTime() - referenceTime) < 100) {
		        	var url = 'http://itunes.apple.com/app/id982539855';
		        	try {
						window.top.location.href = url;
					} catch (e) {
						window.location.href = url;
					}
		        }
		    }, 25);
		});

		klynt.analytics.trackPageView('mobileminiplayer');
	}

	function localURL() {
	    var url = document.location.origin + document.location.pathname;
	    url = url.substring(0, url.lastIndexOf("/") + 1) + 'index.html';
	    return url;
    }
})(window.klynt);