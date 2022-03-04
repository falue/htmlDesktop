// VAR
let mapscrollLeft = 600;
let mapscrollTop = 315;  // 325 
let mapscrollLeftInitial = mapscrollLeft;
let mapscrollTopInitial = mapscrollTop;
let zoomScale = .4;  // initial
let initialZoom = zoomScale;
let speed = 4;  // 1=normal, 0.8 = faster, 1.2=slower
let startupStage0 = false;

// ANIMATION PATHS
/*
Standpunkt Doro:  47.572633, 7.572217 
Bewegender Standpunkt vom Peter der im Auto fährt von: 
47.564656, 7.595582 
bis
47.557995, 7.588072
 */
/* let pathsTarget = [
    // x%, y%, speed, smoothing, delay before animation.
    [0,10, 1000, "linear", 0],
    [90,60, 2000, "ease-in-out", 1000],
    [0,0, 500, "ease-in-out", 500],
    [29.1,29.1, 2500, "ease-out", 0]
]; */

let pathsTarget = [
    // x%, y%, speed, smoothing, delay before animation.
    [74.25,23, 1750*speed, "ease-in-out", 1000],
    [66.5,25.3, 2500*speed, "ease-in", 50],
    [60,28.5, 2500*speed, "ease-out", 0],
    [58.4,30.5, 1750*speed, "ease-in-out", 200],
    [60.5,33, 1000*speed, "ease-in", 0],
    [62.6,34.25, 1000*speed, "linear", 0],
    [64.25,36.7, 750*speed, "linear", 0],
    [63.75,39.5, 750*speed, "linear", 0],
    [65,41.5, 750*speed, "ease-out", 0],
];

let initialTarget = [74.8,28];  // ECHTER START
/* let initialTarget = [65,41.5]; // FINALE */


let lastStage = 0;

// STAGES
// initial stage
async function stage0() {
    /* swap("stage3", "stage0");  // remove last stage and display first */
    swap("stage"+lastStage, "stage"+stage);  // remove last stage and display first
	
    changeTitle('MyGPS');
}

async function stage1() {
    await delay(2500);
    displayCurrentStage();
    startupStage0 = false;
}

async function stage2(test1, test2) {
    displayCurrentStage();
    nextStage(1500);
}

async function stage3(test1) {
    displayCurrentStage();
    // Reset scroll position
    hide('reset');
    resetScrollPosition();
}


function resetScrollPosition(initial) {
    let mapContainer = document.getElementById('mapContainer');
    if(initial == "initial") {
        mapContainer.scrollTop = mapscrollTopInitial;
        mapContainer.scrollLeft = mapscrollLeftInitial;
    } else {
        mapContainer.scrollTop = mapscrollTop;
        mapContainer.scrollLeft = mapscrollLeft;
    }
}

function displayCurrentStage() {
    lastStage = stage;  // Used for rollover
    console.log("start stage"+stage);
    // Hide last stage and display current
    swap("stage"+(stage-1), "stage"+stage);
}

function adjustSpeed(newSpeed) {
    /* console.log(pathsTarget); */
    /* console.log(newSpeed); */

    for (let i = 0; i < pathsTarget.length; i++) {
        pathsTarget[i][2] = pathsTarget[i][2]/speed*newSpeed;
        /* console.log(pathsTarget[i][2]); */
      }

    speed = newSpeed;

    startAnimationPieter();
    /* document.getElementById('speed').innerHTML = "PLAY"; */
}
function adjustSpeedStart() {
    stopAnimationPieter();
    /* document.getElementById('speed').innerHTML = "STOP"; */
}

function adjustSpeedDisplay(newSpeed) {
    let humanNumber = Math.round((10-newSpeed) * 100) / 100;
    let additional = humanNumber <= 2 ? "slow" : humanNumber >= 8 ? "fast" : "";
    document.getElementById('speed').innerHTML = humanNumber + " " +additional;
    /* document.getElementById('speed').innerHTML = newSpeed; */
}


async function startAnimationPieter() {
    document.getElementById('pinPieter').classList.add('pulsating');
    hide('play');
    hide('reset');
    show('pause');
    setCoord('Moving..');
    await moveAlongPath(document.getElementById('target'), pathsTarget);
    setCoord('47.557995, 7.588072');
    document.getElementById('pinPieter').classList.remove('pulsating');
    show('reset');
    hide('pause');
}

function resetPieter() {
    show('play');
    hide('reset');
    hide('pause');
    resetAnimation(document.getElementById('target'), initialTarget)
    setCoord('47.564656, 7.595582');
}

async function stopAnimationPieter() {
    show('play');
    hide('reset');
    hide('pause');
    await resetAnimation(document.getElementById('target'), initialTarget);
    setCoord('47.564656, 7.595582');
    document.getElementById('pinPieter').classList.remove('pulsating');
    hide('reset');
}

function setCoord(coordinates) {
    let coord = document.getElementById('coordinates');
    coord.innerHTML = coordinates;
}

function resetStages() {
    hide("stage0");
    hide("stage1");
    hide("stage2");
    hide("stage3");
}

function resetAllStages() {
    /* resetStages(); */
    resetAnimation(document.getElementById('target'), initialTarget);
    show('play');
    hide('reset');
    hide('pause');
    hide('speedAdjust');
    /* resetZoom(); */
    /* resetScrollPosition(); */
    playStage(0);
}

function zoom(value) {
    let map = document.getElementById('map');
    zoomScale += value;
    /* console.log(zoomScale); */
    map.style.transform = "scale("+zoomScale+")";
}

async function resetZoom() {
    zoomScale = initialZoom;
    zoom(zoomScale);
    await delay(666);  // wait for css effect of scrolling
    resetScrollPosition("initial");
}


function saveScrollPosition() {
    /* console.log(event); */
    let mapContainer = document.getElementById('mapContainer');
    mapscrollTop = mapContainer.scrollTop;
    mapscrollLeft = mapContainer.scrollLeft;
    /* console.log(mapscrollLeft + "\t" + mapscrollTop); */
}

function loadGPSHistory() {
    if(!startupStage0) {
        console.log("stage 1 loading");
        playStage(1);
        startupStage0 = true;
    } else {
        console.log("!! stage 1 already loading");
    }
}

// Start first nextStep after window is in view again
document.addEventListener("visibilitychange", function() {
    console.log(document.hidden, document.visibilityState);
    if(document.visibilityState === 'visible' && stage === 0) {
        loadGPSHistory();
    }
}, false);


