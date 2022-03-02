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
      e.preventDefault()
      original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
      original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
      original_x = element.getBoundingClientRect().left;
      original_y = element.getBoundingClientRect().top;
      original_mouse_x = e.pageX;
      original_mouse_y = e.pageY;
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResize);
    })
    
    function resize(e) {
      /* console.log("do a resize"); */
      showClass('windowManagerOverlay');
      bringToFront(element.id);

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
          element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
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
          element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
        }
      }
      else {
        const width = original_width - (e.pageX - original_mouse_x)
        const height = original_height - (e.pageY - original_mouse_y)
        if (width > minimum_size) {
          element.style.width = width + 'px'
          element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
        }
        if (height > minimum_size) {
          element.style.height = height + 'px'
          element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
        }
      }
    }
    
    function stopResize() {
      /* console.log("stop resize"); */
      hideClass('windowManagerOverlay');
      window.removeEventListener('mousemove', resize)
    }
  }
}


/* DRAG & MOVE WINDOW */
// see https://stackoverflow.com/a/57438497

let offsetX;
let offsetY;

onDragStart = function(ev) {
  showClass('windowManagerOverlay');
  const rect = ev.target.getBoundingClientRect();
  currentDragId = ev.target.id;
  ev.target.style.opacity = '0.025';  // Hide original during dragging
  // Only bringToFront if window not shortcut on desktop
  if(!ev.target.classList.contains("shortcut")) {
    bringToFront(ev.target.id);
  }

  offsetX = ev.clientX - rect.x;
  offsetY = ev.clientY - rect.y;
};

dropHandler = function(ev) {
  ev.preventDefault();
  let droppedId = currentDragId;
  let id1 = gebi(droppedId);
  let id2 = gebi('desktop');

  const left = parseInt(document.defaultView.getComputedStyle(id2).left);
  const top = parseInt(document.defaultView.getComputedStyle(id2).top);

  id1.style.position = 'absolute';
  let testx = ev.clientX - left - offsetX + 'px'
  let testy = ev.clientY - top - offsetY + 'px'
  id1.style.left = getPositionInPercentage("left", testx)+ "%";
  id1.style.top = getPositionInPercentage("top", testy)+ "%";
  // id2.appendChild(gebi(droppedId));  // why was this here
  currentDragId = "";
  id1.style.opacity = '1';
  hideClass('windowManagerOverlay');
};

dragoverHandler = function(ev) {
  // console.log("dragover_handler");
  ev.preventDefault();
  ev.dataTransfer.dropEffect = "move";
};

let recentZIndex = 10;

function addWindow(windowName, icon, contentPath, x,y, w,h, hide, zIndex) {
  let id = "window-" + createUniqueId();
  recentZIndex++;
  // Create main div and resize edges
  // Main window
  let windowContainer = document.createElement("div");
  windowContainer.setAttribute("id", id);
  windowContainer.setAttribute("data-setup-type", "window");
  windowContainer.setAttribute("data-setup", "['"+[windowName, icon, contentPath].join("', '")+"']");
  windowContainer.setAttribute("data-setup-hide", hide);
  windowContainer.setAttribute("class", "window resizable shadow");
  if(hide) {
    windowContainer.classList.add("hide");
  }
  windowContainer.setAttribute("draggable", "true");
  windowContainer.setAttribute("ondragstart", "onDragStart(event)");

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

  // Content
  let content = document.createElement("iframe");
  content.setAttribute("class", "content");
  content.setAttribute("src", "programs/"+contentPath);
  windowContainer.appendChild(content);
    
  gebi('desktop').appendChild(windowContainer);

  // If os==win: add to taskbar
  if(os == "windows") {
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
  let el = gebi(id);
  if(el) {
    recentZIndex++;
    el.style.zIndex = recentZIndex;
    /* el.setAttribute("data-setup-zindex", recentZIndex); */
  }
}

function minimizeWindow(id) {
  console.log("minimizeWindow WTF: "+id);
  gebi(id).setAttribute("data-setup-hide", true);
  hide(id);
}

function getWindowFromTaskbar(id) {
  let hide = toggle(id);
  gebi(id).setAttribute("data-setup-hide", !hide);
  bringToFront(id);
  gebi(id).style.opacity = 1;  // To cover up the drag/drop bug
}

function maximizeWindow(id) {
  console.log("maximizeWindow: "+id);
  let windowContainer = gebi(id);
  windowContainer.style.left = "0px";
  windowContainer.style.top = "0px";
  windowContainer.style.width = "100%";
  windowContainer.style.height = "100%";
  bringToFront(id);

  let resetMaxButton = gebi("maximizeWindow-"+id);
  resetMaxButton.setAttribute("onclick", "resetWindowSize('"+id+"')");
}

function resetWindowSize(id) {
  let windowContainer = gebi(id);
  windowContainer.style.left = "50px";
  windowContainer.style.top = "50px";
  windowContainer.style.width = "600px";
  windowContainer.style.height = "350px";

  // reset reset:
  let resetMaxButton = gebi("maximizeWindow-"+id);
  resetMaxButton.setAttribute("onclick", "maximizeWindow('"+id+"')");
}

function closeWindow(id) {
  let el = gebi(id);
  el.remove();
  // If os==win: remove from taskbar
  if(os=="windows") {
    gebi("minimized-"+id).remove();
  }
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

  gebi('editShortcutName').value = currentShortcut.getElementsByClassName("filename")[0].innerHTML;
  gebi('editShortcutAction').value = currentShortcut.getAttribute('ondblclick') ? currentShortcut.getAttribute('ondblclick') : "";
}

// Saves edits on shortcuts
function saveShortcut(id) {
  hide("editShortcut");
  let currentShortcut = gebi(id);
  let name = gebi('editShortcutName').value;
  currentShortcut.getElementsByClassName("filename")[0].innerHTML = name;
  let action = gebi('editShortcutAction').value;
  console.log(action);
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
  let randomIcon = [
    "folderFull.png", "folderFull.png", "folderFull.png", "folderFull.png", "folderFull.png", "folderEmpty.png", "folderEmpty.png", "fileMovie.png", "fileImage.png", "fileImage.png", "fileImage.png", "fileImage.png", "fileImage.png", "file.png", "file.png", "file.png", "file.png", "file.png" ]
  let randomNameParts = [
    "File", "file", "Document", "Home", "Personal", "var", "VAR", "Favorites", "A-433", "Photos", "Links", "Important",
  ]
  let randomNameSuffix = [
    "", "", "", "", "", "", "", ".avi", ".png", ".jpg", ".jpg", ".JPG", ".jpeg", "", "", "", "", ""
  ]

  let rand;
  let x;
  let y;
  let name;

  for (i = 1; i <= count; i++) {
    /* console.log(i); */
    x = randomBetween(0, 93);
    y = randomBetween(0, 80);
    rand = chooseRandomKey(randomIcon);
    /* console.log(rand, x, y, randomIcon[rand]); */
    name = randomNameParts[chooseRandomKey(randomNameParts)];
    name += randomBetween(0, 100) > 85 ? " " + createUniqueId() : "";
    name += randomBetween(0, 100) > 75 ? " Copy" : "";
    name += randomNameSuffix[rand];
    //console.log(name);
    placeShortcut(name, randomIcon[rand], x,y, "");
  }
}
