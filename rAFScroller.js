/* eslint-env browser */
/* eslint indent: [2, 4] */
'use strict';
var rAFScroller = {
    fallback: function() {
        throw 'No fallback method registered';
    },
    tick: function(ts) {
        var y = window.scrollY;
        var checkPos = y + rAFScroller.ppf;
        if (
            (rAFScroller.scrollDistance > 0 && checkPos >= rAFScroller.target) ||
            (rAFScroller.scrollDistance < 0 && checkPos <= rAFScroller.target)
        ) {
            scrollTo(0, rAFScroller.target);
            rAFScroller.last = 0;
        } else {
            if (rAFScroller.last === 0) {
                rAFScroller.start = ts;
            } else {
                var delta = ts - rAFScroller.last;
                // Recalc ppf (pixels per frame) every frame to ensure the set
                // duration is kept
                var pixelsLeftToScroll = (rAFScroller.target - y) << 0;
                var timeLeft = rAFScroller.duration - (ts - rAFScroller.start) << 0;
                timeLeft = timeLeft <= 0 ? 1 : timeLeft;
                delta = timeLeft === 1 ? 1 : delta;
                rAFScroller.ppf = (pixelsLeftToScroll / timeLeft * delta) << 0;
            }
            rAFScroller.last = ts;
            scrollBy(0, rAFScroller.ppf);
            requestAnimationFrame(rAFScroller.tick);
        }
    },
    scrollIntoView: function(elm, duration) {
        // First check for dependencies
        if ('offsetParent' in elm && 'requestAnimationFrame' in window) {
            // Make sure both elm and duration has been passed
            if (elm && duration) {
                // Find out how far to scroll and in what direction
                rAFScroller.scrollDistance = elm.getBoundingClientRect().top << 0;
                var target = elm;
                var offsetTop = 0;
                do {
                    offsetTop += target.offsetTop;
                } while (target = target.offsetParent);
                rAFScroller.target = offsetTop;
                rAFScroller.duration = duration;
                // Always start optimistically at 60 FPS
                rAFScroller.ppf = (rAFScroller.scrollDistance / duration * (1000 / 60)) << 0;
                requestAnimationFrame(rAFScroller.tick);
            }
        } else if (typeof rAFScroller.fallback === 'function') {
            rAFScroller.fallback(elm);
        } else {
            throw 'fallback was not set to a function';
        }
    },
    last: 0,
    start: 0,
    scrollDistance: 0,
    target: 0,
    ppf: 0,
    duration: 0
};
