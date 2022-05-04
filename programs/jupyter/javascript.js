async function setup() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let os = urlParams.get('os');
    let workstation = urlParams.get('workstation');
    let darkMode = urlParams.get('darkMode');
    let scene = urlParams.get('scene');
    
    // Set generic system fonts
    setSystemFont(os);

    if(darkMode === "true") {
        addStylesheet("darkMode.css");
    } else {
        addStylesheet("lightMode.css");
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

function forceTypeHighlight(event, textarea, target, text) {
    cursor(target, false);
    forceType(event, textarea, text, false, false);
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
        cursor.innerHTML = '|';
        terminal.appendChild(cursor);
    } else {
        let cursor = terminal.querySelector('.cursor');
        if(cursor) cursor.remove();
    }
}

function clearInputs() {
    let inputs = document.getElementsByTagName('input');
    let textareas = document.getElementsByTagName('textarea');
    let highlights = document.getElementsByClassName('terminal');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
    }
    for (let i = 0; i < textareas.length; i++) {
        textareas[i].value = '';
    }
    for (let i = 0; i < highlights.length; i++) {
        highlights[i].innerHTML = '';
    }
}

function setTextareaHeightToEnteredText() {
    let textareas = document.getElementsByClassName('autoHeight');
    for (let i = 0; i < textareas.length; i++) {
        textareas[i].style.height = 'auto';
        textareas[i].style.height = textareas[i].scrollHeight + 'px';
    }
}

function addStylesheet(path) {
    let currentStylesheet = gebi('osStylesheet');
    if(currentStylesheet) currentStylesheet.remove();
    let head = document.head;
    let link = document.createElement("link");
    link.id = "osStylesheet"
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = path;
    head.appendChild(link);
  }
