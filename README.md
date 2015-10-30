# rAFScroller.js
Vertical (only) animated scrolling using requestAnimationFrame.

## Usage
Just include the js file and then call:
```javascript
// rAFScroller.scrollIntoView() takes two arguments; an element and a config
// object. The element should be an element in the DOM and the config object
// can hold the following properties and values (default values shown):
var config = {

    duration: 300,
    // A positive number representing the duration of the animation.

    timingFunction: 'ease-out',
    // Takes a string of 'ease-out' or something else. Anything else but
    // 'ease-out' will be interpreted as 'linear' and cause a linear timing
    // function to be applied.

    offset: 0,
    // This offset will be applied to the vertical position of the element.

    fallback: function(targetYPos) {
        throw 'No fallback method registered';
    }
    // Fallback function if required browser features is not available in the
    // current browser. The only argument passed to the fallback is the
    // calculated target Y position that the page should have scrolled to.

};

// Scroll #target into view with default configuration (as above)
rAFScroller.scrollIntoView(document.querySelector('#target'));

// Scroll #target into view with a fallback function using window.scrollTo()
rAFScroller.scrollIntoView(document.querySelector('#target'), {
    fallback: function(targetYPos) {
        window.scrollTo(0, targetYPos);
    }
});
```
