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
			element.addEventListener("begin", onBeginListener, false);
			element.addEventListener("end", onEndListener, false);
			
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
        if (data.link.tooltip) {
            element.title = data.link.tooltip;
		}
	}

	function addElementAction() {
		element.actionData = data.action;
		$(element).click(function () {
			sequence.runAction(element.id);
		});
		element.style.cursor = "pointer";
        if (data.action.tooltip) {
            element.title = data.action.tooltip;
		}
	}

	function startTransitionIn() {
		switch (data.transitionIn.type) {
			case 'fade' :
				elementFadeIn(element, getOpacity(data), data.transitionIn.duration);
				break;
			case 'barWipe' :
				elementBarWipeIn(element, data.left, data.transitionIn.duration);
				break;
		}
	}
	
	function endTransitionIn() {
		switch (data.transitionIn.type) {
			case 'barWipe' :
				setLeftPosition(element, 0);
				break;
		}
	}
	
	function addElementTransitionOut() {
		if (data.transitionOut.type && getTimeFromString(data.dataend) < sequence.duration && element.id != sequence.syncMaster) {
			sequence.addMetaElement(getTransitionBegin(data.dataend, data.transitionOut.duration), transitionFunction);
		}
		
		function transitionFunction() {
			switch (data.transitionOut.type) {
				case "fade":
					return elementFadeOut(element, data.transitionOut.duration);
				case "barWipe":
					return elementBarWipeOut(element, data.transitionOut.duration);
				default:
					return null;
			}
		}
	}
	
	function startElementAnimation() {
		if (data.animation.type = "panZoom") {
			panZoom(element, data.animation.width, data.animation.height, data.animation.left, data.animation.top, data.animation.duration);
		}
	}
	
	function endElementAnimation() {
		if (data.animation.type = "panZoom") {
			resetPanZoom(element, data.width, data.height, data.left, data.top);
		}
	}

	function dataHasValue(value) {
		return hasValue(data, value);
	}
	
	function onBeginListener () {
		if (options.onBeginLeft) {
			options.onBeginLeft(element);
		}
		if (dataHasValue("transitionIn")) {
			startTransitionIn();
		}
		if (dataHasValue("animation")) {
			startElementAnimation();
		}
		if (options.onBeginRight) {
			options.onBeginRight(element);
		}
	}
	
	function onEndListener () {
		if (options.onEndLeft) {
			options.onEndLeft(element);
		}
		if (dataHasValue("transitionOut")) {
			resetTransitionOut(element, getOpacity(data), data.left);
		}
		if (dataHasValue("transitionIn")) {
			endTransitionIn();
		}
		if (dataHasValue("animation")) {
			endElementAnimation();
		}
		if (options.onEndRight) {
			options.onEndRight(element);
		}
	}

	var element = null;
		
	options = options || {};
	createElement();
	addElementPosition();
	if (dataHasValue("style")) {
		addElementStyle();
	}
	if (dataHasValue("transitionOut")) {
		addElementTransitionOut();
	}
	if (dataHasValue("link")) {
		addElementLink();
	} else if (dataHasValue("action")) {
		addElementAction();
	}
	addElementTiming();

	sequence.div.appendChild(element);

	return element;
}

/* Pan and zoom */

function panZoom(element, endWidth, endHeight, endLeft, endTop, duration) {
	$(element).animate({
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

function resetPanZoom(element, width, height, left, top) {
	$(element).css({left:left + "px", top:top + "px", width:width + "px", height:height + "px"});
}

/* Utils */

function getOpacity(data) {
	return hasValue(data, "style") ? data.style.opacity : 1;
}

function hasValue(data, value) {
	return data.hasOwnProperty(value) && data[value] != undefined && data[value] != null && data[value] != "null";
}

function getTransitionBegin(dataend, duration) {
	return getStringFromTime(getTimeFromString(dataend) - duration);
}
