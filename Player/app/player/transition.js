/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
var TRANSITION = (function () {
	var TRANSITION = {};

	TRANSITION.applyToSequence = function (sequence, transitionType, oldSequence, callback) {
		var duration = 1000;
		var div = sequence.div;
		var oldDiv = oldSequence ? oldSequence.div : null;

		switch (transitionType) {
			case 'fade':
				fadeIn(div, 1, duration, callback);
				break;
			case 'slideLeft':
				slideHorizontally(div, PLAYER.width, 0, duration, callback);
				slideHorizontally(oldDiv, 0, -PLAYER.width, duration);
				break;
			case 'slideRight':
				slideHorizontally(div, -PLAYER.width, 0, duration, callback);
				slideHorizontally(oldDiv, 0, PLAYER.width, duration);
				break;
			case 'slideUp':
				slideVertically(div, PLAYER.height, 0, duration, callback);
				slideVertically(oldDiv, 0, -PLAYER.height, duration);
				break;
			case 'slideDown':
				slideVertically(div, -PLAYER.height, 0, duration, callback);
				slideVertically(oldDiv, 0, PLAYER.height, duration);
				break;
			case 'pop':
				pop(div, duration, callback);
				break;
			case 'flip':
				flip(div, duration, callback);
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
