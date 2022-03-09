let newWindowPositions = {"x": 5,"y": 5};

/*Make resizable div by Hung Nguyen*/
// see https://medium.com/the-z/making-a-resizable-div-in-js-is-not-easy-as-you-think-bda19a1bc53d

function makeResizableDiv(div) {
  const element = document.querySelector(div);
  const resizers = document.querySelectorAll(div + ' .resizer')
  const minimum_size = 20;
  let original_width = 0;
  let original_height = 0;
  let original_x = 0;
  let original_y = 0;
  let original_mouse_x = 0;
  let original_mouse_y = 0;
  for (let i = 0;i < resizers.length; i++) {
    const currentResizer = resizers[i];
    currentResizer.addEventListener('mousedown', function(e) {
      /* console.log("Start resize"); */
      e.preventDefault()
      original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
      original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
      original_x = element.getBoundingClientRect().left;
      original_y = element.getBoundingClientRect().top;
      original_mouse_x = e.pageX;
      original_mouse_y = e.pageY;
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizeIntermediate);
      // Bring to front so user can see window
      bringToFront(element.id);
      // .. but show overlay to not interfere right after (!)
      showClass('windowManagerOverlay');
    })

    function stopResizeIntermediate() {
      // I need this so i can grab the element, and to later stop it
      stopResize(element);
    }
    
    function resize(e) {
      /* console.log("do a resize"); */

      if (currentResizer.classList.contains('bottom-right')) {
        const width = original_width + (e.pageX - original_mouse_x);
        const height = original_height + (e.pageY - original_mouse_y)
        if (width > minimum_size) {
          element.style.width = width + 'px'
        }
        if (height > minimum_size) {
          element.style.height = height + 'px'
        }
      }
      else if (currentResizer.classList.contains('bottom-left')) {
        const height = original_height + (e.pageY - original_mouse_y)
        const width = original_width - (e.pageX - original_mouse_x)
        if (height > minimum_size) {
          element.style.height = height + 'px'
        }
        if (width > minimum_size) {
          element.style.width = width + 'px'
          element.style.left = getPositionInPercentage("left", original_x + (e.pageX - original_mouse_x)) + '%'
        }
      }
      else if (currentResizer.classList.contains('top-right')) {
        const width = original_width + (e.pageX - original_mouse_x)
        const height = original_height - (e.pageY - original_mouse_y)
        if (width > minimum_size) {
          element.style.width = width + 'px'
        }
        if (height > minimum_size) {
          element.style.height = height + 'px'
          element.style.top = getPositionInPercentage("top", original_y + (e.pageY - original_mouse_y)) + '%'
        }
      }
      else {
        const width = original_width - (e.pageX - original_mouse_x)
        const height = original_height - (e.pageY - original_mouse_y)
        if (width > minimum_size) {
          element.style.width = width + 'px'
          element.style.left = getPositionInPercentage("left", original_x + (e.pageX - original_mouse_x)) + '%'
        }
        if (height > minimum_size) {
          element.style.height = height + 'px'
          element.style.top = getPositionInPercentage("top", original_y + (e.pageY - original_mouse_y)) + '%'
        }
      }
    }
    
    function stopResize(currentElement) {
      /* console.log("stop resize"); */
      // Show current overlay again
      hide(currentElement.getElementsByClassName('windowManagerOverlay')[0].id);
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizeIntermediate);
    }
  }
}


/* DRAG & MOVE WINDOW */
// see https://stackoverflow.com/a/57438497
let offsetX;
let offsetY;
let dropSuccessful = false;

onDragStart = function(ev) {
  showClass('windowManagerOverlay');
  const rect = ev.target.getBoundingClientRect();
  currentDragId = ev.target.id;
  ev.target.style.opacity = '0.025';  // Hide original during dragging
  offsetX = ev.clientX - rect.x;
  offsetY = ev.clientY - rect.y;
};

