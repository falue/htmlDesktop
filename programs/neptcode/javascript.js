let codeIndex;

async function setup() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let os = urlParams.get('os');
    let workstation = urlParams.get('workstation');
    let darkMode = urlParams.get('darkMode');
    let scene = urlParams.get('scene');
    let dataPath = urlParams.get('data');
    
    // Set generic system fonts
    setSystemFont(os);

    if(darkMode === "true") {
        addStylesheet("darkMode.css", false);
        addStylesheet("../../tools/libraries/highlight/styles/monokai-sublime.css", false);
    } else {
        addStylesheet("../../tools/libraries/highlight/styles/docco.css", false);
    }

    // select all textareas and set onkeyup to setTextareaHeightToEnteredText
    let textareas = document.getElementsByTagName('textarea');
    for (let i = 0; i < textareas.length; i++) {
        textareas[i].onkeyup = function() {
            setTextareaHeightToEnteredText(this);
        };
    }

    // Init syntax highlighting
    hljs.initHighlightingOnLoad();
    hljs.configure({useBR: true});
    updateSyntaxHighlighting();

    // Open the start tab
    switchTabs(scene || 1);

    // Setup code blocks
    // Add new script tag with src to head
    let script = document.createElement('script');
    script.src = `data/${dataPath || "basic"}.js`;
    // Wait for additional js to load until commencing setup process
    script.setAttribute('onload', 'setupCodeblocks()');
    document.getElementsByTagName('head')[0].appendChild(script);
}


function switchTabs(index) {
    let tabs = document.getElementsByClassName("tab");
    if(index > tabs.length) return;
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.add("hide");
    }
    tabs[index-1].classList.remove("hide");
}

function updateSyntaxHighlighting() {
    document.querySelectorAll('.terminal').forEach((block) => {
        hljs.highlightBlock(block);
    });
}

function forceTypeHighlight(event, textarea, target, text, endAction, waitForEnter) {
    cursor(target, false);
    forceType(event, textarea, text, endAction, waitForEnter);
    gebi(target).innerHTML=textarea.value.replaceAll('\n', '<br>').replaceAll('`', "'").replaceAll('’', "'");
    updateSyntaxHighlighting();
    // Do not show cursor if text is finished
    if(textarea.value.length !== text.length) cursor(target, true);
}

function cursor(terminalId, display) {
    let terminal = gebi(terminalId);
    if(display) {
        let cursor = document.createElement('span');
        cursor.classList.add('cursor', 'blink');
        cursor.innerHTML = '│';
        terminal.appendChild(cursor);
    } else {
        let cursor = terminal.querySelector('.cursor');
        if(cursor) cursor.remove();
    }
}

function clearInputs() {
    gebi("paper").innerHTML = '';
    setupCodeblocks();
}

function setTextareaHeightToEnteredText() {
    let textareas = document.getElementsByClassName('autoHeight');
    for (let i = 0; i < textareas.length; i++) {
        textareas[i].style.height = 'auto';
        textareas[i].style.height = textareas[i].scrollHeight + 'px';
    }
}

function setupCodeblocks() {
    codeIndex = 0;
    addNextCodeblock();
    updateSyntaxHighlighting();
}

/* AUTO CREATE CODE */
async function addNextCodeblock(last=false) {
    // If end is reached, get on to print out the final message
    if(codeIndex >= data.length && !last) {
        addNextCodeblock(true);
        return;
    }

    let textToPrint;
    if(!last) textToPrint = data[codeIndex];

    let htmlCodeBlock = isHtml(textToPrint);
    if(!htmlCodeBlock && !last) textToPrint = textToPrint.replaceAll('\n' ,'<br>');

    let container = gebi("paper");
    let uniqueId = createUniqueId();
    let label = document.createElement("label");
    let labelText = document.createElement("div");
    labelText.appendChild(document.createTextNode(last || htmlCodeBlock ? `Out [${codeIndex-1}]:` : `In [${codeIndex}]:`));
    label.appendChild(labelText);
    let highlightBox = document.createElement("div");
    highlightBox.setAttribute("id", `terminal-${uniqueId}`);
    highlightBox.setAttribute("class", "terminal python");

    let forcetypeContainer = document.createElement("div");
    forcetypeContainer.setAttribute("class", "forceType");
    let textarea = document.createElement("textarea");

    textarea.setAttribute("onblur", `cursor('terminal-${uniqueId}', false)`);
    if(!last) {
        textarea.setAttribute("onfocus", `cursor('terminal-${uniqueId}', true)`);
        if(htmlCodeBlock) {
            // Its html - print all at once as "out[_]"
            highlightBox.removeAttribute("class");
            highlightBox.innerHTML = textToPrint;
            highlightBox.classList.add('htmlCodeblock');
            textarea.setAttribute("onkeydown", `event.keyCode === 13 ? addNextCodeblock() : ''; updateSyntaxHighlighting(); scrollToBottom("paperHolder");`);
        } else if(textToPrint.length > 0) {
            // Its code - use forceType
            textarea.setAttribute("onkeydown", `forceTypeHighlight(event, this, 'terminal-${uniqueId}', '${textToPrint}', function () { addNextCodeblock(); scrollToBottom("paperHolder"); }, true);`);
        } else {
            // Its freetext if empty string - On enter, go to next code block
            textarea.setAttribute("onkeyup", `if(event.keyCode === 13 && this.value.length > 0) { addNextCodeblock(); scrollToBottom("paperHolder"); updateSyntaxHighlighting(); } else { gebi('terminal-${uniqueId}').innerHTML=this.value.replaceAll('\\n' ,'<br>'); updateSyntaxHighlighting();}`);
        }
    }
    forcetypeContainer.appendChild(textarea);
    
    // Fillout if printedOut is defined
    if(codeIndex < printedOut) {
        textarea.value = textToPrint;
        highlightBox.innerHTML = textToPrint;
    }
    forcetypeContainer.appendChild(highlightBox);
    label.appendChild(forcetypeContainer);
    container.appendChild(label);
    
    if(last) {
        // print out the final message
        document.activeElement.blur();
        highlightBox.innerHTML = "<i class='material-icons small valign blue spin'>sync</i>";
        highlightBox.classList.add('op50');
        await delay(1111);
        highlightBox.classList.remove('op50');
        if(isHtml(out)) {
            // If its html, remove highlighting and add it as is
            highlightBox.removeAttribute("class");
            highlightBox.innerHTML = out;
            highlightBox.classList.add('out');
        } else {
            highlightBox.innerHTML = out;
            textarea.focus();
            updateSyntaxHighlighting();
        }
        codeIndex = 0;
        scrollToBottom("paperHolder");
    } else {
        // focus() this element
        focusNextElement();
        codeIndex++;
    }
    
    if(codeIndex < printedOut && !last) {
        addNextCodeblock(codeIndex === data.length);
    }
}

async function scrollToBottom(id){
    // wait for image to load so scroll can happen
    await delay(100);
    let container = document.getElementById(id);
    container.scrollTop = container.scrollHeight - container.clientHeight;
}


function addStylesheet(path, replace=true) {
    let head = document.head;
    let link = document.createElement("link");
    if(replace) {
        let currentStylesheet = gebi('osStylesheet');
        if(currentStylesheet) currentStylesheet.remove();
        link.id = "osStylesheet"
    }
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = path;
    head.appendChild(link);
  }
