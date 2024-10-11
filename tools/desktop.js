let bgImgCounter = 0;
let bgImgBasePath = "os/_generic/desktops/";

async function cycleBackgroundImage() {
    // Fade out elements slightly to show new bg image better
    gebi('actionMenu').classList.add('op25');
    let desktopContent = gebi('desktop').children;
    for(let i=0; i<desktopContent.length; i++){
        desktopContent[i].style.opacity="0";
    }
    // Show everything again after a delay
    setTimeout(function() {
        for(let i=0; i<desktopContent.length; i++){
            desktopContent[i].style.opacity="1";
        }
        gebi('actionMenu').classList.remove('op25');
    }, 1000);

    // Show generic Desktop of OS
    if(bgImgCounter === 0 && bgImgBasePath == "os/_generic/desktops/") {
        cl("set generic desktop of OS.");
        setDesktopImg("os/"+os+"/desktop.jpg");
        bgImgCounter++;  // For further manual clicking
        return;
    } else if(bgImgCounter === 0) {
        bgImgCounter = 1;
    }

    // Check if file exists, if not, return false from fileExists()
    let whichFile = await fileExists(bgImgBasePath+bgImgCounter+".jpg", false);
    if(whichFile) {
        setDesktopImg(whichFile);
        bgImgCounter++;  // For further manual clicking
    } else {
        bgImgCounter = 0;  // TODO: only set to 0 if cycle repeats complete
        bgImgBasePath = bgImgBasePath === "os/_generic/desktops/" ? "workstations/"+workstation+"/desktops/" : "os/_generic/desktops/";
        cycleBackgroundImage();
    }
}

