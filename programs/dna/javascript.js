let initialFontSize;

async function setup() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let os = urlParams.get('os');
    let workstation = urlParams.get('workstation');
    let darkMode = urlParams.get('darkMode');
    
    // Set generic system fonts
    setSystemFont(os);

    // Save initial fontsize for resetting font size
    initialFontSize = getFontSize('dna');

    let dnaContainer = gebi('dna');
    dnaContainer.innerHTML = "<i class='material-icons small valign blue spin'>sync</i>";
    await delay(2222);
    dnaContainer.innerHTML = data.replaceAll('\n', '<br>');
}

function changeFontSize(element, increment) {
    let container = gebi(element);
    let fontSize = initialFontSize;
    if(increment != 0) {
        fontSize = clamp(getFontSize(element) + increment, 5, 50);
    }
    container.style.fontSize = fontSize + 'px';
}

function getFontSize(element) {
    const cssObj = window.getComputedStyle(gebi(element));
    let fontSize = cssObj.getPropertyValue("font-size");
    return parseInt(fontSize);
}