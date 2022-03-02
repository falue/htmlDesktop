function getInFocus(current, id) {
    if(current.value.length > 0) {
        let element = document.getElementById(id);
        element.focus();
    }
}

async function goToIntranet(user) {
    // TODO CHECK NAMES ETC
    if(user.toLowerCase().includes("fischer")) {
        hide('loginForm');
        show('loading');
        await delay(1200);
        window.location.href = 'intranet-fischer.html';
    } else if(user.toLowerCase().includes("kemp")) {
        hide('loginForm');
        show('loading');
        await delay(1200);
        window.location.href = 'intranet-kemp.html';
    } else {
        alert("Username muss 'fischer' oder 'kemp' enthalten.");
    }
}

function loadSubfolders() {
    document.getElementById('imageLoadingFolder').style.display = "table-row";
    document.getElementById('closedFolderFamily').style.display = "table-row";
    document.getElementById('closedFolderLena').style.display = "table-row";
    hide('imageLoadingFolderClosed');
    showClass('subfolder');
}

async function loadImages(foldername) {
    /* hide('imageLoadingFolderClosed'); */
    document.getElementById('imageLoading'+capitalizeFirstLetter(foldername)).style.display = "table-row";
    document.getElementById('openFolder'+capitalizeFirstLetter(foldername)).style.display = "table-row";
    hide('closedFolder'+capitalizeFirstLetter(foldername));
    let speed = foldername == 'family' ? 666 : 1500;
    await counter('loadingGallery'+capitalizeFirstLetter(foldername), "%", speed, 94, 0, 100);
    hide('imageLoading'+capitalizeFirstLetter(foldername));
    showClass('imageGalleryTr '+foldername);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
async function loadFileBrowser() {
    await counter('loadingBrowser', "K Files", 2200, 97, 0, 813);
    /* await counter('loadingBrowser', " Files", 1000, 0, 0, 58); */  // testing
    hide('filebrowserLoader');
    show('filelist');
}

function unloadImages() {
    document.getElementById('imageLoadingFolderClosed').style.display = "table-row";
    /* document.getElementById('openFolderFamily').style.display = "table-row"; */
    hide('openFolderFamily');
    hide('openFolderLena');
    hide('closedFolderFamily');
    /* document.getElementById('openFolderLena').style.display = "table-row"; */
    hide('closedFolderLena');
    hide('imageLoadingFolder');
    hideClass('imageGalleryTr');
    hideClass('subfolder');
}

let family = [
    "imgs/gallery/family/1.jpg",
    "imgs/gallery/family/2.jpg",
    "imgs/gallery/family/3.jpg",
    "imgs/gallery/family/4.jpg",
    "imgs/gallery/family/5.jpg",
    "imgs/gallery/family/6.jpg",
    "imgs/gallery/family/7.jpg",
]
let fileNamesFamily = [
    "Bilder/Family/IMG_42729.jpg",
    "Bilder/Family/IMG_42730.jpg",
    "Bilder/Family/IMG_42731.jpg",
    "Bilder/Family/IMG_42732.jpg",
    "Bilder/Family/IMG_42733.jpg",
    "Bilder/Family/IMG_42734.jpg",
    "Bilder/Family/IMG_42735.jpg",
]

let lena = [
    "imgs/gallery/lena/1.jpg",
    "imgs/gallery/lena/2.jpg",
    "imgs/gallery/lena/3.jpg",
    "imgs/gallery/lena/4.jpg",
    "imgs/gallery/lena/5.jpg",
    "imgs/gallery/lena/6.jpg",
    "imgs/gallery/lena/7.jpg",
    "imgs/gallery/lena/8.jpg",
    "imgs/gallery/lena/9.jpg",
]
let fileNamesLena = [
    "Bilder/Lena/IMG_100322.jpg",
    "Bilder/Lena/IMG_100323.jpg",
    "Bilder/Lena/IMG_100324.jpg",
    "Bilder/Lena/IMG_100325.jpg",
    "Bilder/Lena/IMG_100326.jpg",
    "Bilder/Lena/IMG_100327.jpg",
    "Bilder/Lena/IMG_100328.jpg",
    "Bilder/Lena/IMG_100329.jpg",
    "Bilder/Lena/IMG_100330.jpg",
]

let imageIndex = 0;
let filelist = family;
let fileNameList = fileNamesFamily;

async function openGallery(currentFolder, currentFileNames) {
    show('gallery');
    imageIndex = 0;
    filelist = currentFolder;
    fileNameList = currentFileNames;
    await delay(666);
    openImage(1);
}

function closeGallery() {
    hide('gallery');
    imageIndex = 0;
    let galleryImage = document.getElementById('galleryImage');
    let galleryDesc = document.getElementById('galleryDesc');
    galleryDesc.innerHTML = "Loading..";
    galleryImage.style.backgroundImage = "none";
}

function openImage(increment) {
    if(imageIndex >= filelist.length) imageIndex = 0;
    if(imageIndex < 0) imageIndex = filelist.length-1;
    let galleryImage = document.getElementById('galleryImage');
    let galleryDesc = document.getElementById('galleryDesc');
    /* console.log(imageIndex);
    console.log(filelist[imageIndex]); */
    galleryDesc.innerHTML = (imageIndex+1).toString().padStart(3, "0") + ": " + fileNameList[imageIndex];
    galleryImage.style.backgroundImage = "url("+filelist[imageIndex]+")";
    imageIndex += increment;
}