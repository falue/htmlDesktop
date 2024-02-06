let os;
let workstation;
let files;
let imageIndex = 0;
let isFirstFile;
let disableVideoControls;
let allowZoom = true;
let hiddenBar = false;
let autoplay = false;

async function setupImageViewer() {

    /* 
        URL params:
            files
            disableVideoControls
            hiddenBar
            autoplay
            allowZoom
    */
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    os = urlParams.get('os');
    workstation = urlParams.get('workstation');
    disableVideoControls = urlParams.get('disableVideoControls') == "true";
    allowZoom = urlParams.get('allowZoom') == "true";
    hiddenBar = urlParams.get('hiddenBar') == "true";
    autoplay = urlParams.get('autoplay') == "true";
    gebi('disableVideoControls').checked = disableVideoControls;
    gebi('allowZoom').checked = allowZoom;

    if(hiddenBar && localStorage.getItem('imageViewer-hiddenBar') !== 'false') {
        hideBar();
    }

    if(autoplay || localStorage.getItem('imageViewer-autoplay') === 'true') {
        gebi('autoplay').checked = true;
        autoplay = true;  // set for local storage
    }

    if(localStorage.getItem('imageViewer-autoplay') === 'false') {
        autoplay = false;  // set for local storage
    }

    if(urlParams.get('files')) {
        files = urlParams.get('files').split("|");
        // If the first image is a PDF, open it directly
        if(files[0].toLowerCase().endsWith('.pdf')) {
            window.location.href = "../../workstations/"+workstation+"/files/"+files[0];
            return;
        }
        setupThumbnails(files);
        isFirstFile = true;
        showImage(0);  // Show first image
    } else {
        files = JSON.parse(localStorage.getItem('imageViewer'));
        if(files) {
            if(files[0].startsWith('data:application/pdf')) {
                window.location.href = files[0];
                return;
            } else {
                setupThumbnails(files);
                isFirstFile = true;
                showImage(0);  // Show first image
            }
        } else {
            gebi('content').innerHTML = "No files in URL or local storage";
        }
    }

    if(!allowZoom) {
        hide('zoomIn');
        hide('zoomOut');
        hide('zoomReset');
    }
}

function toggleZoom(value) {
    zoom(100, getCurrentContentWrapper());
    allowZoom = value;
    if(allowZoom) {
        show('zoomIn');
        show('zoomOut');
        show('zoomReset');
    } else {
        hide('zoomIn');
        hide('zoomOut');
        hide('zoomReset');
    }
}

function toggleLetterbox(value) {
    if(value) {
        gebi('content').style.backgroundSize = 'contain';
    } else {
        gebi('content').style.backgroundSize = 'cover';
    }
}

function setupThumbnails(files) {
    let thumbnails = gebi('thumbnails');
    let content = gebi('content');
    if(files.length <= 1) {
        // Hide navigation arrwos if only one image
        content.classList.add('onlyOneImage');
        hide('thumbnails');
    } else {
        content.classList.remove('onlyOneImage');
        show('thumbnails');
        // Setup thumbnail gallery
        for (const [i, file] of files.entries()) {
            let thumbnail = document.createElement("div");
            let filename = file.length < 100 ? file : Math.floor(Math.random() * Date.now());
            thumbnail.setAttribute("title", filename);
            thumbnail.setAttribute("id", "thumbnail-"+filename);
            thumbnail.classList.add("thumbnail", "shadow", "radius3");
            if(file.endsWith(".mp4")) {
                thumbnail.style.backgroundImage = "url(../../os/"+os+"/systemIcons/fileMovie.png)";
            } else if(file.startsWith('data:image')) {
                thumbnail.style.backgroundImage = "url("+file+")";
            } else {
                thumbnail.style.backgroundImage = "url(../../workstations/"+workstation+"/files/"+file+")";
            }
            thumbnail.setAttribute("onclick", "showImage("+i+");");
            thumbnails.appendChild(thumbnail);
        }
    }
}

