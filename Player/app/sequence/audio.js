/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
function addAudio(data, sequence) {
	var audioAutoPlay = data.autoplay ? playMedia : null;
	var audioPauseMedia = !data.continuous ? pauseMedia : null;
	var audioDiv = addElement(sequence, data, {
		name: 'audio',
		className: 'audioClass',
		onBeginLeft: audioAutoPlay,
		onBeginRight: showMedia,
		onEndLeft: audioPauseMedia,
		onEndRight: hideMedia
	});
	
	audioDiv.innerHTML = getMediaHTML('audio', audioDiv, data, sequence);;
	
	audioDiv.firstChild.continuous = data.continuous;
	audioDiv.volume = data.volume;
}
