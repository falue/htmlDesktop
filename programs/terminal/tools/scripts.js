let text = "All work and no play makes Jack a dull boy.";
let currentText = "shining";
let baseText = text;
let multipleTexts = [];
let repeatMultipleTexts = "repeat";
let cursor = 0;
let speed = 1;
var humanTyper = false;
var blinkingCursor = true;
let truncateText = true;
let truncateTextBefore = 12000;
let autoType;
let timeOut;
let startChar = 0;
let terminal = document.getElementById('terminal');
let byRows = false;

startup();

async function startup() {
    await readFilesToVariables();
    setUpUrlParams();

    document.getElementById("filetoRead").addEventListener("change",function(){
        var file = this.files[0];

        if (file) {
            var reader = new FileReader();
            reader.onload = function (evt) {
                console.log(evt);
                cursor = 0;
                //document.getElementById("editor").value = evt.target.result;
                text = evt.target.result;
                baseText = text;
            };        
            reader.onerror = function (evt) {
                console.error("An error ocurred reading the file",evt);
            };        
            reader.readAsText(file, "UTF-8");
        }
    },false);

    // add event handler onchange to every input except buttons 
    document.querySelectorAll('input:not([type=select])').forEach(item => {
        item.addEventListener('change', event => {
            /* console.log("change", event.value); */
            saveInUrl();
        });
    });

    // Setup pre-entered text on load
    if(startChar > 0) {
        if(byRows) {
            if(startChar < text.split("\n").length) {
                cursor = startChar;
            } else {
                cursor = text.split("\n").length-speed;
            }
        } else {
            if(startChar < text.length) {
                cursor = startChar;
            } else {
                cursor = text.length-speed;
            }
        }
        let initSpeed = speed;
        speed = 1;  // change speed so that only one key is mashed
        type("", terminal);  // Trigger typing to enter text
        speed = initSpeed;  // reset speed so fast speed = faster typing
    }
}


// AUTOPLAY FROM URL
function setUpUrlParams() {
    /* 
    allowed values:
        text:       name of file without .txt - make sure to define files in readTexts.js!
                    could be a single filename, or multiple pipe (|) seperated values to be typed in order.
        theme:      an-old-hope
                    default
                    dracula
                    hybrid
                    paraiso-dark
                    shades-of-purple
                    tomorrow-night-bright
                    xt256
        speed:      1-50 or more
        language:   none
                    javascript
                    python
                    sql
                    c 
        autotype:   true or false
        
    optionals:
        humanTyper:   true or false
        cursor:       true or false
        truncateText: >1, default 12000
        bgColor:      hex color code without #
        fontColor:    hex color code without #
        paddingRange: 40-400, padding bottom of terminal
        startChar:    >=0 displays already entered text on load
        byRows:       true or false, instead of char by char, every typing enters an entire row
        repeatMultipleTexts
                      If multiple texts are defined with text, decide what should happen if
                      the end of all texts together are reached:
                        - "repeat": start with first text again
                        - "stopAtEnd": Do not loop after last text and disable further input
                        - "loopLast": Repeat the last text indefinitely
*/

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const entries = urlParams.entries();

    if(queryString.length > 0) {
        // Expand URL if shortened and reload page with new params
        if(urlParams.has('shrt')) {
            console.log("has shrt");
            console.log(expandUrl(queryString));
            window.location = expandUrl(queryString);
        }

        for(const entry of entries) {
            let key = entry[0];
            let value = entry[1] === "true" ? true : entry[1] === "false" ? false : entry[1];

            switch(key) {
                case "text":
                    if(value == "ownText") {
                        alert("You've entered or edited the text online. the text is lost now. Sorry.");
                    } else {
                        multipleTexts = value.split("|");
                        /* console.log(multipleTexts); */
                        loadText(multipleTexts[0]);
                    }
                break;

                case "theme":
                    swapSyntaxTheme(value);
                    document.getElementById('themeSelect').value=value;
                break;

                case "speed":
                    changeSpeed(value);
                    document.getElementById('speedRange').value=value;
                break;

                case "language":
                    let language;
                    if(value === 'none') {
                        language = "nohighlight";
                    } else {
                        language = 'language-'+value
                    }
                    toggleSyntaxHighlights(true, language);
                    document.getElementById(value).checked=true;
                    break;

                case "autotype":
                    toggleAutoplay(value);
                    document.getElementById('autoType').checked=value;
                break;

                case "humanTyper":
                    humanTyper = value;
                    document.getElementById('humanTyper').checked=value;
                break;

                case "cursor":
                    toggleCursor(value);
                    document.getElementById('cursorBox').checked=value;
                    // Because cursor on load without content is initially hardcoded
                    if(!value) document.getElementById("cursor").style.display = "none";
                break;

                case "truncateText":
                    truncateText = value > 0;
                    document.getElementById('truncateText').checked = value > 0;
                    truncateTextBefore = value;
                    document.getElementById('truncateTextBefore').value=value;
                break;

                case "bgColor":
                    if(value !== "theme") {
                        changeBGColor("#" + value);
                    }
                break;

                case "fontColor":
                    changeFontColor("#" + value);
                break;

                case "startChar":
                    if(value > 0) {
                        // I dont know why i subtracted speed from value.
                        // to start with 1 char, it is not working
                        startChar = value-speed;
                        startChar = startChar == 0 ? 1 : startChar;
                        document.getElementById('startChar').value = startChar;
                    }
                break;

                case "byRows":
                    if(value) {
                        byRows = true;
                        document.getElementById('byRows').checked = "true";
                    }
                break;

                case "paddingRange":
                    document.getElementById('paddingRange').value=value;
                    changePadding(value);
                break;

                case "repeatMultipleTexts":
                    repeatMultipleTexts = value;
                break;
            }
        }
    } else {
        console.log("No autoplay defined.");
    }
}