dropHandler = function(ev) {
  // Element is being dropped
  // console.log("dropHandler");
  ev.preventDefault();
  let droppedId = currentDragId;
  let dragSource = gebi(droppedId);
  let dragTarget = gebi('desktop');

  // Mark as successful drop action
  dropSuccessful = true;

  const left = parseInt(document.defaultView.getComputedStyle(dragTarget).left);
  const top = parseInt(document.defaultView.getComputedStyle(dragTarget).top);

  dragSource.style.position = 'absolute';
  let testx = ev.clientX - left - offsetX + 'px'
  let testy = ev.clientY - top - offsetY + 'px'
  dragSource.style.left = getPositionInPercentage("left", testx)+ "%";
  dragSource.style.top = getPositionInPercentage("top", testy)+ "%";

  let droppedWindow = dragSource.getElementsByClassName('windowManagerOverlay')[0];
  if(droppedWindow) bringToFront(droppedId);

  currentDragId = "";
  dragSource.style.opacity = '1';
};

dragoverHandler = function(ev) {
  // Element is being draged
  // console.log("dragover_handler");
  ev.preventDefault();
  ev.dataTransfer.dropEffect = "move";
};

onDragEnd = function() {
  if(!dropSuccessful) {
    /* cl("dragend failed: "); */
    gebi(currentDragId).style.opacity="1";
  }
  // Reset for next drop
  dropSuccessful = false;
}

let recentZIndex = 10;

function addWindow(windowName, icon, contentPath, x,y, w,h, minimized, zIndex) {
  // Display overlay in all other windows that youre able to click on them later
  showClass('windowManagerOverlay');

  let id = "window-" + createUniqueId();
  recentZIndex++;
  // Create main div and resize edges
  // Main window
  let windowContainer = document.createElement("div");
  windowContainer.setAttribute("id", id);
  windowContainer.setAttribute("data-setup-type", "window");
  windowContainer.setAttribute("data-setup", "['"+[windowName, icon, contentPath].join("', '")+"']");
  windowContainer.setAttribute("data-setup-minimized", minimized);
  windowContainer.setAttribute("data-setup-render-to-dom", "true");
  windowContainer.setAttribute("class", "window resizable shadow");
  if(minimized) {
    windowContainer.classList.add("hide");
  }
  windowContainer.setAttribute("draggable", "true");
  windowContainer.setAttribute("ondragstart", "onDragStart(event)");
  windowContainer.setAttribute("ondragend", "onDragEnd(event)");

  // Set position & size
  windowContainer.style.left = x + "%";
  windowContainer.style.top = y + "%";
  windowContainer.style.width = w + "px";
  windowContainer.style.height = h + "px";
  if(zIndex) {
    windowContainer.style.zIndex = zIndex;
    recentZIndex = zIndex;
  } else {
    windowContainer.style.zIndex = recentZIndex;
  }

  // Resizers
  let resizers = document.createElement("div");
  resizers.setAttribute("class", "resizers");
  let resizerTopLeft = document.createElement("div");
  resizerTopLeft.setAttribute("class", "resizer top-left");
  resizers.appendChild(resizerTopLeft);
  let resizerTopRight = document.createElement("div");
  resizerTopRight.setAttribute("class", "resizer top-right");
  resizers.appendChild(resizerTopRight);
  let resizerBottomLeft = document.createElement("div");
  resizerBottomLeft.setAttribute("class", "resizer bottom-left");
  resizers.appendChild(resizerBottomLeft);
  let resizerBottomRight = document.createElement("div");
  resizerBottomRight.setAttribute("class", "resizer bottom-right");
  resizers.appendChild(resizerBottomRight);
  windowContainer.appendChild(resizers);

  // windowManagerOverlay
  let windowManagerOverlay = document.createElement("div");
  let overlayId = id + "-"+createUniqueId(6);
  windowManagerOverlay.setAttribute("id", overlayId);
  windowManagerOverlay.setAttribute("onclick", "bringToFront('"+id+"'); hide('"+overlayId+"');");
  windowManagerOverlay.setAttribute("class", "hide windowManagerOverlay");
  windowContainer.appendChild(windowManagerOverlay);

  // Window Title
  let windowFrame = document.createElement("div");
  windowFrame.setAttribute("class", "windowFrame systemColors");
  windowFrame.setAttribute("onclick", "bringToFront('"+id+"')");
  windowFrame.setAttribute("ondblclick", "maximizeWindow('"+id+"')");

  let windowTitle = document.createElement("div");
  windowTitle.setAttribute("class", "windowTitle");

  let windowIcon = document.createElement("i");
  windowIcon.setAttribute("class", "material-icons small");
  windowIcon.appendChild(document.createTextNode(icon));
  windowTitle.appendChild(windowIcon);

  let windowTitleText = document.createElement("span");
  windowTitleText.appendChild(document.createTextNode(windowName));
  windowTitleText.setAttribute("class", "valignText");
  windowTitle.appendChild(windowTitleText);
  windowFrame.appendChild(windowTitle);

  // Window actions
  let windowActions = document.createElement("div");
  windowActions.setAttribute("class", "windowActions right");
  let minimize = document.createElement("i");
  minimize.setAttribute("class", "material-icons small");
  minimize.setAttribute("onclick", "minimizeWindow('"+id+"')");
  minimize.appendChild(document.createTextNode("minimize"));
  windowActions.appendChild(minimize);

  let maximize = document.createElement("i");
  maximize.id = "maximizeWindow-"+id;
  maximize.setAttribute("class", "material-icons small");
  maximize.setAttribute("onclick", "maximizeWindow('"+id+"')");
  maximize.appendChild(document.createTextNode("check_box_outline_blank"));
  windowActions.appendChild(maximize);

  let close = document.createElement("i");
  close.setAttribute("class", "material-icons small");
  close.setAttribute("onclick", "closeWindow('"+id+"')");
  close.appendChild(document.createTextNode("close"));
  windowActions.appendChild(close);

  windowFrame.appendChild(windowActions);
  windowContainer.appendChild(windowFrame);

  // iFrame Content
  let content = document.createElement("iframe");
  content.setAttribute("class", "content");
  // Automatically attach current os, workstation & darkMode to iframe URL
  contentPath = contentPath.split("?");
  let mainProgram = contentPath.shift();  // Remove first element *AND* return first element
  let parameters = contentPath.join("");  // get everything after "?" if there is
  let srcIframe = [
    "programs/",
    mainProgram,
    "?os=",
    os,
    "&workstation=",
    workstation,
    "&darkMode=",
    !isLightColor(systemColor),
    parameters ? "&" : "",
    parameters
  ].join("");
  content.setAttribute("src", srcIframe);
  windowContainer.appendChild(content);
    
  gebi('desktop').appendChild(windowContainer);

  // If os==win: add to taskbar
  if(os !== "mac") {
    /* console.log("win"); */
    let miminmizedWindow = document.createElement("button");
    let taskbarIcon = document.createElement("i");
    taskbarIcon.setAttribute("class", "material-icons small valign");
    taskbarIcon.innerHTML=icon;
    miminmizedWindow.appendChild(taskbarIcon);
    miminmizedWindow.type="button";
    miminmizedWindow.appendChild(document.createTextNode(windowName));
    miminmizedWindow.id="minimized-"+id;
    miminmizedWindow.setAttribute("class", "valign systemColors");
    miminmizedWindow.setAttribute("onclick", "getWindowFromTaskbar('"+id+"')");
    gebi('taskbar').appendChild(miminmizedWindow);
  /* } else {
  console.log("not win"); */
}
  makeResizableDiv('#'+id);
  setSystemColors(systemColor);
}

