/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
function addText(data, sequence) {
	var textContainer = addElement(sequence, data, {
		name: 'text',
		className: data.type
	});
	
	$(textContainer)
		.addClass('nano-container')
		.append($('<div class="nano-content">' + data.text + '</div>'));
}
