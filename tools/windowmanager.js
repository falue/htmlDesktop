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

  let droppedSourceIsWindow = dragSource.getElementsByClassName('windowManagerOverlay')[0];
  if(droppedSourceIsWindow) {
    bringToFront(droppedId);
  } else {
    // If shortcut, hide front most protective overlay again
    hideFrontMostWindowOverlay();
  }

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

async function addWindow(windowName, icon, contentPath, x,y, w,h, minimized, zIndex) {
  // Display overlay in all other windows that youre able to click on them later
  showClass('windowManagerOverlay');

  // Save for alter - used if URL is starts with http
  let isDirectUrl = contentPath.includes('://') || contentPath.includes('localhost:') ? contentPath : false;

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
  windowContainer.classList.add("window","resizable","shadow");
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
    recentZIndex = zIndex > recentZIndex ? zIndex : recentZIndex;
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
  windowIcon.setAttribute("oncontextmenu", `epD(event); setWindowIcon('${id}')`);
  windowTitle.appendChild(windowIcon);

  let windowTitleText = document.createElement("span");
  windowTitleText.appendChild(document.createTextNode(windowName));
  windowTitleText.setAttribute("id", "title-"+id);
  windowTitleText.setAttribute("oncontextmenu", `epD(event); setWindowTitle('title-${id}')`);
  windowTitleText.setAttribute("class", "valignText");
  windowTitleText.style.paddingRight='2em';
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
  content.id = `iframe-${id}`;
  content.classList.add("content", "hide");
  // Automatically attach current os, workstation & darkMode to iframe URL
  contentPath = contentPath.split("?");
  let mainProgram = contentPath.shift();  // Remove first element *AND* return first element
  // If index.html is not specified, add index.html by default
  mainProgram = mainProgram.endsWith(".html") ? mainProgram : mainProgram+"/index.html";
  let parameters = contentPath.join("");  // get everything after "?" if there is
  // Do not overwrite hardcoded darkMode parameter
  parameters += parameters.includes("darkMode") ? "" : "&darkMode="+!isLightColor(systemColor);
  let srcIframe = [
    "programs/",
    mainProgram,
    "?os=",
    os,
    "&workstation=",
    workstation,
    parameters ? "&" : "",
    parameters
  ].join("");
  content.setAttribute("src", isDirectUrl ? isDirectUrl : srcIframe);
  content.setAttribute("onload", `show('iframe-${id}')`);
  // make it possible to have video inside iframe be fullscreen
  content.setAttribute("allowfullscreen", "true");
  content.setAttribute("webkitallowfullscreen", "true");
  content.setAttribute("allow", "fullscreen");
  content.setAttribute("allow", "fullscreen *");
  windowContainer.appendChild(content);

  // For some godforsaken reason, i cannot parse .html files OR files with no extension,
  // This is why i use .splash
  let splashPath = `programs/${mainProgram.endsWith(".html") ? mainProgram.split("/").slice(0, -1).join("/") : mainProgram}/index.splash`;
  let splash = await parseFile(splashPath, false);
  if(splash != 404 && !minimized) {
    show('splashScreen');
    gebi('splashScreenWindow').innerHTML = splash;
    let delayTime = splash.match(/\<\!-- ?delay ?= ?(\d*?) ?--\>/);
    delayTime = delayTime ? parseInt(delayTime[1]) : 2000;
    await delay(delayTime);
    hide('splashScreen');
  }
    
  gebi('desktop').appendChild(windowContainer);

  // Add to taskbar or dock
  let miminmizedWindow = document.createElement("button");
  let taskbarIcon;
  miminmizedWindow.type="button";
  miminmizedWindow.id="minimized-"+id;
  miminmizedWindow.setAttribute("class", "valign systemColors");
  miminmizedWindow.setAttribute("onclick", "getWindowFromTaskbar('"+id+"')");

  if(!dockAvailable) {
    // Linux & Windows taskbar
    taskbarIcon = document.createElement("i");
    taskbarIcon.setAttribute("class", "material-icons small valign");
    taskbarIcon.innerHTML=icon;
    miminmizedWindow.appendChild(taskbarIcon);
    miminmizedWindow.appendChild(document.createTextNode(windowName));
    gebi('taskbar').appendChild(miminmizedWindow);
  } else {
    // Mac styled dock
    // Check if icon exists
    let iconSrc = await fileExists(`os/${os}/programIcons/minimized-${icon}.png`, false);
    if(iconSrc) {
      taskbarIcon = document.createElement("img");
      taskbarIcon.src=iconSrc;
    } else {
      taskbarIcon = document.createElement("div");
      taskbarIcon.setAttribute("class", "material-icons valign large centerContent fancy white round padding05");
      taskbarIcon.innerHTML=icon;
    }
    miminmizedWindow.classList.add("tooltip", "tooltipDock");
    miminmizedWindow.dataset.title=windowName;
    miminmizedWindow.appendChild(taskbarIcon);
    gebi('dockTaskbar').appendChild(miminmizedWindow);
  }

  makeResizableDiv('#'+id);
  setSystemColors(systemColor);
}

