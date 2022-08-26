let videoElement = gebi('video');
let delayTime = 0;
let enterPlay = false;
let chapters = [0];
let currentChapter = 0;
let pauseAfterChapterJump = false;
let inbetweenChapters = true;
let isAwaitingDelay = false;
let abort = false;

// Tranformation
let zoom = 1;
let rotate = 0;
let topMargin = 0;
let leftMargin = 0;
let rotateLast = rotate;
let zoomLast = zoom;
let topMarginLast = topMargin;
let leftMarginLast = leftMargin;

async function setup() {
    /* const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let os = urlParams.get('os');
    let workstation = urlParams.get('workstation');
    let darkMode = urlParams.get('darkMode');
    
    // Set generic system fonts
    setSystemFont(os); */
    
    buildChapters();
}

function playSelectedFile(event) {
  var URL = window.URL || window.webkitURL
  /* cl(this);
  cl(event);
  cl(event.target.value); */
  var file = event.target.files[0]
  var type = file.type
  var videoNode = document.querySelector('video')
  var canPlay = videoNode.canPlayType(type)
  if (canPlay === '') canPlay = 'no'
  var message = 'Can play "'+ file.name +'" of type "' + type + '": ' + canPlay
  var isError = canPlay === 'no'
  displayMessage(message, isError)

  if (isError) {
    return
  }

  var fileURL = URL.createObjectURL(file)
  videoNode.src = fileURL

  // reset input to retrigger after same file selected
  gebi('fileinput').value='';
  gebi('filename').innerHTML=file.name;
}

function setTotalDuration() {
  cl(videoElement.duration);
  let dur = videoElement.duration;
  var minutes = Math.floor(dur / 60);   
  var seconds = Math.floor(dur - minutes * 60)
  gebi('currentTimeTotal').innerHTML = zeroPad(minutes, 2) + ":" + zeroPad(seconds, 2);
  gebi('currentTimeRange').setAttribute("max", parseInt(dur)); 
}

function displayMessage(message, isError) {
  var element = document.querySelector('#message')
  show('message');
  element.innerHTML = message
  element.className = isError ? 'error small' : 'info small'
}

function videoFit(fit) {
  videoElement.classList.remove('scale');
  videoElement.classList.remove('letterbox');
  videoElement.classList.remove('stretch');
  videoElement.classList.add(fit);

  let scaleButtons = document.getElementsByClassName("scaleButton");
  for(i=0; i< scaleButtons.length; i++) { 
		scaleButtons[i].classList.remove('blueBg');
	}
  gebi(fit).classList.add('blueBg');
  if(fit === "letterbox") {
    show('letterboxColor')
  } else {
    hide('letterboxColor')
  }
}

function changeLetterboxColor(value) {
  gebi('video').style.backgroundColor = value;
  document.getElementById("letterboxColor").value = value;
  document.getElementById("letterboxColorText").value = value;
}

function changeBgColor(value) {
  gebi('body').style.backgroundColor = value;
  document.getElementById("bgColor").value = value;
  document.getElementById("bgColorText").value = value;
}

function toggleControls() {
  if (videoElement.hasAttribute("controls")) {
     videoElement.removeAttribute("controls")   
  } else {
     videoElement.setAttribute("controls","controls")   
  }
}

function toggleLoop() {
  if (videoElement.hasAttribute("loop")) {
     videoElement.removeAttribute("loop")   
  } else {
     videoElement.setAttribute("loop","loop")   
  }
}

function toggleMute() {
  videoElement.muted = !videoElement.muted;
}

function toggleClickPlay(checkbox) {
  if(checkbox.checked) {
    show("clickAllowed");
    videoElement.onclick=function () { toggleplay(true, false) };
  } else {
    hide("clickAllowed");
    videoElement.onclick=function() {};
  }
}

async function delayPlay() {
  if(delayTime > 0 && videoElement.paused && !isAwaitingDelay) {  // && waitForDelay) {
    // FIXME: wait after every play press?
    // cl(delayTime);
    // videoElement.pause();
    let timerContainer = gebi('timer');
    isAwaitingDelay = true;
    let startTime = (parseFloat(delayTime)/1000.0).toFixed(1);
    timerContainer.innerHTML = startTime+'s &times;';
    gebi('delayPlayIcon').innerHTML = "pause";

    for(i=0; i< delayTime/50; i++) {
      /* timerContainer.innerHTML = (parseFloat(startTime-i)).toFixed(1); */
      timerContainer.innerHTML = (delayTime/1000-i/20.0).toFixed(1)+'s &times;';
      await delay(50);
      if(abort) {
        //break;
        abort = false;
        timerContainer.innerHTML = '';
        return;
      }
    }
    timerContainer.innerHTML = '';
    isAwaitingDelay = false;
    gebi('delayPlayIcon').innerHTML = "play_arrow";
  } 
  if(isAwaitingDelay) {
    abortDelay();
    return;
  }
  toggleplay();
}

