let scene;
let data;
let textToType = `[05-01-22 00:25:24.424] LOG : General , 1641338724424> 1641338724424 fmod: Create DSP for capture sound.
[05-01-22 00:25:26.280] LOG : General , 1641338726279> AngelCodeFont failed to load page 0`;
let firstNames = ["Abi", "Adalie", "Aita", "Albula", "Alyssia", "Amrei", "Andel", "Andrin", "Andrin", "Anica", "Annatina", "Anneli", "Anneli", "Annely", "Annigna", "Annina", "Antonette", "Arale", "Arianita", "Armida", "Armide", "Atreju", "Ayla", "Badin", "Balz", "Barbli", "Beat", "Beat", "Beath", "Beath", "Bendicht", "Bendicht", "Benedikt", "Bengiamin", "Benjas", "Bensehilla", "Bern", "Bernhardin", "Berti", "Bethli", "Bigna", "Binia", "Brandi", "Carissima", "Chasper", "Chatrina", "Chatrina", "Chonz", "Cilgia", "Cla", "Conz", "Corina", "Corinne", "Corsica", "Dani", "Daron", "David", "Divico", "Dorli", "Dumeng", "Dumeni", "Dumeni", "Duri", "Eliane", "Elijan", "Elsa", "Elsi", "Elsy", "Elvezia", "Elvezia", "Emerita", "Emma", "Enie", "Erika", "Erina", "Ernestin", "Fabian", "Fabiola", "Fadri", "Ferdi", "Florin", "Florina", "Flurin", "Flurina", "Franklin", "Franzi", "Fränzi", "Fridolin", "Fridolina", "Friedolin", "Frillix", "Gaudenz", "Gian", "Gianin", "Gianrico", "Gieri", "Gilgian", "Gilgian", "Gillis", "Giuanna", "Giulitta", "Giusep", "Göpf", "Gritli", "Gritli", "Gwer", "Hänggi", "Hanneli", "Hanni", "Hans", "Hans-Rudolf", "Harri", "Heidi", "Heiri", "Helvetia", "Ingenuin", "Inglina", "Innegrit", "Irmalin", "Irmeli", "Irmelin", "Isalie", "Jelsha", "Jilge", "Jo", "Jockel", "Jocki", "Jocky", "Joder", "Jonin", "Jöri", "Jost", "Jovin", "Jovin", "Jürg", "Kaja", "Karin", "Katrin", "Ladina", "Lanessa", "Leon", "Levio", "Lisa", "Lisa-Maria", "Lisa-Katharina", "Lisi", "Loan", "Lorian", "Lorin", "Luc", "Ludewiga", "Lumi", "Lyan", "Madlaina", "Madleina", "Magali", "Marei", "Marilen", "Mark", "Markus", "Marleen", "Maya", "Meinrad", "Melia", "Melinda", "Menga", "Meret", "Midja", "Mylene", "Nando", "Neamy", "Nette", "Niklaus", "Nordin", "Norina", "Pascale", "Paschalis", "Ramona", "Reto", "Reto", "Rita", "Roger", "Rolf", "Rösli", "Ruedi", "Ruedi", "Sana", "Seina", "Selma", "Seraina", "Sereina", "Severin", "Severine", "Simon", "Susi", "Tell", "Töbe", "Ueli", "Urban", "Urs", "Ursina", "Uto", "Vera", "Vreni", "Vroni", "Walo", "Wendelin", "Rösi"]
let lastNames = ["Müller", "Meier", "Schmid", "Keller", "Weber", "Schneider", "Huber", "Meyer", "Steiner", "Fischer", "Baumann", "Frei", "Brunner", "Gerber", "Widmer", "Zimmermann", "Moser", "Graf", "Wyss", "Roth", "Suter", "Baumgartner", "Bachmann", "Studer", "Bucher", "Berger", "Kaufmann", "Kunz", "Hofer", "Bühler", "Lüthi", "Lehmann", "Marti", "Frey", "Christen", "Koch", "Egli", "Favre", "Arnold", "Pfister", "Schweizer", "Wüthrich", "Fuchs", "Martin", "Stalder", "Gasser", "Peter", "Kohler", "Maurer", "Koller", "Wenger", "Zürcher", "Burri", "Furrer", "Egger", "Hofmann", "Michel", "Hunziker", "Leuenberger", "Bieri", "Ammann", "Vogel", "Hug", "Hess", "Tanner", "Sutter", "Hauser", "Blaser", "Rüegg", "Hartmann", "Schuler", "Rey", "Wagner", "Gisler", "Senn", "Zbinden", "Kälin", "Schär", "Siegenthaler", "Scherrer", "Flückiger", "Lang", "Zaugg", "Fankhauser", "Stucki", "Kuhn", "Imhof", "Vogt", "Bernasconi", "Scheidegger", "Odermatt", "Portmann", "Küng", "Sommer", "Seiler", "Ackermann", "Liechti", "Jost", "Schmidt", "Schumacher", "Schärer", "Schwarz", "Stocker", "Staub", "Giger", "Hasler", "Schenk", "Rochat", "Lüscher", "Weiss", "Gloor", "Herzog", "Hofstetter", "Schwab", "Zehnder", "Stutz", "Pittet", "Rohner", "Weibel", "Schnyder", "Bosshard", "Wittwer", "Eichenberger", "Steiger", "Haas", "Schaller", "Stadelmann", "Rohrer", "Stettler", "Bolliger", "Stöckli", "Tobler", "Sieber", "Siegrist", "Wolf", "Sigrist", "Meister", "Marty", "Ulrich", "Lutz", "Lanz", "Blanc", "Röthlisberger", "Grob", "Kaiser", "Steffen", "Betschart", "Locher", "Beck", "Aeschlimann", "Blum", "Bühlmann", "Probst", "Mathys", "Rossi", "Schmutz", "Kessler", "Kuster", "Häfliger", "Muller", "Steinmann", "Stauffer", "Haller", "Graber", "Krebs", "Walker", "Ziegler", "Nussbaumer", "Benz", "Jenni", "Friedli", "Käser", "Bischof", "Fässler", "Hostettler", "Aebi", "Richard", "Hürlimann", "Zwahlen", "Knecht", "Schaub", "Wehrli", "Eugster", "Mäder", "Walther", "Ott", "Flury", "Brügger", "Rossier", "Willi", "Erni", "Ryser", "Gut", "Wicki", "Reber", "Merz", "Thalmann", "Mettler", "Wirth", "Iten", "Garcia", "Heiniger", "Glauser", "Schütz", "Niederberger", "Bürgi", "Mathis", "Schüpbach", "Forster", "Wirz", "Bigler", "Clerc", "Achermann", "Gross", "Frischknecht", "Zingg", "Etter", "Jäggi", "Bösch", "Braun", "Ferrari", "Balmer", "Walter", "Trachsel", "Allemann", "Schlegel", "Kern", "Jakob", "Walser", "Fehr", "Bianchi", "Schoch", "Von", "Geiser", "Bürki", "Gfeller", "Iseli", "Sidler", "Zeller", "Bader", "Ritter", "Reymond", "Leu", "Amstutz", "Landolt", "Da", "Stadler", "Felder", "Hänni", "Tschanz", "Ernst", "Eberle", "Bärtschi", "Näf", "Germann", "Schönenberger", "Wild", "Birrer", "Monney", "Emmenegger", "Hodel", "Minder", "Affolter", "Eggenberger", "Zemp", "Winkler", "Isler", "Wälti", "Messerli", "Wiederkehr", "Burkhalter", "Sonderegger", "Neuenschwander", "Brand", "Brun", "Herrmann", "Baur", "Hirschi", "Dubois", "Schlatter", "Perrin", "Krähenbühl", "Maillard", "Grossenbacher", "Jenny", "Zuber", "Schneeberger", "Aebischer", "Mosimann", "Linder", "Beyeler", "Fontana", "Perret", "Rieder", "Gehrig", "Stähli", "Hutter", "Buser", "Miller", "Thoma"]

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
            gebi('vm').innerHTML = `proj-${createUniqueId(6)}`;
            gebi('vmManager').innerHTML = `${getRandomElement(firstNames)[0]}.${getRandomElement(lastNames)}`;
            gebi('target2').innerHTML = `
            <img id="fuckfacemap" class="maxHeight mirrorX" src="data/floorplan-14.svg" style="transform: rotate(${360/16*4}deg);">
            <div class="fixed code bottom blackBgTransparent left padding1">
            <i class="material-icons blue small valign">business</i>
            Mona lisa blocks<br><span class="grey">Node 01-026 (mlve)</span>
            </div>
            `
            break;
        case "14-B":
            gebi('vm').innerHTML = "SONN-HS";
            gebi('vmManager').innerHTML = "J.Brugger";
            gebi('target2').innerHTML = `
            <img class="maxHeight" src="data/floorplan-14.svg" style="transform: rotate(${360/16*1}deg);">
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

function createAllCharts(maxedOutBlock) {
    // TODO: if window is minimized, nothing gets loaded initially
    for (let i = 0; i < data.length; i++) {
        if(!isHidden(gebi(data[i].target))) {
            gebi(data[i].target).replaceChildren();  // clear contents to re-render
            if (maxedOutBlock) {
                // cl("maxedoutblock is true");
                let countOfPoints = 150;
                data[0].data.labels = arrayOfIndexes(countOfPoints);
                data[0].data.datasets[0].data = notSoRandomInts(countOfPoints, 88, 105, 667, 10, .03, false);
                data[0].data.datasets[1].data = notSoRandomInts(countOfPoints, 33, 87, 668, 10, .03, false);
                data[0].data.datasets[0].borderColor = colors[1];
                data[0].data.datasets[1].borderColor = colors[0];

                data[0].options.scales.y.suggestedMin = 0;
                data[0].options.scales.y.suggestedMax = 120;
                data[0].options.scales.y.grid.drawBorder = true;
                data[0].options.scales.y.grid.color = function(context) { if (context.tick.value === 100) { return "red" } return 'rgba(0,0,0,0.2)'; };

                data[4].data.labels = arrayOfIndexes(countOfPoints);
                data[4].data.datasets[0].data = notSoRandomInts(countOfPoints, randomBetween(0,33), randomBetween(3,100), 669, 10, -.003, false);
                data[4].data.datasets[1].data = notSoRandomInts(countOfPoints, randomBetween(5,33), randomBetween(0,100), 670, 10, -.3, false);
                data[4].data.datasets[0].borderColor = chooseRandomKeys(1, colors);
                data[4].data.datasets[1].borderColor = chooseRandomKeys(1, colors);

                // Block 1 uses this
                gebi('vmManager').innerHTML = `J.Brugger`;
                gebi('vm').innerHTML = `SONN-HS`;

            } else if(scene ==="14-A") {
                // cl("maxedoutblock is false");
                // cl("hardcoded overwrite of generic server data!!!!");
                let countOfPoints = randomBetween(33,150);
                /* data[0].data.datasets[0].data = randomIntsBetween(countOfPoints, randomBetween(0,33), randomBetween(3,88));
                data[0].data.datasets[1].data = randomIntsBetween(countOfPoints, randomBetween(5,33), randomBetween(0,66));
                data[4].data.datasets[0].data = randomIntsBetween(countOfPoints, randomBetween(0,33), randomBetween(3,66));
                data[4].data.datasets[1].data = randomIntsBetween(countOfPoints, randomBetween(5,33), randomBetween(0,95)); */
                data[0].data.labels = arrayOfIndexes(countOfPoints);
                data[0].data.datasets[0].data = notSoRandomInts(countOfPoints, randomBetween(0,33), randomBetween(3,88), 667, 10, .003, randomBoolean());
                data[0].data.datasets[1].data = notSoRandomInts(countOfPoints, randomBetween(5,33), randomBetween(0,66), 668, 10, .03, randomBoolean());
                data[0].data.datasets[0].borderColor = chooseRandomKeys(1, colors);
                data[0].data.datasets[1].borderColor = chooseRandomKeys(1, colors);
                data[0].options.scales.y.suggestedMin = 0;
                data[0].options.scales.y.suggestedMax = 100;
                data[0].options.scales.y.grid = {"color": function(context) { return 'rgba(0,0,0,0.2)'; }};
                data[4].data.labels = arrayOfIndexes(countOfPoints);
                data[4].data.datasets[0].data = notSoRandomInts(countOfPoints, randomBetween(0,33), randomBetween(3,88), 669, 10, -.003, randomBoolean());
                data[4].data.datasets[1].data = notSoRandomInts(countOfPoints, randomBetween(5,33), randomBetween(0,95), 670, 10, -.3, randomBoolean());
                data[4].data.datasets[0].borderColor = chooseRandomKeys(1, colors);
                data[4].data.datasets[1].borderColor = chooseRandomKeys(1, colors);

                /* data[0].data.datasets[0].data = notSoRandomInts(countOfPoints, randomBetween(0,33), randomBetween(3,88), randomBetween(1,666), randomBetween(0,3)/1000, randomBetween(-3,3)/1000, false);
                data[0].data.datasets[1].data = notSoRandomInts(countOfPoints, randomBetween(5,33), randomBetween(0,66), randomBetween(1,666), randomBetween(0,3)/1000, randomBetween(-3,3)/1000, false);
                data[4].data.datasets[0].data = notSoRandomInts(countOfPoints, randomBetween(0,33), randomBetween(3,66), randomBetween(1,666), randomBetween(0,3)/1000, randomBetween(-3,3)/1000, false);
                data[4].data.datasets[1].data = notSoRandomInts(countOfPoints, randomBetween(5,33), randomBetween(0,95), randomBetween(1,666), randomBetween(0,3)/1000, randomBetween(-3,3)/1000, false); */
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

            // Set random names
            gebi('vm').innerHTML = `proj-${createUniqueId(6)}`;
            gebi('vmManager').innerHTML = `${getRandomElement(firstNames)[0]}.${getRandomElement(lastNames)}`;

            // stop propagation
            event.stopPropagation();
            if(this.innerHTML.indexOf("Block 01") >= 0) {
                // scene = "14-B";
                // loadScene(scene, true);  // swap to sonnys project
                //return;
                // scene = "14-A";
                // loadScene(scene);  // swap to initial
                switchTabs(1, true);  // makes it look like its reloading and if block 05, max out stats
                gebi('target2').innerHTML = `
                    <img class="maxHeight" src="data/floorplan-14.svg" style="transform: rotate(${360/16*0}deg);">
                    <div class="fixed code bottom blackBgTransparent left padding1">
                    <i class="material-icons blue small valign">business</i>
                    Mona lisa blocks<br><span class="grey">Node 02-001 (mlve)</span>
                    </div>
                    `
            } else if(this.innerHTML.indexOf("Block 02") >= 0 || this.innerHTML.indexOf("Node 02") >= 0) {
                scene = "14-B";
                loadScene(scene);  // swap to sonnys project
                return;
            } else if(scene === "14-B") {
                scene = "14-A";
                loadScene(scene);  // swap to initial
                return;
            } else {
                switchTabs(1, false);
            }

            var regex = /\d+/g;
            var matches = this.innerHTML.match(regex)[0];  // creates array from matches
            // turn map accordingly
            // style="transform: rotate(${360/16*randomInt(0,16)}deg)"
            if(gebi('fuckfacemap')) gebi('fuckfacemap').style.transform = `rotate(${360/16*(matches-1)}deg)`;

            /* 
            if(scene === "14-A") loadScene("14-B");  // swap to sonnys project
            if(this.innerHTML.indexOf("Block 01") !== -1) loadScene("14-A");  // swap to initial
             */
            // switchTabs(1, this.innerHTML.indexOf("Block 01") >= 0);  // makes it look like its reloading and if block 05, max out stats
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

function switchTabs(index, maxedOutBlock=false) {
    cl("switch tabs ..");
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
    createAllCharts(maxedOutBlock);
    
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