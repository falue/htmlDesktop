let markerIcon = "<img class='svgMarker' src='tools/marker.svg' alt='m'/>"
let counMarkers = 4;

startup();

function startup() {
    changeMarkers(counMarkers);
}

function toggleClass(id, className) {
    var element = document.getElementById(id);
    element.classList.toggle(className);
}

function changeMainColor(value) {
    console.log(value);
    //document.body.style.backgroundColor = value;
    document.getElementById('mainFrame').style.backgroundColor = value;
    document.getElementById("mainFrameText").value = value;
    document.getElementById("mainFrameColor").value = value;
}

function checkerboard(value) {
    toggleClass("mainFrame", "checkerboard");
    if(value) {
        document.getElementById("mainFrameText").value = "checkerboard";
    } else {
        let mainColor = document.getElementById("mainFrameColor").value;
        document.getElementById('mainFrame').style.backgroundColor = mainColor;
        document.getElementById("mainFrameText").value = mainColor;
        document.getElementById("mainFrameColor").value = mainColor;
    }
}

function checkerboardSize(value) {
    value /= 10;
    document.getElementById("checkerboardSizeText").innerHTML = value;
    document.getElementById('mainFrame').style.backgroundSize = value+"em "+value+"em";
}

function changeMarkerColor(value) {
    console.log(value);
    //document.body.style.backgroundColor = value;
    document.getElementById('markers').style.color = value;
    document.getElementById("markerText").value = value;
    document.getElementById("markerColor").value = value;
}

function changeMarkerIcon(value) {
    if(value == "marker") value = "<img class='svgMarker' src='tools/marker.svg' alt='m'/>";
    markerIcon = value;
    changeMarkers(counMarkers);
}

function changeMarkers(value) {
    let markerContainer = document.getElementById("markers");
    let fifth = false;
    let tempVal = value;
    if(tempVal == 5) {
        fifth = true;
        tempVal = 4;
    }
    counMarkers = value;
    let columns = Math.round(tempVal/2);
    /* let rows = Math.round(tempVal/6); */
    let node = "";
    if(tempVal == 4) {
        markerContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
        node = '<div class="grid-item vertAlign horAlign">'+markerIcon+'</div>';
        node += '<div class="grid-item vertAlign horAlign"></div>';
        node += '<div class="grid-item vertAlign horAlign">'+markerIcon+'</div>';
        node += '<div class="grid-item vertAlign horAlign"></div>';
        node += '<div class="grid-item vertAlign horAlign"></div>';
        node += '<div class="grid-item vertAlign horAlign"></div>';
        node += '<div class="grid-item vertAlign horAlign">'+markerIcon+'</div>';
        node += '<div class="grid-item vertAlign horAlign"></div>';
        node += '<div class="grid-item vertAlign horAlign">'+markerIcon+'</div>';
        markerContainer.innerHTML = node;
        
    } else if(tempVal == 6) {
        markerContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
        node = '<div class="grid-item vertAlign horAlign">'+markerIcon+'</div>';
        node += '<div class="grid-item vertAlign horAlign">'+markerIcon+'</div>';
        node += '<div class="grid-item vertAlign horAlign">'+markerIcon+'</div>';
        node += '<div class="grid-item vertAlign horAlign"></div>';
        node += '<div class="grid-item vertAlign horAlign"></div>';
        node += '<div class="grid-item vertAlign horAlign"></div>';
        node += '<div class="grid-item vertAlign horAlign">'+markerIcon+'</div>';
        node += '<div class="grid-item vertAlign horAlign">'+markerIcon+'</div>';
        node += '<div class="grid-item vertAlign horAlign">'+markerIcon+'</div>';
        markerContainer.innerHTML = node;
        
    } else if(tempVal == 8) {
        markerContainer.style.gridTemplateColumns = "repeat(4, 1fr)";
        node = '<div class="grid-item vertAlign horAlign">'+markerIcon+'</div>';
        node += '<div class="grid-item vertAlign horAlign">'+markerIcon+'</div>';
        node += '<div class="grid-item vertAlign horAlign">'+markerIcon+'</div>';
        node += '<div class="grid-item vertAlign horAlign">'+markerIcon+'</div>';
        node += '<div class="grid-item vertAlign horAlign"></div>';
        node += '<div class="grid-item vertAlign horAlign"></div>';
        node += '<div class="grid-item vertAlign horAlign"></div>';
        node += '<div class="grid-item vertAlign horAlign"></div>';
        node += '<div class="grid-item vertAlign horAlign">'+markerIcon+'</div>';
        node += '<div class="grid-item vertAlign horAlign">'+markerIcon+'</div>';
        node += '<div class="grid-item vertAlign horAlign">'+markerIcon+'</div>';
        node += '<div class="grid-item vertAlign horAlign">'+markerIcon+'</div>';
        markerContainer.innerHTML = node;

    } else {
        markerContainer.style.gridTemplateColumns = "repeat("+columns+", 1fr)";
        //markerContainer.style.gridTemplateRows = "repeat(auto-fill, "+100/tempVal+"%)";
        node = '<div class="grid-item vertAlign horAlign">'+markerIcon+'</div>';
        markerContainer.innerHTML = node.repeat(tempVal);
    }

    if(fifth) {
        let center = document.createElement("div");
        center.classList = "centerMarker vertAlign horAlign";
        center.innerHTML = markerIcon;
        markerContainer.appendChild(center);
    }
}

function changeMarkerSize(value) {
    document.getElementById("markerSizeText").innerHTML = value;
    document.getElementById("markers").style.fontSize = value/2 + "em";
}

