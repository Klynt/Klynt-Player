/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
function addButton(data, sequence) {
	addButton_old(sequence, data.id, data.label, data.label, data.databegin, data.dataend, data.duration, '', '', '', data.left, data.top, data.type, '', '', data.width, data.height, data.link, data.action, data.zIndex, data.transitionIn, data.transitionOut);
}

function addButton_old(sequence, btnID, label, tooltip, databegin, dataend, duration, onbegin, onend, onclick, left, top, type, onmouseover, onmouseout, width, height, lnk, action, btnZindex, animationIn, animationOut) {
	
	createButtonByType(type);
	
	function createButtonByType(type) {
		switch (type) {
			case 'btn-arrow-left':
				createArrow('left');
				break;
			case 'btn-arrow-right':
				createArrow('right');
				break;
			case 'btn-arrow-top':
				createArrow('top');
				break;
			case 'btn-arrow-bottom':
				createArrow('bottom');
				break;
			default:
				createButton();
		}
	}

	function createButton() {
		var btn = document.createElement('button');
		btn.id = btnID;
		btn.innerHTML = label;
		btn.className = type;
		btn.setAttribute('name', 'button');

		setCommonAttributes(btn);
		$(sequence.div).append(btn);
		$(sequence.div).append('<br />');
		return btn;
	}

	function createArrow(arrow_type) {
		var container = document.createElement('div');
		container.className = 'btn-arrow_container';
		container.setAttribute('name', 'button_arrow_container');
		container.id = "_" + btnID;
		setCommonAttributes(container);

		var arrow = document.createElement('div');
		arrow.id = btnID;
		arrow.setAttribute('name', 'button_arrow');
		arrow.className = type;

		var tooltip = document.createElement('div');
		tooltip.id = btnID + arrow_type;
		tooltip.className = type + '_tooltip';
		tooltip.setAttribute('name', 'button_arrow_tooltipe');
		tooltip.style.display = "none";
		tooltip.innerHTML = label;

		$(sequence.div).append(container);
		$(container).append(arrow);
		$(container).append(tooltip);

		$(sequence.div).append('<br/>');

		tooltip.style.width = getWidth(container) - getWidth(arrow) - getHorizontalPadding(tooltip) + 'px';
		
		$(arrow).on("mouseover", mouseOut).on("mouseout", mouseOver);
		function mouseOut() {
			$(tooltip).fadeIn(500, "swing");
		}
		function mouseOver(id) {
			$(tooltip).fadeOut(500, "swing");
		}
		
		return arrow;
	}


	function getWidth(element) {
		return getStyle(element, 'width');
	}

	function getHorizontalPadding(element) {
		return getStyle(element, 'paddingLeft') + getStyle(element, 'paddingRight');
	}

	function getStyle(element, style) {
		return parseInt(window.getComputedStyle(element)[style], 10);
	}

	function setCommonAttributes(root_element) {
		setLayout(root_element);
		setAnimations(root_element);
		setTiming(root_element);
		if (lnk) {
			attachLink(root_element);
		} else if (action) {
			attachAction(root_element);
		}
	}

	function setLayout(root_element) {
		root_element.style.zIndex = btnZindex;

		root_element.style.position = 'absolute';
		root_element.style.top = top + 'px';
		root_element.style.left = left + 'px';
		root_element.style.width = width + 'px';
		root_element.style.height = height + 'px';
			
		// Elements are initially hidden until they become active.
		root_element.style.visibility = 'hidden';
	}


	function setTiming(root_element) {
		root_element.setAttribute('data-begin', databegin);
		root_element.setAttribute('data-end', dataend);
		root_element.setAttribute('data-dur', duration);		
	}

	function attachLink(root_element) {
		root_element.linkData = lnk;

        if (lnk.tooltip)
		    root_element.title = lnk.tooltip;

		if (lnk.automaticTransition) {
			root_element.style.display = 'none';
			sequence.automaticLink = lnk;
			root_element.addEventListener('begin', sequence.endSequence);
		} else {
			root_element.style.cursor = "pointer";
			$(root_element).click(function () {
				sequence.runLink(root_element.id);
			});
		}
	}

	function attachAction(root_element) {
		root_element.actionData = action;
		$(root_element).click(function () {
			sequence.runAction(root_element.id);
		});
		root_element.style.cursor = "pointer";
        if (action.tooltip) {
		    root_element.title = action.tooltip;
		}
	}
	
	function setAnimations(btn) {
		btn.addEventListener("begin", onBegin, false);
		btn.addEventListener("end", onEnd, false);
		if (animationOut && animationOut != 'null') {
			sequence.addMetaElement(getTransitionBegin(dataend, animationOut.duration), animateOut);
		}
		
		function onBegin() {
			resetTransitionOut(btn, left);
			if (animationIn && animationIn != 'null') {
				switch (animationIn.type) {
					case 'fade':
						elementFadeIn(btn, 1 , animationIn.duration);
						break;
					case 'barWipe':
						elementBarWipeIn(btn, left, animationIn.duration);
						break;
				}
			}
		}
		
		function onEnd() {
			if (animationIn && animationIn != 'null') {
				switch (animationIn.type) {
					case 'barWipe':
						setLeftPosition(btn, 0);
						break;
				}
			}
		}
			
		function animateOut() {
			switch (animationOut.type) {
				case 'fade' :
					elementFadeOut(btn, animationOut.duration);
					break;
				case 'barWipe' :
					elementBarWipeOut(btn, animationOut.duration);
					break;
			}
		}
	}
}
