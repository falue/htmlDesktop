let timeout;
let timeoutSpeedChange;
let video;
let gallery;
let duration;
let isFullscreen = false;
let isVideoplayer = true;
let imageGallery = [];
let imageGalleryIndex = 0;
let chapters = [0.0];

// Tranformation
let zoom = 1;
let rotate = 0;
let topMargin = 0;
let leftMargin = 0;
let rotateLast = rotate;
let zoomLast = zoom;
let topMarginLast = topMargin;
let leftMarginLast = leftMargin;

function setup() {
    video = gebi("video");
    gallery = gebi("gallery");

    // READ IMAGES FROM TO LOCALSTORAGE
    let data = JSON.parse(localStorage.getItem('videoplayer'));
    if(data && data.gallery) {
        console.log("some data in gallery!");
        imageGallery = data.gallery;
        isVideoplayer = false;
        video.pause();
        hideClass('video');
        showClass('gallery');
        displayImage(0);
        gebi('galleryList').innerHTML = `<li>${imageGallery.length} image(s) from memory <button onclick="clearMemory()" style="display:inline-block; width: fit-content;">clear memory</button></li>`;
    }
}

function setupVideo() {
    duration = gebi('video').duration;
    gebi('duration').innerHTML = secToTime(duration);
    gebi('currentTimeRange').setAttribute("max", parseInt(duration)); 
}

// Feel free to fork and improve on this if you'd like
function setColors() {
    let speed = gebi("speed").value;
    let blur = gebi("blur").value;
    let saturate = gebi("saturate").value;
    let hue = gebi("hue").value;
    let brightness = gebi("brightness").value;
    let contrast = gebi("contrast").value;
    let invert = gebi("invert").value;
    let sepia = gebi("sepia").value;

    let filters = "blur(" + blur + "px) saturate(" + saturate + ") hue-rotate(" + hue + "deg) brightness(" + brightness + "%) contrast(" + contrast + ") invert(" + invert + ") sepia(" + sepia + ")";
    video.style.webkitFilter = filters;
    video.style.filter = filters;
    gallery.style.webkitFilter = filters;
    gallery.style.filter = filters;

    changeSpeed(speed);

    gebi("speed-val").innerHTML = speed/10;
    gebi("blur-val").innerHTML = blur;
    gebi("saturate-val").innerHTML = saturate;
    gebi("hue-val").innerHTML = hue;
    gebi("brightness-val").innerHTML = brightness;
    gebi("contrast-val").innerHTML = contrast;
    gebi("invert-val").innerHTML = invert;
    gebi("sepia-val").innerHTML = sepia;
}

function toggleClass(id, className) {
    let element = gebi(id);
    element.classList.toggle(className);
}

function changeSpeed(value) {
    value /= 10;
    gebi("speed-val").innerHTML = value;

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

function uploadFile(data) {
    var file = data.files[0];
    var type = file.type;
    console.log(type);
    imageGallery = [];
    if(type.includes('image')) {
        isVideoplayer = false;
        // Hide videoplayer
        video.pause();
        hideClass('video');
        showClass('gallery');
        // Hide video controls
        makeImageGallery(data)
    } else if (type.includes('video')) {
        isVideoplayer = true;
        localStorage.removeItem('videoplayer');
        // Show videoplayer
        // Show video controls
        loadVideoFile(data);
        showClass('video');
        //hideClass('gallery');
        gebi('galleryList').innerHTML = `<li>Video: ${data.files[0].name}</li>`;
    }
}

async function makeImageGallery(data) {
    gebi('galleryList').innerHTML = '';
    for (let index = 0; index < data.files.length; index++) {
        imageGallery.push(await convertBase64(data.files[index]));
        gebi('galleryList').innerHTML += `<li>${index+1}. ${data.files[index].name}</li>`;
    }
    // SAVE TO LOCALSTORAGE
    try {
        localStorage.setItem('videoplayer', JSON.stringify({'gallery': imageGallery}));
    } catch(e) {
        if (e instanceof DOMException && e.name === "QuotaExceededError") {
            alert('Images are too big to save for next time. It works but they do not get saved.\n\nYou have to manually select these images again next time you start this.\n\nMake images smaller to solve this.');
        } else {
            alert('An error occurred while saving data.');
        }
    }
    gebi('movieSelector').value = '';
    displayImage(0);
}

function clearMemory() {
    localStorage.removeItem('videoplayer');
    window.location="./"
}

function displayImage(index) {
    if(index < 0) index = imageGallery.length-1;
    if(index > imageGallery.length-1) index = 0;
    imageGalleryIndex = index;
    gebi('gallery').style.backgroundImage = `url(${imageGallery[imageGalleryIndex]})`;
}

function loadVideoFile(videoFile) {
    var file = videoFile.files[0];
    var type = file.type;
    var videoNode = document.querySelector('video');
    var canPlay = videoNode.canPlayType(type);
    var fileURL = URL.createObjectURL(file);
    videoNode.src = fileURL;
}

const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};

