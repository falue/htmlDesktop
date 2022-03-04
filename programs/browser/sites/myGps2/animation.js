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

let recordingPoints = false;
let coords = "";

function toggleRecordingPoints(id) {
    let element = document.getElementById(id);
    if(!recordingPoints) {
        console.log("on");
        // add child plane to interrupt onclick/scroll
        let plane = document.createElement("div");
        let object = element.getBoundingClientRect();
        /* console.log(object); */
        plane.id = "plane"
        plane.style.top = object.top + "px";
        plane.style.left = object.left + "px";
        plane.style.width = object.width + "px";
        plane.style.height = object.height + "px";
        plane.style.backgroundColor = "rgba(255,255,255,.5)";
        /* plane.style.border = "red thin solid"; */
        plane.style.position = "fixed";
        plane.style.zIndex = "999";
        document.body.appendChild(plane);

        recordingPoints = true;
        plane.onmousemove = function(event) {
            /* let top = mapContainer.scrollTop;
            let left = mapContainer.scrollLeft; */
            let pos = getMousePositionOverElement(plane, event);
            /* console.log(pos); */
        };

        plane.onclick = function(event) {
            /* let top = mapContainer.scrollTop;
            let left = mapContainer.scrollLeft; */
            /* let pos = getMousePositionOverElement(plane, event); */
            /* let pos = getMousePositionOverElement(document.getElementById('map'), event); */
            let pos = getMousePositionOverElement(plane, event);
            // console.log(pos + "CLICK");
            drawPoint(plane, pos);
            /* coords += pos.join(' - ') + "\n"; */
            coords += '['+pos[0]+','+pos[1]+', 100*speed, "linear", 0],\n';
            /* coords += '['+(pos[0]*1.538).toFixed(2)+','+(pos[1]*1.538).toFixed(2)+', 100*speed, "linear", 0],\n'; */
            /* [59.7,31, 4000*speed, "ease-in-out", 1000], */
        };
    } else {
        console.log("FINISHED. Coords:");
        console.log(coords);
        prompt("Here you are:", coords);
        /* element.onclick = function() {};
        element.onmousemove = function() {}; */
        document.getElementById('plane').remove();
        recordingPoints = false;
        coords = "";
    }
}

function getMousePositionOverElement(element, event) {
    /* let rect = event.target.getBoundingClientRect(); */
    let bodyRect = document.body.getBoundingClientRect();
    let elemRect = element.getBoundingClientRect();
    let offsetY  = elemRect.top - bodyRect.top;
    let offsetX   = elemRect.left - bodyRect.left;
    let width = elemRect.width;
    let height = elemRect.height;

    // Get mouse position
    let x = event.clientX - offsetX; 
    let y = event.clientY - offsetY;

    // Make percentage
    let relX = (100 / width * x).toFixed(2);
    let relY = (100 / height * y).toFixed(2);

    /* console.log("Left? : " + x + " ; Top? : " + y + "."); */
    /* return width+", "+height; */
    // console.log(relX +"%, "+ relY +"%, "+ x+", "+y+", "+width+", "+height); // All are data belongs to us
    /* return offsetX+", "+offsetY; */
    /* return relX +", "+ relY; */
    return [relX, relY];
}

function drawPoint(element, pos) {
    //
    let point = document.createElement('div');
    point.style.left = pos[0] + "%";
    point.style.top = pos[1] + "%";
    point.style.width = "8px";
    point.style.height = "8px";
    point.style.border = "red solid 3px";
    point.style.marginTop = "-7px";
    point.style.marginLeft = "-7px";
    point.style.borderRadius = "50%";
    point.style.position = "absolute";
    element.appendChild(point);
}