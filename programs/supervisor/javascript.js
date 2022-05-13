let data;
let currentTab = 1;

async function setup() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let os = urlParams.get('os');
    let workstation = urlParams.get('workstation');
    let darkMode = urlParams.get('darkMode');
    
    // Set generic system fonts
    setSystemFont(os);

    data = `../threejs/player/${urlParams.get('data') || "webgl_loader_fbx_PP.html"}`;
    
    switchTabs(1);
}



function switchTabs(index) {
    // select current button
    let tabButton = document.getElementsByClassName("tabButton");
    // Remove class active from all tabButtons
    for (let i = 0; i < tabButton.length; i++) {
        tabButton[i].classList.remove("active");
    }
    // Set current active
    tabButton[index-1].classList.add("active");

    // Get all tabs
    let tabs = document.getElementsByClassName("tab");

    // Remove all src from iframes of last tab
    let lastIframes = tabs[currentTab-1].getElementsByTagName("iframe");
    for (let i = 0; i < lastIframes.length; i++) {
        lastIframes[i].removeAttribute('src');
    }

    // Hide all tabs
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.add("hide");
    }
    // Show current tab
    tabs[index-1].classList.remove("hide");

    // Find all iframes in tabs[index-1] and set src to data-src
    let iframes = tabs[index-1].getElementsByTagName("iframe");
    for (let i = 0; i < iframes.length; i++) {
        iframes[i].src = iframes[i].dataset.src || data;
    }

    currentTab = index;
}