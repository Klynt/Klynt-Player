/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
function addFrame(data, sequence) {
	var frame = addElement(sequence, data, {
		name: 'iframe',
		className: 'iframe',
		onBeginRight: displayFrame,
		onEndRight: hideFrame
	});
	
	function displayFrame(frame) {
		frame.innerHTML = data.code || frame.chachedInnerHTML;
		frame.style.display = 'block';
	}

	function hideFrame(frame) {
		frame.chachedInnerHTML = frame.innerHTML;
		frame.innerHTML = "";
		frame.style.display = 'none';
	}
}