function changeSource(source) {
    video.src = source;
}

function togglePlayPause() {
    video.paused ? video.play() : video.pause();
}

let i = 0;
let o = 0;

function keyboardController(event) {
    // TODO: make shortcuts with OPTION key
    if(event.target.localName !== "textarea" && event.target.localName !== "input") {
        // Ignore presses in textareas and inputs, but NOT buttons because mostly fake
        //if(event.target.localName !== "textarea" && event.target.localName !== "input") {
        let key = event.keyCode;
        let keyTable = {
            48: "0",
            49: "1",
            50: "2",
            51: "3",
            52: "4",
            53: "5",
            54: "6",
            55: "7",
            56: "8",
            57: "9",

            96: "0",
            97: "1",
            98: "2",
            99: "3",
            100: "4",
            101: "5",
            102: "6",
            103: "7",
            104: "8",
            105: "9",

            111: "/",
            61: "=",
            187: "=",
            37: "ArrowLeft",
            38: "ArrowUp",
            39: "ArrowRight",
            40: "ArrowDown",
            32: " ",

            65: "a",
            66: "b",
            67: "c",
            68: "d",
            69: "e",
            70: "f",
            71: "g",
            72: "h",
            73: "i",
            74: "j",
            75: "k",
            76: "l",
            77: "m",
            78: "n",
            79: "o",
            80: "p",
            81: "q",
            82: "r",
            83: "s",
            84: "t",
            85: "u",
            86: "v",
            87: "w",
            88: "x",
            89: "y",
            90: "z",

            13: "enter",
            8: "backspace",
            27: "escape",
            46: "delete"
        };
        key = keyTable[key];

        if(event.altKey || ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(key) || /^[0-9]+$/.test(key)) {
            if(isVideoplayer) {
                // Chapter navigation when number plus alt
                if(event.altKey) {
                    if(chapters[parseInt(key)-1] >= 0) {
                        video.currentTime = chapters[parseInt(key)-1];       
                        video.play();
                        return
                    }
                }
                // if number or anything else
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
                    case "=": case "l": toggleLoop(); break;
                    // default: console.log(key); break;
                }
            } else {
                switch(key) {
                    case "4": case "ArrowLeft": imageGalleryIndex -= 1; displayImage(imageGalleryIndex); event.preventDefault(); break;
                    case "6": case "ArrowRight": imageGalleryIndex += 1; displayImage(imageGalleryIndex); event.preventDefault(); break;
                    case "8": case "t": toggleMenu(); break;
                    case "/": case "f": toggleFullscreen(); break;
                }
            }
        }
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
    gebi("inPoint").innerHTML = secToTime(i);
    gebi("outPoint").innerHTML = secToTime(o);
}

function setO() {
    console.log("set end");
    o = video.currentTime;
    if(i > o) i = 0;
    video.currentTime = i;
    
    gebi("inPoint").innerHTML = secToTime(i);
    gebi("outPoint").innerHTML = secToTime(o);
}

function clear() {
    console.log("clear");
    i = 0;
    o = 0;
    gebi("inPoint").innerHTML = secToTime(i);
    gebi("outPoint").innerHTML = secToTime(o);
}

function checkForO(time) {
    // console.log(time);
    gebi("currentTime").innerHTML = secToTime(time);
    gebi("currentTimeRange").value = time;
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
    video.muted = !video.muted;
}

