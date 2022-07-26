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

    if(input) {
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
    gebi('osNotificationsDurationUi').innerHTML = value > 0 ? value+'s' : 'No delay';
}

function triggerActionOrMessage(data) {
    // If selected option has data-type set, its a direct action
    let osNotificationsSelect = gebi('osNotificationsSelect');
    if(osNotificationsSelect.options[osNotificationsSelect.selectedIndex].dataset.action) {
        playAction(data);
    } else {
        showSystemMessage(osNotifications[parseInt(data)]);
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
    clearedSystemMessages = Math.floor(Date.now() / 1000);
}

function setKeyboardLock(state) {
    // Set new state
    lockKeyboard = state;
    
    // Make GUI to reflect state
    gebi(`keyboardLockGui-false`).classList.add('whiteBgTransparent')
    gebi(`keyboardLockGui-false`).classList.remove('blueBg');
    gebi(`keyboardLockGui-true`).classList.add('whiteBgTransparent')
    gebi(`keyboardLockGui-true`).classList.remove('blueBg');
    gebi(`keyboardLockGui-all`).classList.add('whiteBgTransparent')
    gebi(`keyboardLockGui-all`).classList.remove('blueBg');
    
    gebi(`keyboardLockGui-${state}`).classList.remove('whiteBgTransparent');
    gebi(`keyboardLockGui-${state}`).classList.add('blueBg');
}

function keyboardController(event) {
    if(lockKeyboard === "all") {
        cl('Keyboard is locked.');
        return;
    }

    // Ignore presses in textareas and inputs, but NOT buttons because mostly fake
    if(event.target.localName !== "textarea" && event.target.localName !== "input") {

        // If screensaver or blackout is visible, ignore all keypresses and hide both
        if(!gebi('blackout').classList.contains('hide') || !gebi('screensaver').classList.contains('hide')) {
            epD(event);
            blackoutHide();
            screensaverHide();
            return;
        }

        let key = event.key;
        switch(key) {
            case "1": if(!lockKeyboard) { epD(event); startDefaultProgram('terminal', 6); } break;
            case "2": if(!lockKeyboard) { startDefaultProgram('fileManager'); } break;
            case "3": if(!lockKeyboard) { epD(event); startDefaultProgram('textEditor-random'); } break;
            case "4": if(!lockKeyboard) { startDefaultProgram('browser'); } break;
            case "5": if(!lockKeyboard) { startDefaultProgram('imageViewer'); } break;
            case "6": if(!lockKeyboard) { startDefaultProgram('ftp'); } break;
            case "7": if(!lockKeyboard) { startDefaultProgram('ftp-connect'); } break;
            case "b": toggle('blackout'); break;
            case "c": if(!lockKeyboard) { epD(event); createShortcut(); } break;
            case "C": clearSystemMessages(); break;
            case "s": if(!lockKeyboard) { epD(event); save(); } break;
            case "S": if(!lockKeyboard) { epD(event); saveAs(false); } break;
            case "d": if(!lockKeyboard) { clutterDesktop(4); } break;
            case "w": if(!lockKeyboard) { startDefaultProgram(); } break;
            case "a": if(!lockKeyboard) { toggle('actionMenu'); } break;
            case "m": triggerActionOrMessage(gebi('osNotificationsSelect').value); break;
            case "Escape": screensaverHide(); break;

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

function printElement(title, element) {
    let mywindow = window.open('', 'PRINT', 'height=400,width=600');
    mywindow.document.write('<html><head><title>' + title  + '</title>');
    mywindow.document.write("<style>body { font-family: Verdana, Geneva, Tahoma, sans-serif; } li { list-style-type:none; line-height:2.2em; } .keyboardKey { border:solid black thin; padding:.25em .5em; border-radius:.3em; } </style>");
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>' + title  + '</h1>');
    mywindow.document.write(element.innerHTML);
    mywindow.document.write('<br><br><br><span style="font-size:.8em">www.telefabi.ch</span>');
    mywindow.document.write('</body></html>');
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