async function uploadDesktopImage(data) {
    var file = data.files[0];
    var type = file.type;
    console.log(type);
    if(type.includes('image')) {
        console.log(data)
        setDesktopImg(await convertBase64(data.files[0]));
    }
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

// async function showDialog(title, text, selfClosing, input, feedbackButtons) {
async function setLoginGradientWindow() {
    updateGradient();
    show('setGradient');
}

/* GRADIENTS */
let angle = 121;
let prevAngle = angle;
let type = "linear-gradient"

function addGradientColor() {
    let colorList = gebi('colorPoints');

    let colors = document.getElementsByClassName('colorPickerGradient');
    let numOfColors = colors.length;
    let lastColor = colors[numOfColors-1];
    lastColor = lastColor ? lastColor.value : "#8c3335";

    let rangeList = document.getElementsByClassName('position');
    let numOfRanges = rangeList.length;
    let lastPosition = rangeList[numOfRanges-1];
    lastPosition = lastPosition ? parseInt(lastPosition.value) : 100;

    let secondLastPosition = rangeList[numOfRanges-2];
    secondLastPosition = secondLastPosition ? parseInt(secondLastPosition.value) : 0;
    let newPosition = (lastPosition + secondLastPosition ) / 2;
    if(rangeList[numOfRanges-1]) rangeList[numOfRanges-1].value = newPosition;
    let newPoint = document.createElement('div');
    newPoint.className = 'color-point marginY50';
    newPoint.innerHTML = `
        <input type="color" value="${lastColor}" class="valignText colorPickerGradient" oninput="updateGradient();">
        <input type="range" value="100" min="0" name="range-${numOfRanges+1}" class="valignText position marginX1" max="100" oninput="enforceMinimumGradientPosition(this); updateGradient();">
        <i class="material-icons valignText small round greyBg padding25 tooltip pointer remove-point" data-title="Remove this color" onclick="removeGradientColor(this)">close</i>
    `;
    colorList.appendChild(newPoint);
    updateGradient();
}

function removeGradientColor(e) {
    //console.log(e)
    if (e.className.includes('remove-point')) {
        e.parentNode.remove();
        updateGradient();
    }
}

function setGradientType(newType) {
    type = newType;
    if(type === 'linear-gradient') {
        gebi('angleContainer').style.opacity='1';
    } else {
        gebi('angleContainer').style.opacity='0';
    }
    updateGradient();
}

function updateGradient() {
    let angle = gebi('angle').value;
    let colors = Array.from(document.getElementsByClassName('color-point')).map(function(el) {
        // return value of colorPickerGradient
        let colorPickerGradient = el.querySelector('.colorPickerGradient').value;
        // return value of position
        let position = el.querySelector('.position').value;
        return `${colorPickerGradient} ${position}%`;
    });
    let gradient = colors[0].split(" ")[0];
    if(colors.length === 1) {
        gebi('gradientPreview').style.background = gradient;
        // console.log('background: ' + gradient + ';');
        return;
    }
    colors = colors.join(', ');
    if(type === 'linear-gradient') {
        gradient = type + '(' + angle + 'deg, ' + colors + ')';
    } else {
        gradient = type + '(' + colors + ')';
    }
    // console.log(gradient);
    gebi('gradientPreview').style.background = gradient;
    // console.log('background: ' + gradient + ';');

    if(isGradientLight(gradient)) {
        gebi('gradientPreview').classList.remove('white');
        gebi('gradientPreview').classList.add('black');
    } else {
        gebi('gradientPreview').classList.add('white');
        gebi('gradientPreview').classList.remove('black');
    }
}

function enforceMinimumGradientPosition(el) {
    // FIXME: sucks
    /* let lastMinId = parseInt(el.name.split('-')[1])-1;
    if(lastMinId > 0) {
        let lastMin = document.getElementsByName("range-"+lastMinId)[0].value;
        console.log(lastMin);
        if(el.value < lastMin) el.value = lastMin;
    } */
}

function setGradientAngle(degrees) {
    gebi('angleDisplay').textContent = degrees+"°";
    gebi('angle').value = degrees;
    updateGradient();
}

function chooseGradientAngle(that, event) {
    let dial = that;
    let e = event;

    let rect = dial.getBoundingClientRect();
    let center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
    let angle = Math.atan2(e.clientY - center.y, e.clientX - center.x);
    let degrees = (angle * (180 / Math.PI) + 90 + 360) % 360;
    degrees = Math.round(degrees);
    angle = degrees;

    gebi('angleDisplay').textContent = degrees+"°";
    gebi('angle').value = degrees;

    let dialGradient = `conic-gradient(
        black 0deg ${degrees-5}deg,
        grey ${degrees-5}deg ${degrees+5}deg,
        black ${degrees+5}deg 360deg
    )`;
    gebi('angleDial').style.background = dialGradient;
    updateGradient();
};

function restoreDefaultGradient() {
    // TODO: should reset all sliders, button, amount of colors, color pickers, etc.
    let defaultGradient = 'linear-gradient(121deg, rgb(144, 108, 74) 1%, rgb(140, 51, 53) 49%, rgb(87, 50, 113) 99%)';
    gebi('gradientPreview').style.background = defaultGradient;
    gebi('loginBackgroundPreview').style.background = defaultGradient;
    setLoginGradient(defaultGradient);
    localStorage.removeItem('htmlDesktop-loginGradient');
    hide('setGradient');
}

function setLoginGradient(gradient, saveToLocalStorage) {
    gebi('loginBackgroundPreview').style.background = gradient;
    gebi('lockScreenColorOverlay').style.background = gradient;

    if(isGradientLight(gradient)) {
        gebi('lockScreenWindow').classList.remove('white');
        gebi('loginbuttonText').classList.remove('white');
        gebi('loginLoader').classList.remove('white');
        gebi('loginLoader').querySelector('i').classList.remove('white');
    } else {
        gebi('lockScreenWindow').classList.add('white');
        gebi('loginbuttonText').classList.add('white');
        gebi('loginLoader').classList.add('white');
        gebi('loginLoader').querySelector('i').classList.add('white');
    }

    if(saveToLocalStorage) {
        localStorage.setItem('htmlDesktop-loginGradient', gradient);
        cl("Saved gradient");
        cl(gradient);
    }
}


// NOT async but maybe super for other things?
// fileExists("foo.gif", function(){ cl("good"); }, function(){ cl("bad"); } );
/* function fileExists(imageSrc, good, bad) {
    let img = new Image();
    img.src = imageSrc;
    img.onload = good; 
    img.onerror = bad;
} */

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

function setDesktopImg(path) {
    if(path === 'random') {
        path = getRandomElement([
            "os/"+os+"/desktop.jpg",
            "os/_generic/desktops/1.jpg",
            "os/_generic/desktops/2.jpg",
            "os/_generic/desktops/3.jpg",
            "os/_generic/desktops/4.jpg",
            "os/_generic/desktops/5.jpg",
            "os/_generic/desktops/6.jpg",
            "os/_generic/desktops/7.jpg",
            "os/_generic/desktops/8.jpg",
            "os/_generic/desktops/9.jpg",
            "os/_generic/desktops/10.jpg"
        ]);
    }
    gebi("desktop").style.backgroundImage = "url("+path+")";

    /* const img = new Image();
    let width;
    img.onload = function() {
        width = this.width;
        //cl(this.width + 'x' + this.height);
        cl(width);
        cl(window.innerWidth);
        if(width > window.innerWidth) {
            gebi("desktop").style.backgroundSize = "cover";
        } else {
            gebi("desktop").style.backgroundSize = "initial";
        }
    }
    img.src = path; */
    
}

// AKA logout
async function showLockScreen() {
    let userImage = await fileExists('workstations/'+workstation+'/userpicture.jpg', 'os/_generic/userpicture.jpg');
    gebi('lockScreenUserPicture').src = userImage;
    gebi('lockScreenUserName').innerHTML = username;
    gebi('lockScreenText').focus();
    show('lockScreen');

    // Reset animations
    show('loggingOut');
    hide('lockScreenSystemColorOverlay');
    hide('lockScreenColorOverlay');

    // Start animations
    gebi('loggingOut').classList.add("fadeInFast");
    await delay(1200);

    // Show blackout
    gebi('blackout').classList.add("fadeInFast");
    show('blackout');
    await delay(250);

    // Show login underneath
    /* gebi('lockScreenSystemColorOverlay').classList.add("fadeInFast");
    gebi('lockScreenColorOverlay').classList.add("fadeInFast"); */
    show('lockScreenSystemColorOverlay');
    show('lockScreenColorOverlay');
    /* await delay(250); */

    // Reset animation classes for next installment
    hide('loggingOut');
    gebi('loggingOut').classList.remove("fadeInFast");
    /* gebi('lockScreenSystemColorOverlay').classList.remove("fadeInFast");
    gebi('lockScreenColorOverlay').classList.remove("fadeInFast"); */
    gebi('blackout').classList.remove("fadeInFast");
}



/* WINDOWS 10 HACK */
/* 
    1. open window wifi settings -> print btn ->
    2. open window printer -> "install new driver" btn -> 
    3. open window filemanager -> find system32 -> rename utilman.exe -> rename cmd.exe
    4. close all windows (?)
    5. press btn for old utilman -> open bash window with set new user action
    6. close window
    7. login
*/

async function openWifiSettings() {
    let id = await addWindow('Wifi connections', 'wifi', 'wifi', 33,8, 666,666, false, 1111);
    moveWindowToNewParent(id, 'lockScreenColorOverlay');
}

async function openPrinter() {
    let diagnostics = "<h2>WiFi Network Diagnostic Report</h2><ul><li>Network Adapter: Intel(R) Wireless-AC 9260 160MHz</li><li>Date: 2024-01-16</li><li>Time: 15:42 GMT</li></ul><h3>1. ATHLETICS_intern_5G</h2><ul><li>Status: Connected</li><li>Signal Quality: Good</li><li>Signal Strength: -45 dBm</li><li>Security Type: WPA2-Personal</li><li>IPv4 Address: 192.168.1.5</li><li>IPv6 Address: fe80::2c4d:54ff:feaa:3d2b</li><li>Subnet Mask: 255.255.255.0</li><li>Default Gateway: 192.168.1.1</li><li>DHCP Server: 192.168.1.1</li><li>DNS Servers: 192.168.1.1, 8.8.8.8</li><li>Lease Obtained: 2024-01-16 14:42 G</li></ul><li>Notes: Stable connection established. Bandwidth tests indicate nominal data speeds. No network disruptions detected.</li><h2>2. ATHLETICS_guest_free</h2><ul><li>Status: No Internet Access</li><li>Signal Quality: Moderate</li><li>Signal Strength: -60 dBm</li><li>Security Type: Open</li><li>IPv4 Address: 169.254.9.101</li></ul>";
    diagnostics = encodeURI(diagnostics);
    let id = await addWindow('Print Document "WiFi Network Diagnostic Report"', 'print', `print/index.html?printText=${diagnostics}&pages=2`, 22,13, 800,555, false, 1112);
    moveWindowToNewParent(id, 'lockScreenColorOverlay');
}

async function openFileManager() {
    let id = await addWindow('Select new Printer', 'print', 'filemanager/index.html?folderContent=System%20C:/Operating%20System', 8,8, 1024,706, false, 1113);
    moveWindowToNewParent(id, 'lockScreenColorOverlay');
}

async function openTerminal() {
    let id = await addWindow('Terminal', 'code', 'bash/index.html?script=changePassword&darkMode=true', 8,8, 1024,706, false, 1114);
    moveWindowToNewParent(id, 'lockScreenColorOverlay');
}

function moveWindowToNewParent(id, target) {
    let windowToMove = gebi(id);
    windowToMove.parentNode.removeChild(windowToMove);
    gebi(target).appendChild(windowToMove);
    windowToMove.querySelector('iframe').contentWindow.focus();
}

function setBootSpeed(step) {
    let indicator = gebi('bootSpeedIndicator');
    gebi('bootSpeedSlider').value = step;
    let text = ""
    switch(parseInt(step)) {
        case 1: bootSpeed = 3; text = 'ludicrous [~4s]'; break;
        case 2: bootSpeed = 6; text = 'superfast [~7s]'; break;
        case 3: bootSpeed = 15; text = 'fast-ish [~12s]'; break;
        case 4: bootSpeed = 22; text = 'normal [~16s]'; break;
        case 5: bootSpeed = 33; text = 'sluggish [~22s]'; break;
        case 6: bootSpeed = 42; text = 'slow [~28s]'; break;
        case 7: bootSpeed = 55; text = 'almost broken [~35s]'; break;
        default: bootSpeed = 15; text = 'fast-ish [~12s]'; break;
    }
    gebi('bootSpeedSlider').setAttribute('data-speed', bootSpeed);
    indicator.innerHTML = text;
    // TODO: save step to.. everythibng
}

function setBrightness(value) {
    gebi('brightnessOverlay').style.opacity = 1-(value/100);
    gebi('brightnessIndicator').innerHTML = value;
    localStorage.setItem('htmlDesktop-brightness', value);

    // FIXME: cool idea, but it does not propagate to iframes; and also other cursors are not affected (n-resize etc)
    // Set svg of pointer to make it darker
    // let rgb = parseInt(value*2.55);
    // document.getElementsByTagName('body')[0].style.cursor = `url("data:image/svg+xml,%3Csvg%20version%3D%221.1%22%20id%3D%22pointer_cursor%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%0A%09%20y%3D%220px%22%20width%3D%2228px%22%20height%3D%2228px%22%20viewBox%3D%220%200%2028%2028%22%20style%3D%22enable-background%3Anew%200%200%2028%2028%3B%22%20xml%3Aspace%3D%22preserve%22%3E%0A%3Cpolygon%20fill%3D%22rgb(${rgb}%2C${rgb}%2C${rgb})%22%20points%3D%2211.6%2C11.6%200%2C0%200%2C16%203.2%2C12.8%205.5%2C18.2%209.1%2C16.7%207%2C11.6%20%22%2F%3E%0A%3Cpolygon%20points%3D%229.2%2C10.6%201%2C2.4%201%2C13.6%203.6%2C11.1%205.9%2C16.8%207.8%2C16%205.5%2C10.6%20%22%2F%3E%0A%3C%2Fsvg%3E"), auto`;
}

function setGuiSize(value, setSliderValue=false) {
    localStorage.setItem('htmlDesktop-guiSize', value);
    gebi('guiSizeIndicator').innerHTML = value;
    let em = value / 100;
    document.getElementsByTagName("body")[0].style.fontSize = em + "em";
    if(setSliderValue) gebi("guiSizeSlider").value= value;
}

function setViewportMargins(margins) {
    // Load from memory during setup
    changeViewportMarginDisplay('top', margins.topMargin, true);
    changeViewportMarginDisplay('right', margins.rightMargin, true);
    changeViewportMarginDisplay('bottom', margins.bottomMargin, true);
    changeViewportMarginDisplay('left', margins.leftMargin, true);
    changeViewportMargins();
}

function changeViewportMarginDisplay(side, value, setSliderValue=false) {
    // Update the labels with the current values
    gebi(`${side}Label`).textContent = value <= 0 ? value : "+" + value;
    gebi(`${side}Slider`).classList.toggle("negative", value < 0);
    if(setSliderValue) gebi(`${side}Slider`).value= value;
}

function changeViewportMargins() {
    // PROBLEMS
    // tested + not working + i don't care
    // actionMenu
    // bottom: systemBar changes height??
    // when changing OS, reset margins ?
    // also window /shortcuts icons drag and drop are positionned using the full window which is weird

    // save in localstorage!!!
    // when setup() load it
    
    const container = gebi('body');
    const leftMargin = parseInt(gebi('leftSlider').value) || 0;
    const rightMargin = parseInt(gebi('rightSlider').value) || 0;
    const topMargin = parseInt(gebi('topSlider').value) || 0;
    const bottomMargin = parseInt(gebi('bottomSlider').value) || 0;

    localStorage.setItem('htmlDesktop-viewportMargins', `{"leftMargin": ${leftMargin}, "rightMargin": ${rightMargin}, "topMargin": ${topMargin}, "bottomMargin": ${bottomMargin}}`);

    // Apply the margins dynamically using calc()
    // Dynamically adjust the width and height of the container
    container.style.width = `calc(100% - ${leftMargin + rightMargin}px)`;
    container.style.height = `calc(100% - ${topMargin + bottomMargin}px)`;
    container.style.marginLeft = `${leftMargin}px`;
    container.style.marginRight = `${rightMargin}px`;
    container.style.marginTop = `${topMargin}px`;
    container.style.marginBottom = `${bottomMargin}px`;

    let systemBar = gebi('systemBar');
    let systemBarPosition = window.getComputedStyle(systemBar);
    let systemBarOnTop = parseInt(systemBarPosition.top) < parseInt(systemBarPosition.bottom);
    // resize system bar
    systemBar.style.width = `calc(100% - ${leftMargin + rightMargin}px)`;

    if(systemBarOnTop) {
        cl("systemBar is on top");
        systemBar.style.marginTop = `${topMargin}px`;
        gebi('startMenuWindow').style.marginTop = `${topMargin}px`;
        gebi('startMenuWindow').style.marginLeft = `${leftMargin}px`;
        gebi('osNotifications').style.top = `calc(2em + ${topMargin}px)`;
        gebi('osNotifications').style.right = `${rightMargin}px`;
    } else {
        cl("systemBar is on bottom");
        systemBar.style.marginBottom = `${bottomMargin}px`;
        gebi('startMenuWindow').style.marginBottom = `${bottomMargin}px`;
        gebi('startMenuWindow').style.marginLeft = `${leftMargin}px`;
        gebi('osNotifications').style.bottom = `calc(3em + ${bottomMargin}px)`;
        gebi('osNotifications').style.right = `${rightMargin}px`;
    }

    // Reposition dock
    if(dockAvailable) {
        gebi('dock').style.marginBottom = `${bottomMargin}px`;
        gebi('dock').style.left = `calc(50% + ${(leftMargin - rightMargin)/2}px)`;
    } else {
        gebi('dock').style.marginBottom = `initial`;
        gebi('dock').style.left = `initial`;
    }
    gebi('osNotifications').style.right = `${rightMargin}px`;

    // change with and height and... of all elements that are set fixed and 100% w/h
    // i know i know this has to change whenever i add a new element that is maxWIdth / maxHeight in fullscreen
    let fullscreenElements = [
        'gpuFail',
        'lockScreen',
        'lockScreenSystemColorOverlay',
        'lockScreenColorOverlay',
        'greenscreen',
        'greenscreen-iframe',
        'death',
        'death-iframe',
        'screensaver',
        'splashScreenOverlay',
        'loggingOut',
        'shuttingDown',
        'overlayWorkstation',
        'keyboardControlsWindow',
        'autoDialogWindow',
        'editTaskbarIconsWindow',
        'editShortcutWindow',
        'setGradientWindow',
    ];
    fullscreenElements.forEach(element => {
        gebi(element).style.width = `calc(100% - ${leftMargin + rightMargin}px)`;
        gebi(element).style.height = `calc(100% - ${topMargin + bottomMargin}px)`;
    });
}


async function shutDown(currentScreen) {
    let speed = 1;
    let userImage = await fileExists('workstations/'+workstation+'/userpicture.jpg', 'os/_generic/userpicture.jpg');
    gebi('lockScreenUserPicture').src = userImage;
    gebi('lockScreenUserName').innerHTML = username;
    gebi('lockScreenText').focus();
    show('lockScreen');

    if(currentScreen === 'death') {
        speed = 0;
    }

    // Reset animations
    show('shuttingDown');
    if(currentScreen != 'fromLoginScreen') {
        hide('loggingOut');
        hide('lockScreenSystemColorOverlay');
        hide('lockScreenColorOverlay');
    }

    // Start animations
    gebi('shuttingDown').classList.add("fadeInFast");
    await delay(1200 * speed);

    // Show startUp
    gebi('startUp').classList.add("fadeInFast");
    show('startUp');
    await delay(250 * speed);

    // Show login underneath
    show('lockScreenSystemColorOverlay');
    show('lockScreenColorOverlay');

    // Reset animation classes for next installment
    hide('shuttingDown');
    gebi('shuttingDown').classList.remove("fadeInFast");
    gebi('startUp').classList.remove("fadeInFast");
}

async function crash(speed) {
    gebi('death').classList.add('dyingScreen');
    await delay(1000);
    show('blackout');
    shutDown('death');
    await delay(speed);
    gebi('death').classList.remove('dyingScreen');
    startUp();
    setOverlayColor('NONE');
}

async function reboot() {
    shutDown('fromLoginScreen');
    await delay(3500);
    startUp();
}

async function startUp() {
    let speed = bootSpeed;
    // user has clicked
    // user has pressed any key
    let startUp = gebi('startUp');
    if(startUp.dataset.isStartingUp == "true") {
        cl('already startup up, ignore');
        return;
    }
    startUp.dataset.isStartingUp = "true";
    
    let startUpCode = gebi('startUp-code');
    let startUpLoaderBar = gebi('startUp-loader-bar');
    
    await writeStartupTexts(startUpCode, 400*speed);
    await delay(42*speed);
    startUpCode.innerHTML = '';
    await delay(500);
    show('startUp-loader');
    await counter("startUp-loader-bar", "%", 250*speed, 92, 5, 100);
    await delay(1000);
    
    gebi('startUp').classList.add("fadeOutFast");
    // Focus login input
    if(window.getComputedStyle(gebi('lockScreenText')).display !== "none") {
        gebi('lockScreenText').focus();
    } else {
        gebi('lockScreenPassword').focus();
    }
    // DELAY LOCKED to 2500 because css
    await delay(2500);  // wait for css animation
    
    // on end, destroy stuff and reset
    hide('startUp');
    hide('startUp-loader');
    startUpLoaderBar.style.width="0%";
    startUpLoaderBar.innerHTML="0%";
    gebi('startUp').classList.remove("fadeOutFast");
    startUp.dataset.isStartingUp = "false";
}

async function writeStartupTexts(element, totDuration) {
    let percentile = totDuration/17;
    
    element.innerHTML += "\[  OK  \] Started Show Plymouth Boot Screen.<br>";
    await delay(percentile+randomBetween(-150,150));
    element.innerHTML += "\[  OK  \] Reached target Paths.<br>";
    element.innerHTML += "\[  OK  \] Reached target Basic System.<br>";
    await delay(percentile+randomBetween(-150,150));
    element.innerHTML += "\[  OK  \] Found device ST9500325AS.<br>";
    element.innerHTML += "\[  OK  \] Started dracut initqueue hook.<br>";
    element.innerHTML += "         Starting dracut pre-mount hook...<br>";
    await delay(percentile+randomBetween(-150,150));
    element.innerHTML += "\[  OK  \] Reached target Remote File Systems (Pre)<br>";
    await delay(percentile+randomBetween(-150,150));
    element.innerHTML += "\[  OK  \] Reached target Remote File Systems.<br>";
    element.innerHTML += "\[  OK  \] Started dracut pre-mount hook.<br>";
    element.innerHTML += "<div class='grey'>         Starting File System Check on /dev/disk/by-uuid/85e4ae33-c60e-4372-a6ba-9aeb23bf6d86...</div><br>";
    await delay(percentile+randomBetween(-150,150));
    element.innerHTML += "\[  OK  \] Started File System Check on /dev/disk/by-uuid/85e4ae33-c60e-4372-a6ba-9aeb23bf6d86.<br>";
    element.innerHTML += "         Mounting /sysroot...<br>";
    element.innerHTML += "\[  OK  \] Mounted /sysroot.<br>";
    element.innerHTML += "\[  OK  \] Reached target Initrd Root File System.<br>";
    await delay(percentile+randomBetween(-150,150));
    element.innerHTML += "         Starting Reload Configuration from the Real Root...<br>";
    element.innerHTML += "\[  OK  \] Started Reload Configuration from the Real Root.<br>";
    element.innerHTML += "\[  OK  \] Reached target Initrd File Systems.<br>";
    element.innerHTML += "\[  OK  \] Reached target Initrd Default Target.<br><br>";
    element.innerHTML += "Welcome to openSUSE 13.2 (Harlequin) (x86_64)!<br>";
    await delay(percentile+randomBetween(-150,150));
    element.innerHTML += "<br>";
    await delay(percentile+randomBetween(-150,150));
    element.innerHTML += "<div class='yellow'> _                 _                          _ <br>| |__   ___   ___ | |_   ___ _   _ ___  __  _/ |<br>| '_ \\ / _ \\ / _ \\| __| / __| | | / __| \\ \\/ / |<br>| |_) | (_) | (_) | |_  \\__ \\ |_| \\__ \\_ >  <| |<br>|_.__/ \\___/ \\___/ \\__| |___/\\__,_|___(_)_/\\_\\_|</div><br>";
    element.innerHTML += "<br>";
    element.innerHTML += "<br>";
    element.innerHTML += "<br>";
    await delay(percentile+randomBetween(-150,150));
    element.innerHTML += "\[  OK  \] Stopped Switch Root.<br>";
    await delay(percentile+randomBetween(-150,150));
    element.innerHTML += "\[  OK  \] Stopped target Switch Root.<br>";
    await delay(percentile+randomBetween(-150,150));
    element.innerHTML += "\[  OK  \] Stopped target Initrd File Systems.<br>";
    element.innerHTML += "         Stopping File System Check on /dev/disk/by-uuid/85e4ae33-c60e-4372-a6ba-9aeb23bf6d86...<br>";
    element.innerHTML += "\[  OK  \] Stopped File System Check on /dev/disk/by-uuid/85e4ae33-c60e-4372-a6ba-9aeb23bf6d86.<br>";
    await delay(percentile+randomBetween(-150,150));
    element.innerHTML += "\[  OK  \] Stopped target Initrd Root File System.<br>";
    await delay(percentile+randomBetween(-150,150));
    element.innerHTML += "         Starting Collect Read-Ahead Data";
    element.innerHTML += ".";
    await delay(100);
    element.innerHTML += ".";
    await delay(100);
    element.innerHTML += ".";
    await delay(100);
    element.innerHTML += ".";
    await delay(100);
    element.innerHTML += ".";
    await delay(100);
    return;
}

async function hotSwapOs(nextOs) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    // Create temporary save file for loading by setup();
    let saveFileName = "tempSave-"+createUniqueId();
    // Set new os for compileSaveFile
    os = nextOs;
    compileSaveFile(saveFileName, false);
    
    // If save file exists, add to URL for later URL rewriting by setup();
    if(urlParams.get('loadSaveFile')) {
        // here detect DESKTOP.html
        history.pushState({}, null, `${rootHtmlFile}?hotSwapOs=true&loadSaveFile=${saveFileName}&lastSavedFile=${urlParams.get('loadSaveFile')}`);
    } else {
        // here detect DESKTOP.html
        history.pushState({}, null, `${rootHtmlFile}?hotSwapOs=true&loadSaveFile=${saveFileName}`);
    }

    // Clear workstationList
    gebi('workstationList').innerHTML = "";
    
    // I is smart
    // Reload setup. in setup, the windwos & shortcuts get removed & reloaded
    // to trigger new icons
    await setup();

    // Remove temp save from localStorage
    clearLocalStorageItem(saveFileName);
}

