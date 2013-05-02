/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
function addElement(sequence, data, options) {
	function createElement() {
		element = options.element || document.createElement('div');
		element.id = options.id || data.id;
		if (options.name) {
			element.name = options.name;
		}
		if (options.className) {
			element.className = options.className;
		}
		element.isSyncMaster = element.id == sequence.syncMaster;
		element.sequence = sequence;
	}

	function addElementPosition() {
		element.style.top = data.top + "px";
		element.style.left = data.left + "px";
		element.style.width = data.width + "px";
		element.style.height = data.height + "px";
		element.style.position = "absolute";
		element.style.overflow = 'hidden';
		element.style.zIndex = data.zIndex;
	}

	function addElementStyle() {
		element.style.backgroundColor = data.style.backgroundColor;
		element.style.border = data.style.borderSize + 'px solid ' + data.style.borderColor;
		element.style.borderRadius = data.style.roundedEdges + 'px';

		var shadow = data.style.dropShadowX + 'px ' + data.style.dropShadowY + 'px ' + data.style.dropShadowBlur + 'px ' + data.style.dropShadowColor;
		element.style.boxShadow = shadow;
		element.style.WebkitBoxShadow = shadow;

		if (data.style.rotation) {
			var rotation = "rotate(" + data.style.rotation + "deg)";
			element.style.transform = rotation;
			element.style.MozTransform = rotation;
			element.style.WebkitTransform = rotation;
			element.style.OTransform = rotation;
			element.style.msTransform = rotation;
		}
	}

	function addElementTiming() {
		if (element.id == sequence.syncMaster) {
			element.setAttribute('data-syncmaster', true);
			element.setAttribute('data-timeaction', 'none');
		} else {
			element.setAttribute('data-begin', data.databegin);
			element.setAttribute('data-dur', data.duration);
			element.setAttribute('data-end', data.dataend);
			onBegin = "resetTransitionOut('" + element.id + "'," + getOpacity(data) + "," + data.left + ");" + onBegin;
			element.setAttribute('data-onbegin', (options.onBeginLeft || "") + onBegin + (options.onBeginRight || ""));
			element.setAttribute('data-onend', (options.onEndLeft || "") + onEnd + (options.onEndRight || ""));
			
			// Elements are initially hidden until they become active.
			element.style.visibility = 'hidden';
		}
	}

	function addElementLink() {
		element.linkData = data.link;
		$(element).click(function () {
			sequence.runLink(element.id);
		});
		element.style.cursor = "pointer";
        if (data.link.tooltip)
            element.title = data.link.tooltip;
	}

	function addElementTransitionIn() {
		switch (data.transitionIn.type) {
			case 'fade' :
				onBegin = "elementFadeIn('" + element.id + "'," + getOpacity(data) + "," + data.transitionIn.duration + ");" + onBegin;
				break;
			case 'barWipe' :
				onBegin = onBegin + "elementBarWipeIn('" + element.id + "'," + data.left + "," + data.transitionIn.duration + ");";
				onEnd = onEnd + "setLeftPosition('" + element.id + "', 0);";
				break;
		}
	}

	function addElementTransitionOut() {
		if (getTimeFromString(data.dataend) < sequence.duration && element.id != sequence.syncMaster) {
			var transitionFunction = getTransitionFunction();
			if (transitionFunction) {
				transitionFunction += "('" + element.id + "'," + data.transitionOut.duration + ");";
				sequence.addMetaElement(getTransitionBegin(data.dataend, data.transitionOut.duration), transitionFunction);
			}
		}
		
		function getTransitionFunction() {
			switch (data.transitionOut.type) {
				case "fade":
					return "elementFadeOut";
				case "barWipe":
					return "elementBarWipeOut";
				default:
					return null;
			}
		}
	}

	function addElementAnimation() {
		if (data.animation.type = "panZoom") {
			onBegin = "panZoom('" + element.id + "'," + data.animation.width + "," + data.animation.height + "," + data.animation.left + "," + data.animation.top + "," + data.animation.duration + ");" + onBegin;
			onEnd = "resetPanZoom('" + element.id + "'," + data.width + "," + data.height + "," + data.left + "," + data.top + ");" + onEnd;
		}
	}

	function dataHasValue(value) {
		return hasValue(data, value);
	}

	var element = null,
		onBegin = "",
		onEnd = "";
		
	options = options || {};
	createElement();
	addElementPosition();
	if (dataHasValue("style")) {
		addElementStyle();
	}
	if (dataHasValue("animation")) {
		addElementAnimation();
	}
	if (dataHasValue("transitionIn")) {
		addElementTransitionIn();
	}
	if (dataHasValue("transitionOut")) {
		addElementTransitionOut();
	}
	if (dataHasValue("link")) {
		addElementLink();
	}
	addElementTiming();

	sequence.div.appendChild(element);

	return element;
}

/* Pan and zoom */

function panZoom(elementId, endWidth, endHeight, endLeft, endTop, duration) {
	$('#' + elementId).animate({
		left:endLeft + "px",
		top:endTop + "px",
		width:endWidth + "px",
		height:endHeight + "px"
	}, {
		duration: duration * 1000,
		progress: function () {
			resizeImage(this.firstChild);
		}
	});
}

function resetPanZoom(elementId, width, height, left, top) {
	$('#' + elementId).css({left:left + "px", top:top + "px", width:width + "px", height:height + "px"});
}

/* Utils */

function getOpacity(data) {
	return hasValue(data, "style") ? data.style.opacity : 1;
}

function hasValue(data, value) {
	return data.hasOwnProperty(value) && data[value] != undefined && data[value] != null && data[value] != "null";
}

function getTransitionBegin(dataend, duration) {
	var m = parseInt(dataend.substring(0,3));
	var s = parseInt(dataend.substring(3,5)) - parseInt(duration) ;
	var myDate = new Date();
	myDate.setMinutes(m , s);
	return myDate.getMinutes() + ":" + myDate.getSeconds();
}
