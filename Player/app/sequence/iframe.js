/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
function addFrame(data, sequence) {
	var frame = addElement(sequence, data, {
		name: 'iframe',
		className: 'iframe',
		onBeginRight: "displayFrame('" + data.id + "', '" + data.code + "');",
		onEndRight: "hideFrame('" + data.id + "');"
	});
}

function displayFrame(frameId, frameUrl) {
	var frame = document.getElementById(frameId);
	frame.innerHTML = frameUrl || frame.chachedInnerHTML;
	frame.style.display = 'block';
}

function hideFrame(frameId) {
	var frame = document.getElementById(frameId);
	frame.chachedInnerHTML = frame.innerHTML;
	frame.innerHTML = "";
	frame.style.display = 'none';
}