async function showImage(index) {
    imageIndex = index;
    let file = files[index];
    let path = "../../workstations/"+workstation+"/files/"+file;
    let content = gebi('content');

    /* Remove all active classes */
    let elements = document.querySelectorAll(".thumbnail.active");
    for(i=0; i< elements.length; i++) {
        elements[i].classList.remove('active');
    }

    /* Scroll to thumbnail & mark as active */
    let thumbnail = gebi("thumbnail-"+file);
    if(thumbnail) {  // If only one file is in URL, there are no thumbnails
        thumbnail.scrollIntoView({inline: "center", block: "nearest", behavior: "smooth"});
        thumbnail.classList.add('active');
    }

    if(file.endsWith(".mp4")) {
        let poster = path.split('.').slice(0, -1).join('.')+".png";
        if(await fileExists(poster, false)) {
            gebi('videoJsPlayerWrapper_html5_api').setAttribute('poster', poster);
        }

        setVideoControls();

        content.style.backgroundImage = "none";
        show("videoPlayer");
        await setVideoSrcAndPlay(path, 'video/mp4');
        gebi('thumbnails').classList.add("videplayer");
    } else if(file.startsWith('data:image')) {
        content.style.backgroundImage = "url("+file+")";
        hide("videoPlayer");
        let player = videojs(document.querySelector('.video-js'));
        if(player) player.pause();
        gebi('thumbnails').classList.remove("videplayer");
    } else {
        content.style.backgroundImage = "url("+path+")";
        hide("videoPlayer");
        let player = videojs(document.querySelector('.video-js'));
        if(player) player.pause();
        gebi('thumbnails').classList.remove("videplayer");
    }

    // Reset
    isFirstFile = false;
}

async function setVideoSrcAndPlay(videoSource, type) {
    /* cl("setVideoSrcAndPlay.." +videoSource); */
    let player = videojs(document.querySelector('.video-js'));
    await player.src({
        "src": videoSource+"#t=.1",  // Set time for poster image
        "type": type
    });
    // If user has interacted with the page (eg, if video is not first file in gallery), play video
    if(!isFirstFile || autoplay) {
        await player.ready(function(){
            player.play();
        });
    }
}

function setVideoControls() {
    let player = videojs(document.querySelector('.video-js'));
    player.controls(!disableVideoControls) // hides/shows control based on URL params
}

function playWithDisabledControls() {
    if(disableVideoControls || zoomStage != 1) {
        togglePlay();
    }
}

function togglePlay() {
    let player = gebi('videoJsPlayerWrapper_html5_api');
    if(player) {
        if (player.paused) {
            player.play(); 
        } else {
            player.pause();
        }
    }
}
function getCurrentContentWrapper() {
    return gebi('videoPlayer').classList.contains('show') ? 'videoJsPlayerWrapper_html5_api' : 'content' ;
}

function navigateGallery(direction) {
    imageIndex += direction;
    imageIndex = wrapAround(imageIndex, 0, files.length-1);
    zoom(100, getCurrentContentWrapper())  // reset zoom scale
    showImage(imageIndex);
}

function hideBar() {
    hiddenBar = true;
    localStorage.setItem('imageViewer-hiddenBar', hiddenBar);
    let btn = gebi('actionButton');
    if(btn) {
        btn.style.position = 'fixed';
        btn.style.right = '0';
        btn.style.top = '0';
        btn.style.width = '4em';
        btn.style.height = '4em';
    }
    gebi('hiddenBar').checked = true;
    gebi('windowmenu').classList.add('op0');
    gebi('content').style.height = '100%';
    gebi('content').style.top = '0';
    gebi('videoPlayer').style.height = '100%';
    gebi('videoPlayer').style.top = '0';
}

function showBar() {
    hiddenBar = false;
    localStorage.setItem('imageViewer-hiddenBar', hiddenBar);
    let btn = gebi('actionButton');
    if(btn) {
        btn.style.position = null;
        btn.style.right = null;
        btn.style.top = null;
        btn.style.width = null;
        btn.style.height = null;
    }
    gebi('hiddenBar').checked = false;
    gebi('windowmenu').classList.remove('op0');
    gebi('content').style.height = 'calc(100% - 1.5em)';
    gebi('content').style.top = '1.5em';
    gebi('videoPlayer').style.height = 'calc(100% - 1.5em)';
    gebi('videoPlayer').style.top = '1.5em';
}

let zoomStage = 1;
let tempVideoControls;

