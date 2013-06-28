/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
function addVideo(data, sequence) {
	var videoAutoPlay = data.autoplay ? playMedia : null;
	var videoDiv = addElement(sequence, data, {
		name: 'video',
		className: 'videoClass',
		onBeginLeft: videoAutoPlay,
		onBeginRight: showMedia,
		onEndLeft: pauseMedia,
		onEndRight: hideMedia
	});
	
	videoDiv.innerHTML = getMediaHTML('video', videoDiv, data, sequence);
	videoDiv.volume = data.volume;
	
	return videoDiv;
}
