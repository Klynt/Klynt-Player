/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
function addImage(data) {
	var img = addElement(data, {
		name: 'image',
		className: 'image'
	});

	$('<img id="img' + img.id + '" alt="' + data.name + '" src="' + data.src + '" style="position: absolute; opacity:' + getOpacity(data) + '"></img>')
		.load(function () {
			var imageRatio = Math.max(data.width / this.width, data.height / this.height);
			this.width *= imageRatio;
			this.height *= imageRatio;
			$(img).append(this);
		}
	);
}
