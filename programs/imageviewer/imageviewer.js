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
        let path = "../../workstations/"+workstation+"/files/"+files[0];
        content.style.backgroundImage = "url("+path+")";
    } else {
        gebi('content').innerHTML = "no files in URL";
    }
}

function showImage(index) {
    let path = "../../workstations/"+workstation+"/files/"+files[index];
    content.style.backgroundImage = "url("+path+")";
}

function navigateGallery(direction) {
    imageIndex += direction;
    imageIndex = wrapAround(imageIndex, 0, files.length-1);
    showImage(imageIndex);
}
