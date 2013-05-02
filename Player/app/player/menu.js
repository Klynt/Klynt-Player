/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
function addMenu(parentElement, width, height, title, showMenuDescription) {
	var menuLayer = document.createElement('div');
	var menu = document.createElement('div');
	var menuTitle = document.createElement('div');
	var menuClose = document.createElement('div');
	menuLayer.id = 'menuLayer';
	menuLayer.name = 'menuLayer';
	menuLayer.className = 'menuLayer';
	menuLayer.style.width = width + "px";
	menuLayer.style.height = height + "px";
	menu.id = 'menu';
	menu.name = 'menu';
	menu.className = 'menu';
	menu.style.width = (width - 44) + "px"; // 44 = 32 margin-left + 12 padding
	menu.style.height = (height - 100) + "px"; // 100 = 96 top+bottom + 4 padding
	menuTitle.id = 'menuTitle';
	menuTitle.className = 'menuTitle';
	menuTitle.innerHTML = title; // menuTitle from json
	menuClose.id = 'menuClose';
	menuClose.className = 'menuClose';
	menuClose.innerHTML = 'X';
	menuClose.style.left = (width - 64) + "px";
	menuClose.setAttribute('onclick', 'PLAYER.hideMenu();');
	$(parentElement).append(menuLayer);
	$(parentElement).append(menu);
	$(parentElement).append(menuTitle);
	$(parentElement).append(menuClose);

	var seqList = sortMenuSequences();
	seqList.forEach(function (seq) {
		$("#menu").append('<div class="figure" onmouseover="showDescription(' + showMenuDescription + ',\'' + seq.id + '\');" onmouseout="hideDescription(\'' + seq.id + '\');"' +
			' onclick="' + "PLAYER.hideMenu(); PLAYER.showSequence('" + seq.id + "');" + '">' +
			'<div class="menu_thumbnail">' +
			'<img src="' + seq.thumbnailUrl + '">' +
			'<h1>' + seq.name + '</h1>' +
			'</div>' +
			'<div id="fig' + seq.id + '" class="figcaption">' +
			'<h1>' + seq.name + '</h1>' +
			'<div class="description">' +
			'<p>' + seq.description + '</p>' +
			'</div>' +
			'</div>' +
			'</div>');
	});

	hideMenu();
}

function showMenu() {
	var menu = document.getElementById("menu");
	menu.style.visibility = 'visible';
	$("#menuLayer").show();
	$("#menuTitle").show();
	$("#menuClose").show();
	
	trackPageView("Open Menu");
}

function hideMenu() {
	var menu = document.getElementById("menu");
	menu.style.visibility = 'hidden';
	$("#menuLayer").hide();
	$("#menuTitle").hide();
	$("#menuClose").hide();
}

function sortMenuSequences() {
	var seqList = [];
	$.each(data.sequences, function (key, seq) {
		if (seq.indexMenuPosition != -1) {
			seqList[seq.indexMenuPosition] = seq;
		}
	});
	return seqList;
}

function showDescription(showMenuDescription, seqId) {
	if (showMenuDescription == true) {
		document.getElementById('fig' + seqId).style.opacity = 0.9;
	}
}

function hideDescription(seqId) {
	document.getElementById('fig' + seqId).style.opacity = 0;
}
