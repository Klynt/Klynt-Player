/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
var TRANSITION = (function () {
	var TRANSITION = {};

	TRANSITION.applyToSequence = function (frame, transitionType, callback) {
		var duration = 1000;

		switch (transitionType) {
			case 'fade':
				fadeIn(frame, 1, duration, callback);
				break;
			case 'slideLeft':
				slideHorizontally(frame, PLAYER.width, 0, duration, callback);
				break;
			case 'slideRight':
				slideHorizontally(frame, -PLAYER.width, 0, duration, callback);
				break;
			case 'slideUp':
				slideVertically(frame, PLAYER.height, 0, duration, callback);
				break;
			case 'slideDown':
				slideVertically(frame, -PLAYER.height, 0, duration, callback);
				break;
			case 'pop':
				pop(frame, duration, callback);
				break;
			case 'flip':
				flip(frame, duration, callback);
				break;
			default:
				if (callback) {
					callback();
				}
		}
	};

	return TRANSITION;

	function fadeIn(element, opacity, duration, callback) {
		$(element)
			.css({opacity:0})
			.fadeTo(duration, opacity, null, callback);
	}

	function slideHorizontally(element, fromPos, toPos, duration, callback) {
		$(element)
			.css({left:fromPos + "px"})
			.animate({left:toPos + "px"}, duration, null, callback);
	}

	function slideVertically(element, fromPos, toPos, duration, callback) {
		$(element)
			.css({top:fromPos + "px"})
			.animate({top:toPos + "px"}, duration, null, callback);
	}

	function flip(element, duration, callback) {
		$(element).addClass('flip');
		window.setTimeout(function () {
			$(element).removeClass('flip');
			if (callback) {
				callback();
			}
		}, duration);
	}

	function pop(element, duration, callback) {
		$(element).addClass('pop');
		window.setTimeout(function () {
			$(element).removeClass('pop');
			if (callback) {
				callback();
			}
		}, duration);
	}

})();
