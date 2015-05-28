/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.ElementTransitionRenderer = function (elementRenderer, direction) {
        this._elementRenderer = elementRenderer;
        this._$element = elementRenderer.$element;
        this._element = elementRenderer.element;
        this._direction = direction;
        this._transition = direction === klynt.ElementTransitionRenderer.IN ? this._element.transitionIn : this._element.transitionOut;

        this.init();
    };

    klynt.ElementTransitionRenderer.prototype = {
        _transition: null,
        _elementRenderer: null,
        _$element: null,
        _element: null,
        _direction: null,

        get duration() {
            return this._transition ? this._transition.duration * 1000 : 1000;
        },


        _speed: 1,
        _lettersCount: 0,
        _pauses: null,
        _pausesTotal: 0
    };

    klynt.ElementTransitionRenderer.prototype.init = function() {
        if (this._transition.type == 'typeWriter') {
            this._pauses = [];
            var letters = this._element.text.match(/(<.*?\>)|{{(\d+)}}|(&.*?;)|.{1}/g);
            var nextPause = 0;
            var modifiedText = '';
            for (var i = 0; i < letters.length; i++) {
                var pauseMatches = letters[i].match(/{{(\d+)}}/);
                if (pauseMatches && pauseMatches.length > 1) {
                    var pause = parseInt(pauseMatches[1]) / 1000;
                    nextPause += pause;
                } else if (letters[i].match(/(<.*?\>)/)) {
                    modifiedText += letters[i];
                } else {
                    modifiedText += '<span class="typeWriter typeWriter-' + this._lettersCount + '">' + letters[i] + '</span>';
                    if (nextPause) {
                        this._pauses.push({
                            duration: nextPause,
                            index: this._lettersCount
                        });
                        this._pausesTotal += nextPause;
                        nextPause = 0;
                    }
                    this._lettersCount++;
                }
            }
            
            var $content = this._$element.find('.nano-content');
            $content.html(modifiedText);
            $content.find('.typeWriter').css('visibility', 'hidden');

            this._speed = klynt.typeWriterLettersPerSecond || 25;
        }
    };

    klynt.ElementTransitionRenderer.prototype.execute = function () {
        switch (this._transition.type) {
        case 'fade':
            this._executeFadeTransition();
            break;
        case 'barWipe':
            this._executeBarWipeTransition();
            break;
        case 'typeWriter':
            this._executeTypeWriterTransition();
            break;
        }
    };

    klynt.ElementTransitionRenderer.prototype.reset = function () {
        switch (this._transition.type) {
        case 'fade':
            this._resetFadeTransition();
            break;
        case 'barwipe':
            this._resetBarWipeTransition();
            break;
        case 'typeWriter':
            this._resetTypeWriterTransition();
            break;
        }
    };

    klynt.ElementTransitionRenderer.prototype._executeTypeWriterTransition = function () {
        var $content = this._$element.find('.nano-content');
        $content.find('.typeWriter').css('visibility', 'hidden');

        var typingDuration = this._lettersCount / this._speed;
        var totalDuration = typingDuration + this._pausesTotal;
        var previousPauses = 0;
        var previousLetterIndex = -1;
        var nextPauseIndex = 0;
        TweenLite.to($content[0], totalDuration, {
            onUpdate: function (tween, lettersCount, pauses) {
                var currentTime = totalDuration * tween.ratio;
                do {
                    var nextPause = pauses[nextPauseIndex];
                    var nextLetterIndex = Math.round(lettersCount * (currentTime - previousPauses) / typingDuration);
                    
                    if (nextPause && nextPause.index == previousLetterIndex + 1) {
                        previousPauses += nextPause.duration;
                        nextPauseIndex++;
                    } else {
                        if (previousLetterIndex <= nextLetterIndex) {
                            previousLetterIndex++;
                            $content.find('.typeWriter-' + previousLetterIndex).css('visibility', 'visible');
                        } else {
                            
                        }
                    }
                } while (previousLetterIndex <= nextLetterIndex);
            },
            onUpdateParams: ['{self}', this._lettersCount, this._pauses],
            ease: Linear.easeNone
        });
    };

    klynt.ElementTransitionRenderer.prototype._resetTypeWriterTransition = function () {
        var $content = this._$element.find('.nano-content');
        TweenLite.killTweensOf($content[0]);
        $content.find('.typeWriter').css('visibility', 'hidden');
    };

    klynt.ElementTransitionRenderer.prototype._executeFadeTransition = function () {
        switch (this._direction) {
        case klynt.ElementTransitionRenderer.IN:
            this._$element
                .stop()
                .css({
                    opacity: 0
                })
                .fadeTo(this.duration, this._getElementOpacity());
            break;
        case klynt.ElementTransitionRenderer.OUT:
            this._$element
                .stop()
                .fadeOut(this.duration);
            break;
        }
    };

    klynt.ElementTransitionRenderer.prototype._resetFadeTransition = function () {
        this._$element.css({
            opacity: this._getElementOpacity(),
            display: 'block'
        });
    };

    klynt.ElementTransitionRenderer.prototype._getElementOpacity = function () {
        return this._element.style ? this._element.style.opacity : 1;
    };

    klynt.ElementTransitionRenderer.prototype._executeBarWipeTransition = function () {
        var params, duration = this.duration / 1000;

        switch (this._direction) {
        case klynt.ElementTransitionRenderer.IN:
            params = {
                duration: duration,
                fromProperties: {
                    clip: getClipString(this._$element, 0, 0)
                },
                toProperties: {
                    clip: getClipString(this._$element, 0, 1),
                    onComplete: function () {
                        this._resetBarWipeTransition();
                    }.bind(this)
                }
            }
            klynt.animation.killTweens(this._$element);
            klynt.animation.fromTo(params, this._$element);
            break;
        case klynt.ElementTransitionRenderer.OUT:
            params = {
                duration: duration,
                fromProperties: {
                    clip: getClipString(this._$element, 0, 1)
                },
                toProperties: {
                    clip: getClipString(this._$element, 1, 1),
                    onComplete: function () {
                        this._resetBarWipeTransition();
                    }.bind(this)
                }
            }
            klynt.animation.killTweens(this._$element);
            klynt.animation.fromTo(params, this._$element);
        }
    };

    klynt.ElementTransitionRenderer.prototype._resetBarWipeTransition = function () {
        this._$element.css({
            clip: ''
        });
    };

    function getClipString($element, leftFactor, rightFactor) {
        var width = $element.width();
        var height = $element.height();
        return 'rect(' + 0 + 'px ' + parseInt(width * rightFactor) + 'px ' + height + 'px ' + parseInt(width * leftFactor) + 'px)';
    }

    klynt.ElementTransitionRenderer.IN = 'in';
    klynt.ElementTransitionRenderer.OUT = 'out';
})(window.klynt);