function abortDelay() {
  cl("abort");
  abort = true;
  isAwaitingDelay = false;
  let timerContainer = gebi('timer');
  timerContainer.innerHTML = '';
  gebi('delayPlayIcon').innerHTML = "play_arrow";
}

async function toggleplay(waitForDelay) {
  if(isAwaitingDelay) {
    cl("is awaiting delay, skip delay")
    abortDelay();
    await delay(111);  // wait for timer loop to catch the abort = true
    toggleplay();
    return;
  }
  // video element "play button" control already presses play so do it twice..
  // let isPlaying = controlClick ? !videoElement.paused : videoElement.paused;
  if(videoElement.paused) {
    
    // setTimeout(function(){currentChapter = -1;}, 1100);
    // currentChapter = -1;
    // if(!changedDelay) {
      if(!abort) {
        videoElement.play();
        hide('playbutton');
        show('pausebutton');
      } else if(!isAwaitingDelay) {
        abort = false;
      }
      isAwaitingDelay = false;
      // changedDelay = false;
    // }
  } else {
    videoElement.pause();
    show('playbutton');
    hide('pausebutton');
  }
}

function toggleEnterKey(checkbox) {
  enterPlay = checkbox.checked;
  if(enterPlay) {
    show('enterKeyAllowed')
  } else {
    hide('enterKeyAllowed')
  }
}

function setDelay(value) {
  // TODO remove promise of old delay
  // changedDelay = true;
  delayTime = value*1000;
  if(delayTime > 0) {
    show('delayplaybutton');
  } else {
    hide('delayplaybutton');
  }
  gebi('delay').innerHTML = delayTime/1000;
}

function keyboardControllerVideo(event) {
  // cl(event);
  if(event.target.localName !== "textarea" && event.target.localName !== "input") {
    let allowedKeys = ["0", "2", "4", "5", "6", "7", "Enter", "F5", "F10", "F11", "ArrowRight", "ArrowLeft"];
    let allowedKeyCode = ["Numpad0", "Numpad2", "Numpad4", "Numpad5", "Numpad6", "Numpad7"];
    if(allowedKeys.includes(event.key) || allowedKeyCode.includes(event.code)) {
      // cl("allowed key:")
      switch(event.key) {
        case "Enter":
          if(enterPlay) toggleplay();
          break;
        case "0":
          startAgain();
          break;
        case "2":
          delayPlay();
          break;
        case "4":
          jumpChapter(-1);
          break;
        case "5":
          toggleplay();
          break;
        case "6":
          jumpChapter(1);
          break;
        case "7":
          cl("wake up");
          show("remoteTest");
          setTimeout(function(){ hide("remoteTest"); }, 1200);
          break;
        case "ArrowLeft":
          jumpChapter(-1);
          break;
        case "ArrowRight":
          jumpChapter(1);
          break;
      }
    } else {
      cl("blocked key:")
      event.preventDefault();
    }
  } else {
    cl("On input form field: ")
  }
  cl(event.key);
}

function checkTime(value) {
  if(value >= 60) {
    return 59
  }
  if(value < 0) {
    return "00"
  }
  return zeroPad(value, 2);
}

function addChapter(min, sec) {
  min=parseInt(min);
  sec=parseInt(sec);
  min = isNaN(min) ? 0 : min;
  sec = isNaN(sec) ? 0 : sec;
  cl(min)
  cl(sec)
  let totalSeconds = parseInt(min*60)+parseInt(sec);
  if(!chapters.includes(totalSeconds)) {
    chapters.push(totalSeconds);
    cl(chapters);
    buildChapters();
  }
}

function removeChapter(index) {
  chapters.splice(index, 1);
  buildChapters();
}

function startAgain() {
  // go to start of video
  videoElement.currentTime = 0;
  currentChapter = 0;
  inbetweenChapters = true;
  videoElement.pause();
}

