async function setup() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let os = urlParams.get('os');
    let workstation = urlParams.get('workstation');
    let darkMode = urlParams.get('darkMode');

    if(darkMode === 'true') {
        let element = document.getElementsByTagName('body')[0];
        element.classList.add('invertKeepColors');
        element.style.backgroundColor = "#222222";
    }
    
    // Set generic system fonts
    setSystemFont(os);
}
