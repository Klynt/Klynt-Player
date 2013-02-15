/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
function elementFadeIn(elementId, opacity, duration) {
	$('#' + elementId)
		.css({ opacity:0 })
		.fadeTo(duration * 1000, opacity);
}

function elementFadeOut(elementId, duration) {
	$('#' + elementId).fadeOut(duration * 1000);
}

function resetFadeOut(elementId) {
	$('#' + elementId).css({ opacity:1 });
}

function elementBarWipeIn(elementId, left, duration) {
	$('#' + elementId)
		.css({ left:0 })
		.animate({left:left + "px" }, duration * 1000);
}

function setLeftPosition(elementId, left) {
	var element = document.getElementById(elementId);
	element.style.position = 'absolute';
	element.style.left = left + 'px';
}

function elementBarWipeOut(elementId, duration) {
	var leftFactor = PLAYER.width;
	$('#' + elementId).animate({left:leftFactor + "px" }, duration * 1000);
}

function resetTransitionOut(elementId, opacity, left) {
	var element = document.getElementById(elementId);
	element.style.opacity = opacity;
	element.style.left = left + "px";
}

function elementSlideUpDown(elementId, fromPos, toPos) {
	$('#' + elementId)
		.css({ top:fromPos + "px" })
		.animate({top:toPos + "px" }, 1000);
}

function elementSlideLeftRight(elementId, fromPos, toPos) {
	$('#' + elementId)
		.css({ left:fromPos + "px" })
		.animate({left:toPos + "px" }, 1000);
}

function elementFlip(elementId) {
	$('#' + elementId).addClass('flip');
}

function elementPop(elementId) {
	$('#' + elementId).addClass('pop');
}

function removeTransitClass(elementId) {
	var element = $('#' + elementId);
	if (element.hasClass('pop')) {
		element.removeClass('pop');
	}
	if (element.hasClass('flip')) {
		element.removeClass('flip');
	}
}

function SeqTransition(targetSeqId, transitionType) {
	var maxLeft = data.general.width;
	var minLeft = -maxLeft;
	var maxTop = data.general.height;
	var minTop = -maxTop;
	switch (transitionType) {
		case 'fade' :
			//elementFadeOut(currentSeqId, 1);
			elementFadeIn(targetSeqId, 1, 1);
			break;
		case 'slideLeft' :
			elementSlideLeftRight(targetSeqId, maxLeft, 0);
			break;
		case 'slideRight' :
			elementSlideLeftRight(targetSeqId, minLeft, 0);
			break;
		case 'slideUp' :
			elementSlideUpDown(targetSeqId, maxTop, 0);
			break;
		case 'slideDown' :
			elementSlideUpDown(targetSeqId, minTop, 0);
			break;
		case 'pop' :
			elementPop(targetSeqId);
			break;
		case 'flip' :
			elementFlip(targetSeqId);
			break;
		case 'none' :
			break;
	}
}
