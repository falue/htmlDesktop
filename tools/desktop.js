let bgImgCounter = 0;
let bgImgBasePath = "os/_generic/desktops/";

async function cycleBackgroundImage() {
    let bgPath;
    // Show generic Desktop of OS
    if(bgImgCounter === 0 && bgImgBasePath == "os/_generic/desktops/") {
        cl("set generic desktop of OS.");
        setDesktopImg("os/"+os+"/desktop.jpg");
        bgImgCounter++;  // For further manual clicking
        return;
    } else if(bgImgCounter === 0) {
        bgImgCounter = 1;
    }
    fetch(bgImgBasePath+bgImgCounter+".jpg", { method: 'HEAD' })
    .then(res => {
        if (res.ok) {
            // Image is found
            bgPath = bgImgBasePath+bgImgCounter+".jpg"
            cl('Image exists. :'+bgPath);
            setDesktopImg(bgPath);
            bgImgCounter++;  // For further manual clicking
        } else {
            // Image is not found. reset counter, swap bgImgBasePath around and click again.
            cl('Image does not exist. :'+bgImgBasePath+bgImgCounter+".jpg");
            bgImgCounter = 0;  // TODO: only set to 0 if cycle repeats complete
            bgImgBasePath = bgImgBasePath === "os/_generic/desktops/" ? "workstations/"+workstation+"/desktops/" : "os/_generic/desktops/";
            cycleBackgroundImage();
        }
    }).catch(err => console.log('Error:', err));
}

// NOT async but maybe super for other things?
// fileExists("foo.gif", function(){ cl("good"); }, function(){ cl("bad"); } );
function fileExists(imageSrc, good, bad) {
    let img = new Image();
    img.src = imageSrc;
    img.onload = good; 
    img.onerror = bad;
}

function setDesktopImg(path) {
    gebi("desktop").style.backgroundImage = "url("+path+")";
}

function showLockScreen() {
    show('lockScreen');
    gebi('lockScreenText').focus();
    gebi('lockScreenUserName').innerHTML = username;
    gebi('lockScreenUserPicture').src = 'workstations/'+workstation+'/userpicture.jpg';
}

async function login(password) {
    let correctPassword = gebi("passwordCheck").value;
    if(password.includes(correctPassword)) {
        /* hide('wrongPassword'); */
        hide('loginbuttonText');
        show('loginLoader');
        /* await delay(3500); */
        await counter("loginLoaderBar", "%", 3000, 92, 0, 100);
        cl("start animation");
        gebi('lockScreen').classList.add('loginAnimation');
        gebi('loginLoaderBar').innerHTML = "Logging in.."
        await delay(2000);  // wait for color animation
        cl("finish animation");
        hide('lockScreen');

        /* Reset login window */
        hide('loginLoader');
        gebi('lockScreenText').value='';
        gebi('lockScreenPassword').value='';
        show('loginbuttonText');
        gebi('lockScreen').classList.remove('loginAnimation');
        gebi('lockScreenPassword').classList.remove('redBorder');
    } else {
        /* toggle('wrongPassword'); */
        gebi('lockScreenPassword').value='';
        gebi('lockScreenPassword').classList.add('wiggleX', 'redBorder');
        await delay(1000);  // wait for color animation
        gebi('lockScreenPassword').classList.remove('wiggleX');
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
        autoDialogInput.focus();
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
