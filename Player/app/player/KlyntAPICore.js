APIHandler.defineCommand('openUrl', function(url){
	if (url)
		window.open(url, '_blank');
});

APIHandler.defineCommand('openLogoLink', function(){
	if (data.footer.logoLink)
		window.open(data.footer.logoLink, '_blank');
});

APIHandler.defineCommand('openIndexMenu', function(){
	PLAYER.showMenu();
});

APIHandler.defineCommand('openMapMenu', function(){
	PLAYER.showMap();
});

APIHandler.defineCommand('shareToFacebook', function(){
	var baseURL = document.location.origin + document.location.pathname;
	baseURL = baseURL.substring(0, baseURL.lastIndexOf("/") + 1);
	var url = 'http://www.facebook.com/sharer.php?' +
		's=100' +
		'&p[url]=' + data.social.facebookLink +
		'&p[title]=' + encodeURIComponent(data.social.facebookTitle) +
		'&p[images][0]=' + baseURL + data.social.facebookLogo +
		'&p[summary]=' + encodeURIComponent(data.social.facebookMessage);
	window.open(url, '_blank');
});

APIHandler.defineCommand('shareToTwitter', function(){
	var url = 'http://twitter.com/intent/tweet?' +
		'original_referer=' + data.social.twitterLink +
		'/&text=' + encodeURIComponent(data.social.twitterMessage + ' - ' + data.social.twitterLink);
	window.open(url, '_blank');
});

APIHandler.defineCommand('showEmbedCode', function(){
	showEmbedCode();
});

APIHandler.defineCommand('toggleMute', function(){
	PLAYER.toggleMute();
});

APIHandler.defineCommand('mute', function(){
	PLAYER.mute();
});

APIHandler.defineCommand('unmute', function(){
	PLAYER.unmute();
});

APIHandler.defineCommand('toggleFullScreen', function(){
	PLAYER.toggleFullScreen();
});

APIHandler.defineCommand('enterFullScreen', function(){
	PLAYER.enterFullScreen();
});

APIHandler.defineCommand('exitFullScreen', function(){
	PLAYER.exitFullScreen();
});

APIHandler.defineCommand('togglePlayPause', function(){
	PLAYER.togglePause();
});

APIHandler.defineCommand('seek', function(time){
	PLAYER.seek(time);
});

APIHandler.defineCommand('play', function(){
	PLAYER.resume();
});

APIHandler.defineCommand('pause', function(){
	PLAYER.pause();
});

APIHandler.defineCommand('openSequence', function(params){
	PLAYER.openSequence(params);
});

APIHandler.defineCommand('openOverlay', function(params){
	PLAYER.openOverlay(params);
});

APIHandler.defineCommand('closeOverlay', function () {
	PLAYER.closeOverlay();
});