function getFrontMostWindow(includingMinimized) {
  let windows;
  let maxZIndex = 0;
  let currentZIndex = 0;
  let frontMostWindow;

  if(includingMinimized) {
    windows = document.querySelectorAll('.window');
  } else {
    // Class .minimizeWindow because animation is ongoing during minimization
    windows = document.querySelectorAll('.window:not(.hide):not(.minimizeWindow)');
  }

  windows.forEach(e => {
    currentZIndex = parseInt(e.style.zIndex);
    if(currentZIndex > maxZIndex) {
      maxZIndex = currentZIndex;
      frontMostWindow = e;
    }
  })
  return {"frontMostWindow": frontMostWindow, "maxZIndex": maxZIndex};
}

function bringToFront(id) {
  let currentWindow = gebi(id);

  // Get all windows including ones that are hidden
  let windows = getFrontMostWindow(true);

  // If window frontMostWindow, do nothing except set recentZIndex to current window.zindex
  if(windows?.frontMostWindow?.id === id) {
    /* cl("this window is the front most - do nothing"); */
    recentZIndex = windows.maxZIndex;
  } else {
    // Current window is not frontmost
    if(currentWindow) {
      // If window ZIndex is bigger than saved one, set to bigger ZIndex
      if(parseInt(currentWindow.style.zIndex) < windows.maxZIndex) {
        recentZIndex = windows.maxZIndex;
      }
      recentZIndex++;
      currentWindow.style.zIndex = recentZIndex;
      
      // display all windowManagerOverlay
      showClass('windowManagerOverlay');
    }
  }
  // Hide current windowManagerOverlay in any case except is was closed
  if(currentWindow) {
    hide(currentWindow.getElementsByClassName('windowManagerOverlay')[0].id);
  }
}

function getWindowFromTaskbar(id) {
  let currentWindow = gebi(id);
  let hidden = currentWindow.classList.contains('hide');  

  if(hidden) {
    /* cl("was hidden - display now!"); */
    showClass('windowManagerOverlay');
    currentWindow.setAttribute("data-setup-hide", false);
    show(id);
    bringToFront(id);
    currentWindow.style.opacity = 1;  // To cover up the drag/drop bug
  } else {
    /* cl("was displayed - hide now!"); */
    currentWindow.setAttribute("data-setup-hide", true);
    minimizeWindow(id);
  }
}

async function minimizeWindow(id) {
  /* console.log("minimizeWindow WTF: "+id); */
  let currentWindow = gebi(id);
  currentWindow.setAttribute("data-setup-minimized", true);
  currentWindow.classList.add("minimizeWindow");
  hideFrontMostWindowOverlay(); 
  await delay(1000);  // Await CSS animation
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
  // Set click into window action button to reset window position
  resetMaxButton.setAttribute("onclick", "resetWindowSize('"+id+"', '"+lastX+"', '"+lastY+"', '"+lastW+"', '"+lastH+"')");
  // Set click into window top bar to reset window position
  windowContainer.getElementsByClassName("windowFrame")[0].setAttribute("ondblclick", "resetWindowSize('"+id+"', '"+lastX+"', '"+lastY+"', '"+lastW+"', '"+lastH+"')");
}

