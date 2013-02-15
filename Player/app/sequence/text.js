/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
function addText(data) {
	var txt = addElement(data, {
		name: 'text',
		className: data.type
	});

	txt.innerHTML = data.text;
}
