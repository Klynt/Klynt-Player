/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of the hashtag module which allows deep linking in the player by updating the
 * value of the url hash to the current sequence alias.
 * */

(function (klynt) {
	var accessors = {
		_bandwidth: 0, // Bits/s
		get bandwidth() {
			return this._bandwidth;
		},
		set bandwidth(value) {
			this._bandwidth = value;
		},
		_latency: 0,
		get latency() {
			return this._latency;
		},
		set latency(value) {
			this._latency = value;
		},
		_bandwidthType: 'low',
		get bandwidthType() {
			return this._bandwidthType;
		},
		set bandwidthType(value) {
			this._bandwidthType = value;
		}
	};

	klynt.getModule('bandwidth', accessors).expose(estimateBandwidth, update);

	function estimateBandwidth(filesLoadTime, callback) {
		var testStartTime = new Date().getTime();
		var currentIndex = -1;
		loadNextImage();

		function loadNextImage() {
			currentIndex++;
			var time = new Date().getTime();

			if (currentIndex <= 1 || (currentIndex < testImages.length && time - testStartTime < 500)) {
				var currentImage = testImages[currentIndex];

				var image = new Image();
				image.onload = function () {
					var imageLoadTime = (new Date().getTime() - time) / 1000;
					if (currentIndex == 0) {
						klynt.bandwidth.latency = imageLoadTime;
					} else {
						//console.log('Test: ' + currentIndex, 'Load time: ' + (imageLoadTime - klynt.bandwidth.latency), 'Bandwidth: ' + Math.round(currentImage.bytes / Math.max(imageLoadTime - klynt.bandwidth.latency, 0.001) * 8));
						klynt.bandwidth.bandwidth = Math.round(currentImage.bytes / Math.max(imageLoadTime - klynt.bandwidth.latency, 0.001) * 8);
						klynt.bandwidth.bandwidthType = currentIndex <= 1 ? 'low' : currentIndex <= 2 ? 'medium' : 'high';
					}
					loadNextImage();
				}
				image.src = currentImage.src + '?t=' + time;
			} else {
				/*console.log('\nMeasured bandwidth: ' + klynt.bandwidth.bandwidth + ' Bits/s');
				console.log('Quality: ' + klynt.bandwidth.bandwidthType);
				console.log('Latency: ' + klynt.bandwidth.latency.toFixed(3) + 's');
				console.log('Test duration: ' + ((time - testStartTime) / 1000).toFixed(1) + 's');
				console.log('Last image index: ' + (currentIndex - 1));*/

				if (callback) {
					callback();
				}
			}
		}
	}

	function update(media, fluidity) {
		console.log(fluidity.toFixed(2));
	}

	var testImages = [{
			src: 'Player/css/player/img/1.bmp',
			bytes: 0
		},
		/*{
			src: 'Player/css/player/img/64.bmp',
			bytes: 16438
		},*/
		{
			src: 'Player/css/player/img/128.bmp',
			bytes: 65590
		}, {
			src: 'Player/css/player/img/256.bmp',
			bytes: 262198
		}, {
			src: 'Player/css/player/img/512.bmp',
			bytes: 1048630
		}, {
			src: 'Player/css/player/img/1024.bmp',
			bytes: 4194358
		}
	];
})(window.klynt);