function toggleClass(id, className) {
    let element = document.getElementById(id);
    element.classList.toggle(className);
}


function type(event, id) {
    getNewPosition(event, id);
    let snippet;
    /* let snippet = text.substring(0, cursor+speed).replace(/\n/g, "<br>").replace(/  /g, " &nbsp;").replace(/\t/g, " &nbsp; &nbsp;"); */
    if(byRows) {
        snippet = (text.split("\n").slice(0, cursor)).join("<br>");
    } else {
        snippet = text.substring(0, cursor+speed).replace(/\n/g, "<br>");
    }

    // remove text off screen to safe memory
    let textLength = snippet.length;
    if(textLength > truncateTextBefore && truncateText) {
        snippet = snippet.substring(textLength-truncateTextBefore, textLength);
    }

    // snippet to html codes?
    id.innerHTML = snippet;
    if(blinkingCursor) {
        id.innerHTML += "<span id=\"cursor\" class=\"cursor blink\">_</span>";
        // hide cursor
        document.getElementById("cursor").style.display = "none";
    }

    // cancel timeout
    clearTimeout(timeOut);

    //scroll to bottom if needed
    updateScroll();

    // update syntax highlighting
    if(!document.getElementById("none").checked) {
        updateSyntaxHighlighting();
    }

    // set timeout & make visible again
    if(blinkingCursor) {
        timeOut = setTimeout(function() {
            document.getElementById("cursor").style.display = "inline";
        }, 450);
    }
}

function updateSyntaxHighlighting() {
    hljs.configure({useBR: true});
    document.querySelectorAll('div.terminal').forEach((block) => {
        hljs.highlightBlock(block);
    });
}

function updateScroll(){
    let container = document.getElementById("terminal");
    container.scrollTop = container.scrollHeight - container.clientHeight;
}

function getNewPosition(event, id) {
    let KeyID = event.keyCode;
    switch(KeyID) {
        case 8:
            console.log("backspace");
            cursor -= speed;
            break; 
            
        case 13:
            console.log("enter");
            /* to toggle: toggleAutoplay(!autoType); */
            if(!autoType) {
                // If enter is pressed, start autoplay
                toggleAutoplay(true);
            } else {
                // If enter pressed again, reload entire site
                window.location.href = window.location.href
            }

            // Adding BR does not work because whole text gets replaced again
            // document.getElementById("terminal").innerHTML += "br";
            break;
            
        case 27:
            console.log("esc");
            document.getElementById("terminal").innerHTML = "";
            cursor = 0;
            break;

        case 46:
            console.log("delete");
            break;

        default:
            if(humanTyper) cursor += Math.random() * speed;
            cursor += speed;
            break;
    }
    // do not set cursor before 0
    cursor = cursor < 0 ? 0 : cursor;

    // END REACHED - LOOP TEXT
    if((byRows && cursor >= text.split("\n").length)
        ||
        (!byRows && cursor >= text.length)
    ) {
        if(multipleTexts.length > 1) {
            // Load next or first text
            let currentTextIndex = multipleTexts.indexOf(currentText);
            let nextIndexOfText;

            if(repeatMultipleTexts === "repeat" || repeatMultipleTexts === "stopAtEnd") {
                if(repeatMultipleTexts === "stopAtEnd" && currentTextIndex+1 >= multipleTexts.length) {
                    // Disable interaction after last text is reached
                    baseText = "";
                } else {
                    // Repeat all text indefinitely
                    nextIndexOfText = currentTextIndex+1 >= multipleTexts.length ? 0 : currentTextIndex+1;
                    currentText = multipleTexts[nextIndexOfText];
                    baseText = "\n" + texts[multipleTexts[nextIndexOfText]];
                }

            } else if (repeatMultipleTexts === "loopLast") {
                // Repeat the last text element indefinitely
                nextIndexOfText = multipleTexts.length-1;
                currentText = multipleTexts[nextIndexOfText];
                baseText = "\n" + texts[multipleTexts[nextIndexOfText]];
            }
        }

        // Add new text to current text
        text += baseText;
    }
}

function changeSpeed(value) {
    speed = parseInt(value);
    document.getElementById("speed").innerHTML = speed + (speed == 1 ? " (human)" : speed > 12 ? " (uber human)" : "");
}

function randomSpeed(value) {
    humanTyper = value;
}

function toggleCursor(value) {
    blinkingCursor = value;
}

