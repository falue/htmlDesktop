let markerIndex;
let patternIndex;
let fontSize;
let color;
let colorMarkers;
let disabledKeys;
let opacity;
let dblClickAllowed;
let pattern = [
    [23, 41, 191, 209],
    [23, 41, 116, 191, 209],
    [23, 41, 32, 191, 200, 209],
    [23, 41, 32, 112, 120, 191, 200, 209],
    [45, 61, 116, 171, 187],
    [45, 61, 171, 187],
    [48, 58, 174, 184],
    [116],
    [],
    [1, 11, 21, 211, 221, 231],
    [1, 11, 21, 111, 121, 211, 221, 231],
];
let markers = [
    "<img src='tools/marker.svg' alt=''>",
    "&#9650;",
    "&#9709;",
    "&middot;",
    "+",
    "✚",
    "&times;",
]
let isFullscreen = false;

async function setup() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let os = urlParams.get('os');
    let workstation = urlParams.get('workstation');
    let darkMode = urlParams.get('darkMode');
    fontSize = parseInt(urlParams.get('size')) || 4;
    markerIndex = parseInt(urlParams.get('marker')) || 5;
    patternIndex = parseInt(urlParams.get('pattern')) || 1;
    opacity = parseInt(urlParams.get('opacity')) || 33;
    color = urlParams.get('color') ? "#"+urlParams.get('color') : "#00ff00";
    dblClickAllowed = urlParams.get('dblClickAllowed') ? urlParams.get('dblClickAllowed') == "true" : false;
    disabledKeys = urlParams.get('disabledKeys') ? urlParams.get('disabledKeys') == "true" : false;
    let enforceDisablingKeyFromUrl = disabledKeys ? true : false;
    colorMarkers = urlParams.get('colorMarkers') ? "#"+urlParams.get('colorMarkers') : "#000000";

    /// read locaStorage
    let data = JSON.parse(localStorage.getItem('colorMarker'));
    if(data) {
        cl("loaded");
        fontSize = data.fontSize;
        markerIndex = data.markerIndex;
        opacity = data.opacity;
        patternIndex = data.patternIndex;
        dblClickAllowed = data.dblClickAllowed;
        color = data.color;
        colorMarkers = data.colorMarkers;
        // Overwrite saved value if it is part of the url
        disabledKeys = enforceDisablingKeyFromUrl ? true : data.disabledKeys;
    }

    
    // Set generic system fonts
    setSystemFont(os);

    createCells(patternIndex);
    setOpacity(opacity);
    gebi('opacitySlider').value = opacity;
    setFontSize(fontSize);
    gebi('fontSizeSlider').value=fontSize;
    setBgColor(color);
    setMarkerColor(colorMarkers);
    gebi('disabledKeys').checked = disabledKeys;
    gebi('dblClickAllowed').checked = dblClickAllowed;

    // Hide back to index button if in iframe
    if(window.location !== window.parent.location) {
        hide('backToIndex');
    } else {
        hide('fullscreenSettings');
    }
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
    setMarkerColor(colorMarkers);
    if(patternIndex == 9) {
        gebi('patternStyle').innerHTML = "9 (empty)";
    } else {
        gebi('patternStyle').innerHTML = patternIndex;
    }

    saveToLocalStorage();
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

function setFontSize(newFontSize) {
    gebi('container').style.fontSize = newFontSize + "em";
    gebi('fontSize').innerHTML = newFontSize + "em";
    fontSize = newFontSize;
    saveToLocalStorage();
}

function setOpacity(newOpacity) {
    gebi('container').style.opacity = newOpacity / 100;
    gebi('opacity').innerHTML = newOpacity + "%";
    opacity = newOpacity;
    saveToLocalStorage();
}

function setBgColor(newColor) {
    document.getElementsByTagName('body')[0].style.backgroundColor=newColor;
    gebi('colorPickerBg').value=newColor;
    color=newColor;
    saveToLocalStorage();
}

function setMarkerColor(newColor) {
    let currentMarkers = document.getElementsByClassName('mark');
    for(let i=0; i<currentMarkers.length; i++) {
        currentMarkers[i].getElementsByTagName('div')[0].style.color=newColor;
    }
    gebi('colorPickerMarker').value=newColor;
    colorMarkers=newColor;
    saveToLocalStorage();
}

function greenKeyboardController(event) {
    let key = event.key;
    cl(key)
    if(!disabledKeys) {
        switch(key) {
            case "f": if(isFullscreen) { exitFullscreen() } else { enterFullscreen() }; break;
            case " ": if(isFullscreen) { exitFullscreen() } else { enterFullscreen() }; break;
            default:
                parent.keyboardController(event);
                break;
        }
    }
}

function changeDisablingKeys(checked) {
    disabledKeys = checked;
    saveToLocalStorage();
}

function dblClickFullscreen() {
    if(dblClickAllowed) {
        toggleFullscreen();
    }
}

function toggleFullscreen() {
    if(isFullscreen) {
        exitFullscreen();
    } else {
        enterFullscreen();
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

function saveToLocalStorage() {
    let data = `{
        "markerIndex": `+markerIndex+`,
        "patternIndex": `+patternIndex+`,
        "fontSize": `+fontSize+`,
        "opacity": `+opacity+`,
        "dblClickAllowed": `+dblClickAllowed+`,
        "color": "`+color+`",
        "colorMarkers": "`+colorMarkers+`",
        "disabledKeys": `+disabledKeys+`  
    }`
    localStorage.setItem('colorMarker', data);
}