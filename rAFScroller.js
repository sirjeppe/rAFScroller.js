/* eslint-env browser */
/* eslint indent: [2, 4] */
'use strict';
var rAFScroller = {
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
                var timeLeft = rAFScroller.config.duration - (ts - rAFScroller.start) << 0;
                timeLeft = timeLeft <= 0 ? 1 : timeLeft;
                delta = timeLeft === 1 ? 1 : delta;
                rAFScroller.ppf = (pixelsLeftToScroll / timeLeft * delta) << 0;
                if (rAFScroller.config.timingFunction === 'ease-out') {
                    var wasNegative = false;
                    if (rAFScroller.ppf < 0) {
                        wasNegative = true;
                        rAFScroller.ppf /= -1;
                    }
                    rAFScroller.ppf = rAFScroller.ppf * Math.log10(10 * rAFScroller.ppf) << 0;
                    rAFScroller.ppf = wasNegative ? rAFScroller.ppf / -1 : rAFScroller.ppf;
                }
            }
            rAFScroller.last = ts;
            scrollBy(0, rAFScroller.ppf);
            requestAnimationFrame(rAFScroller.tick);
        }
    },
    calcTarget: function(elm, offset) {
        var offsetTop = 0;
        do {
            offsetTop += elm.offsetTop;
        } while (elm = elm.offsetParent);
        return offsetTop + offset;
    },
    scrollIntoView: function(elm, config) {
        // First check for dependencies
        if ('offsetParent' in elm && 'requestAnimationFrame' in window) {
            // Make sure both elm and duration has been passed
            if (elm) {
                // Setup config if it's given
                if (typeof config === 'object') {
                    for (var i in rAFScroller.config) {
                        if (i in config) {
                            rAFScroller.config[i] = config[i];
                        }
                    }
                }
                // Find out how far to scroll and in what direction
                rAFScroller.scrollDistance = elm.getBoundingClientRect().top << 0;
                rAFScroller.target = rAFScroller.calcTarget(elm, rAFScroller.config.offset);
                rAFScroller.scrollDistance += rAFScroller.config.offset;
                // Always start optimistically at 60 FPS
                rAFScroller.ppf = (rAFScroller.scrollDistance / rAFScroller.config.duration * (1000 / 60)) << 0;
                requestAnimationFrame(rAFScroller.tick);
            }
        } else if (typeof rAFScroller.fallback === 'function') {
            rAFScroller.fallback(rAFScroller.target);
        } else {
            throw 'fallback was not set to a function';
        }
    },
    config: {
        timingFunction: 'ease-out',
        duration: 300,
        offset: 0,
        fallback: function() {
            throw 'No fallback method registered';
        }
    },
    last: 0,
    start: 0,
    scrollDistance: 0,
    target: 0,
    ppf: 0
};