function setOwnText() {
    let ownText = document.getElementById('yourOwnText').value;
    if(ownText.length > 0) {
        text = ownText;
        currentText = "ownText";
        baseText = text;
        cursor = 0;
        saveInUrl();
    }
}

function editBaseText() {
    document.getElementById('yourOwnText').value = baseText;
}

function changePadding(value) {
    terminal.style.paddingBottom = value + "px";
    document.getElementById('padding').innerHTML = value + "px";
}

function changeBGColor(value) {
    if(value === "theme") {
        document.body.style.removeProperty('background-color');
        terminal.style.removeProperty('background-color');
    } else {
        document.body.style.backgroundColor = value;
        terminal.style.backgroundColor = value;
        document.getElementById("BGColor").value = value;
        document.getElementById("BGColorText").value = value;
    }
}

function changeFontColor(value) {
    document.body.style.color = value;
    document.getElementById("FontColor").value = value;
    document.getElementById("FontColorText").value = value;
}

function toggleAutoplay(value) {
    if(value) {
        let delay;
        if(humanTyper) {
            delay = Math.floor(Math.random() * 800/speed);
        } else {
            delay = Math.floor(800/speed);
        }
        autoType = setTimeout(function() {
            let initSpeed = speed;
            speed = 1;  // change speed so that only one key is mashed
            type("", terminal);
            speed = initSpeed;  // reset speed so fast speed = faster typing
            toggleAutoplay(true);
        }, delay);
    } else {
        /* console.log("stop autoplay"); */
        clearTimeout(autoType);
        autoType = undefined;
    }
}

function loadText(value) {
    currentText = value;
    text = texts[value];  // .replace(/  /g, "··").replace(/\t/g, "····");  // display whitespaces..
    baseText = text;
    cursor = 0;
}

function toggleSyntaxHighlights(value, language) {
    /* console.log(language, language === "nohighlight"); */
    if(language === "nohighlight") {
        /* console.log("nohighlight: show custom colors, hide syntax themes"); */
        document.getElementById("customColors").style.display = "block";
        document.getElementById("syntaxThemeColors").style.display = "none";
    } else {
        /* console.log("language selected: hide custom colors, show syntax themes"); */
        document.getElementById("customColors").style.display = "none";
        document.getElementById("syntaxThemeColors").style.display = "block";
    }

    let element = document.getElementById("terminal");
    let idOfRadio = language.replace("language-", '');
    idOfRadio = !idOfRadio || language == "nohighlight" ? "none" : idOfRadio;
    document.getElementById(idOfRadio).checked = "true";
    if(value) {
        element.className = "";
        element.classList.add("terminal");
        element.classList.add(language);

        hljs.configure({useBR: true});
        document.querySelectorAll('div.terminal').forEach((block) => {
            hljs.highlightBlock(block);
        });
    } else {
        element.className = "";
        element.classList.add("terminal");
        element.classList.add("nohighlight");
    }
}

function swapSyntaxTheme(value) {
    // clear bg color
    document.body.style.removeProperty('background-color');
    terminal.style.removeProperty('background-color');
    document.getElementById("BGColorText").value = "theme";

    /* console.log(value); */
    document.getElementById("syntaxTheme").href= "tools/highlight/styles/" + value + ".css";
}

function buildUrlFromCurrentSettings() {
    /* let url = window.location.host + window.location.pathname; */
    let url = window.location.pathname;
    let params = new Array();
    params.push("text=" + multipleTexts.join("|"));
    params.push("theme=" + document.getElementById('themeSelect').value);
    params.push("speed=" + speed);
    params.push("language=" + getSelectedLanguage());
    params.push("autotype=" + document.getElementById('autoType').checked);
    params.push("humanTyper=" + humanTyper);
    params.push("cursor=" + blinkingCursor);
    params.push("truncateText=" + (truncateText ? truncateTextBefore : 0));
    params.push("bgColor=" + document.getElementById('BGColorText').value.replace("#", ""));
    params.push("fontColor=" + document.getElementById('FontColorText').value.replace("#", ""));
    params.push("byRows=" + document.getElementById('byRows').checked);
    params.push("startChar=" + document.getElementById('startChar').value);
    params.push("paddingRange=" + document.getElementById('paddingRange').value);
    params.push("repeatMultipleTexts=" + repeatMultipleTexts);
    let completeUrl = url + "?" + params.join("&");
    /* console.log(completeUrl); */
    return completeUrl;
}

function saveInUrl() {
    let completeUrl = buildUrlFromCurrentSettings();
    /* alert("A new window will open with your current settings. Save & revisit the complete URL there to come back to these settings."); */
    /* window.location.href = completeUrl;  // With reload */
    window.history.pushState('Terminal', 'Terminal', completeUrl);
    return completeUrl;
}

function openInPopUp() {
    let completeUrl = buildUrlFromCurrentSettings();
    window.open(completeUrl, "Terminal", "toolbar=no,menubar=no,width=1280,height=960");
}

function getSelectedLanguage() {
    let radios = document.getElementsByName('language');
    for (let radio of radios) {
        if (radio.checked) {
            return radio.id;
        }
    }
}
