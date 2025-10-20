async function setup() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let os = urlParams.get('os');
    let workstation = urlParams.get('workstation');
    let darkMode = urlParams.get('darkMode') === 'true';
    let scene = urlParams.get('scene');
    if(!scene) scene = "_example";
    console.log(scene)
    let mapPath = `data/${scene}/map.svg`;
    
    // Set generic system fonts
    setSystemFont(os);

    if(darkMode) {
      setDarkMode();
    }

    setupZoom('zoom-img', mapPath, `data/${scene}/pointsOfInterest.json`, 'zoom-container')
}

function setDarkMode() {
  gebi('windowMenu-settings').classList.toggle('invert');
  gebi('windowMenu-tools').classList.toggle('invert');
}

/* 
function setMapImage(mapPath) {
    fetch(mapPath)
    .then(response => response.text())
    .then(svgData => {
      // Erstellt ein neues div-Element, um das SVG aufzunehmen
      gebi('map').innerHTML=svgData;
    })
    .catch(error => console.error('Fehler beim Laden des SVG:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    const mapContainer = gebi('map-container');
    const map = gebi('map');
    let isDragging = false, startX, startY, dragStartX, dragStartY;

    map.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const viewBox = map.viewBox.baseVal;
        dragStartX = viewBox.x;
        dragStartY = viewBox.y;
        map.style.cursor = 'grabbing';
      });
    
      document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const dx = (e.clientX - startX) * (map.viewBox.baseVal.width / map.clientWidth);
        const dy = (e.clientY - startY) * (map.viewBox.baseVal.height / map.clientHeight);
        map.viewBox.baseVal.x = dragStartX - dx;
        map.viewBox.baseVal.y = dragStartY - dy;
      });
    
      document.addEventListener('mouseup', function() {
        isDragging = false;
        map.style.cursor = 'grab';
      });

      mapContainer.addEventListener('wheel', function(e) {
        e.preventDefault();
      
        var rect = map.getBoundingClientRect(); // Das SVG-Element
        var mouseX = e.clientX - rect.left; // X Position der Maus innerhalb des SVG
        var mouseY = e.clientY - rect.top; // Y Position der Maus innerhalb des SVG
      
        // Aktuelle viewBox-Werte
        var viewBox = map.viewBox.baseVal;
        var zoomFactor = e.deltaY > 0 ? 1.05 : 0.95; // Veränderung des Zoomfaktors
      
        // Berechnen der neuen viewBox-Dimensionen
        var newWidth = viewBox.width * zoomFactor;
        var newHeight = viewBox.height * zoomFactor;
        
        // Berechnen der neuen X und Y Positionen für die viewBox, basierend auf der Mausposition
        var newX = mouseX * (viewBox.width / rect.width) + viewBox.x - (mouseX * (newWidth / rect.width));
        var newY = mouseY * (viewBox.height / rect.height) + viewBox.y - (mouseY * (newHeight / rect.height));
      
        // Aktualisieren der viewBox-Werte
        viewBox.x = newX;
        viewBox.y = newY;
        viewBox.width = newWidth;
        viewBox.height = newHeight;
      });
  
  
    // JSON-Daten für die Pins
    const pinsData = [
      {"x": 100, "y": 150},
      {"x": 400, "y": 300}
    ];
  
    // Pins auf der Karte platzieren
    pinsData.forEach(function(pin) {
      const pinElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pinElement.setAttribute('cx', pin.x);
      pinElement.setAttribute('cy', pin.y);
      pinElement.setAttribute('r', 10); // Radius des Pins
      pinElement.setAttribute('fill', 'red');
      map.appendChild(pinElement);
    });
    
  });
   */