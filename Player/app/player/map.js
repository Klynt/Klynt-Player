/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
function addMap(parentElement, width, height, title, showMapDescription, longitude, latitude, defaultZoom, minZoom, maxZoom) {

	var mapLayer = document.createElement('div');
	var map = document.createElement('div');
	var mapCanvas = document.createElement('div');
	var mapClose = document.createElement('div');
	var mapTitle = document.createElement('div');

	mapLayer.id = 'mapLayer';
	mapLayer.name = 'mapLayer';
	mapLayer.className = 'mapLayer';
	mapLayer.style.width = width + "px";
	mapLayer.style.height = height + "px";

	map.id = "map";
	map.name = 'map';
	map.className = 'map';
	map.style.width = (width - 64) + "px"; // 64 = 32 left+right + 32 padding
	map.style.height = (height - 128) + "px"; // 128 = 96 top+bottom + 32 padding

	mapCanvas.id = "map_canvas";
	mapCanvas.name = 'map_canvas';
	mapCanvas.className = 'map_canvas';

	mapTitle.id = 'mapTitle';
	mapTitle.name = 'mapTitle';
	mapTitle.className = 'mapTitle';
	mapTitle.innerHTML = title;

	mapClose.id = 'mapClose';
	mapClose.className = 'mapClose';
	mapClose.innerHTML = 'X';
	mapClose.style.left = (width - 64) + "px";
	mapClose.setAttribute('onclick', 'PLAYER.hideMap();');

	$(parentElement).append(mapLayer);
	$(parentElement).append(map);
	$("#map").append(mapCanvas);
	$(parentElement).append(mapClose);
	$(parentElement).append(mapTitle);

	hideMap();
	PLAYER.setMapsEnabled(true);

	var mapOptions = {
		center:new google.maps.LatLng(latitude, longitude),
		mapTypeId:google.maps.MapTypeId.ROADMAP,
		zoom:defaultZoom,
		minZoom:minZoom,
		maxZoom:maxZoom,
		noClear:false
	};
	var googleMap = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	//$("#map").style.height = (height-128) + "px"; // 128 = 96 top+bottom + 32 padding

	var infoWindowArray = [];

	sortMapSequences().forEach(function (seq) {
		var image = new google.maps.MarkerImage(
			'Player/resources/map-menu/map_marker.png',
			new google.maps.Size(64, 64),
			// The origin for this image is 0,0.
			new google.maps.Point(0, 0)
		);
		// Shapes define the clickable region of the icon.
		var shape = {
			coord:[0, 16, 16, 32, 32, 64, 48, 48, 64, 16, 32 , 0],
			type:'poly'
		};

		var marker = new google.maps.Marker({
			position:new google.maps.LatLng(seq.latitude, seq.longitude),
			map:googleMap,
			icon:image,
			shape:shape,
			title:seq.id,
			zIndex:seq.mapMenuPosition
		});

		var infowindow = new google.maps.InfoWindow();
		infoWindowArray.push(infowindow);
		if (showMapDescription == true) {
			var seqContent = '<div class="map_figure">' +
				'<img src="' + seq.thumbnailUrl + '">' +
				'<div class="map_seqTitle">' +
				'<h>' + seq.name + '</h>' +
				'</div>' +
				'<div class="map_description">' +
				'<p>' + seq.description + '</p>' +
				'</div>' +
				'<div class="map_link" onclick="PLAYER.hideMap(); PLAYER.showSequence(\'' + seq.id + '\');">' +
				'<p> > Go </p>' +
				'</div>' +
				'</div>';
		} else {
			var seqContent = '<div class="map_figure">' +
				'<img src="' + seq.thumbnailUrl + '">' +
				'<div class="map_seqTitle">' +
				'<h>' + seq.name + '</h>' +
				'</div>' +
				'<div class="map_link" onclick="PLAYER.hideMap(); PLAYER.showSequence(\'' + seq.id + '\');">' +
				'<p> > Go </p>' +
				'</div>' +
				'</div>';
		}

		addInfoWindow(marker, infowindow, seqContent, infoWindowArray);
	});
}


function addInfoWindow(marker, infowindow, content, infoWindowArray) {
	google.maps.event.addListener(marker, 'click', function () {
		closeInfoWindows(infoWindowArray);
		infowindow.setContent(content);
		infowindow.open(this.getMap(), this);
	});
}

function closeInfoWindows(infoWindowArray) {
	if (infoWindowArray) {
		for (i in infoWindowArray) {
			infoWindowArray[i].close();
		}
	}
}

function showMap() {
	var map = document.getElementById("map");
	map.style.visibility = 'visible';
	$("#mapLayer").show();
	//$("#map_canvas").show();
	$("#mapTitle").show();
	$("#mapClose").show();
}

function hideMap() {
	var map = document.getElementById("map");
	map.style.visibility = 'hidden';
	$("#mapLayer").hide();
	//$("#map_canvas").hide();
	$("#mapTitle").hide();
	$("#mapClose").hide();
}

function sortMapSequences() {
	var seqList = [];
	$.each(data.sequences, function (key, seq) {
		if (seq.mapMenuPosition != -1) {
			seqList[seq.mapMenuPosition] = seq;
		}
	});
	return seqList;
}
