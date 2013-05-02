/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
function addAudio(data, sequence) {
	
	var audioHTML = getMediaHTML('audio', data, sequence);
	
	var audioDiv = addElement(sequence, data, {
		name: 'audio',
		className: 'audioClass',
		onBeginLeft: data.autoplay ? "playMedia('" + data.id + "');" : "",
		onBeginRight: "setMediaVolume('" + data.id + "', " + data.volume + ");" + "showMedia('" + data.id + "');",
		onEndLeft: !data.continuous ? "pauseMedia('" + data.id + "');" : "",
		onEndRight: "hideMedia('" + data.id + "');"
	});
	
	audioDiv.innerHTML = audioHTML;
	
	audioDiv.firstChild.continuous = data.continuous;
}
