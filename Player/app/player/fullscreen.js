/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */

var Fullscreen = 
{
	player: null,
	playerDimensions: null,
	screenDimensions: null,
	scale: 1,
	active:	false,
	
	activate: function()
	{
		this.active = true;
		this.getPlayer();
		this.getPlayerDimensions();
		this.getScreenDimensions();
		this.getFullscreenScale();
		$(this.player)
			.width(this.playerDimensions.width)
			.height(this.playerDimensions.height)
			.css('position', 'absolute');
		
		this.scalePlayer();
		this.scaleMediaElementFlash();
	},
	
	getPlayer: function()
	{
		this.player = this.player || document.getElementById('player');
	},
	
	getPlayerDimensions: function()
	{
		var playerStyles = window.getComputedStyle(this.player);
		
		this.playerDimensions = {
			width: getPixelValue(playerStyles.width),
			height:	getPixelValue(playerStyles.height)
		}
		
		function getPixelValue(value) {
			if (!value)
				return 0;
			var split = value.split("px");
			return (split && split.length > 1)? parseInt(split[0], 10) : 0;
		}
	},
	
	getScreenDimensions: function()
	{
		this.screenDimensions = {
			width: screen.width,
			height: screen.height
		}
	},
	
	getFullscreenScale: function()
	{
		var widthRatio = this.screenDimensions.width / this.playerDimensions.width;
		var heightRatio = this.screenDimensions.height / this.playerDimensions.height;
		this.scale =  Math.min(widthRatio, heightRatio);
	},

	scalePlayer: function()
	{
		if ($.browser.chrome) {
			this.scalePlayerForChrome();
		} else {
			var translateX = Math.round(screen.width / this.scale - this.playerDimensions.width) / 2;
			var translateY = Math.round(screen.height / this.scale - this.playerDimensions.height) / 2;
			var transform = 'scale(' + this.scale + ') translate(' + translateX + 'px,' + translateY + 'px)';
			setTransform(this.player, transform, "0px 0px");
		}
	},
	
	scalePlayerForChrome: function()
	{
		this.player.style.zoom = this.scale;
		this.player.style.left = (screen.width / this.scale - this.playerDimensions.width) / 2 + "px";
		this.player.style.top = (screen.height / this.scale - this.playerDimensions.height) / 2 + "px";
	},

	scaleMediaElementFlash: function()
	{
		var scale = this.scale;
		mejs.players.map(setPlayerDimensions);

		function setPlayerDimensions(player){
			if (player.media.pluginType != 'flash') {
				return;
			}
			
			if (!$.browser.chrome) {
				invertScale(player.media.pluginElement);
			}

			var current = {
				width: player.width | 0,
				height: player.height | 0
			};

			var scaled = {
				width: current.width * scale,
				height: current.height * scale
			};
			
			player.media.setVideoSize(scaled.width, scaled.height);
		}

		function invertScale(element) {		
			setTransform(element, 'scale(' + 1 / scale + ')', '0px 0px');
		}
	},
	
	cancel: function()
	{
		this.active = false;
		this.resetScale();
		this.resetMediaElementFlashScale();

		$(this.player)
			.width(this.playerDimensions.width)
			.height(this.playerDimensions.height)
			.css('position', 'relative');
	},
	
	resetScale: function()
	{
		if ($.browser.chrome) {
			this.resetScaleForChrome();
		} else {
			setTransform(this.player, 'scale(1)', '0px 0px');
		}
	},
	
	resetScaleForChrome: function()
	{
		this.player.style.zoom = 1;
		this.player.style.top = "0px";
		this.player.style.left = "0px";
	},

	resetMediaElementFlashScale: function()
	{
		mejs.players.map(setPlayerDimensions);

		function setPlayerDimensions(player) {
			if (player.media.pluginType != 'flash') {
				return;
			}
			if (!$.browser.chrome) {
				resetScale(player.media.pluginElement);
			}

			var current = {
				width: player.width | 0,
				height: player.height | 0
			};

			player.media.setVideoSize(current.width, current.height);
		}

		function resetScale(element) {
			setTransform(element, null, null);
		}
	},
};

function setTransform(element, transformValue, transformOriginValue) {
	setProperty("transform", transformValue);
	setProperty("transformOrigin", transformOriginValue);

	function setProperty(property, value) {
		element.style[property] = value;
		property = property.charAt(0).toUpperCase() + property.slice(1);
		["o", "ms", "moz", "webkit"].forEach(function (prefix) {
			element.style[prefix + property] = value;
		});
	}
}

function fullScreenBrowser()
{
	Fullscreen.activate();
}

function cancelFullScreen() 
{
	Fullscreen.cancel();
}

function fullScreen(eltId) {
	enterFullScreen(document.getElementById(eltId));
}

function fullScreenCancel(eltId) {
	exitFullscreen();
}

function enterFullScreen(element) {
	if (element.requestFullScreen) {
		element.requestFullScreen();
	} else if (element.webkitRequestFullScreen) {
		element.webkitRequestFullScreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	}
}

function exitFullscreen() {
	if (document.cancelFullScreen) {
		document.cancelFullScreen();
	} else if (document.webkitCancelFullScreen) {
		document.webkitCancelFullScreen();
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	}
}

if (document.addEventListener) {
	document.addEventListener("fullscreenchange", handleFullScreenEvent, false);
	document.addEventListener("mozfullscreenchange", handleFullScreenEvent, false);
	document.addEventListener("webkitfullscreenchange", handleFullScreenEvent, false);
}

function handleFullScreenEvent() {
	PLAYER.handleFullScreenEvent();
}
