let timeout;
let timeoutSpeedChange;
let video;
let duration;
let isFullscreen = false;

function setup() {
    video = document.getElementById("video");
    duration = video.duration;
    document.getElementById('duration').innerHTML = duration;
}

// Feel free to fork and improve on this if you'd like
function setColors() {
    let speed = document.getElementById("speed").value;
    let blur = document.getElementById("blur").value;
    let saturate = document.getElementById("saturate").value;
    let hue = document.getElementById("hue").value;
    let brightness = document.getElementById("brightness").value;
    let contrast = document.getElementById("contrast").value;
    let invert = document.getElementById("invert").value;
    let sepia = document.getElementById("sepia").value;

    let filters = "blur(" + blur + "px) saturate(" + saturate + ") hue-rotate(" + hue + "deg) brightness(" + brightness + "%) contrast(" + contrast + ") invert(" + invert + ") sepia(" + sepia + ")";
    video.style.webkitFilter = filters;
    video.style.filter = filters;
    changeSpeed(speed);

    document.getElementById("speed-val").innerHTML = speed/10;
    document.getElementById("blur-val").innerHTML = blur;
    document.getElementById("saturate-val").innerHTML = saturate;
    document.getElementById("hue-val").innerHTML = hue;
    document.getElementById("brightness-val").innerHTML = brightness;
    document.getElementById("contrast-val").innerHTML = contrast;
    document.getElementById("invert-val").innerHTML = invert;
    document.getElementById("sepia-val").innerHTML = sepia;
}

function toggleClass(id, className) {
    let element = document.getElementById(id);
    element.classList.toggle(className);
}

function changeSpeed(value) {
    value /= 10;
    document.getElementById("speed-val").innerHTML = value;

    //console.log(timeout, timeoutSpeedChange);

    if(value <= 16) {
        // use standard browser playback speed mode
        //console.log("clear timeouts");
        clearTimeout(timeout);
        timeout = "";
        clearTimeout(timeoutSpeedChange);
        timeoutSpeedChange = "";

        video.playbackRate = value;
        if(video.paused) video.play();
    } else {
        // horsin' around
        if(!timeoutSpeedChange) {
            timeoutSpeedChange = setTimeout(function() {
                console.log("timeoutSpeedChange NOW!");
                video.playbackRate = 1;
                video.pause();
                clearTimeout(timeout);
                timeout = "";
                clearTimeout(timeoutSpeedChange);
                timeoutSpeedChange = "";
                fasterPussycat(value);
            }, 250);
        }
    }
}

function fasterPussycat(value) {
    let currentTime = video.currentTime;
    timeout = setTimeout(function() {
        let jump = currentTime + value/100;
        if(jump > video.duration) jump = value/100;
        //console.log(value, jump);
        video.currentTime = jump;
        fasterPussycat(value);
    }, 40);  // 40 für 25fps
}

function loadVideoFile(videoFile) {
    var file = videoFile.files[0];
    var type = file.type;
    var videoNode = document.querySelector('video');
    var canPlay = videoNode.canPlayType(type);
    var fileURL = URL.createObjectURL(file);
    videoNode.src = fileURL;
}


function changeSource(source) {
    video.src = source;
}

function togglePlayPause() {
    video.paused ? video.play() : video.pause();
}

let i = 0;
let o = 0;

function keyboardController(event) {
    // Ignore presses in textareas and inputs, but NOT buttons because mostly fake
    //if(event.target.localName !== "textarea" && event.target.localName !== "input") {
    let key = event.key;
    switch(key) {
        case "0": case "m": toggleMute(); break;
        case "1": case "i": setI(); event.preventDefault(); break;
        case "2": case "c": toggleControls();  event.preventDefault(); break;
        case "3": case "o": setO();  event.preventDefault(); break;
        case "4": case "ArrowLeft": skipForeward(); event.preventDefault(); break;
        case "5": case " ": case "p": togglePlayPause(); event.preventDefault(); break;
        case "6": case "ArrowRight": skipBackward(); event.preventDefault(); break;
        case "7": case "r": clear();  event.preventDefault(); break;
        case "8": case "t": toggleMenu(); break;
        case "9": case "u": console.log("to start or 'i' and pause()"); video.currentTime = i; video.pause(); event.preventDefault(); break;
        case "/": case "f": toggleFullscreen(); break;
        // default: console.log(key); break;
    }
}

function skipForeward() {
    console.log("skip -5s");
    if(video.currentTime - 5 <= 0) {
        video.currentTime = 0;
    } else {
        video.currentTime -= 5;
    }
}

function skipBackward() {
    console.log("skip +5s");
    if(video.currentTime + 5 > duration) {
        video.currentTime = duration;
    } else {
        video.currentTime += 5;
    }
}

function setI() {
    console.log("set start");
    i = video.currentTime;
    if(i < o) o = 0;
    document.getElementById("inPoint").innerHTML = i;
    document.getElementById("outPoint").innerHTML = o;
}

function setO() {
    console.log("set end");
    o = video.currentTime;
    if(i > o) i = 0;
    video.currentTime = i;
    
    document.getElementById("inPoint").innerHTML = i;
    document.getElementById("outPoint").innerHTML = o;
}

function clear() {
    console.log("clear");
    i = 0;
    o = 0;
    document.getElementById("inPoint").innerHTML = i;
    document.getElementById("outPoint").innerHTML = o;
}

function checkForO(time) {
    // console.log(time);
    document.getElementById("currentTime").innerHTML = time;
    if(o > 0) {
        // leeway if(o < time +.25 && time-0.25 > o) {
        if(time > o) {
            video.currentTime = i;
        }
    }
}

function toggleControls() {
    console.log("toggle video controls");
    video.hasAttribute('controls') ? [video.removeAttribute('controls'), video.classList.add('noControls')] : [video.setAttribute('controls', ''),  video.classList.remove('noControls')];
}

function toggleMenu() {
    console.log("toggle menu");
    toggleClass('menu', 'hide');
    toggleClass('menu-hidden', 'hide');
}

function toggleMute() {
    console.log("toggle mute");
    video.hasAttribute('muted') ? video.muted= '' : video.muted = 'true';
}


function toggleFullscreen() {
    if(isFullscreen) {
        exitFullscreen();
    } else {
        enterFullscreen();
    }
}

function enterFullscreen(force) {
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
