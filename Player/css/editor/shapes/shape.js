var shape;
var container;

var load = function(backgroundColor)
{
	shape = document.getElementById('shape');
	setBackgroundColor(backgroundColor);
};

function setWidth(width)
{
	shape.style.width = width;
};

function setHeight(height)
{
	shape.style.height = height;
};

function setBackgroundColor(value)
{
	shape.style.backgroundColor = value;
};