function zoom(event, id) {
    if(!allowZoom) return;
    let scrollingEvent = {};
    if(typeof event !== 'object') {
        // if zoom was triggered by key presses, reset zoom
        scrollingEvent = {
            "wheelDeltaY": event,
            "wheelDeltaX": 0,
            "offsetX": 0,
            "offsetY": 0,
            "zoomReset": true
        }
    } else {
        scrollingEvent = event;
    }
    
    if(typeof event.preventDefault === 'function') event.preventDefault();
    let element = gebi(id);
    let currentPos = element.style.transformOrigin.split("px ");

    let isVideo = element.tagName === "VIDEO" || !gebi('videoPlayer').classList.contains('hide');
    // If video is scrolled by button in program bar
    if(!gebi('videoPlayer').classList.contains('hide')) {
        element = gebi('videoJsPlayerWrapper_html5_api');
    }

    if((scrollingEvent.wheelDeltaY>1 || scrollingEvent.wheelDeltaY<-1) && (scrollingEvent.wheelDeltaX>=-1 && scrollingEvent.wheelDeltaX<=1)) {
        if(isVideo) {
            // reset controls
            tempVideoControls = disableVideoControls;
            disableVideoControls = true;
            setVideoControls()
        }
        // zoom in / zoom out
        zoomStage = scrollingEvent.zoomReset ? 1 : clamp(zoomStage-scrollingEvent.wheelDeltaY/100, 1,8);
        element.style.transform = 'scale('+zoomStage+')';
        element.style.transformOrigin = scrollingEvent.offsetX+'px '+scrollingEvent.offsetY+'px';
        
        // if zoom is maxed out, reset controls
        disableVideoControls = tempVideoControls;
        if(zoomStage == 1 && isVideo) {
            setVideoControls()
        }
    } else if(scrollingEvent.wheelDeltaX>1 || scrollingEvent.wheelDeltaX<-1) {
        let newX = currentPos[0] - scrollingEvent.wheelDeltaX;
        newX = clamp(newX, 0, window.innerWidth);
        element.style.transformOrigin = newX +'px '+ currentPos[1];
    }
}
let isFullscreen = false;

function enterFullscreen() {
    isFullscreen = true;
    document.documentElement.requestFullscreen();
    hide('windowmenu');
}

function exitFullscreen() {
    isFullscreen = false;
    if(document.exitFullscreen) {
        document.exitFullscreen();
    } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
    show('windowmenu');
}

async function uploadImages(data) {
    var selectedImages = data.files;
    cl(selectedImages);
    if(selectedImages[0].name.toLowerCase().endsWith('.pdf')) {
        displayLocalPdf(selectedImages[0]);
        return;
    }
    // Reset thumbs & current
    files = [];
    gebi('content').innerHTML = '';
    gebi('thumbnails').innerHTML = '';
    for(i=0; i< selectedImages.length; i++) {
        // if(files[i].type.includes('image'))
        files.push(await convertBase64(selectedImages[i]));
    }
    try {
        localStorage.setItem('imageViewer', JSON.stringify(files));
    } catch (err) {
        cl(err);
        alert("This / these images are too big. make them smaller pretty please");
    }
    setupThumbnails(files);
    isFirstFile = true;
    showImage(0);  // Show first image
    hide('settings');
}

function displayLocalPdf(file) {
    const reader = new FileReader();
    reader.addEventListener("load", function () {
      // convert file to base64 string
      localStorage.setItem('imageViewer', JSON.stringify([reader.result]));
      window.location.href = reader.result;
    }, false);
    reader.readAsDataURL(file);
    window.location.href = file;
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

function keyboardControllerImageViewer(event) {
    let KeyID = event.keyCode;
    switch(KeyID) {
        case 39:
            cl("arrow right");
            navigateGallery(1);
            break;

        case 37:
            cl("arrow left");
            navigateGallery(-1);
            break;

        case 32:
            cl("space..");
            if(files[imageIndex].endsWith(".mp4")) {
                togglePlay();
            }
            break;

        case 70:
            cl("f");
            if(isFullscreen) { exitFullscreen() } else { enterFullscreen() };
            break; 

        /* case 8:
            cl("backspace");
            break; 
            
        case 13:
            cl("enter");
            break;
            
        case 27:
            cl("esc");
            break;

        case 46:
            cl("delete");
            break; */

        default:
            parent.keyboardController(event);
            break;
    }
}

async function fileExists(imageSrc, fallback) {
    return fetch(imageSrc, { method: 'HEAD' })
    .then(res => {
        if (res.ok) {
            return imageSrc;  // Image is found
        } else {
            return fallback;  // Image is not found
        }
    }).catch(err => console.log('Error:', err));
}
