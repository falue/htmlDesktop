let os = "windows";
let workstation = "_generic";
let files;
let imageIndex = 0;

async function setupImageViewer() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    os = urlParams.get('os');
    workstation = urlParams.get('workstation');

    if(urlParams.get('files')) {
        files = urlParams.get('files').split("|");
        setupThumbnails(files);
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
                // Preload to allow for scrubbing when visiting the video
                setVideoSrc("../../workstations/"+workstation+"/files/"+file, 'video/mp4');
            } else {
                thumbnail.style.backgroundImage = "url(../../workstations/"+workstation+"/files/"+file+")";
            }
            thumbnail.setAttribute("onclick", "showImage("+i+");");
            thumbnails.appendChild(thumbnail);
        }
    }
}

function showImage(index) {
    imageIndex = index;
    let file = files[index];
    let path = "../../workstations/"+workstation+"/files/"+file;
    let content = gebi('content');

    if(file.endsWith(".mp4")) {
        show("videoPlayer");
        setVideoSrc(path, 'video/mp4');
        content.style.backgroundImage = "none";
    } else {
        hide("videoPlayer");
        let player = videojs(document.querySelector('.video-js'));
        if(player) player.pause();
        content.style.backgroundImage = "url("+path+")";
    }

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
}

async function setVideoSrc(videoSource, type) {
    cl("laod video");
    let player = videojs(document.querySelector('.video-js'));
    player.src({
        "src": videoSource,
        "type": type
    });
    // Enable autoplay if more than one file
    // without prior user interaction, autoplay is forbidden
    // Fails if video is first of gallery but yeah, just more error logs
    return await player.ready(function(){
            if(files.length > 1) {
                player.play();
            }
        });
}

function navigateGallery(direction) {
    imageIndex += direction;
    imageIndex = wrapAround(imageIndex, 0, files.length-1);
    showImage(imageIndex);
}


function keyboardController(event) {
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

        case 8:
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
            break;

        default:
            cl("anything else. KeyID: ");
            cl(KeyID);
            break;
    }
}