async function login(typedPassword) {
    if(typedPassword.includes(password) || !password) {
        /* hide('wrongPassword'); */
        hide('loginbuttonText');
        show('loginLoader');
        gebi('lockScreenPassword').classList.remove('redBorder');
        /* await delay(3500); */
        await counter("loginLoaderBar", "%", 400, 92, 0, 100);
        /* cl("start animation"); */
        gebi('lockScreen').classList.add('loginAnimation');
        gebi('loginLoaderBar').innerHTML = "Logging in.."
        await delay(1500);  // wait for color animation
        /* cl("finish animation"); */
        hide('lockScreen');

        /* Reset login window */
        hide('loginLoader');
        gebi('lockScreenText').value='';
        gebi('lockScreenPassword').value='';
        show('loginbuttonText');
        gebi('lockScreen').classList.remove('loginAnimation');
    } else {
        /* toggle('wrongPassword'); */
        gebi('lockScreenPassword').value='';
        gebi('lockScreenPassword').classList.add('wiggleX', 'redBorder');
        await delay(1000);  // wait for color animation
        gebi('lockScreenPassword').classList.remove('wiggleX');
    }
}

async function changePassword() {
    let dialogText = "For the login screen, enter new password <span class='red italics'>(only this<br>will be valid)</span> or empty it <span class='green italics'>(anything is valid)</span>:";
    let newPassword = await showDialog("Edit temporary password", dialogText, false, password);
    if(!newPassword) return;  // cancel btn

    if(newPassword === "~EMPTY") {
        password = "";
        gebi("passwordHint").innerHTML = "<span class='italics'>none - type whatever</span>";
        gebi("passwordHint").classList.add("blue");
        localStorage.removeItem('htmlDesktop-password');
    } else {
        password = newPassword;
        gebi("passwordHint").innerHTML = newPassword;
        gebi("passwordHint").classList.add("blue");
        localStorage.setItem('htmlDesktop-password', newPassword);
    }
}

