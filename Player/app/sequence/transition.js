/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */

function elementFadeIn(elementId, opacity, duration) {
	$('#' + elementId).css({
		opacity:0
	}).fadeTo(duration * 1000, opacity);
}

function elementFadeOut(elementId, duration) {
	$('#' + elementId).fadeOut(duration * 1000);
}

function setLeftPosition(elementId, left) {
	$('#' + elementId).css({
		position: 'absolute',
		left: left + 'px'
	});
}

function elementBarWipeIn(elementId, left, duration) {
	$('#' + elementId).css({
		clip: getClipString(elementId, 0, 0)
	}).animate({
		clip: getClipString(elementId, 0, 1)
	}, duration * 1000);
}

function elementBarWipeOut(elementId, duration) {
	$('#' + elementId).css({
		clip: getClipString(elementId, 0, 1)
	}).animate({
		clip: getClipString(elementId, 1, 1)
	}, duration * 1000);
}

function resetTransitionOut(elementId, opacity, left) {
	$('#' + elementId).css({
		opacity: opacity,
		left: left + 'px',
		clip: null
	});
}

function getClipString(elementId, leftFactor, rightFactor) {
	var element = $('#' + elementId);
	var width = element.width();
	var height = element.height();
	return 'rect(' + 0 + 'px ' + parseInt(width * rightFactor) + 'px ' + height + 'px ' + parseInt(width * leftFactor) + 'px)';
}

(function(jQuery){
	jQuery.fx.step.clip = function(fx){
		if ( fx.pos == 0 ) {
			var cRE = /rect\(([0-9]{1,})(px|em)[,]? ([0-9]{1,})(px|em)[,]? ([0-9]{1,})(px|em)[,]? ([0-9]{1,})(px|em)\)/;
			fx.start = cRE.exec( fx.elem.style.clip.replace(/,/g, '') );
			fx.end = cRE.exec( splitFxEnd() );
			
			function splitFxEnd(){
				var end = (fx.end instanceof Array)? fx.end[0] : fx.end;
				return end.replace(/,/g, '');
			}
		}
		var sarr = new Array(), earr = new Array(), spos = fx.start.length, epos = fx.end.length,
			emOffset = fx.start[ss+1] == 'em' ? ( parseInt($(fx.elem).css('fontSize')) * 1.333 * parseInt(fx.start[ss]) ) : 1;
		for ( var ss = 1; ss < spos; ss+=2 ) { sarr.push( parseInt( emOffset * fx.start[ss] ) ); }
		for ( var es = 1; es < epos; es+=2 ) { earr.push( parseInt( emOffset * fx.end[es] ) ); }
		fx.elem.style.clip = 'rect(' + 
			parseInt( ( fx.pos * ( earr[0] - sarr[0] ) ) + sarr[0] ) + 'px ' + 
			parseInt( ( fx.pos * ( earr[1] - sarr[1] ) ) + sarr[1] ) + 'px ' +
			parseInt( ( fx.pos * ( earr[2] - sarr[2] ) ) + sarr[2] ) + 'px ' + 
			parseInt( ( fx.pos * ( earr[3] - sarr[3] ) ) + sarr[3] ) + 'px)';
	}
})(jQuery);
