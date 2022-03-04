let animationOngoing = false;
let stopped = false;

// To use with stylesheet defined smooting
function moveToPoint(element, x, y) {
    addAnimationEndStop(element);
    element.style.left = x + "%";
    element.style.top = y + "%";
}

// To use with different easing styles
function animateToPoint(element, x, y, speed, smoothing, delay) {
    addAnimationEndStop(element);
    speed = speed ? speed : 2000;
    smoothing = smoothing ? smoothing : "ease-in-out";
    delay = delay ? delay : 0;
    
    /* transition: all 2s ease-in-out 0s; */
    let transition = "all " + speed + "ms " + smoothing + " " + delay + "ms";
    element.style.transition = transition;
    element.style.left = x + "%";
    element.style.top = y + "%";
}

function addAnimationEndStop(element) {
    animationOngoing = true;
    let transitionEnd = whichTransitionEvent(element);
    element.addEventListener(transitionEnd, cssFinished, false);
}

function cssFinished() {
    /* console.log("finsihed"); */
    animationOngoing = false;
}

// move incrementally on point
async function moveAlongPath(element, path) {
    // Ignroe button press if already playing
    if(animationOngoing) {
        console.log("animation already playing");
        return;
    }

    for (let i = 0; i < path.length; i++) {
        if(stopped) break;
        /* moveToPoint(element, path[i][0], path[i][1]); */
        animateToPoint(element, path[i][0], path[i][1], path[i][2], path[i][3], path[i][4]);
        // wait till css animation finished
        while(animationOngoing) {  //  && !stopped
            await delay(5);
        }
      }
}

/* function stopAnimation(element, path) {
    // moveToPoint(element, path[0][0], path[0][1]);
    stopped = true;
    moveToPoint(element, path[0][0], path[0][1], 0, "linear", 0);
    console.log("stopped");
} */

async function resetAnimation(element, initialPosition) {
    animationOngoing = false;
    stopped = true;
    // wait for while loop in moveAlongPath() to catch on
    await delay(50);  
    element.style.transition = "all 0s linear 0s";
    element.style.left = initialPosition[0] + "%";
    element.style.top = initialPosition[1] + "%";
    stopped = false;
}

function whichTransitionEvent(element){
    let t;
    let transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( element.style[t] !== undefined ){
            return transitions[t];
        }
    }
}