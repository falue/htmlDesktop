// VAR
let mapscrollLeft = 0;
let mapscrollTop = 280;
let mapscrollLeftInitial = mapscrollLeft;
let mapscrollTopInitial = mapscrollTop;
let zoomScale = .4;  // initial
let initialZoom = zoomScale;
let speed = 4;  // 1=normal, 0.8 = faster, 1.2=slower
let startupStage0 = false;

// ANIMATION PATHS
/*
    Standpunkt Akademie:  47.572761, 7.572122
    Langsam bewegender Standpunkt von Lena Kemp: 
    47.552949, 7.581346
*/

let pathsTarget = [
    // x%, y%, speed, smoothing, delay before animation.
    // IMPORTANT, OGIRINAL:
    [44.2,34.5, 8000*speed, "ease-in-out", 1000],  // Eigener Fantasiepunkt 80m vor doro
    // [59,34.5, 4000*speed, "ease-in-out", 1000],  // Evtl. neues ende, angegeben als stndpkt. PIETER
    // [58.2,36, 4000*speed, "ease-in-out", 1000],  // Evtl. neues ende, angegeben als ENDE DORO
];

let initialTarget = [41.875,38.25];  // ECHTER START DORO

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

function adjustSpeed(newSpeed) {
    for (let i = 0; i < pathsTarget.length; i++) {
        pathsTarget[i][2] = pathsTarget[i][2]/speed*newSpeed;
        /* console.log(pathsTarget[i][2]); */
      }
    speed = newSpeed;
    startAnimationAkademie();
    /* document.getElementById('speed').innerHTML = "PLAY"; */
}
function adjustSpeedStart() {
    stopAnimationAkademie();
    /* document.getElementById('speed').innerHTML = "STOP"; */
}

function adjustSpeedDisplay(newSpeed) {
    let humanNumber = Math.round((10-newSpeed) * 100) / 100;
    let additional = humanNumber <= 2 ? "slow" : humanNumber >= 8 ? "fast" : "";
    document.getElementById('speed').innerHTML = humanNumber + " " +additional;
    /* document.getElementById('speed').innerHTML = newSpeed; */
}

async function startAnimationAkademie() {
    await delay(4000);
    document.getElementById('pinLena').classList.add('pulsating');
    hide('play');
    hide('reset');
    show('pause');
    setCoord('Moving..');
    await moveAlongPath(document.getElementById('target'), pathsTarget);
    setCoord('47.555377, 7.583859');
    document.getElementById('pinLena').classList.remove('pulsating');
    show('reset');
    hide('pause');
}

function resetAkademie() {
    show('play');
    hide('reset');
    hide('pause');
    resetAnimation(document.getElementById('target'), initialTarget)
    setCoord('47.552949, 7.581346');
}

async function stopAnimationAkademie() {
    show('play');
    hide('reset');
    hide('pause');
    await resetAnimation(document.getElementById('target'), initialTarget);
    setCoord('47.586398, 7.588711');
    document.getElementById('pinAkademie').classList.remove('pulsating');
    hide('reset');
}

function setCoord(coordinates) {
    let coord = document.getElementById('coordinatesLena');
    coord.innerHTML = coordinates;
}
/* 
function resetAllStages() {
    resetAnimation(document.getElementById('target'), initialTarget);
    show('play');
    hide('reset');
    hide('pause');
    hide('speedAdjust');
    playStage(0);
}
*/

function zoom(value) {
    let map = document.getElementById('map');
    zoomScale += value;
    /* console.log(zoomScale); */
    map.style.transform = "scale("+zoomScale+")";
    // Scale pins
    let pins = document.querySelectorAll('.pin');  //  '.pin div'
    // BUG: does not work while animating
    if(value == initialZoom) {
        // Reset transformations
        pins[0].style.transform = "scale(1)";
        pins[1].style.transform = "scale(1)";
    } else {
        let currentTransform = pins[0].style.transform;
        currentTransform = !currentTransform ? 1.0 : currentTransform.match(/[\d\.]+/g)[0];
        /* console.log("transf: " + currentTransform); */
        pins[0].style.transform = "scale("+(currentTransform-value/3)+")";
        pins[1].style.transform = "scale("+(currentTransform-value/3)+")";
    }
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
