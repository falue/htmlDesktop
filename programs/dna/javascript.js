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

    loadDna();
}


async function loadDna() {
    let dnaContainer = gebi('dna');
    dnaContainer.classList.add("loading");
    dnaContainer.innerHTML = "<progress id='loader' value='32' max='100'>32%</progress></span><i class='material-icons small valign grey spin marginX1'>sync</i>";
    /* await delay(2222); */
    /* let formattedData = data.replaceAll('A', '<span class="a">A</span>').replaceAll('\n', '</li><li>'); */
    let formattedData = data.replace(/([A-Z])/g, `<span class="$1">$1</span>`).replaceAll('\n', '</li><li>');
    await counter('loader', "%", 2000, 94, 0, 100);
    dnaContainer.classList.remove("loading");
    dnaContainer.innerHTML = "<ul class='dnaList'><li>"+formattedData+"</li></ul>";
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