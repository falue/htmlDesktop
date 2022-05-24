let threejsData = `../threejs/player/`;
let currentTab = 1;

async function setup() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let os = urlParams.get('os');
    let workstation = urlParams.get('workstation');
    let darkMode = urlParams.get('darkMode');
    let scene = urlParams.get('scene');
    
    // Set generic system fonts
    setSystemFont(os);
    setupScene(scene);
}

function setupScene(scene) {
    switch(scene) {
        case "34":
            //show(`scene34`);  // scene number
            threejsData = threejsData + "ELCH_FullIsland.html";  // PATH STUFF
            cl(threejsData);
            switchTabs(2);
            for (let i = 0; i < data[scene].length; i++) {
                createChart(data[scene][i].width, data[scene][i].height, "canvas-"+createUniqueId(), data[scene][i].target, data[scene][i]);
            }
            break;

        case "41":
            //show(`scene41`);  // scene number
            switchTabs(2);
            /* cl(data[scene]); */
            for (let i = 0; i < data[scene].length; i++) {
                createChart(data[scene][i].width, data[scene][i].height, "canvas-"+createUniqueId(), data[scene][i].target, data[scene][i]);
            }
            break;

        case "42":
            // BOAR
            threejsData += "webgl_loader_fbx_PP.html";
            // ISLAND DROWNING - opens in seperate window:
            // threejsData += "ELCH_FullIsland_SZ42.html";
            switchTabs(4);
            break;

        case "67":
            // TYPING, COAST & CHAMPAGNE
            threejsData += "ELCH_Sz67.html";
            switchTabs(2);
            show('showChartBigTarget2');
            for (let i = 0; i < data[scene].length; i++) {
                createChart(data[scene][i].width, data[scene][i].height, "canvas-"+createUniqueId(), data[scene][i].target, data[scene][i]);
            }
            break;

        default:
            // BOAR DEFAULT
            threejsData += "webgl_loader_fbx_PP.html";
            switchTabs(1);
            break;
    }
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
        iframes[i].src = iframes[i].dataset.src || threejsData;
    }

    currentTab = index;
}

async function showChartBig(scene, chartNo) {
    let popup = document.createElement('div');
    popup.classList.add('maxWidth', 'fixed', 'maxHeight', 'centerContent', 'top', 'left', 'blackBgTransparent');
    popup.id="popup-"+createUniqueId();
    popup.setAttribute('onclick', `gebi('${popup.id}').remove();`);
    let window = document.createElement('div');
    window.style.width = "80%";
    window.style.height = "66%";
    window.style.backgroundColor = "#3d3d3d";
    window.classList.add('shadow', 'padding2');
    let canvasContainer = document.createElement('div');
    canvasContainer.style.width = "100%";
    canvasContainer.style.height = "100%";
    canvasContainer.id="popupCanvas";
    window.appendChild(canvasContainer);
    popup.appendChild(window);
    document.body.appendChild(popup);
    await delay(100);
    createChart("100%", "100%", "canvas-"+createUniqueId(), "popupCanvas", data[scene][chartNo]);
}