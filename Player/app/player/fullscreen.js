/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
//Helper function
function getPixelValue(value)
{
	if (!value)
		return 0;
	var split = value.split("px");
	return (split && split.length > 1)? parseInt(split[0], 10) : 0;
}

var Fullscreen = 
{
	PARENT_IS_PLAYER: "parentIsPlayer",
	PARENT_IS_SEQUENCE: "parentIsSequence",
	parent: null,
	player: null,
	playerDimensions: null,
	screenDimensions: null,
	scale: 1,
	active:	false,
	
	isPlayer: function()
	{
		return (this.parent == this.PARENT_IS_PLAYER);
	},
	
	isSequence: function()
	{
		return (this.parent == this.PARENT_IS_SEQUENCE);
	},
	
	activate: function()
	{
		this.getPlayer();
		this.getPlayerDimensions();
		this.getScreenDimensions();
		this.getFullscreenScale();
		if (this.isPlayer())
			this.player.setAttribute('style', 'width:' + this.playerDimensions.width + 'px; height:' + this.playerDimensions.height + 'px; position: absolute; top:0; left:0; overflow:hidden; background-color: white');
		
		this.scalePlayer();
		if (this.isPlayer())
			this.swapToCancelButton();
	},
	
	getPlayer: function()
	{
		this.player = this.player || ((this.isPlayer())? document.getElementById('player'): document.body);
	},
	
	getPlayerDimensions: function()
	{
		var playerStyles = window.getComputedStyle(this.player);
		
		this.playerDimensions = {
			width: getPixelValue(playerStyles.width),
			height:	getPixelValue(playerStyles.height)
		}
	},
	
	getScreenDimensions: function()
	{
		this.screenDimensions = {
			width: (this.isPlayer())? screen.width : document.width,
			height: (this.isPlayer())? screen.height : document.height,
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
		if ($.browser.chrome)
			return this.scalePlayerForChrome();
		var transform = 'scale(' + this.scale + ')';
		
		this.player.style.transform = transform;
		this.player.style.OTransform = transform;
		this.player.style.msTransform = transform;
		this.player.style.MozTransform = transform;
		this.player.style.WebkitTransform = transform;
		
		var originX = 0;
		var originY = -(screen.height - this.playerDimensions.height * this.scale);
		
		var origin = originX + "px " + originY + "px";
		
		this.player.style.transformOrigin = origin;
		this.player.style.OTransformOrigin = origin;
		this.player.style.msTransformOrigin = origin;
		this.player.style.MozTransformOrigin = origin;
		this.player.style.WebkitTransformOrigin = origin;
	},
	
	scalePlayerForChrome: function()
	{
		this.player.style.zoom = this.scale;
		if (this.isPlayer())
			this.player.style.top = ((screen.height - this.playerDimensions.height * this.scale) / (2 * this.scale)) + "px";
	},

	swapToCancelButton: function()
	{
		if(document.getElementById('cancelfullscreen'))
			document.getElementById('cancelfullscreen').style.visibility = 'visible';
		if(document.getElementById('fullscreen'))
			document.getElementById('fullscreen').style.visibility = 'hidden';
	},
	
	swapToFullscreenButton: function()
	{
		if(document.getElementById('cancelfullscreen'))
			document.getElementById('cancelfullscreen').style.visibility = 'hidden';
		if(document.getElementById('fullscreen'))
			document.getElementById('fullscreen').style.visibility = 'visible';
	},
	
	cancel: function()
	{
		this.resetScale();
		if (this.isPlayer())
			this.swapToFullscreenButton();
	},
	
	resetScale: function()
	{
		if ($.browser.chrome)
			return this.resetScaleForChrome();
		var transform = 'scale(1)';
		
		this.player.style.transform = transform;
		this.player.style.OTransform = transform;
		this.player.style.msTransform = transform;
		this.player.style.MozTransform = transform;
		this.player.style.WebkitTransform = transform;
		
		var origin = "0px 0px";
		
		this.player.style.transformOrigin = origin;
		this.player.style.OTransformOrigin = origin;
		this.player.style.msTransformOrigin = origin;
		this.player.style.MozTransformOrigin = origin;
		this.player.style.WebkitTransformOrigin = origin;
	},
	
	resetScaleForChrome: function()
	{
		this.player.style.zoom = 1;
		if (this.isPlayer())
			this.player.style.top = "0px";
	}
}

function fullScreenBrowser(parent)
{
	Fullscreen.parent = parent || Fullscreen.PARENT_IS_PLAYER;
	Fullscreen.activate();
}

/************************ retour à la taille d'origine ***************************/

function cancelFullScreen() 
{
	Fullscreen.cancel();
}

/************************************************************************************/

function enterFullScreen(element) {
	if (element.requestFullScreen) {
		//fonction officielle du w3c
		element.requestFullScreen();
	} else if (element.webkitRequestFullScreen) {
		if ($.browser.safari)
			element.webkitRequestFullScreen();
		else
			element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	} else if (element.mozRequestFullScreen) {
		//fonction pour Firefox
		element.mozRequestFullScreen();
	} else {
		alert("Le mode plein ecran n'est pas supporté par votre navigateur");
	}
}

function fullScreen(eltId) {
	enterFullScreen(document.getElementById(eltId));
}

function exitFullscreen() {
	if (document.cancelFullScreen) {
		//fonction officielle du w3c
		document.cancelFullScreen();
	} else if (document.webkitCancelFullScreen) {
		//fonction pour Google Chrome
		document.webkitCancelFullScreen();
	} else if (document.mozCancelFullScreen) {
		//fonction pour Firefox
		document.mozCancelFullScreen();
	}
}

function fullScreenCancel(eltId) {
	exitFullscreen(document.getElementById(eltId));
}