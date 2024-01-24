async function setup() {
    /* 
        URL PARAMS:
        - set "printText" to a text/encoded html string to be displayed as plain text
        - set "printIframe" to eg. programs/wifi to display an program in the print area
        - set "pages" to set "to" pages
    */
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let os = urlParams.get('os');
    let workstation = urlParams.get('workstation');
    let darkMode = urlParams.get('darkMode');

    if(darkMode === 'true') {
        let element = document.getElementsByTagName('body')[0];
        element.classList.add('invertKeepColors');
        element.style.backgroundColor = "#222222";
        gebi('paper').classList.add('invertKeepColors');
    }
    
    let pages = urlParams.get('pages');
    if(pages) {
        gebi('pageIndicator1').innerHTML = pages;
        gebi('range_to').value = pages;
    }

    let printText = urlParams.get('printText');
    let printIframe = urlParams.get('printIframe');
    if(printText || printIframe) {
        show('preview');
        gebi('form').style.width="60%";
        gebi('form').style.left="40%";
        gebi('footer').style.width="60%";
        if(printText) {
            gebi('paper').innerHTML = printText;
        } else {
            cl(" printIframe")
            cl( printIframe)
            gebi('paper').style.padding="0";
            gebi('paper').innerHTML = `<iframe src="${ printIframe}"></iframe>`;
        }
    } else {
        hide('preview');
    }
    
    // Set generic system fonts
    setSystemFont(os);
}
