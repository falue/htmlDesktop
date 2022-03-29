let os;
let workstation;
let files;
let imageIndex = 0;
let isFirstFile;

async function setupImageViewer() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    os = urlParams.get('os');
    workstation = urlParams.get('workstation');

    if(urlParams.get('files')) {
        files = urlParams.get('files').split("|");
        setupThumbnails(files);
        isFirstFile = true;
        showImage(0);  // Show first image
    } else {
        gebi('content').innerHTML = "No files in URL";
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
        // Setup thumbnail gallery
        for (const [i, file] of files.entries()) {
            let thumbnail = document.createElement("div");
            thumbnail.setAttribute("title", file);
            thumbnail.setAttribute("id", "thumbnail-"+file);
            thumbnail.classList.add("thumbnail", "shadow", "radius3");
            if(file.endsWith(".mp4")) {
                thumbnail.style.backgroundImage = "url(../../os/"+os+"/systemIcons/fileMovie.png)";
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
        content.style.backgroundImage = "none";
        show("videoPlayer");
        await setVideoSrcAndPlay(path, 'video/mp4');
        gebi('thumbnails').classList.add("videplayer");
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
    if(!isFirstFile) {
        await player.ready(function(){
            player.play();
        });
    }
}

function navigateGallery(direction) {
    imageIndex += direction;
    imageIndex = wrapAround(imageIndex, 0, files.length-1);
    showImage(imageIndex);
}


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
                let player = gebi('videoJsPlayerWrapper_html5_api');
                if(player) {
                    if (player.paused) {
                        player.play(); 
                    } else {
                        player.pause();
                    }
                }
            }
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