async function setWindowTitle(id) {
  let currentWindowTitleElement = gebi(id);
  let currentTitle = currentWindowTitleElement.innerHTML;
  let newTitle = await showDialog("Set new window title", "", false, currentTitle);
  if(newTitle) {
    currentWindowTitleElement.innerHTML = newTitle != "~EMPTY" ? newTitle : '';
  }
  return newTitle;
}

async function setWindowIcon(id) {
  let currentWindowIcon = gebi(id).getElementsByClassName('windowTitle')[0].getElementsByTagName('i')[0];
  let textContent = `<div class="chooseBox editIcon radius5 alignCenter">
    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='folder'"><i class="material-icons blue valign ">folder</i></div>
    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='folder_open'"><i class="material-icons blue valign ">folder_open</i></div>
    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='edit_note'"><i class="material-icons blue valign ">edit_note</i></div>
    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='image'"><i class="material-icons blue valign ">image</i></div>
    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='grid_view'"><i class="material-icons blue valign ">grid_view</i></div>
    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='public'"><i class="material-icons blue valign ">public</i></div>
    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='person'"><i class="material-icons blue valign ">person</i></div>
    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='inventory_2'"><i class="material-icons blue valign ">inventory_2</i></div>

    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='code'"><i class="material-icons blue valign ">code</i></div>
    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='videocam'"><i class="material-icons blue valign ">videocam</i></div>
    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='storm'"><i class="material-icons blue valign ">storm</i></div>
    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='view_in_ar'"><i class="material-icons blue valign ">view_in_ar</i></div>
    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='reorder'"><i class="material-icons blue valign ">reorder</i></div>
    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='location_searching'"><i class="material-icons blue valign ">location_searching</i></div>
    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='map'"><i class="material-icons blue valign ">map</i></div>
    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='fastfood'"><i class="material-icons blue valign ">fastfood</i></div>

    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='call_to_action'"><i class="material-icons blue valign ">call_to_action</i></div>
    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='local_florist'"><i class="material-icons blue valign ">local_florist</i></div>
    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='trip_origin'"><i class="material-icons blue valign ">trip_origin</i></div>
    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='description'"><i class="material-icons blue valign ">description</i></div>
    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='folder_zip'"><i class="material-icons blue valign ">folder_zip</i></div>
    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='warning'"><i class="material-icons blue valign ">warning</i></div>
    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value='feedback'"><i class="material-icons blue valign ">feedback</i></div>
    <div class="pointer inlineBlock hover radius5 whiteBgTransparent margin25" onclick="gebi('autoDialogInput').value=''"><i class="material-icons blue valign op0">folder</i></div>
  </div>
  See
  <a href='https://fonts.google.com/icons?selected=Material+Icons' target='_blank'>here</a> for all icons.
  Copy the plain text variable.`
  let newIcon = await parent.showDialog("Set new window icon", textContent, false, currentWindowIcon.innerHTML);
  if(newIcon && newIcon != "~EMPTY") {
    currentWindowIcon.innerHTML = newIcon;
  } 
  return newIcon;
}

function closeWindow(id) {
  let el = gebi(id);
  el.remove();
  // Remove from taskbar or Dock
  gebi("minimized-"+id).remove();
  hideFrontMostWindowOverlay();
}

function closeAllWindows() {
  let windowsFromDom = document.querySelectorAll("[data-setup-type='window']");
  for (let windowData of windowsFromDom) {
    gebi(windowData.id).remove();
    gebi("minimized-"+windowData.id).remove();
  }
}

function clearCacheOfFiles(target, type, attributeName) {
  // Get element and reload file; ignoring cache (maybe..)
  for (let currentFile of target.querySelectorAll(`${type}[${attributeName}]`)) {
    if(currentFile.hasAttribute(attributeName)) {
      cl(`Clear ${attributeName} of ${currentFile[attributeName]}`);
      // create img with sources; but fetch does the same (?)
      // https://stackoverflow.com/a/9044701
      /* let dummyElement =  document.createElement("img");
      dummyElement.setAttribute("src", currentFile[attributeName]);
      dummyElement.setAttribute("title", "HARDEST RELOAD");
      dummyElement.setAttribute("style", "visibility:hidden; width:0; height:0");
      // target.innerHTML = "ERASED";
      target.appendChild(dummyElement);
      cl(dummyElement); */
      fetch(currentFile[attributeName], {cache: 'reload', mode: 'no-cors'});
    }
  }
}

