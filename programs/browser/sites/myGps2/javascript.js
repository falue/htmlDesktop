// VAR
let mapscrollLeft = 750;
let mapscrollTop = 200;  // 325 
let mapscrollLeftInitial = mapscrollLeft;
let mapscrollTopInitial = mapscrollTop;
let zoomScale = .6;  // initial
let initialZoom = zoomScale;
let speed = 4;  // 1=normal, 0.8 = faster, 1.2=slower
let startupStage0 = false;

// ANIMATION PATHS
/*
Szene 245
Bewegender Standpunkt von Doro die im Auto fährt von: 
47.586398, 7.588711 
bis
47.584851, 7.588031
Standpunkt Pieter:  47.585113, 7.588076 
*/

let pathsTarget = [
    // x%, y%, speed, smoothing, delay before animation.
    // IMPORTANT, OGIRINAL:
    [59.7,31, 4000*speed, "ease-in-out", 1000],  // Eigener Fantasiepunkt 80m vor doro
    // [59,34.5, 4000*speed, "ease-in-out", 1000],  // Evtl. neues ende, angegeben als stndpkt. PIETER
    // [58.2,36, 4000*speed, "ease-in-out", 1000],  // Evtl. neues ende, angegeben als ENDE DORO
];

let initialTarget = [62.7,22.25];  // ECHTER START DORO

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
    startAnimationDoro();
    /* document.getElementById('speed').innerHTML = "PLAY"; */
}
function adjustSpeedStart() {
    stopAnimationDoro();
    /* document.getElementById('speed').innerHTML = "STOP"; */
}

function adjustSpeedDisplay(newSpeed) {
    let humanNumber = Math.round((10-newSpeed) * 100) / 100;
    let additional = humanNumber <= 2 ? "slow" : humanNumber >= 8 ? "fast" : "";
    document.getElementById('speed').innerHTML = humanNumber + " " +additional;
    /* document.getElementById('speed').innerHTML = newSpeed; */
}

async function startAnimationDoro() {
    await delay(4000);
    document.getElementById('pinDoro').classList.add('pulsating');
    hide('play');
    hide('reset');
    show('pause');
    setCoord('Moving..');
    await moveAlongPath(document.getElementById('target'), pathsTarget);
    setCoord('47.584851, 7.588031');
    document.getElementById('pinDoro').classList.remove('pulsating');
    show('reset');
    hide('pause');
}

function resetDoro() {
    show('play');
    hide('reset');
    hide('pause');
    resetAnimation(document.getElementById('target'), initialTarget)
    setCoord('47.586398, 7.588711');
}

async function stopAnimationDoro() {
    show('play');
    hide('reset');
    hide('pause');
    await resetAnimation(document.getElementById('target'), initialTarget);
    setCoord('47.586398, 7.588711');
    document.getElementById('pinDoro').classList.remove('pulsating');
    hide('reset');
}

function setCoord(coordinates) {
    let coord = document.getElementById('coordinatesDoro');
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
