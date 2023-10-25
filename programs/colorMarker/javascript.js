let markerIndex;
let patternIndex;
let fontSizeIndex;
let pattern = [
    [23, 41, 191, 209],
    [23, 41, 116, 191, 209],
    [23, 41, 32, 191, 200, 209],
    [23, 41, 32, 112, 120, 191, 200, 209],
    [45, 61, 171, 187],
    [45, 61, 116, 171, 187],
    [48, 58, 174, 184],
    [116],
    [1, 11, 21, 211, 221, 231],
    [1, 11, 21, 111, 121, 211, 221, 231],
    [],
];
let markers = [
    "<img src='tools/marker.svg' alt=''>",
    "&#9650;",
    "&#9709;",
    "&middot;",
    "+",
    "&times;",
]
let isFullscreen = false;

async function setup() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let os = urlParams.get('os');
    let workstation = urlParams.get('workstation');
    let darkMode = urlParams.get('darkMode');
    fontSizeIndex = parseInt(urlParams.get('size')) || 5;
    markerIndex = parseInt(urlParams.get('marker')) || 5;
    patternIndex = parseInt(urlParams.get('pattern')) || 2;
    let color = urlParams.get('color') ? "#"+urlParams.get('color') : "#00ff00";
    let colorMarkers = urlParams.get('colorMarkers') ? "#"+urlParams.get('colorMarkers') : "rgba(0,0,0,0.33)";
    let chess = urlParams.get('chess') === "true";
    
    // Set generic system fonts
    setSystemFont(os);

    createCells(patternIndex);
    changeFontSize();
    setBgColor(color);
    if(chess) toggleChess();
    setMarkerColor(colorMarkers);
}


function createCells(currentMarkerIndex) {
    let container = gebi("container");
    container.innerHTML = '';
    for (let i = 0; i < 231; i++) {
        let cell = document.createElement("div");
        cell.classList.add("gridBox", "centerContent");
        if(pattern[currentMarkerIndex-1].includes(i+1)) {
            cell.classList.add("mark");
            let mark = document.createElement("div");
            mark.innerHTML = markers[markerIndex-1];
            mark.classList.add("gridBox", "centerContent");
            cell.appendChild(mark);
        /* } else {
            // Removed because LAGGY even if hidden
            cell.innerHTML = i+1; */
        }
        container.appendChild(cell);
    }
    patternIndex = currentMarkerIndex;
    setMarkerColor(gebi('colorPickerMarker').value);
}

function nextPattern() {
    if(patternIndex < pattern.length) {
        createCells(patternIndex+1);
    } else {
        createCells(1);
    }
}
function prevPattern() {
    if(patternIndex > 1) { 
        createCells(patternIndex-1);
    } else {
        createCells(pattern.length);
    }
}

function nextStyle() {
    markerIndex = markerIndex+1 > markers.length ? 1 : markerIndex+1;
    createCells(patternIndex);
}
function prevStyle() {
    markerIndex = markerIndex-1 < 1 ? markers.length : markerIndex-1;
    createCells(patternIndex);
}

function changeFontSize(reset=false) {
    if(reset) fontSizeIndex = 0;
    let fontSizes = [1, 1.5, 1.8, 2.5, 3.2, 5];
    gebi('container').style.fontSize = fontSizes[fontSizeIndex] + "em";
    if(fontSizeIndex < fontSizes.length-1) {
        fontSizeIndex++
    } else {
        fontSizeIndex = 0;
    }
}

function setBgColor(color) {
    document.getElementsByTagName('body')[0].style.backgroundColor=color;
    gebi('colorPickerBg').value=color;
}

function setMarkerColor(color) {
    let currentMarkers = document.getElementsByClassName('mark');
    for(let i=0; i<currentMarkers.length; i++) {
        currentMarkers[i].getElementsByTagName('div')[0].style.color=color;
    }
    gebi('colorPickerMarker').value=color;
}

function toggleChess() {
    gebi('container').classList.toggle('chess');
}

function greenKeyboardController(event) {
    let key = event.key;
    cl(key)
        switch(key) {
            case "f": if(isFullscreen) { exitFullscreen() } else { enterFullscreen() }; break;
            case " ": if(isFullscreen) { exitFullscreen() } else { enterFullscreen() }; break;
            default:
                parent.keyboardController(event);
                break;
        }
}

function enterFullscreen() {
    isFullscreen = true;
    document.documentElement.requestFullscreen();
}

function exitFullscreen() {
    isFullscreen = false;
    if(document.exitFullscreen) {
        document.exitFullscreen();
    } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}