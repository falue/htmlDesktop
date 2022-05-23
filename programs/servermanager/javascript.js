let scene;
let data;
let textToType = `[05-01-22 00:25:24.424] LOG : General , 1641338724424> 1641338724424 fmod: Create DSP for capture sound.
[05-01-22 00:25:26.280] LOG : General , 1641338726279> AngelCodeFont failed to load page 0`;
  
async function setup() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let os = urlParams.get('os');
    let workstation = urlParams.get('workstation');
    let darkMode = urlParams.get('darkMode');
    scene = urlParams.get('scene');

    /* let data = urlParams.get('data');
    gebi('dataScript').src = `data/${data || "basic"}.js`; */
    
    // Set generic system fonts
    setSystemFont(os);

    if(darkMode === "true") {
        addStylesheet("darkMode.css");
    }

    // Overwrite generic techwords in autoChart.js for this usecase
    techwords = ["CPU usage",
        "Memory usage",
        "GPU utilization",
        "GPU memory",
        "Network send",
        "Network receive"
    ];

    loadScene(scene);
    updateSyntaxHighlighting();
    highlightNode();
}

function loadScene(scene) {
    // Remove last script if already loaded
    if(gebi('sceneData')) {
        gebi('sceneData').remove();
        firstTimeLoaded = false;
    }
    
    // Add new script tag with src to head
    let script = document.createElement('script');
    script.id = "sceneData";
    script.src = `data/${scene || "basic"}.js`;
    // Wait for additional js to load until commencing setup process
    script.setAttribute('onload', 'switchTabs(1)');
    document.getElementsByTagName('head')[0].appendChild(script);

    // Init syntax highlighting
    hljs.initHighlightingOnLoad();
    hljs.configure({useBR: true});

    switch(scene) {
        case "14-A":
            gebi('vm').innerHTML = "rando project";
            gebi('vmManager').innerHTML = "rando guy";
            gebi('target2').innerHTML = `
            <img class="maxHeight mirrorX" src="data/floorplan-14.svg" style="transform: rotate(63.528deg)">
            <div class="fixed code bottom blackBgTransparent left padding1">
            <i class="material-icons blue small valign">business</i>
            Mona lisa blocks<br><span class="grey">Node 01-026 (mlve)</span>
            </div>
            `
            break;
        case "14-B":
            gebi('vm').innerHTML = "Sonn-TTP";
            gebi('vmManager').innerHTML = "J.Brugger";
            gebi('target2').innerHTML = `
            <img class="maxHeight" src="data/floorplan-14.svg">
            <div class="fixed code bottom blackBgTransparent left padding1">
            <i class="material-icons blue small valign">business</i>
            Mona lisa blocks<br><span class="grey">Node 02-001 (mlve)</span>
            </div>
            `
            break;
        case "67":
            gebi('target2').innerHTML = `
            <img class="maxHeight" src="data/floorplan-67.svg">
            <div class="fixed code bottom blackBgTransparent left padding1">
            <i class="material-icons blue small valign">business</i>
            Mona lisa blocks<br><span class="grey">Node 02-001 (mlve)</span>
            </div>
            `
            break;
    }
}

function createAllCharts() {
    // TODO: if window is minimized, nothing gets loaded initially
    for (let i = 0; i < data.length; i++) {
        if(!isHidden(gebi(data[i].target))) {
            gebi(data[i].target).replaceChildren();  // clear contents to re-render
            if(scene ==="14-A") {
                cl("hardcoded overwrite of generic server data!!!!");
                data[0].data.datasets[0].data = randomIntsBetween(12, 0, randomIntsBetween(1,3,45)[0]);
                data[0].data.datasets[1].data = randomIntsBetween(12, 5, randomIntsBetween(1,0,33)[0]);
                data[4].data.datasets[0].data = randomIntsBetween(12, 0, randomIntsBetween(1,3,45)[0]);
                data[4].data.datasets[1].data = randomIntsBetween(12, 5, randomIntsBetween(1,0,33)[0]);
            }
            createChart(data[i].width, data[i].height, "canvas-"+createUniqueId(), data[i].target, data[i]);
        }
    }
}

function highlightNode() {
    // get elementy by css selector
    let elements = document.querySelectorAll(".treeview li");
    // cycle throuhg elements
    for (let i = 0; i < elements.length; i++) {
        // add event listener to each element
        elements[i].addEventListener("click", function(event) {
            // remove class from all elements
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.remove("active");
            }
            // add class to clicked element
            this.classList.add("active");
            // stop propagation
            event.stopPropagation();
            if(this.innerHTML.indexOf("Block 02") >= 0 || this.innerHTML.indexOf("Node 02") >= 0) {
                scene = "14-B";
                loadScene(scene);  // swap to sonnys project
            } else if(scene === "14-B") {
                scene = "14-A";
                loadScene(scene);  // swap to initial
            }

            /* 
            if(scene === "14-A") loadScene("14-B");  // swap to sonnys project
            if(this.innerHTML.indexOf("Block 01") !== -1) loadScene("14-A");  // swap to initial
             */
            switchTabs(1);  // makes it look like its reloading
            gebi('summeryTitle').innerHTML = this.innerHTML;
        });
    }
}

function updateSyntaxHighlighting() {
    document.querySelectorAll('div.terminal').forEach((block) => {
        hljs.highlightBlock(block);
    });
}

function isHidden(el) {
    // check if el is displayed for user
    return (el.offsetParent === null);
}

function switchTabs(index) {
    // select current button
    let tabButton = document.getElementsByClassName("tabButton");
    for (let i = 0; i < tabButton.length; i++) {
        tabButton[i].classList.remove("active");
    }

    tabButton[index-1].classList.add("active");

    let tabs = document.getElementsByClassName("tab");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.add("hide");
    }
    tabs[index-1].classList.remove("hide");

    // re-render to animate again
    createAllCharts();
    
    // Scroll to top
    tabs[index-1].scrollTop=0;
}


/* function generateData(value, i1, i2, step = 1) {
  for (let x = i1; x <= i2; x += step) {
    yValues.push(eval(value));
    xValues.push(x);
  }
} */

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

function makeData() {
    let result = "";
    for(i=0; i<1; i++) {
        result += getRandomElement(["enp","ens","env","vmbr","escm"]);
        result += randomIntsBetween(3).join("");
        result += getRandomElement(["s","d","f"]);
        result += randomIntsBetween(2).join("");
        if(randomBoolean()) {
            result += getRandomElement(["s","d","f"]);
            result += randomIntsBetween().join("");
        }
        result += "\t";
        
        result += getRandomElement(["Network Device","Bridge"]);
        result += "\t";

        result += getRandomElement(["Yes","No"]);
        result += "\t";
        
        result += getRandomElement(["Yes","No"]);
        result += "\t";

        result += getRandomElement(["Yes","No"]);
        result += "\t";
        
        if(randomBoolean()) if(randomBoolean()) if(randomBoolean()) result += getRandomElement(["enp","ens","env","vmbr","escm"]) + randomIntsBetween(3).join("");
        result += "\t";
        
        result += "\t";

        if(randomBoolean()) if(randomBoolean()) result += "192.168.0." + randomIntsBetween(3).join("");
        result += "\t";
    }
    cl(result);
}