function toggleLoop() {
    console.log("toggle loop");
    video.loop = !video.loop;
    gebi("looping").innerHTML = video.loop ? 'Yes' : 'No';
    gebi("looping").classList.toggle("blueBg");
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


function gebi(id) {
    return document.getElementById(id);
}

function hide(id) {
    for(i=0; i< arguments.length; i++) { 
        gebi(arguments[i]).classList.add('hide');
    }
}

function show(id) {
    for(i=0; i< arguments.length; i++) { 
        gebi(arguments[i]).classList.remove('hide');
    }
}

function toggle(id) {
    // TODO: IGNORES CLASS HIDE
    let element = gebi(id);
    let display = window.getComputedStyle(element, null).display;
    if(display == "" || display == "none") {
        show(id);
        return 1;
    } else {
        hide(id);
        return 0;
    }
}


function showClass(className) {
    let elements = document.getElementsByClassName(className);
    for(i=0; i< elements.length; i++) {
          elements[i].classList.remove('hide');
      }
  }
  
  function hideClass(className) {
    let elements = document.getElementsByClassName(className);
    for(i=0; i< elements.length; i++) { 
          elements[i].classList.add('hide');
      }
  }

function videoFit(fit) {
    video.classList.remove('scale');
    video.classList.remove('letterbox');
    video.classList.remove('stretch');
    video.classList.add(fit);

    let scaleButtons = document.getElementsByClassName("scaleButton");
    for(i=0; i< scaleButtons.length; i++) { 
            scaleButtons[i].classList.remove('blueBg');
        }
    gebi(fit).classList.add('blueBg');
    if(fit === "letterbox") {
        show('letterboxColorContainer');
    } else {
        hide('letterboxColorContainer');
    }
}

function changeLetterboxColor(value) {
    video.style.backgroundColor = value;
    document.getElementById("letterboxColor").value = value;
    document.getElementById("letterboxColorText").value = value;
    gebi('body').style.backgroundColor = value;  // If blur is applied, chose the same color
}

function secToTime(sec) {
    return zeroPad(Math.floor(sec / 60), 2)+':'+zeroPad((sec-Math.floor(sec / 60)*60).toFixed(0), 2)
}

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

function seek(time) {
    video.currentTime = time;
}

function transformVideo(action) {
    switch(action) {
      case "zoomin":
        zoom += 0.05;
        break;
      case "zoomout":
        zoom -= 0.05;
        break;
      case 'left':
        leftMargin -= 5;
        break;
      case 'right':
        leftMargin += 5;
        break;
      case 'up':
        topMargin -= 5;
        break;
      case 'down':
        topMargin += 5;
        break;
      case "rotateleft":
        rotate += 1;
        break;
      case "rotateright":
        rotate -= 1;
        break;
      case "reset":
        rotate = 0;
        zoom = 1;
        topMargin = 0;
        leftMargin = 0;
        break;
      case "hardReset":
        rotate = 0;
        zoom = 1;
        topMargin = 0;
        leftMargin = 0;
        break;
      case "resetLast":
        rotate = rotateLast;
        zoom = zoomLast;
        topMargin = topMarginLast;
        leftMargin = leftMarginLast;
        break;
    }
    if(action != "reset") {
      rotateLast = rotate;
      zoomLast = zoom;
      topMarginLast = topMargin;
      leftMarginLast = leftMargin;
    }
    video.style.transform ='scale('+zoom+') rotate('+rotate+'deg) translate('+leftMargin+'px,'+topMargin+'px)';
  }

  function addChapter(sec) {
    if(!chapters.includes(sec)) {
        chapters.push(sec);
        buildChapters();
    }
}

function buildChapters() {
    let chapterList = gebi('chapterList');
    let chapterIndicators = gebi('chapterIndicatorContainer');
    chapterList.innerHTML = '';
    chapterIndicators.innerHTML = '';
    chapters.sort(function (a, b) {  return a - b;  });
    for(i=0; i< chapters.length; i++) {
        let clearChapter = '<span class="redBg" title="Remove chapter" style="color:white; display:inline-block; width:1.5em; height:1.5em; border-radius:50%; top:0; margin-left:.5em; padding-top:.12em; box-sizing:border-box;" onclick="removeChapter('+i+')">&times;</span>';
        if(i == 0) clearChapter = '';
        chapterList.innerHTML += '<button class="small" title="alt + '+(i+1)+'" style="margin:0 0.5em 0.5em 0">#'+(i+1)+') <span onclick="seek('+chapters[i]+')">'+secToTime(chapters[i])+'</span>'+clearChapter+'</button>';
        let left = (chapters[i] / duration) * 100;
        chapterIndicators.innerHTML += '<div class="redBg" style="border:none; position:absolute; top:.4em; height:19px; left:'+left+'%; width:1px; pointer-events: none; padding:0;"></div>'
    }
    if(chapters.length === 1) {
        chapterList.innerHTML = '<span class="small grey">No chapters.</span>';
        chapterIndicators.innerHTML = '';
    }
}
function removeChapter(index) {
    chapters.splice(index, 1);
    buildChapters();
}