function setSystemColors(newcolor) {
    systemColor = newcolor;  // Update globals
    const systemElements = document.querySelectorAll('.systemColors');
    let color = isLightColor(newcolor) ? "#000000" : "#FFFFFF";
    
    // Change the text of multiple elements with a loop
    systemElements.forEach(element => {
      element.style.backgroundColor = newcolor;
      element.style.color = color;
    });
}

function setDefaultSystemColors(os) {
    let newSystemColor;
    switch(os) {
        case "windows":
            newSystemColor = "#000000";
            break;
        case "windows95":
            newSystemColor = "#c0c0c0";
            break;
        case "mac":
            newSystemColor = "#FCFCFC";
            break;
        case "linux":
            newSystemColor = "#502259";
            break;
        case "spa":
            newSystemColor = "#2f3643";
            break;
    }
    gebi('systemColorPicker').value = newSystemColor;
    setSystemColors(newSystemColor);
    hotSwapped = true;
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

function isGradientLight(gradient) {
    const colorRegex = /#(?:[0-9a-fA-F]{3}){1,2}|rgba?\((?:\d{1,3},\s?){2}\d{1,3}(?:,\s?\d(?:\.\d{1,3})?)?\)/g;
    const colors = gradient.match(colorRegex);
    if (!colors) {
        cl("no colors")
        return false; // No recognizable color format found
    }
    const totalBrightness = colors.reduce((acc, color) => acc + isLightColor(color)*255, 0);
    const averageBrightness = totalBrightness / colors.length;
    return averageBrightness > 127.5; // Brightness threshold
}

// Test for weighted gradient. if white is from 0 to 12% and the rest black,
//   it should result in a "dark gradient" and not be 50-50
/* function isGradientLight(gradient) {
    // Check if the gradient is actually a gradient with percentages
    if (!gradient.includes('gradient') || !gradient.match(/\d+%/)) {
        // Handle non-gradient or gradient without explicit percentages
        if (gradient.startsWith('#') || gradient.startsWith('rgb')) {
            // Single color
            return isLightColor(gradient);
        }
        // If it doesn't match known patterns, return null or a default assumption
        return null;
    }

    // Adjusted regex to capture colors with their percentages
    const colorRegex = /(#(?:[0-9a-fA-F]{3}){1,2}|rgba?\((?:\d{1,3},\s?){2,3}\d+(?:,\s?\d+(?:\.\d+)?)?\))\s*(\d+\.?\d*)?%/g;
    let match;
    let colorsWithPercentages = [];

    while ((match = colorRegex.exec(gradient)) !== null) {
        const color = match[1];
        const percentage = parseFloat(match[2]);
        colorsWithPercentages.push({ color, percentage });
    }

    if (colorsWithPercentages.length === 0) {
        // No colors with percentages found, default assumption or null
        return null;
    }

    // Calculate weighted brightness
    let totalWeightedBrightness = 0;
    let lastPercentage = 0;

    cl("-----");
    cl(colorsWithPercentages);

    colorsWithPercentages.forEach(({ color, percentage }, index) => {
        const brightness = isLightColor(color);
        const weight = index === 0
            ? percentage + colorsWithPercentages[1].percentage/2
            // : (percentage - lastPercentage)/2 + percentage;
            // : (percentage - lastPercentage)/2 + lastPercentage;  // for last?
            : typeof colorsWithPercentages[index+1] === 'undefined'  // for last
                ? (percentage - lastPercentage)/2 + lastPercentage  // for last
                : ((colorsWithPercentages[index+1].percentage - percentage)/2+percentage) - (percentage - lastPercentage/2);  // for last?

        // 0, 40, 100
        // 20, 50, 30
        cl(color);
        cl(brightness);
        cl(weight);
        cl(percentage);
        cl("-----");
        totalWeightedBrightness += brightness*255 * weight;
        lastPercentage = percentage;
    });

    // Handle the last segment if it doesn't reach 100%
    if (lastPercentage < 100) {
        totalWeightedBrightness += (100 - lastPercentage) * isLightColor(colorsWithPercentages[colorsWithPercentages.length - 1].color);
    }

    // Normalize to percentage scale
    const averageBrightness = totalWeightedBrightness / 100;

    return averageBrightness > 127.5; // Brightness threshold
} */


let autoDialogHasClickedOk = false;
async function showDialog(title, text, selfClosing, input, feedbackButtons) {
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

    if(input !== false && input !== undefined) {
        show("autoDialogCloseButton");
        show("autoDialogCancelButton");
        hide("autoDialogLoading");
        show("autoDialogInput");
        autoDialogInput.focus();
        if(input !== true) autoDialogInput.value = input;
        button.innerHTML = "OK";
        button.setAttribute("onclick", "autoDialogHasClickedOk=true; hide('autoDialog')");
        gebi('autoDialogCancelButton').setAttribute("onclick", "autoDialogHasClickedOk=true; gebi('autoDialogInput').value='~CANCEL'; hide('autoDialog')");
        while(!autoDialogHasClickedOk) { await delay(125); }
        return autoDialogInput.value.length ? autoDialogInput.value === "~CANCEL" ? "" : autoDialogInput.value : "~EMPTY";
    }

    if(feedbackButtons?.length) {
        show("autoDialogCloseButton");
        show("autoDialogCancelButton");
        hide("autoDialogLoading");
        hide("autoDialogInput");
        let cancelButton = gebi('autoDialogCancelButtonButton');
        cancelButton.innerHTML = feedbackButtons[0];
        cancelButton.setAttribute("onclick", "autoDialogHasClickedOk=true; gebi('autoDialogInput').value='"+feedbackButtons[0]+"'; hide('autoDialog')");
        button.innerHTML = feedbackButtons[1];
        button.setAttribute("onclick", "autoDialogHasClickedOk=true; gebi('autoDialogInput').value='"+feedbackButtons[1]+"'; hide('autoDialog')");
        while(!autoDialogHasClickedOk) { await delay(125); }
        return autoDialogInput.value;
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


async function showNote(title, text, icon, deathDelay) {
    show("autoNote");
    let  = title;
    /* gebi("autoNoteText").innerHTML = text; */
    let listOfNotes = gebi('autoNote');
    let id = "note-"+createUniqueId();

    let note = document.createElement("div");
    note.id = id;
    note.classList.add("shadow", "darkGreyBg", "radius5");
    note.setAttribute("onclick", 'this.remove();');
    
    let titleElement = document.createElement("h3");
    titleElement.classList.add("grey");
    
    let iconElement = document.createElement("i");
    iconElement.classList.add("material-icons", "white", "fancy", "circle", "padding25", "small", "valign");
    iconElement.appendChild(document.createTextNode(icon));
    
    titleElement.appendChild(iconElement);
    titleElement.appendChild(document.createTextNode(title));
    
    let textElement = document.createElement("span");
    textElement.innerHTML = text;
    
    note.appendChild(titleElement);
    note.appendChild(textElement);
    listOfNotes.appendChild(note);

    await delay(deathDelay);

    // maybe div was closed by user in the meantime
    let currentNote = gebi(id);
    if(currentNote) {
        currentNote.classList.add("fadeOut");
        await delay(1000);
        currentNote.remove();
    }

    // If no notes present, hide div
    if(!listOfNotes.innerHTML) hide("autoNote");
}

function setDelayUi(value) {
    gebi('osNotificationsDurationSlider').value = value;
    gebi('osNotificationsDurationUi').innerHTML = value > 0 ? value+'s delay' : 'No delay';
}

function triggerActionOrMessage(data) {
    // If selected option has data-type set, its a direct action
    let osNotificationsSelect = gebi('osNotificationsSelect');
    if(data && osNotificationsSelect.options[osNotificationsSelect.selectedIndex].dataset.action) {
        playAction(data);
    } else if(data) {
        showSystemMessage(osNotifications[parseInt(data)]);
    } else {
        cl("No notifications available");
    }
}

async function playAction(action) {
    let messageSent = Math.floor(Date.now() / 1000);
    let initialDelay = parseInt(gebi('osNotificationsDurationSlider').value)*1000;
    await delay(initialDelay);
    // Show container if it was not cleared before
    if(clearedSystemMessages < messageSent) {
        // if action includes await, it needs to be enclosed in async function
        eval("(async () => {" + action + "})()"); // suck my dick
    }
}

async function showSystemMessage(messageData) {
    let messageSent = Math.floor(Date.now() / 1000);
    let title = messageData.title;
    let description = messageData.description;
    let icon = messageData.icon;
    let initialDelay = messageData.initialDelay === true ? parseInt(gebi('osNotificationsDurationSlider').value)*1000 : messageData.initialDelay;
    let timeOut = messageData.timeOut;
    let action = messageData.action;
    action = action && action !== "action" ? action : "";
    let id = "message-"+createUniqueId(10);  // Only for close via close button
    let container = gebi('osNotifications');

    let message = document.createElement("div");
    message.classList.add("message", "radius5", "shadow");  // Cannot add systemColors because this is js that does that
    message.setAttribute("onclick", "closeSystemMessage(this); "+action);
    message.id = id;
    
    // Set icon
    let i = document.createElement("i");
    i.classList.add("material-icons", "icon", "valign", "fancy");
    i.innerHTML = icon;
    message.appendChild(i);
    
    let textContainer = document.createElement("div");
    textContainer.classList.add("textContainer");
    let titleDiv = document.createElement("div");
    titleDiv.classList.add("title");
    titleDiv.innerHTML = title;
    textContainer.appendChild(titleDiv);
    
    if(description) {
        let descDiv = document.createElement("div");
        descDiv.classList.add("description");
        descDiv.innerHTML = description;
        textContainer.appendChild(descDiv);
    }

    message.appendChild(textContainer);

    let close = document.createElement("div");
    close.classList.add("close", "shadow");
    close.innerHTML="&times;";
    close.setAttribute("onclick", "event.stopPropagation(); closeSystemMessage(gebi('"+id+"'));");
    message.appendChild(close);

    // Wait for initial delay
    if(initialDelay) await delay(initialDelay);
    
    // Show container if it was not cleared before
    if(clearedSystemMessages < messageSent) {
        show('osNotifications');

        // Show message & add to container
        container.appendChild(message);    
        
        // If self-closing is set > 0, self close
        if(timeOut) {
            await delay(timeOut);
            closeSystemMessage(message);
        }
    }
}

async function closeSystemMessage(element) {
    // add fadeout class
    element.classList.add("fadeOutFast");
    // await animation
    await delay(300);
    // remove fadeoutclass
    element.classList.remove("fadeOutFast");
    // if gebi(id) remove this message
    if(element) element.remove();
    // Hide container if empty
    if(!gebi('osNotifications').innerHTML) hide('osNotifications');
}

let clearedSystemMessages = 0;
function clearSystemMessages() {
    gebi('osNotifications').innerHTML = "";
    hide('osNotifications');
    cl('Cleared system messages');
    clearedSystemMessages = Math.floor(Date.now() / 1000);
}


function keyboardController(event) {
    // Ignore presses in textareas and inputs, but NOT buttons because mostly fake
    if(event.target.localName !== "textarea" && event.target.localName !== "input") {
        // Need .code not .key because i need to check for .altKey - which makes
        // "å" out of "a" depending on the keyboard layout.
        let key = event.code;
        // 
        key = key.replace("Numpad", "");  // For numerals on keypad
        key = key.replace("Digit", "");   // For numerals on top of keyboard
        if(event.shiftKey) key = "shift-"+key;
        if(key==="Multiply") key = "*";   // For star on keypad
        if(event.key==="*") key = "*";    // For shift + 3

        // "Any key" wakes up from blackout - but ignore if
        //   alt key is pressed to allow for green screen activation
        if(!gebi('blackout').classList.contains('hide') && !event.altKey) {
            setOverlayColor("BLACK");
            return;
        }
        
        // Wake up from screensaver
        if(!gebi('screensaver').classList.contains('hide')) {
            epD(event);
            screensaverHide();
            return;
        }

        // if is shutting down, start up
        if(!gebi('startUp').classList.contains('hide')) {
            startUp();
            return;
        }
        // Remote or arrow keys
        if((key === 'ArrowRight' || key === 'ArrowLeft') && arrowAction !== 'NOTHING') {
            switch(arrowAction) {
                case 'ACTION':
                    triggerActionOrMessage(gebi('osNotificationsSelect').value);
                    break;
                case 'BLACK':
                    setOverlayColor("BLACK");
                    break;
                case 'LOGOUT':
                    showLockScreen();
                    break;
                case 'SHUTDOWN':
                    shutDown();
                    break;
                case 'SCREENSAVER':
                    screenSaver();
                    break;
                case 'GREEN':
                    setOverlayColor("GREEN");
                    break;
                case 'DEATH':
                    setOverlayColor("DEATH");
                    break;
                case 'GPU':
                    toggle("gpuFail");
                    break;
            }
            return;
        }

        // For main keyboard, all hotkeys need alt to work!
        //   This is down here because hotkeys above here should work without alt,
        //   like leaving the screensaver, a blackout or the greenscreen
        // ATTENTION: alt+m is used by eddy-g to toggle menu bar; alt+h is "go to home"!

        // Do nothing if any key was pressed without alt, but let Numpad keys work without alt
        if(!event.altKey && !event.code.includes("Numpad")) {
            return;
        }

        if(event.altKey && (key === "ArrowLeft" || key === "ArrowRight")) {
            cl('prevented history back/front!');
            event.preventDefault();
        }

        // special cases for black, death and green
        if(!gebi('blackout').classList.contains('hide') || !gebi('greenscreen').classList.contains('hide') || !gebi('death').classList.contains('hide')) {
            if(key === "5" || key === "KeyG") {
                setOverlayColor("GREEN");
            } else if(key === "8" || key === "KeyK") {
                setOverlayColor("DEATH");
            } else if(key === "1" || key === "KeyB") {
                setOverlayColor("BLACK");
            }
            return;
        }

        switch(key) {
            case "*": showSystemMessage({title: "Remote Control works!", description: "You can use every button now.", icon:"podcasts", timeOut: 1500}); break;
            case "KeyB": case "1": setOverlayColor('BLACK'); break;
            case "KeyL": case "2": showLockScreen(); break;
            case "KeyQ": case "3": shutDown(); break;
            case "KeyX": case "4": screenSaver(); break;
            case "KeyG": case "5": setOverlayColor('GREEN'); break;
            case "KeyN": case "6": triggerActionOrMessage(gebi('osNotificationsSelect').value); break;
            case "shift-KeyC": case "7": clearSystemMessages(); break;
            //case "KeyK": case "8": window.location = 'programs/bluescreen/index.html'; break;
            case "KeyK": case "8": setOverlayColor('DEATH'); break;
            case "Escape": case "0": setOverlayColor('NONE'); break;

            case "KeyC": epD(event); createShortcut(); break;
            case "KeyS": epD(event); save(); break;
            case "shift-KeyS": epD(event); saveAs(false); break;
            case "KeyD": clutterDesktop(4); break;
            case "KeyW": startDefaultProgram(); break;
            case "KeyA": toggle('actionMenu'); break;

            /* case "KeyC": if(!lockKeyboard) { epD(event); createShortcut(); } break;
            case "KeyS": if(!lockKeyboard) { epD(event); save(); } break;
            case "shift-KeyS": if(!lockKeyboard) { epD(event); saveAs(false); } break;
            case "KeyD": if(!lockKeyboard) { clutterDesktop(4); } break;
            case "KeyW": if(!lockKeyboard) { startDefaultProgram(); } break;
            case "KeyA": if(!lockKeyboard) { toggle('actionMenu'); } break; */

            /* case "1": if(!lockKeyboard) { epD(event); startDefaultProgram('terminal', 6); } break;
            case "2": if(!lockKeyboard) { startDefaultProgram('fileManager'); } break;
            case "3": if(!lockKeyboard) { epD(event); startDefaultProgram('textEditor-random'); } break;
            case "4": if(!lockKeyboard) { startDefaultProgram('browser'); } break;
            case "5": if(!lockKeyboard) { startDefaultProgram('imageViewer'); } break;
            case "6": if(!lockKeyboard) { startDefaultProgram('ftp'); } break;
            case "7": if(!lockKeyboard) { startDefaultProgram('ftp-connect'); } break; */

            /* case "arrowright": epD(event); cl("arrow right!"); break;
            case "arrowleft": epD(event); cl("arrow left!"); break;
            case "arrowup": epD(event); cl("arrow up!"); break;
            case "arrowdown": epD(event); cl("arrow down!"); break;
            case " ": epD(event); cl("space!"); break;
            case "backspace": epD(event); cl("backspace!"); break; 
            case "enter": epD(event); cl("enter!"); break;
            case "delete": epD(event); cl("delete"); break;
            case "meta": epD(event); cl("cmd"); break;
            case "shift": epD(event); cl("shift"); break;
            case "alt": epD(event); cl("alt"); break;
            case "control": epD(event); cl("control"); break;
            case "shift": epD(event); cl("shift"); break; */

            default:
                // Any other keypresses: Do nothing
                // cl("Default Keypress: "+key);
                break;
        }
    }
}

let overlayColor = 'NONE';

// This forgets the previous color, but also does kinda what I want.
async function setOverlayColor(buttonColor) {
    let currentScreen = "NONE";
    currentScreen = !gebi('blackout').classList.contains('hide') ? "BLACK" : currentScreen;
    currentScreen = !gebi('greenscreen').classList.contains('hide') ? "GREEN" : currentScreen;
    currentScreen = !gebi('death').classList.contains('hide') ? "DEATH" : currentScreen;
    
    // hide everything first
    hide('blackout');
    hide('greenscreen');
    hide('death');
    
    // If button same as before, show desktop
    if(currentScreen === buttonColor) {
        hide('blackout');
        hide('greenscreen');
        hide('death');
    } else {
        // if any color, show it and focus iframe
        if(buttonColor === 'BLACK') {
            show('blackout');
        }
        if(buttonColor === 'GREEN') {
            show('greenscreen');
            gebi('greenscreen-iframe').focus();
        }
        if(buttonColor === 'DEATH') {
            show('death');
            gebi('death-iframe').focus();
        }
    }
}

function blackoutHide() {
    hide('blackout');
    if(!gebi('lockScreen').classList.contains('hide')) {
        // If lock screen is visible, focus login form:
        // focus() user input (linux, windows) or focus password input (mac) because user input is missing on mac
        if(window.getComputedStyle(gebi('lockScreenText')).display !== "none") {
            gebi('lockScreenText').focus();
        } else {
            gebi('lockScreenPassword').focus();
        }
    }
}

function fullscreenGreenscreen() {
    hide('actionMenu');
    if(!gebi('greenscreen').classList.contains('hide') && !gebi('blackout').classList.contains('hide')) {
        blackoutHide();
    } else if(!gebi('greenscreen').classList.contains('hide')) {
        hide('greenscreen');
    } else {
        show('greenscreen');
        gebi('greenscreen-iframe').focus();
    }
}

function screenSaver() {
    gebi('screensaverSrc').setAttribute('src', 'os/'+os+'/screensaver.mp4');
    show('screensaver');
    gebi('screensaver').load();
    gebi('screensaver').play();
}

function screensaverHide() {
    let screensaver = gebi('screensaver');
    screensaver.pause(); screensaver.currentTime=0; hide(screensaver.id);
}

async function printElement(title, element, footer=true) {
    let mywindow = window.open('', 'PRINT', 'height=400,width=600');
    let fontFace = `@font-face {
        font-family: 'Material Icons';
        font-style: normal;
        font-weight: 400;
        src: url('tools/fontface/MaterialIcons-Regular.eot');
        src: url('tools/fontface/MaterialIcons-Regular.woff2') format('woff2'), 
             url('tools/fontface/MaterialIcons-Regular.woff') format('woff'), 
             url('tools/fontface/MaterialIcons-Regular.ttf') format('truetype');
      }`;
    mywindow.document.write('<html><head><title>' + title  + '</title>');
    mywindow.document.write(`<style>${fontFace} body { font-family: Verdana, Geneva, Tahoma, sans-serif; } li { list-style-type:none; line-height:2.2em; } .keyboardKey { border:solid black thin; padding:.25em .5em; border-radius:.3em; } i { font-family: 'Material Icons'; font-style: normal; } 
    .bold { font-weight: bold; }
    .noPrint { display: none !important;}
    .onlyPrint { display: inherit !important; }
    </style>`);
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>' + title  + '</h1>');
    mywindow.document.write(element.innerHTML);
    if(footer) mywindow.document.write('<br><br><br><span style="font-size:.8em">www.telefabi.ch/htmlDesktop/howto</span>');
    mywindow.document.write('</body></html>');
    await delay(250); // wait for font to render
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    mywindow.print();
    mywindow.close();
    return true;
}

async function displayLicenses() {
    let licenses = [
        "Material-icons-LICENSE-apache-2_0.txt",
        "papirus-icon-theme-LICENSE-gnu-3.txt",
        "la-capitaine-icons-LICENSE-gnu-3.txt",
        "Mojave-CT-LICENSE-gnu_3.txt",
        "Roboto-font-LICENSE-apache-2_0.txt",
        "threejs-LICENSE-MIT.txt"
    ];
    let licensesText = "";
    let licensesHeader = "The following fair-use Licenses are from third party software included in this software:<br><br>";
    for(let i = 0; i < licenses.length; i++) {
        let title = licenses[i].replace(".txt", "").replace("LICENSE", "").replaceAll("-", " ");
        licensesHeader += "- <a href='#"+licenses[i]+"'>"+title+"</a><br>"
        licensesText += "<section id='"+licenses[i]+"'><h2 class='blue'>"+title+"</h2><br>";
        licensesText += (await parseFile("tools/licenses/"+licenses[i])).replaceAll("<", "").replaceAll(">", "").replaceAll("  ", " &nbsp;").replaceAll("\n", "<br>");
        licensesText += "</section><br><br><hr><br>";
    }
    showDialog("EXTERNAL LICENSES", licensesHeader + "<br><hr><br>" + licensesText);
}
