/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */

function addImage(data, sequence) {
    var element = addElement(sequence, data, {
        name: 'image',
        className: 'image'
    });

    $(element).append($('<img id="img' + element.id + '" alt="' + data.name + '" src="' + data.src + '" style="position: absolute; opacity:' + getOpacity(data) + '"></img>')
        .load(function () {
            this.originalWidth = this.width;
            this.originalHeight = this.height;
            resizeImage(this);
        }
    ));
}


function resizeImage(image) {
	if (image.originalWidth > 0 && image.originalHeight > 0) {
	    var widthRatio = $(image.parentNode).width() / image.originalWidth;
	    var heightRatio = $(image.parentNode).height() / image.originalHeight;
	    var imageRatio = Math.max(widthRatio, heightRatio);
	    image.width = image.originalWidth * imageRatio;
	    image.height = image.originalHeight * imageRatio;
	}
}