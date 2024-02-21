let zoomStage = 1;
let initialFontSize = 14;
let isDragging = false;


/* 
  MÖGLICHE 
  push_pin
  voice_chat
  visibility
  thumbtack
*/

function setupZoom(imageId, mapPath, pointsOfInterest, container) {
  gebi(imageId).style.backgroundImage=`url(${mapPath})`;
  loadPointsOfInterest(pointsOfInterest, container);
}

async function loadPointsOfInterest(path, id) {
  let points = await parseFile(path);
  points.forEach(point => {
    setPointOfInterest(point, id);
  })
}

function setPointOfInterest(point, id) {
  let thumbtack = `<div class="relative inlineBlock"
      style="left:${point.x}%; top:${point.y}%; font-size:1em;"
      onclick="${point.action}"
    >
      <i data-title="${point.tootlip}"
        class="thumbtack tooltip material-icons absolute ${point.iconClasses}"
        style="transform: translate(-50%, -100%); font-size:${point.size}em; ${point.iconStyles}"
      >
        ${point.icon}
      </i>
      ${point.text.length ? `<div style="margin-left:-50%" class="thumbtack-label">${point.text}</div>` : '' }
    </div>`
    gebi(id).innerHTML += thumbtack;
}

function zoom(event, id) {
    //if(!allowZoom) return;
    let scrollingEvent = {};
    if(typeof event !== 'object') {
        // if zoom was triggered by key presses, reset zoom
        scrollingEvent = {
            "wheelDeltaY": event,
            "wheelDeltaX": 0,
            "offsetX": 0,
            "offsetY": 0,
            "zoomReset": true
        }
    } else {
        scrollingEvent = event;
    }
    
    if(typeof event.preventDefault === 'function') event.preventDefault();
    let element = gebi(id);
    let currentPos = element.style.transformOrigin.split("px ");

    /* let isVideo = element.tagName === "VIDEO" || !gebi('videoPlayer').classList.contains('hide');
    // If video is scrolled by button in program bar
    if(!gebi('videoPlayer').classList.contains('hide')) {
        element = gebi('videoJsPlayerWrapper_html5_api');
    } */

    if(true) {
    //if((scrollingEvent.wheelDeltaY>1 || scrollingEvent.wheelDeltaY<-1) && (scrollingEvent.wheelDeltaX>=-1 && scrollingEvent.wheelDeltaX<=1)) {
        /* if(isVideo) {
            // reset controls
            tempVideoControls = disableVideoControls;
            disableVideoControls = true;
            setVideoControls()
        } */
        // zoom in / zoom out
        zoomStage = scrollingEvent.zoomReset ? 1 : clamp(zoomStage-scrollingEvent.wheelDeltaY/1000, 1,100);
        element.style.transform = 'scale('+zoomStage+')';
        element.style.transformOrigin = scrollingEvent.offsetX+'px '+scrollingEvent.offsetY+'px';

        element.style.fontSize = initialFontSize/zoomStage + "px";
        element.style.lineHeight = initialFontSize*1.5/zoomStage + "px";
        
        // if zoom is maxed out, reset controls
        /* disableVideoControls = tempVideoControls;
        if(zoomStage == 1 && isVideo) {
            setVideoControls()
        } */
    } /* else if(scrollingEvent.wheelDeltaX>1 || scrollingEvent.wheelDeltaX<-1) {
        let newX = currentPos[0] - scrollingEvent.wheelDeltaX;
        newX = clamp(newX, 0, window.innerWidth);
        element.style.transformOrigin = newX +'px '+ currentPos[1];
    } */
}

function pan(x, y, id) {
  /* context.translate(x, y);
  drawImageToCanvas(); */
  // cl(currentZoomLevel)
  // gebi('overlay').style.transform = `translate(${x}px, ${y}px);`;
  let element = gebi(id);
  transform.x = x;
  transform.y = y;
  // cl([x, y])
  element.style.transform = "translate("+transform.x+"px, "+transform.y+"px) scale("+zoomStage+")";
  //element.style.marginTop = (parseInt(element.style.marginTop.split('px')[0] || 0)+y)+"px";
}

let dragStartPosition = {x:0, y:0};
let transform = {x:0, y:0};

// onMouseDown
function startPanning(event, id) {
  isDragging = true;
  // canvas.style.cursor = MOUSEDOWNCURSOR;
  dragStartPosition = getRelativePoint(event.offsetX, event.offsetY, id);
}

// onMouseMove
function panning(event, id) {
  // canvas.style.cursor = DEFAULTCURSOR;
  event.preventDefault();
  if(isDragging) {
    currentTransformedCursor = getRelativePoint(event.offsetX, event.offsetY, id);
    pan(
      currentTransformedCursor.x - dragStartPosition.x,
      currentTransformedCursor.y - dragStartPosition.y,
      id
    );
  }
}

// onMouseUp
function stopPanning() {
  isDragging = false;
  // canvas.style.cursor = DEFAULTCURSOR;
}

function getRelativePoint(x,y, id) {
  const rect = gebi(id).getBoundingClientRect(); // Canvas-Größe und -Position
  //console.log(x, rect.left, y, rect.top)
  const mouseX = x - rect.left; // Maus-X relativ zum Canvas
  const mouseY = y - rect.top; // Maus-Y relativ zum Canvas
  // return {x: mouseX, y:mouseY}
  return {x: x, y:y}
}

/* function getTransformedPoint(x, y) {
  const originalPoint = new DOMPoint(x, y);
  return context.getTransform().invertSelf().transformPoint(originalPoint);
} */