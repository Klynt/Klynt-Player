(function (klynt) {
	klynt.getModule('loader').expose(prepareForSequence, setCurrentSequence, setCurrentTime, getSequenceStartupImages);

	var segmentDuration = 5;
	var currentSequence = null;
	var currentTime = NaN;
	var currentSegment = NaN;
	var segmentsQueue = null;
	var sequencesQueue = null;

	function setCurrentSequence(sequence, time) {
		if (currentSequence != sequence) {
			//console.log("Current sequence " + sequence.title);
			currentSequence = sequence;
			currentTime = NaN;
			currentSegment = NaN;
			setCurrentTime(time || 0);
		}
	}

	function setCurrentTime(sequence, time) {
		if (currentSequence == sequence && currentTime != time) {
			currentTime = time;

			if (isNaN(currentSegment) || currentTime < currentSegment || currentTime >= currentSegment + segmentDuration) {
				setCurrentSegment(time);
			}
		}
	}

	function setCurrentSegment(segment) {
		var strictBeginning = !isNaN(currentSegment) && Math.abs(currentSegment + segmentDuration - segment) < 0.5; // We naturally arrived from the previous segment

		currentSegment = segment;
		//console.log("Changed current segment to " + segment + (strictBeginning ? " (ContinuePlayback)" : " (Skip)"));

		segmentsQueue = getNSegments(currentSegment, 3);
		sequencesQueue = [];
		loadImagesInSegmentsQueue(strictBeginning);
	}

	function loadImagesInSegmentsQueue(strictBeginning) {
		if (segmentsQueue && segmentsQueue.length) {
			var segment = segmentsQueue.shift();
			if (segment > currentSequence.duration) {
				//console.log("Skipped loading images in segment " + segment + " because because we reached end of the sequence");
				segmentsQueue = [];
				loadImagesInSegmentsQueue(true);
			} else {
				//console.log("Loading images in segment " + segment, strictBeginning);
				loadImages(getImagesInSegment(currentSequence, segment, strictBeginning), loadImagesInSegmentsQueue, [true]);
			}
		} else {
			sequencesQueue = getNSegmentsSequences(currentTime, 3);
			if (sequencesQueue.length) {
				//console.log("Preloading " + sequencesQueue.length + " sequences");
				loadSequencesInSegmentsQueue();
			} else {
				//console.log("No sequences to preload");
			}
		}
	}

	function loadSequencesInSegmentsQueue() {
		if (sequencesQueue && sequencesQueue.length) {
			prepareForSequence(sequencesQueue.shift(), loadSequencesInSegmentsQueue);
		} else {
			//console.log("Finished preparing for sequences");
		}
	}

	function prepareForSequence(sequence, callback, args, progressCallback) {
		//console.log("Preloading sequence " + sequence.title);
		loadImages(getSequenceStartupImages(sequence), callback, args, progressCallback);
	}

	function loadImages(images, callback, args, progressCallback) {
		var stillToLoad = 0;
		//console.log("------");

		if (images && images.length) {
			stillToLoad = images.length;
			//console.log('Images to load ' + stillToLoad);
			images.forEach(function (src) {
				var image = new Image();
				var $image = $(image);
				$image.on('load', function () {
					//console.log("Image load!", image.src);
					stillToLoad--;
					$image.off('load');
					$image.off('error');
					image.src = '';
					checkAllLoaded();
					progressCallback && progressCallback();
				}).on('error', function () {
					//console.log("Image error!", image.src);
					//console.log('Could not load ' + src);
					stillToLoad--;
					$image.off('load');
					$image.off('error');
					image.src = '';
					checkAllLoaded();
					progressCallback && progressCallback();
				});
				image.src = src;
				if (image.complete) {
					//console.log("Image Complete!", image.src);
					stillToLoad--;
					$image.off('load');
					$image.off('error');
					image.src = '';
					checkAllLoaded();
					progressCallback && progressCallback();
				}
			});
		} else {
			checkAllLoaded();
		}

		function checkAllLoaded() {
			if (stillToLoad == 0 && typeof callback == 'function') {
				callback.apply(this, args);
			}
		}
	}

	function getSequenceStartupImages(sequence) {
		return getImagesInSegment(sequence, 0);
	}

	function getImagesInSegment(sequence, t, strictBeginning) {
		var images = [];

		sequence.images.forEach(function (image) {
			if (elementVisibleInSegment(image, t, strictBeginning)) {
				images.push(image.source);
			}
		});

		sequence.medias.forEach(function (media) {
			if (media.poster && elementVisibleInSegment(media, t, strictBeginning)) {
				images.push(media.poster);
			}
		});

		return images;
	}

	function elementVisibleInSegment(element, t, strictBeginning) {
		if (element.syncMaster) {
			return t < segmentDuration;
		} else if (strictBeginning) { // Only element that start at the segment
			return t <= element.begin && element.begin < t + segmentDuration;
		} else { // All elements visible in the segment
			return t <= element.end && element.begin < t + segmentDuration;
		}
	}

	function getNSegments(first, length) {
		var segments = [];
		for (var i = 0; i < length; i++) {
			segments[i] = first + i * segmentDuration;
		}
		return segments;
	}

	function getNSegmentsSequences(first, length) {
		var segments = getNSegments(first, length);
		var sequences = getSequencesInSegment(segments[0], false);
		
		for (var i = 1; i < segments.length; i++) {
			sequences = sequences.concat(getSequencesInSegment(segments[i], true));
		}

		return sequences;
	}

	function getSequencesInSegment(segment, strictBeginning) {
		return currentSequence.elements.filter(function (element) {
			return elementVisibleInSegment(element, segment, strictBeginning) && element.link && element.link.target;
		}).map(function (element) {
			return element.link.target;
		});
	}
})(window.klynt);