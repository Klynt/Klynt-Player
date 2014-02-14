
var JustSprite = (function($){

    var $spritePlayer,
        spritesData,
        totalFrames = 0,
        currentFrameIndex = 0,
        currentFrameData,
        $currentFrame,
        $frames = [],
        playTimeout,
        loop;

    function init (player, data) {

        $spritePlayer = player;
        spritesData = data;

        return this;

    };
    function destroy() {

        $spritePlayer.empty();

        clearTimeout(playTimeout);

        spritesData = undefined,
        $spritePlayer = undefined,
        totalFrames = 0,
        currentFrameIndex = 0,
        currentFrameData = undefined,
        $currentFrame = undefined,
        $frames = [],
        playTimeout = undefined;

    };
    function drawSprite() {

        currentFrameData = spritesData.frames[currentFrameIndex];

        if (currentFrameIndex == 0) {

            totalFrames = spritesData.frames.length;

            $spritePlayer.css({
                height: spritesData.meta.sourceSize.h,
                width: spritesData.meta.sourceSize.w,
                marginTop: Math.round(spritesData.meta.sourceSize.h / -2),
                marginLeft: Math.round(spritesData.meta.sourceSize.w / -2)
            });

        }

        $spritePlayer.find('.frame').hide();

        $currentFrame = $frames[currentFrameIndex];
        if (typeof $currentFrame == 'undefined') {
            $currentFrame = $('<div class="frame" id="frame' + currentFrameIndex + '"></div>');
            $spritePlayer.append($currentFrame);
            $currentFrame.css({
                backgroundImage: 'url(' + spritesData.meta.image + ')',
                backgroundPosition: -1*currentFrameData.frame.x + 'px ' + -1*currentFrameData.frame.y + 'px',
                height: currentFrameData.frame.h,
                width: currentFrameData.frame.w,
                left: currentFrameData.spriteSourceSize.x,
                top: currentFrameData.spriteSourceSize.y
            });
            $frames[currentFrameIndex] = $currentFrame;
        } else {
            $currentFrame.show();
        }

        playTimeout = setTimeout(play, 40);

    };
    function play(loop){

        loop = (typeof loop !== 'undefined' && loop == true);

        drawSprite();

        currentFrameIndex = currentFrameIndex + 1;

        if (currentFrameIndex == totalFrames) {
            if (loop) currentFrameIndex = 0;
            else      stop();
        }

    };
    function stop(){
        clearTimeout(playTimeout);
    };

    return {
        init: init,
        destroy: destroy,
        play: play,
        pause: stop
    }

})(jQuery);
