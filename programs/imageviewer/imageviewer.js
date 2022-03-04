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
        console.log(files);
        let content = gebi('content');
        setupThumbnails(files);
        let path = "../../workstations/"+workstation+"/files/"+files[0];
        content.style.backgroundImage = "url("+path+")";
    } else {
        gebi('content').innerHTML = "no files in URL";
    }
}

function setupThumbnails(files) {
    let thumbnails = gebi('thumbnails');
    if(files.length <= 1) {
        // Hide navigation arrwos if only one image
        content.classList.add('onlyOneImage');  
        hide('thumbnails');
    } else {
        /* FOR OF FILES... */
        for (const [i, file] of files.entries()) {
        /* for(file of files) { */
            /* cl(file + " " + i); */
            /* <div class="thumbnail shadow"></div> */
            let thumbnail = document.createElement("div");
            thumbnail.setAttribute("title", file);
            thumbnail.setAttribute("id", "thumbnail-"+file);
            thumbnail.classList.add("thumbnail", "shadow", "radius3");
            if(i === 0) thumbnail.classList.add("active");
            thumbnail.style.backgroundImage = "url(../../workstations/"+workstation+"/files/"+file+")";
            thumbnail.setAttribute("onclick", "showImage("+i+");");
            thumbnails.appendChild(thumbnail);
            /* console.log(i, file) */
        }
    }
}

function showImage(index) {
    let path = "../../workstations/"+workstation+"/files/"+files[index];
    content.style.backgroundImage = "url("+path+")";
    /* Remove all active classes */
    let elements = document.querySelectorAll(".thumbnail.active");
    for(i=0; i< elements.length; i++) {
          elements[i].classList.remove('active');
      }
    /* Scroll to thumbnail & mark as active */
    let thumbnail = gebi("thumbnail-"+files[index]);
    thumbnail.scrollIntoView({inline: "center", block: "nearest", behavior: "smooth"});
    thumbnail.classList.add('active');
}

function navigateGallery(direction) {
    imageIndex += direction;
    imageIndex = wrapAround(imageIndex, 0, files.length-1);
    showImage(imageIndex);
}
