/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
function addAudio(data) {
	
	var audioHTML = getMediaHTML('audio', data);
	
	console.log("setMediaVolume('" + data.id + "', " + data.volume + ");" + "showMedia('" + data.id + "');");
	
	var audioDiv = addElement(data, {
		name: 'audio',
		className: 'audioClass',
		onBeginLeft: data.autoplay ? "playMedia('" + data.id + "');" : "",
		onBeginRight: "setMediaVolume('" + data.id + "', " + data.volume + ");" + "showMedia('" + data.id + "');",
		onEndLeft: !data.continuous ? "pauseMedia('" + data.id + "');" : "",
		onEndRight: "hideMedia('" + data.id + "');"
	});
	
	audioDiv.innerHTML = audioHTML;
	
	var audio = $('#' + data.id + 'Element')[0];
	audio.continuous = data.continuous;
}
