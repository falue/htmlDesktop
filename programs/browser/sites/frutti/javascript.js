let amountOfImages = [4, 19];
let previewIndex = [0,0];
let currentGallery = 1;

function nextImg(set) {
    hide("preview-"+set+"-"+previewIndex[set-1]);
    if(previewIndex[set-1] < amountOfImages[set-1]-1) {
        previewIndex[set-1]++;
    } else {
        previewIndex[set-1]=0;
    }
    show("preview-"+set+"-"+previewIndex[set-1]);
}

function keyboardControllerFrutti(event) {
    if(event.key === 'Escape') {
        hide('preview-1');
        hide('preview-2');
    }
    if(event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        nextImg(currentGallery);
    }
    
    parent.keyboardController(event)
}