var button;
var container;
var isWSizable = function () {
	return true;
};
var isHSizable = function () {
	return true;
};

var load = function (text) {
	button = document.getElementById('button');
	container = document.getElementById("container");
	arrow = document.getElementById("arrow");
	setText(text);
};

var getWidth = function () {
	return getStyle("width") + getStyle("paddingLeft") + getStyle("paddingRight");
};

var getArrowWidth = function () {
	return getStyle("width", arrow) + getStyle("paddingLeft", arrow) + getStyle("paddingRight", arrow);
}

var setWidth = function (width) {
	button.style.width = width - getArrowWidth() - getStyle("paddingLeft", button) - getStyle("paddingRight", button) - 2;
};

var getHeight = function () {
	return getArrowHeight();
};

var getArrowHeight = function () {
	return getStyle("height", arrow) + getStyle("paddingTop", arrow) + getStyle("paddingBottom", arrow);
}

var setHeight = function (height) {
	arrow.style.height = height;
	container.style.height = height;
	button.style.height = height;
	button.style.lineHeight = height + 'px';
};

var setText = function (text) {
	button.innerText = text;
};

var getStyle = function (style, target) {
	target = target || container;
	return parseInt(window.getComputedStyle(target)[style], 10);
};