async function hardReloadAllIframes() {
  let iFrames = document.querySelectorAll("iframe");
  for (let currentIframe of iFrames) {
    let currentSrc = currentIframe.src;
    let currentId = currentIframe.id;
    cl(`Hard reload: ${currentSrc}`);
    let currDocument = currentIframe.contentWindow.document;
    currDocument.location.reload();  // Maybe does not remove cache
    await fetch(currentSrc, {cache: 'reload', mode: 'no-cors'});
    
    // wait until file is loaded... sketchy!
    // can't use onload because there is already an onload event..
    await delay(666);

    // New iframe with refreshed content
    let currentNewIframe = gebi(currentId).contentWindow.document;
    clearCacheOfFiles(currentNewIframe, "script", "src");
    clearCacheOfFiles(currentNewIframe, "style", "href");
    clearCacheOfFiles(currentNewIframe, "link", "href");
    clearCacheOfFiles(currentNewIframe, "img", "src");
 }
}

function removeAllShortcuts() {
  let shortcutsFromDom = document.querySelectorAll("[data-setup-type='shortcut']");
  for (shortcut of shortcutsFromDom) {
    shortcut.remove();
  }
}

async function hideFrontMostWindowOverlay() {
  // Hide the front most window's windowManagerOverlay
  let windows = getFrontMostWindow(false);

  if(windows.maxZIndex) {
    // Somehow, the class windowManagerOverlay is being forced right now.
    // Thats why ther's a await here. Works on window "close" without though
    await delay(50);
    hide(windows.frontMostWindow.getElementsByClassName('windowManagerOverlay')[0].id);
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
  // Reset click into window action button to maximize window position
  resetMaxButton.setAttribute("onclick", "maximizeWindow('"+id+"')");
  // Reset click into window top bar to maximize window position
  windowContainer.getElementsByClassName("windowFrame")[0].setAttribute("ondblclick", "maximizeWindow('"+id+"')");
}

async function grabWindowFromWorkstation() {
  let list = '';
  let countWorkstations = 0;
  let countWindows = 0;
  let settingsData = await parseFile("tools/general.settings");
  let alreadySavedWindows = [];
  for (let e of settingsData) {
    let workstationWindowList = ''; // Initialize an empty string
    let settings = e.split("=");
    let workstationName = settings[1].split(";")[0];
    let savedWindows = await parseFile(`workstations/${workstationName}/settings.json`);

    if (savedWindows.windows.length > 0) {
      countWorkstations++;
      for (let window of savedWindows.windows) {
        if(!alreadySavedWindows.includes(window.metaTitle+window.windowName+window.contentPath)) {
          workstationWindowList += `<li onclick="addWindow('${window.windowName}', '${window.icon}', '${window.contentPath}', ${window.x},${window.y}, ${window.w},${window.h}, ${window.minimized}, ${window.zIndex});">`;
          workstationWindowList += `<i class="material-icons grey small">${window.icon}</i>`;
          workstationWindowList += (window.metaTitle || window.windowName).replaceAll(/#(\d\w+)/gm, `<span class='green'>#$1</span>`);
          workstationWindowList += `</li>`;
          alreadySavedWindows.push(window.metaTitle+window.windowName+window.contentPath);
          countWindows++;
        }
      }
      if(workstationWindowList.length > 0) {
        workstationWindowList = `<li><span class="green">${workstationName}</span><ul>`+workstationWindowList;
        workstationWindowList += `</ul></li>`;
      }
      list += workstationWindowList;
    }
  }
  let textContent = `Available windows: ${countWindows} from ${countWorkstations} workstations<br>
    <div class="chooseBox radius3 maxHeight noScrollbar"><ul>${list}</ul></div>`;
  showDialog('Grab window from another workstation', textContent);
}


/* SHORTCUTS */
// Displays the edit shortcut dialog window
function editShortcut(id) {
  // (re-) define position, name & icon
  show("editShortcut");
  let currentShortcut = gebi(id);
  gebi('editShortcutId').value = id;

  let fileName = currentShortcut.getElementsByClassName("filename")[0].innerHTML.replace(/&amp;/g, "&");

  // Reset icon chooser if new shortcut is being made
  if(!fileName) {
    let resetIconRadio = gebi('editShortcut').querySelector('input[name="editShortcutIcon"]:checked');
    if(resetIconRadio) {
      resetIconRadio.checked = false;
    }
  }

  // Set forms
  // Set images to current os & select icon
  let radioLabels = gebi('editShortcut').getElementsByTagName('label');
  for (let label of radioLabels) {
    let labelImg = label.getElementsByTagName('img')[0];
    let radioButton = label.getElementsByTagName('input')[0];
    if(currentShortcut.getElementsByTagName("img")[0].src.endsWith(radioButton.value) && fileName) {
      radioButton.checked = true;
    }
    let currentPath = labelImg.src;
    labelImg.src = currentPath.replace("os/windows", "os/"+os);
  }

  gebi('editShortcutName').value = fileName;
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
  let icon = document.querySelector('input[name="editShortcutIcon"]:checked');
  if(icon) {
    icon = icon.value;
  } else {
    // If no icon is chosen from the dialog, choose icon based on filename.
    // If there is no ending, get the folderFull icon.
    icon = iconDecider(name, name.split(".").length === 1);
  }
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
  gebi('editNewShortcut').value = "true";
  let id = placeShortcut("", "", 3,4, "");
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
  // Set dbl click action if there is a defined one, else: Set default app
  if(action) {
    shortcutContainer.setAttribute("ondblclick", action);
  } else if(name) {
    // Start default action
    shortcutContainer.setAttribute("ondblclick", chooseDefaultProgram(name));
  }
  shortcutContainer.setAttribute("oncontextmenu", "gebi('editNewShortcut').value = 'false'; editShortcut('"+id+"'); return false;");

  let fileIcon = document.createElement("img");
  if(icon) {
    fileIcon.setAttribute("src", "os/"+os+"/systemIcons/"+icon);
  } else if(action.startsWith('addWindow')) {
    // if icon is not set but action, it might be a custom program
    let programName = action.match(/'([^']+)'/g).map(function(match) {
      return match.replace(/'/g, ''); // Remove single quotes
    })[2].split("/")[0];
    fileIcon.setAttribute("src", "programs/"+programName+"/icon.png");
  } else {
    fileIcon.setAttribute("src", "os/"+os+"/systemIcons/"+iconDecider(name, name.split(".").length === 1));
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
    "Document1", "File2", "Data", "Report", "Image", "Note", "Presentation", "Spreadsheet", "Picture", "Memo", "Text", "Project"
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
    y = randomBetween(4, 85);
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
  let generalOffsetX = -2;
  let generalOffsetY = 4;
  let currentOffsetX  = 0;
  let columns = 7;
  let rows = 13;
  for (shortcut of shortcutsFromDom) {
    currentOffsetX = shortcut.getBoundingClientRect()["width"];
    currentOffsetX = getPositionInPercentage("left", currentOffsetX);
    // Magic: get difference between imaginary rectangle (12% width) and the shortcut. 
    //   Divide by 2 and add this to the .stlye.left after clamping. I'm smart!
    currentOffsetX = (14-currentOffsetX)/2; //-3;
    let roundedLeft = Math.floor(parseInt(shortcut.style.left)/columns)*columns;
    let roundedRight = Math.floor(parseFloat(shortcut.style.top)/rows)*rows;
    shortcut.style.left = clamp(roundedLeft + generalOffsetX, generalOffsetX, 92)+currentOffsetX+"%"; 
    shortcut.style.top = clamp(roundedRight + generalOffsetY, generalOffsetY, 82)+"%";
  }
}

function tidyUpShortcuts() {
  let shortcutsFromDom = document.querySelectorAll("[data-setup-type='shortcut']");
  let generalOffsetX = -2;
  let generalOffsetY = 4;
  let xOffset = generalOffsetX;  // compensate optically space to left screen border
  let yOffset = generalOffsetY;
  let columns = 7;
  let rows = 13;

  let currentOffsetX  = 0;
  for (shortcut of shortcutsFromDom) {
    currentOffsetX = shortcut.getBoundingClientRect()["width"];
    currentOffsetX = getPositionInPercentage("left", currentOffsetX);
    // Magic: get difference between imaginary rectangle (12% width) and the shortcut. 
    //   Divide by 2 and add this to the .stlye.left after clamping. I'm smart!
    currentOffsetX = (14-currentOffsetX)/2;
    shortcut.style.left = xOffset + currentOffsetX + "%";
    shortcut.style.top = yOffset + "%";

    if(yOffset < 82) {
      // Switch to next row
      yOffset += rows;
    } else if(xOffset > 92) {
      // Start over top left
      yOffset = generalOffsetY;
      xOffset = generalOffsetX;
    } else  {
      // Switch to next column
      yOffset = generalOffsetY;
      xOffset += columns;
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

function chooseDefaultProgram(fileName) {
  let programToStart = "fileManager";
  let extension = fileName.split(".").length ? fileName.split(".")[1] : fileName;
  extension = extension?.length ? extension.toLowerCase() : extension;
  if(["jpg","jpeg","png","tiff","psd","pdf","mp4","avi","mpeg","mkv"].includes(extension)) {
    // Image file
    programToStart = "imageViewer";
  } else if(["doc","docx","txt","rtf"].includes(extension)) {
    // Text file
    programToStart = 'textEditor-random'
  } else if(["pyc","py"].includes(extension)) {
    // Program file
    programToStart = 'terminal'
  }
  // For shortcuts created by setup() from settings.json
  return "startDefaultProgram('"+programToStart+"');";
}

function setDialogDefaultProgram() {
  let programName = gebi('editShortcutName').value;
  // Fills textarea of Dialog with standard action
  let dialogActionTextarea = gebi('editShortcutAction');
  if(programName) {
    dialogActionTextarea.value = chooseDefaultProgram(programName);
  } else {
    showNote("No extension", "Please add a file extension to name<br><span class='small grey'>.jpg, .jpeg, .png, .tiff, .psd, .pdf, .mp4, .avi, .mpeg, .mkv, .doc, .docx, .txt, .rtf, .pyc, .py</span>", "info", 4500);
  }
}

function startDefaultProgram(program, parameters) {
  // If no variable is set, start random program
  let x;
  let y;
  if(!program) {
    let programs = [
      "fileManager",
      "browser",
      "ftp",
      "ftp-connect",
      "imageViewer",
      "textEditor-random",
      "terminal",
      "threejsEditor",
      "bash",
      "neptcode"
  ];
    program = programs[chooseRandomKey(programs)];
    cl("startDefaultProgram Random: " + program);
    x = randomBetween(0,50);
    y = randomBetween(3,50);
  } else {
    cl("startDefaultProgram: " + program);
    x = incrementWindowsPosition('x');
    y = incrementWindowsPosition('y');
  }

  switch(program) {
    case "fileManager":
      addWindow('File manager', 'folder', 'filemanager', x, y, 600,350, false);
      break;
    case "browser":
      addWindow('Browser', 'public', 'browser', x, y, 1200,650, false);
      break;
    case "ftp":
      addWindow('FTP Client', 'storm', 'ftp', x, y, 850,590, false);
      break;
    case "ftp-connect":
      addWindow('FTP Client - Connect', 'storm', 'ftp/connect.html', x, y, 666,480, false);
      break;
    case "imageViewer":
      // TODO: Default file list from where?
      parameters = parameters ? typeof(parameters) === "string" ? parameters : parameters.join("|") : "1.jpg|2.jpg|3.jpg|1.mp4|2.mp4|4.jpg|5.jpg|6.jpg|7.jpg|8.jpg|9.jpg|10.jpg";
      addWindow('Image viewer', 'image', 'imageviewer/index.html?files='+parameters, x, y, 666,450, false);
      break;
    case "textEditor":
        addWindow('Text editor', 'edit_note', 'texteditor/index.html', x, y, 666,450, false);
      break;
    case "textEditor-random":
        addWindow('Text editor', 'edit_note', 'texteditor/index.html?text=random', x, y, 666,450, false);
      break;
    case "threejsEditor":
        addWindow('Threejs - Editor', 'view_in_ar', 'threejs/editor', x, y, 666,450, false);
      break;
    case "threejsPlayer":
        addWindow('Threejs - Player', 'view_in_ar', 'threejs/player/index.html?file='+(parameters ? parameters : ''), x, y, 666,450, false);
      break;
    case "bash":
        addWindow('Bash Console', 'code', 'bash/index.html?script=script', x, y, 666,450, false);
      break;
    case "webcam":
        addWindow('Webcam', 'videocam', 'webcam', x, y, 666,450, false);
      break;
    case "colorMarker":
        addWindow('Program', 'grid_view', 'colorMarker', x, y, 666,450, false);
      break;
    case "neptcode":
        addWindow('Neptcode Notebook', 'code', `neptcode/index.html?scene=${parameters || "basic"}`, x, y, 888,850, false);
      break;neptcode
    case "terminal":
      // If no parameters set, start with random terminal content
      if(!parameters) parameters = randomBetween(0,6);
      switch(parameters) {
        case 0:  // sqlHack (start froms cratch)
          /* TODO: This should be a terminal with bash CLI inside */
          addWindow('Terminal - SQL', 'code', 'terminal/index.html?byRows=false&startChar=0&text=sqlHack&theme=dracula&speed=1&language=sql&autotype=false&humanTyper=true&cursor=true&truncateText=12000&bgColor=212121&fontColor=FFFFFF&paddingRange=10', x, y, 666,450, false);
          break;
        case 1:  // apt-get
          addWindow('Terminal - Update', 'code', 'terminal/index.html?byRows=true&startChar=0&text=apt-get&theme=an-old-hope&speed=2&language=python&autotype=true&humanTyper=false&cursor=true&truncateText=12000&bgColor=212121&fontColor=FFFFFF&paddingRange=10', x, y, 666,450, false);
          break;
        case 2:  // lorem_ipsum_binary
        addWindow('Terminal - BIN', 'code', 'terminal/index.html?byRows=false&startChar=0&text=lorem_ipsum_binary&theme=hybrid&speed=50&language=none&autotype=true&humanTyper=false&cursor=true&truncateText=12000&bgColor=0d0d0d&fontColor=339e91&paddingRange=10', x, y, 666,450, false);
          break;
        case 3:  // hexdump
          addWindow('Terminal - HEX', 'code', 'terminal/index.html?byRows=true&startChar=0&text=hexdump&theme=hybrid&speed=12&language=none&autotype=true&humanTyper=false&cursor=true&truncateText=12000&bgColor=0d0d0d&fontColor=339e91&paddingRange=10', x, y, 666,450, false);
          break;
        case 4:  // sqlHack
          addWindow('Terminal - SQL2', 'code', 'terminal/index.html?byRows=false&startChar=119&text=sqlHack&theme=dracula&speed=1&language=sql&autotype=false&humanTyper=true&cursor=true&truncateText=12000&bgColor=212121&fontColor=FFFFFF&paddingRange=10', x, y, 666,450, false);
          break;
        case 5:  // randall  python
          addWindow('Terminal - PYTHON', 'code', 'terminal/index.html?byRows=false&startChar=178&text=randall&theme=paraiso-dark&speed=1&language=python&autotype=false&humanTyper=true&cursor=true&truncateText=12000&bgColor=212121&fontColor=FFFFFF&paddingRange=10', x, y, 666,450, false);
          break;
        case 6:  // log
          addWindow('Terminal - LOG', 'code', 'terminal/index.html?byRows=true&startChar=0&text=log&theme=hybrid&speed=1&language=c&autotype=true&humanTyper=false&cursor=true&truncateText=12000&bgColor=212121&fontColor=FFFFFF&paddingRange=10', x, y, 666,450, false);
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
