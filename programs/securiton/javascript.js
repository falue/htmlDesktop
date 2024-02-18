let scene;
let videoIndex = 1;
let totalVideos = 4;
let useGreenscreen = false;
let showControls = false;
let greenscreenType = 1;
let gridSize = 4;
let zoomStage = [1,1,1,1,1];

async function setup() {
    /* 
        URL parameters
        scene: files in securitron/data/{scene}-{screenNo}.mp4 and ..data/{scene}-{screenNo}.jpg for videos
    */

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
        if(localStorage.getItem('securiton-gridsize1') === "true") {
            //showVideo();
            setGrid(1);
        }

        if(localStorage.getItem('securiton-hideControls') === "true") {
            setControls(false);
        } else {
            setControls(true);
        }
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

    cl(zoomStage)

    if(videoIndex > totalVideos) {
        // Reset videos
        videoIndex=1;
        let videoElem0 = gebi('video1');
        let videoElem1 = gebi('video2');
        let videoElem2 = gebi('video3');
        let videoElem3 = gebi('video4');
        let videoElem4 = gebi('video5');
        videoElem0.setAttribute('src', 'data/default.mp4');
        videoElem1.setAttribute('src', 'data/default.mp4');
        videoElem2.setAttribute('src', 'data/default.mp4');
        videoElem3.setAttribute('src', 'data/default.mp4');
        videoElem4.setAttribute('src', 'data/default.mp4');
        videoElem0.pause();
        videoElem1.pause();
        videoElem2.pause();
        videoElem3.pause();
        videoElem4.pause();
        videoElem0.style.transform = 'scale(1)';
        videoElem0.style.transformOrigin = '0px 0px';
        videoElem1.style.transform = 'scale(1)';
        videoElem1.style.transformOrigin = '0px 0px';
        videoElem2.style.transform = 'scale(1)';
        videoElem2.style.transformOrigin = '0px 0px';
        videoElem3.style.transform = 'scale(1)';
        videoElem3.style.transformOrigin = '0px 0px';
        videoElem4.style.transform = 'scale(1)';
        videoElem4.style.transformOrigin = '0px 0px';
        zoomStage = [1,1,1,1,1]
        if(useGreenscreen) toggleGreenscreen(useGreenscreen);
        //return;
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
    gebi('video5').pause();
    if(!useGreenscreen) gebi('video'+videoIndex).play();

    if(gridSize === 1) {
        setVideoSizes(videoIndex, 100);
    }
    videoIndex++;  
}

function toggleGreenscreen(mode) {
    if(mode) {
        hide('video1');
        hide('video2');
        hide('video3');
        hide('video4');
        hide('video5');
        show('greenscreen1');
        show('greenscreen2');
        show('greenscreen3');
        show('greenscreen4');
        show('greenscreen5');
        gebi('video1').pause();
        gebi('video2').pause();
        gebi('video3').pause();
        gebi('video4').pause();
        gebi('video5').pause();
    } else {
        show('video1');
        show('video2');
        show('video3');
        show('video4');
        show('video5');
        hide('greenscreen1');
        hide('greenscreen2');
        hide('greenscreen3');
        hide('greenscreen4');
        hide('greenscreen5');
    }
}


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
            if(showControls) videoElem.setAttribute('controls', '');
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

function setGrid(size) {
    if(size === 1) {
        totalVideos = 5;
        gridSize = size;
        localStorage.setItem('securiton-gridsize1', 'true');
        gebi('gridBtn1').classList.add('greyBg');
        gebi('gridBtn4').classList.remove('greyBg');

        setVideoSizes(1, 100);

    } else {
        gridSize = size;
        totalVideos = 4;
        localStorage.removeItem('securiton-gridsize1');
        gebi('gridBtn1').classList.remove('greyBg');
        gebi('gridBtn4').classList.add('greyBg');

        setVideoSizes(1, 50);
        setVideoSizes(2, 50);
        setVideoSizes(3, 50);
        setVideoSizes(4, 50);
    }
}

function setVideoSizes(index, size) {
    if(size===100) {
        hide('container1');
        hide('container2');
        hide('container3');
        hide('container4');
        hide('container5');
        show('container'+index);
        gebi('container'+index).style.left = '0';
        gebi('container'+index).style.top = '0';
    } else {
        show('container1');
        show('container2');
        show('container3');
        show('container4');
        hide('container5');

        switch(index) {
            case 1:
                gebi('container'+index).style.left = '0';
                gebi('container'+index).style.top = '0';
                break;
            
            case 2:
                gebi('container'+index).style.left = '50%';
                gebi('container'+index).style.top = '0';
                break;

            case 3:
                gebi('container'+index).style.left = '0';
                gebi('container'+index).style.top = '50%';
                break;

            case 4:
                gebi('container'+index).style.left = '50%';
                gebi('container'+index).style.top = '50%';
                break;
        }
    }
    
    gebi('container'+index).style.height = size+"%";
    gebi('container'+index).style.width = size+"%";
}

function setControls(mode) {
    if(mode) {
        showControls = true;
        localStorage.setItem('securiton-hideControls', false);
        
        gebi('controlsNo').classList.remove('greyBg');
        gebi('controlsYes').classList.add('greyBg');

        gebi('video1').setAttribute("controls","controls");
        gebi('video2').setAttribute("controls","controls");
        gebi('video3').setAttribute("controls","controls");
        gebi('video4').setAttribute("controls","controls");
        gebi('video4').setAttribute("controls","controls");

    } else {
        showControls = false;
        localStorage.setItem('securiton-hideControls', true);

        gebi('controlsNo').classList.add('greyBg');
        gebi('controlsYes').classList.remove('greyBg');

        gebi('video1').removeAttribute("controls");
        gebi('video2').removeAttribute("controls");
        gebi('video3').removeAttribute("controls");
        gebi('video4').removeAttribute("controls");
        gebi('video4').removeAttribute("controls");
    }
}