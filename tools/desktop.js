let bgImg = 0;
let totalBgImgs = 4;

function cycleBackgroundImage() {
    if(bgImg > totalBgImgs+1) bgImg = 0;
    bgImg++;
    let bgPath = "os/_general/desktops/"+bgImg+".jpg";
    if(bgImg > totalBgImgs) bgPath = "workstations/"+workstation+"/desktop.jpg";
    if(bgImg > totalBgImgs+1) bgPath = "os/"+os+"/desktop.jpg";
    // console.log(bgPath);
    setDesktopImg(bgPath);
}

function setDesktopImg(path) {
    gebi("desktop").style.backgroundImage = "url("+path+")";
}

async function login(password) {
    let correctPassword = gebi("passwordCheck").value;
    if(password === correctPassword) {
        hide('wrongPassword');
        show('loginLoader');
        /* await delay(3500); */
        await counter("loginLoaderBar", "%", 3500, 95, 0, 100);
        hide('lockScreen');
        hide('loginLoader');
        gebi('lockScreenText').value='';
        gebi('lockScreenPassword').value='';
    } else {
        toggle('wrongPassword');
        gebi('lockScreenPassword').value='';
    }
}

function setSystemColors(newcolor) {
    systemColor = newcolor;  // Update globals
    const systemElements = document.querySelectorAll('.systemColors');
    
    // Change the text of multiple elements with a loop
    systemElements.forEach(element => {
      element.style.backgroundColor = newcolor;
      element.style.color = isLightColor(newcolor) ? "#000000" : "#FFFFFF";
    });
}

// Magic from Andreas Wik https://awik.io/determine-color-bright-dark-using-javascript/
function isLightColor(color) {
    // Variables for red, green, blue values
    var r, g, b, hsp;
    
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {
        // If RGB --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        r = color[1];
        g = color[2];
        b = color[3];
    } else {
        // If hex --> Convert it to RGB: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace( 
        color.length < 5 && /./g, '$&$&'));
        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }
    
    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    // hsp>127.5 = 'light'; hsp<=127.5 = 'dark';
    // greyscale image from color: rgb(hsp, hsp, hsp)
    // inverted brightness of grey tone from color: rgb(255-hsp, 255-hsp, 255-hsp)
    return hsp > 127.5;
}


let autoDialogHasClickedOk = false;
async function showDialog(title, text, selfClosing, input) {
    show("autoDialog");
    gebi("autoDialogTitle").innerHTML = title;
    gebi("autoDialogText").innerHTML = text;
    // Reset dialog
    hide("autoDialogInput");
    hide("autoDialogCancelButton");
    let button = gebi('autoDialogCloseButtonButton');
    button.innerHTML = "Close";
    let autoDialogInput = gebi('autoDialogInput');
    autoDialogInput.value = "";

    autoDialogHasClickedOk = false;

    if(input) {
        show("autoDialogCloseButton");
        show("autoDialogCancelButton");
        hide("autoDialogLoading");
        show("autoDialogInput");
        button.innerHTML = "OK";
        button.setAttribute("onclick", "autoDialogHasClickedOk=true; hide('autoDialog')");
        gebi('autoDialogCancelButton').setAttribute("onclick", "autoDialogHasClickedOk=true; gebi('autoDialogInput').value='~CANCEL'; hide('autoDialog')");
        while(!autoDialogHasClickedOk) { await delay(125); }
        return autoDialogInput.value.length ? autoDialogInput.value === "~CANCEL" ? "" : autoDialogInput.value : "~EMPTY";
    }
    if(selfClosing) {
        hide("autoDialogCloseButton");
        show("autoDialogLoading");
        /* await delay(selfClosing); */
        await counter('autoDialogLoading', '', selfClosing, 0, 4,1)
        /* counter(targetId, append, duration, jitter, start, stop) */
        hide("autoDialog");
        return "TESTFILENAME";
    } else {
        show("autoDialogCloseButton");
        hide("autoDialogLoading");
    }
}