function bringToFront(id) {
  let currentWindow = gebi(id);
  if(currentWindow) {
    recentZIndex++;
    /* console.log(recentZIndex); */
    currentWindow.style.zIndex = recentZIndex;
    // display all windowManagerOverlay
    showClass('windowManagerOverlay');
    
    // hide current windowManagerOverlay
    hide(currentWindow.getElementsByClassName('windowManagerOverlay')[0].id);
  }
}

function getWindowFromTaskbar(id) {
  let hide = toggle(id);
  gebi(id).setAttribute("data-setup-hide", !hide);
  bringToFront(id);
  gebi(id).style.opacity = 1;  // To cover up the drag/drop bug
}

async function minimizeWindow(id) {
  /* console.log("minimizeWindow WTF: "+id); */
  let currentWindow = gebi(id);
  currentWindow.setAttribute("data-setup-hide", true);
  currentWindow.classList.add("minimizeWindow");
  hideFrontMostWindowOverlay(); 
  await delay(1000);
  hide(id);
  currentWindow.classList.remove("minimizeWindow");
}

function maximizeWindow(id) {
  /* console.log("maximizeWindow: "+id); */
  let screenSizes = getScreenSize();
  let systemBar = gebi('systemBar').getBoundingClientRect();
  let systemBarHeight = systemBar["height"];
  let systemBarPosition = systemBar["top"];

  let windowContainer = gebi(id);
  // Save current window position & size
  let lastX = windowContainer.style.left;
  let lastY = windowContainer.style.top;
  let lastW = windowContainer.style.width;
  let lastH = windowContainer.style.height;

  windowContainer.style.left = "0px";
  // Shift beneath the taskbar if taskbar is on top (linux, mac)
  windowContainer.style.top = systemBarPosition === 0 ? systemBarHeight+"px" : 0+"px";
  // get pixel not 100% for later loading
  windowContainer.style.width = screenSizes[0]+"px";
  // get pixel not 100% for later loading. Remove taskbar height to not be underneath.
  windowContainer.style.height = screenSizes[1]-systemBarHeight+"px";
  bringToFront(id);

  let resetMaxButton = gebi("maximizeWindow-"+id);
  resetMaxButton.setAttribute("onclick", "resetWindowSize('"+id+"', '"+lastX+"', '"+lastY+"', '"+lastW+"', '"+lastH+"')");
}