function buildChapters() {
  let chapterList = gebi('chapterList');
  chapterList.innerHTML = '';
  chapters.sort(function (a, b) {  return a - b;  });
  for(i=0; i< chapters.length; i++) {
    let clearChapter = '<span class="red circle whiteBg bold hover" title="Remove chapter" style=" display:inline-block; width:1em; height:1em; margin-left:.25em; padding-left:.15em; box-sizing:border-box;" onclick="removeChapter('+i+')">&times;</span>';
    if(i == 0) clearChapter = '';
    chapterList.innerHTML += '<span class="keyboardKey blueBg"><span onclick="seek('+chapters[i]+')">'+zeroPad(Math.floor(chapters[i] / 60), 2)+':'+zeroPad(chapters[i]-Math.floor(chapters[i] / 60)*60, 2)+'</span>'+clearChapter+'</span>';
  }
}

function jumpChapter(direction) {
  // currentChapter != chapters.indexOf(currentTime)
  currentChapter += direction;
  currentChapter = currentChapter < 0 ? 0 : currentChapter;
  if(currentChapter > chapters.length-1) {
    currentChapter = chapters.length-1;
  } else {
    videoElement.currentTime = chapters[currentChapter];
    if(pauseAfterChapterJump) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
  }
  // console.log(currentChapter + ", "+ chapters.length, chapters[currentChapter]);
}

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

function seek(time) {
  videoElement.currentTime = time;
}

function getCurrentTimes() {
  var minutes = Math.floor(videoElement.currentTime / 60);   
  var seconds = Math.floor(videoElement.currentTime - minutes * 60)
  gebi('currentTimeRange').value = parseInt(videoElement.currentTime);
  gebi('currentTime').innerHTML = zeroPad(minutes, 2) +":"+ zeroPad(seconds, 2);
  return [minutes, seconds];
}

function checkChapters() {
  let currentTime = parseInt(videoElement.currentTime);
  // Stop at chapter begin
  if(chapters.includes(currentTime) && currentChapter != chapters.indexOf(currentTime) && inbetweenChapters) {
    videoElement.pause();
  }
  if(chapters.includes(currentTime)) {
    currentChapter = chapters.indexOf(currentTime);
    inbetweenChapters = false;
  } else {
    // currentChapter = -1;
    inbetweenChapters = true;
  }
}

function toggleFilters(value) {
  if(value) {
    hide('menu-content');
    show('filters');
    setColors();  // ??
    transformVideo("resetLast");
  } else {
    gebi("video").style.filter = "";
    gebi('videoblur').style.backdropFilter = "blur(0px)";
    transformVideo("reset");
  }
}

function resetColors() {
  cl("disable filters");
  // gebi('speed').value=10;
  gebi('blur').value=0;
  gebi('saturate').value=1;
  gebi('hue').value=0;
  gebi('brightness').value=100;
  gebi('contrast').value=1;
  gebi('invert').value=0;
  gebi('sepia').value=0;
  setColors();
}

function setColors() {
  // let speed = gebi("speed").value;
  let blur = gebi("blur").value;
  let saturate = gebi("saturate").value;
  let hue = gebi("hue").value;
  let brightness = gebi("brightness").value;
  let contrast = gebi("contrast").value;
  let invert = gebi("invert").value;
  let sepia = gebi("sepia").value;

  let filters = "saturate(" + saturate + ") hue-rotate(" + hue + "deg) brightness(" + brightness + "%) contrast(" + contrast + ") invert(" + invert + ") sepia(" + sepia + ")";
  // gebi("video").style.webkitFilter = filters;
  videoElement.style.filter = filters;
  // changeSpeed(speed);

  gebi('videoblur').style.backdropFilter = "blur("+blur+"px)";

  // gebi("speed-val").innerHTML = speed/10;
  gebi("blur-val").innerHTML = blur;
  gebi("saturate-val").innerHTML = saturate;
  gebi("hue-val").innerHTML = hue;
  gebi("brightness-val").innerHTML = brightness;
  gebi("contrast-val").innerHTML = contrast;
  gebi("invert-val").innerHTML = invert;
  gebi("sepia-val").innerHTML = sepia;
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
  videoElement.style.transform ='scale('+zoom+') rotate('+rotate+'deg) translate('+leftMargin+'px,'+topMargin+'px)';
  if(zoom < 1 || rotate != 0 || leftMargin != 0 || topMargin != 0) {
    show('bgColor');
  } else {
    hide('bgColor');
  }
}