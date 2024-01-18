let scene;
async function setup() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    scene = urlParams.get('scene');

    setGreenscreenFlag(localStorage.getItem('securiton-greenscreen') == "true");

    // Load all four videos
    if(scene) {
        showVideo();
        showVideo();
        showVideo();
        showVideo();
        gebi('video4').pause();
        videoIndex = 1;
    }
        
    /* let form = gebi('loginForm');
    if(form) {
        form.action = 'securiton.html?scene='+scene;
        cl('start');
    } else {
    } */
    /* const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let os = urlParams.get('os');
    /* let workstation = urlParams.get('workstation');
    let darkMode = urlParams.get('darkMode'); *
    /* let id = urlParams.get('id'); *
    /* let id = window.parent.document.getElementById('#target');  *
    let thisWindow = window.parent.document.querySelectorAll("[data-setup*='magic']")[0];
    let id = thisWindow.id;
    let newSrc = await parent.showDialog("Set new window path", "Type new absolute path or URL.<br>Including localhost or live URLs.", false, "https://");
    if(newSrc && newSrc != "~EMPTY") {
        let windowTitle = await parent.setWindowTitle(`title-${id}`);
        let windowIcon = await parent.setWindowIcon(`${id}`);
        thisWindow.setAttribute('data-setup', `['${windowTitle}', '${windowIcon}', '${newSrc}']`);
        thisWindow.getElementsByTagName('iframe')[0].src = newSrc;
    } */
}


let videoIndex = 1;
let totalVideos = 4;
let useGreenscreen = false;
let greenscreenType = 1;

function setGreenscreenFlag(mode) {
    useGreenscreen = mode;
    if(mode) {
        gebi('useGreenscreenNo').classList.remove('greyBg');
        gebi('useGreenscreenYes').classList.add('greyBg');
    } else {
        gebi('useGreenscreenNo').classList.add('greyBg');
        gebi('useGreenscreenYes').classList.remove('greyBg');
    }
    localStorage.setItem('securiton-greenscreen', mode);
    toggleGreenscreen(mode);
}

/* function setGreenscreenType(index) {
    greenscreenType = index;
} */

function showVideo() {
    if(videoIndex > totalVideos) {
        // Reset videos
        videoIndex=1;
        let videoElem0 = gebi('video1');
        let videoElem1 = gebi('video2');
        let videoElem2 = gebi('video3');
        let videoElem3 = gebi('video4');
        videoElem0.setAttribute('src', 'data/default.mp4');
        videoElem1.setAttribute('src', 'data/default.mp4');
        videoElem2.setAttribute('src', 'data/default.mp4');
        videoElem3.setAttribute('src', 'data/default.mp4');
        videoElem0.pause();
        videoElem1.pause();
        videoElem2.pause();
        videoElem3.pause();
        videoElem0.style.transform = 'scale(1)';
        videoElem0.style.transformOrigin = '0px 0px';
        videoElem1.style.transform = 'scale(1)';
        videoElem1.style.transformOrigin = '0px 0px';
        videoElem2.style.transform = 'scale(1)';
        videoElem2.style.transformOrigin = '0px 0px';
        videoElem3.style.transform = 'scale(1)';
        videoElem3.style.transformOrigin = '0px 0px';
        zoomStage = [1,1,1,1]
        if(useGreenscreen) toggleGreenscreen(useGreenscreen);
        return;
    }

    // let videoName = useGreenscreen ? 'data/greenscreen'+greenscreenType+'.mp4' : 'data/'+videoIndex+'.mp4';
    let videoName = `data/${scene}-${videoIndex}.mp4`;
    let posterName = `data/${scene}-${videoIndex}.jpg`;
    toggleGreenscreen(useGreenscreen);

    gebi('video'+videoIndex).setAttribute('src', videoName);
    gebi('video'+videoIndex).setAttribute('poster', posterName);
    gebi('video1').pause();
    gebi('video2').pause();
    gebi('video3').pause();
    gebi('video4').pause();
    if(!useGreenscreen) gebi('video'+videoIndex).play();

    videoIndex++;  
}

function toggleGreenscreen(mode) {
    if(mode) {
        hide('video1');
        hide('video2');
        hide('video3');
        hide('video4');
        show('greenscreen1');
        show('greenscreen2');
        show('greenscreen3');
        show('greenscreen4');
        gebi('video1').pause();
        gebi('video2').pause();
        gebi('video3').pause();
        gebi('video4').pause();
    } else {
        show('video1');
        show('video2');
        show('video3');
        show('video4');
        hide('greenscreen1');
        hide('greenscreen2');
        hide('greenscreen3');
        hide('greenscreen4');
    }
}

let zoomStage = [1,1,1,1];

function zoom(event, elementNumber) {
    /* console.log(event.offsetX, event.offsetY); */
    /* console.log(event.wheelDeltaY); */
    /* console.log(event.wheelDelta, event.wheelDeltaX, event.wheelDeltaY); */

    // check if video is fullscreen - if so, do not zoom and return
    let videoElem = gebi('video'+elementNumber);
    if(document.fullscreenElement && document.fullscreenElement.id === 'video'+elementNumber) {
        cl("This video is in fullscreen, ingore zoom");
        return;
    }


    if(event.wheelDeltaY>1 || event.wheelDeltaY<-1) {
        // reset controls
        videoElem.removeAttribute('controls');
        // zoom in / zoom out
        zoomStage[elementNumber-1] = clamp(zoomStage[elementNumber-1]-event.wheelDeltaY/100, 1,8);
        // cl(zoomStage[elementNumber-1]);
        // cl(elementNumber);
        videoElem.style.transform = 'scale('+zoomStage[elementNumber-1]+')';
        videoElem.style.transformOrigin = event.offsetX+'px '+event.offsetY+'px';
        
        // if zoom is maxed out, reset controls
        if(zoomStage[elementNumber-1] == 1) {
            videoElem.setAttribute('controls', '');
        }
    }
}

function togglePlay(videoIndex) {
    let videoElem = gebi('video'+videoIndex);
    // Somehow, if is zoomed out, this function fires alongside the native click-to-toggle-play/pause thingy
    // if zoomed in no controls and no nqative click thingy
    // maybe thats what the hidden "controls" make happen
    if(!videoElem.hasAttribute('controls')) {
        if(videoElem.paused) {
            cl('toggle play')
            videoElem.play();
        } else {
            cl('toggle pause')
            videoElem.pause();
        }
    }
}