function closeWindow(id) {
  let el = gebi(id);
  el.remove();
  // If os==win: remove from taskbar
  if(os !== "mac") {
    gebi("minimized-"+id).remove();
    hideFrontMostWindowOverlay(); 
  }
}

async function hideFrontMostWindowOverlay() {
  // Hide the front most window's windowManagerOverlay
  // .minimizeWindow because animation is ongoing during minimization
  let overlays = document.querySelectorAll('.window:not(.hide):not(.minimizeWindow)');
  let maxZIndex = 0;
  let currentZIndex = 0;
  let overlayToHide;

  overlays.forEach(e => {
      currentZIndex = e.style.zIndex;
      if(currentZIndex > maxZIndex) {
        maxZIndex = currentZIndex;
        overlayToHide = e;
      }
    })

  if(maxZIndex) {
    // Somehow, the class windowManagerOverlay is being forced right now.
    // Thats why ther's a await here. Works on window "close" without though
    await delay(50);
    hide(overlayToHide.getElementsByClassName('windowManagerOverlay')[0].id);
  }
}

function resetWindowSize(id, x,y, w,h) {
  let windowContainer = gebi(id);
  windowContainer.style.left = x;
  windowContainer.style.top = y;
  windowContainer.style.width = w;
  windowContainer.style.height = h;

  // reset reset:
  let resetMaxButton = gebi("maximizeWindow-"+id);
  resetMaxButton.setAttribute("onclick", "maximizeWindow('"+id+"')");
}

/* SHORTCUTS */
// Displays the edit shortcut dialog window
function editShortcut(id) {
  // (re-) define position, name & icon
  show("editShortcut");
  let currentShortcut = gebi(id);
  gebi('editShortcutId').value = id;

  // Set forms
  // Set images to current os & select icon
  let radioLabels = gebi('editShortcut').getElementsByTagName('label');
  for (let label of radioLabels) {
    let labelImg = label.getElementsByTagName('img')[0];
    let radioButton = label.getElementsByTagName('input')[0];
    if(currentShortcut.getElementsByTagName("img")[0].src.endsWith(radioButton.value)) {
      radioButton.setAttribute("checked", "true");
    }
    let currentPath = labelImg.src;
    labelImg.src = currentPath.replace("os/windows", "os/"+os);
    /* radioButton.setAttribute("value", labelImg.src); */
  }

  gebi('editShortcutName').value = currentShortcut.getElementsByClassName("filename")[0].innerHTML.replace(/&amp;/g, "&");
  gebi('editShortcutAction').value = currentShortcut.getAttribute('ondblclick') ? currentShortcut.getAttribute('ondblclick') : "";
  gebi('editShortcutName').focus();
}

// Saves edits on shortcuts
function saveShortcut(id) {
  hide("editShortcut");
  let currentShortcut = gebi(id);
  let currentOffsetX = currentShortcut.getBoundingClientRect();
  let name = gebi('editShortcutName').value.replace(/[\"'`\{\}\[\]\\]/g, "");
  currentShortcut.getElementsByClassName("filename")[0].innerHTML = name;
  let action = gebi('editShortcutAction').value;
  if(action) {
    currentShortcut.setAttribute('ondblclick', action);
  } else {
    currentShortcut.removeAttribute('ondblclick');
  }
  let icon = document.querySelector('input[name="editShortcutIcon"]:checked').value;
  currentShortcut.getElementsByTagName('img')[0].src = "os/"+os+"/systemIcons/"+icon;
  
  currentShortcut.setAttribute("data-setup-name", name);
  currentShortcut.setAttribute("data-setup-icon", icon);
  currentShortcut.setAttribute("data-setup-action", action);

  // Reposition center
  // Split difference of shortCut width before and after renaming
  let newOffsetX = (currentShortcut.getBoundingClientRect()["width"]-currentOffsetX["width"])/2;
  newOffsetX = getPositionInPercentage("left", newOffsetX);
  let currentOffsetXPercent = getPositionInPercentage("left", currentOffsetX["left"]);
  currentShortcut.style.left = currentOffsetXPercent-newOffsetX+"%"; 
}

// makes a new shortcut on demand
function createShortcut() {
  let id = placeShortcut("name", "file.png", 0,0, "");
  editShortcut(id);
}

// Places a shortcut in the scene
function placeShortcut(name, icon, x,y, action) {
  // place existing shortcut on desktop
  /* console.log(name, icon, x,y, action); */

  let id = "shortcut-" + createUniqueId();

  let shortcutContainer = document.createElement("div");
  shortcutContainer.setAttribute("id", id);

  shortcutContainer.setAttribute("data-setup-type", "shortcut");
  shortcutContainer.setAttribute("data-setup-name", name);
  shortcutContainer.setAttribute("data-setup-icon", icon);
  shortcutContainer.setAttribute("data-setup-action", action);

  shortcutContainer.setAttribute("class", "shortcut");
  shortcutContainer.setAttribute("style", "left:"+x+"%; top:"+y+"%");
  shortcutContainer.setAttribute("draggable", "true");
  shortcutContainer.setAttribute("ondragstart", "onDragStart(event)");
  /* shortcutContainer.setAttribute("ondblclick", "addWindow('File manager', 'folder', 'filemanager', 5,5, 600,350, false)"); */
  if(action) shortcutContainer.setAttribute("ondblclick", action);
  shortcutContainer.setAttribute("oncontextmenu", "editShortcut('"+id+"'); return false;");

  let fileIcon = document.createElement("img");
  if(icon) {
    fileIcon.setAttribute("src", "os/"+os+"/systemIcons/"+icon);
  } else {
    fileIcon.setAttribute("src", "os/"+os+"/systemIcons/file.png");
  }
  fileIcon.setAttribute("alt", "");
  fileIcon.setAttribute("draggable", "false");
  shortcutContainer.appendChild(fileIcon);

  let fileName = document.createElement("span");
  fileName.setAttribute("class", "filename");
  fileName.appendChild(document.createTextNode(name));
  shortcutContainer.appendChild(fileName);

  /* shortcutContainer.appendChild(e_1); */
  gebi('desktop').appendChild(shortcutContainer);

  return id;  // used for createShortcut()
}

function clutterDesktop(count) {
  let randomNameParts = [
    "File", "file", "Document", "Home", "Personal", "var", "VAR", "Favorites", "A-433", "Photos", "Links", "Important",
  ]
  let randomNameSuffix = [
    "", "", "", "", "", "", "","", "", "", "", "", "", "","", "", "", "", "", "", "","", "", "", "", "", "", "","", "", "", "", "", "", "",
    "", "", "", "", "", "", "","", "", "", "", "", "", "","", "", "", "", "", "", "","", "", "", "", "", "", "","", "", "", "", "", "", "",
    ".jpg", ".jpeg", ".png", ".tiff", ".psd", ".doc", ".docx", ".pyc", ".py", ".txt", ".rtf", ".pdf", ".zip", ".mp3", ".mp4", ".avi", ".mpeg", ".mkv", ".trash",
    ".avi", ".png", ".jpg", ".jpg", ".JPG", ".jpeg", ".zip", ".mp4", ".txt", ".doc", ".mp3" , ".pyc", ".pdf", ".pdf", ".PDF" 
  ]

  let x;
  let y;
  let name;

  for (i = 1; i <= count; i++) {
    /* console.log(i); */
    x = randomBetween(1, 93);
    y = randomBetween(1, 85);
    /* console.log(rand, x, y, randomIcon[rand]); */
    name = randomNameParts[chooseRandomKey(randomNameParts)];
    name += randomBetween(0, 100) > 85 ? " " + createUniqueId(5) : "";
    name += randomBetween(0, 100) > 75 ? " Copy" : "";
    name += randomNameSuffix[chooseRandomKey(randomNameSuffix)];
    //console.log(name);
    placeShortcut(name, iconDecider(name, name.split(".").length === 1), x,y, "");
  }
}

function alignShortcutsToGrid() {
  let shortcutsFromDom = document.querySelectorAll("[data-setup-type='shortcut']");
  let generalOffsetX = 0;
  let currentOffsetX  = 0;
  for (shortcut of shortcutsFromDom) {
    currentOffsetX = shortcut.getBoundingClientRect()["width"];
    currentOffsetX = getPositionInPercentage("left", currentOffsetX);
    // Magic: get difference between imaginary rectangle (12% width) and the shortcut. 
    //   Divide by 2 and add this to the .stlye.left after clamping. I'm smart!
    currentOffsetX = (14-currentOffsetX)/2-3;
    shortcut.style.left = clamp((Math.floor(parseInt(shortcut.style.left)/7)*7+generalOffsetX), generalOffsetX, 92)+currentOffsetX+"%"; 
    shortcut.style.top = clamp(Math.floor(parseFloat(shortcut.style.top)/12)*12+1, 1, 85)+"%";
  }
}

function tidyUpShortcuts() {
  let shortcutsFromDom = document.querySelectorAll("[data-setup-type='shortcut']");
  let xOffset = -2;  // compensate optically space to left screen border
  let yOffset = 1;
  let currentOffsetX  = 0;
  for (shortcut of shortcutsFromDom) {
    currentOffsetX = shortcut.getBoundingClientRect()["width"];
    currentOffsetX = getPositionInPercentage("left", currentOffsetX);
    // Magic: get difference between imaginary rectangle (12% width) and the shortcut. 
    //   Divide by 2 and add this to the .stlye.left after clamping. I'm smart!
    currentOffsetX = (12-currentOffsetX)/2;
    shortcut.style.left = xOffset + currentOffsetX + "%";
    shortcut.style.top = yOffset + "%";

    if(yOffset < 85) {
      // Switch to next row
      yOffset += 12;
    } else if(xOffset > 88) {
      // Start over top left
      yOffset = 1;
      xOffset = -2;
    } else  {
      // Switch to next column
      yOffset = 1;
      xOffset += 7;
    }
  }
}

function incrementWindowsPosition(axe) {
  newWindowPositions[axe] += 3;
  // Reset once if edge of desktop reached
  // Second go-round overlaps. But then again, if you have this many windows, you're the problem.
  if(newWindowPositions[axe] > 50) newWindowPositions = {"x": 11,"y": 3};
  return newWindowPositions[axe];
}

function startDefaultProgram(program, parameters) {
  // If no variable is set, start random program
  if(!program) {
    let programs = ["fileManager", "browser", "ftp", "ftp-connect", "imageViewer", "textEditor-random", "terminal"];
    program = programs[chooseRandomKey(programs)];
    cl("startDefaultProgram Random: " + program);
  } else {
    cl("startDefaultProgram: " + program);
  }

  switch(program) {
    case "fileManager":
      addWindow('File manager', 'folder', 'filemanager', incrementWindowsPosition('x'), incrementWindowsPosition('y'), 600,350, false);
      break;
    case "browser":
      addWindow('Browser', 'public', 'browser', incrementWindowsPosition('x'), incrementWindowsPosition('y'), 1200,650, false);
      break;
    case "ftp":
      addWindow('FTP Client', 'storm', 'ftp', incrementWindowsPosition('x'), incrementWindowsPosition('y'), 850,590, false);
      break;
    case "ftp-connect":
      addWindow('FTP Client - Connect', 'storm', 'ftp/connect.html', incrementWindowsPosition('x'), incrementWindowsPosition('y'), 666,480, false);
      break;
    case "imageViewer":
      // TODO: Default file list from where?
      parameters = parameters ? parameters.join("|") : "1.jpg|2.jpg|3.jpg|1.mp4|2.mp4|4.jpg|5.jpg|6.jpg|7.jpg|8.jpg|9.jpg|10.jpg";
      addWindow('Image viewer', 'image', 'imageviewer/index.html?files='+parameters, incrementWindowsPosition('x'), incrementWindowsPosition('y'), 666,450, false);
      break;
    case "textEditor":
        addWindow('Text editor', 'edit_note', 'texteditor/index.html', incrementWindowsPosition('x'), incrementWindowsPosition('y'), 666,450, false);
      break;
    case "textEditor-random":
        addWindow('Text editor', 'edit_note', 'texteditor/index.html?text=random', incrementWindowsPosition('x'), incrementWindowsPosition('y'), 666,450, false);
      break;
    case "terminal":
      // If no parameters set, start with random terminal content
      if(!parameters) parameters = randomBetween(0,6);
      switch(parameters) {
        case 0:  // sqlHack (start froms cratch)
          /* TODO: This should be a terminal with bash CLI inside */
          addWindow('Terminal - SQL', 'code', 'terminal/index.html?byRows=false&startChar=0&text=sqlHack&theme=dracula&speed=1&language=sql&autotype=false&humanTyper=true&cursor=true&truncateText=12000&bgColor=212121&fontColor=FFFFFF&paddingRange=10', incrementWindowsPosition('x'), incrementWindowsPosition('y'), 666,450, false);
          break;
        case 1:  // apt-get
          addWindow('Terminal - Update', 'code', 'terminal/index.html?byRows=true&startChar=0&text=apt-get&theme=an-old-hope&speed=2&language=python&autotype=true&humanTyper=false&cursor=true&truncateText=12000&bgColor=212121&fontColor=FFFFFF&paddingRange=10', incrementWindowsPosition('x'), incrementWindowsPosition('y'), 666,450, false);
          break;
        case 2:  // lorem_ipsum_binary
        addWindow('Terminal - BIN', 'code', 'terminal/index.html?byRows=false&startChar=0&text=lorem_ipsum_binary&theme=hybrid&speed=50&language=none&autotype=true&humanTyper=false&cursor=true&truncateText=12000&bgColor=0d0d0d&fontColor=339e91&paddingRange=10', incrementWindowsPosition('x'), incrementWindowsPosition('y'), 666,450, false);
          break;
        case 3:  // hexdump
          addWindow('Terminal - HEX', 'code', 'terminal/index.html?byRows=true&startChar=0&text=hexdump&theme=hybrid&speed=12&language=none&autotype=true&humanTyper=false&cursor=true&truncateText=12000&bgColor=0d0d0d&fontColor=339e91&paddingRange=10', incrementWindowsPosition('x'), incrementWindowsPosition('y'), 666,450, false);
          break;
        case 4:  // sqlHack
          addWindow('Terminal - SQL2', 'code', 'terminal/index.html?byRows=false&startChar=119&text=sqlHack&theme=dracula&speed=1&language=sql&autotype=false&humanTyper=true&cursor=true&truncateText=12000&bgColor=212121&fontColor=FFFFFF&paddingRange=10', incrementWindowsPosition('x'), incrementWindowsPosition('y'), 666,450, false);
          break;
        case 5:  // randall  python
          addWindow('Terminal - PYTHON', 'code', 'terminal/index.html?byRows=false&startChar=178&text=randall&theme=paraiso-dark&speed=1&language=python&autotype=false&humanTyper=true&cursor=true&truncateText=12000&bgColor=212121&fontColor=FFFFFF&paddingRange=10', incrementWindowsPosition('x'), incrementWindowsPosition('y'), 666,450, false);
          break;
        case 6:  // log
          addWindow('Terminal - LOG', 'code', 'terminal/index.html?byRows=true&startChar=0&text=log&theme=hybrid&speed=1&language=c&autotype=true&humanTyper=false&cursor=true&truncateText=12000&bgColor=212121&fontColor=FFFFFF&paddingRange=10', incrementWindowsPosition('x'), incrementWindowsPosition('y'), 666,450, false);
          break;
        default:
          cl("Terminal does not exist: " + program +", "+ terminalContent);
          break;
      }
      break;
      default:
        cl("App does not exist: " + program);
        break;
  }
}
