/* SAVING */
async function save(download) {
  let saveFileName = await showDialog("Save as", "Enter filename:", false, true);
  // Satanize input saveFileName
  saveFileName = saveFileName.replace(/[^a-zA-Z0-9\~]/g, "");

  if(saveFileName === "~EMPTY") {
    showDialog("Abort", "Aborted due to empty file name.");
    console.log("Abort due to empty input.");
  } else if(saveFileName) {
    saveFileName = "desktopSaveFile-"+Date.now()+"-"+saveFileName+"-"+createUniqueId(22);
    /* cl(saveFileName); */
    compileSaveFile(saveFileName, download);
  } else {
    console.log("Abort due to cancel click.");
  }
}

function compileSaveFile(saveFileName, download) {
  let dataWindows = saveAllWindows();
  let dataShortcuts = saveAllShortcuts();
  let systemIcons = saveAllSystemIcons();

  let data = {};
  data["settingsComment"] = "General settings of this workstation. OS and workstation-name MAY be defined in generalSettings.txt!";
  data["settings"] = {
    systemColor: systemColor,
    desktopColor: gebi("BGColor").value,
    // TODO no need for complete url.. maybe some problems down the road
    desktopImg: document
      .getElementById("desktop")
      .style.backgroundImage.slice(4, -1)
      .replace(/"/g, ""),
      // .split("/").pop(),  // TODO: TEST!!!!!!!!!!!!!! take only the filenmae of the path ??
    os: os,
    darkMode: darkMode,
    username: username,
    password: password,
    workstation: workstation
  };
  data["systemIconsComment"] = "Only display shown icons (and the defined time)";
  data["systemIcons"] = systemIcons;
  data["windowsComment"] = "Live, displayed or hidden windows. accessible programs like terminal, browser or filemanager with a specific folder open";
  data["windows"] = dataWindows;
  data["shortcutsComment"] = "define desktop icons with dbl click action: 1: 'test.exe', 'folderFull.png', 250,650, ['action', 'path oder so'] ";
  data["shortcuts"] = dataShortcuts;

  /* console.log(data); */

  /* let path = "workstations/"+workstation+"/saves/save.json" */

  if(download) {
    downloadStringAsFile(JSON.stringify(data), saveFileName);
  } else {
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem(saveFileName, JSON.stringify(data));
      showNote("Saved", "All your windows & settings are now saved.<br>No manually entered window contents though.", "save", 3500);
      // Rewrite URL to allow later cmd + r by user
      history.pushState({}, null, "index.html?loadSaveFile="+saveFileName);
    } else {
      // Sorry! No Web Storage support..
      showDialog("No Local Storage", "This browser does not support localStorage. Try downloading the file.");
    }
  }
}

/* DOWNLOAD */
function downloadSaveFileFromStorage(data, name) {
  downloadStringAsFile(localStorage.getItem(data), name);
}

function downloadStringAsFile(data, name) {
  name = name ? name : "export";
  let a = document.createElement("a");
    a.href = window.URL.createObjectURL(
      new Blob([data], { type: "text/plain" })
    );
    a.download = name + ".json";
    a.click();
}

/* UPLOAD */
// https://simon-schraeder.de/posts/filereader-async/
async function uploadLocalSaveFile(files) {
  let file = files[0];
  if (file) {
    let arrayBuffer = await readLocalFileAsync(file);
    let data = arrayBufferToString(arrayBuffer)
    // Create filname from current file - is an exported file?
    let customNameFromFile = file["name"].startsWith("desktopSaveFile-") ? file["name"].split("-")[2] : file["name"]+"asdadasdasd";
    // Make valid filename
    customNameFromFile = customNameFromFile.split(".")[0].replace(/[^a-zA-Z0-9\~]/g, "");
    // Add date and UID
    /* let saveFileName = "desktopSaveFile-" + file["lastModified"] + "-"+ customNameFromFile + "-" + createUniqueId(22)+".json"; */
    let saveFileName = "desktopSaveFile-"+Date.now()+"-"+ customNameFromFile+"-" + createUniqueId(22)+".json";
    // Save to localStorage
    localStorage.setItem(saveFileName, data);
    // Reload page
    window.location.href = 'index.html?loadSaveFile='+saveFileName;
  }
}

function readLocalFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  })
}

function arrayBufferToString(arrayBuffer, decoderType='utf-8') {
  let decoder = new TextDecoder(decoderType);
  return decoder.decode(arrayBuffer);
}

/* SAVE FILE MANIPULATION */
function loadSaveFile(saveFile) {
  let data = JSON.parse(localStorage.getItem(saveFile));
  if(data) {
    /* cl(data); */
    return data;
  } else {
    cl("There is no localStorage data stored under "+saveFile+". Check your URL.");
    showDialog("Wrong file name", "There is no localStorage data stored under this filename:<code>"+saveFile+"</code>Check your URL.");
    return false;
  }
}

function clearLocalStorage() {
  localStorage.clear();
}

function clearLocalStorageItem(key) {
  if(key) localStorage.removeItem(key);
  checkSaveFiles();
}

async function renameLocalStorageItem(currentName, key) {
  /* Autodialog get new name */
  let newSaveFileName = await showDialog("Save "+ currentName +" as", "Enter new filename:", false, true);
  
  newSaveFileName = newSaveFileName.replace(/[^a-zA-Z0-9\~]/g, "");

  if(newSaveFileName === "~EMPTY") {
    showDialog("Abort", "Aborted due to empty file name.");
    console.log("Abort due to empty input.");
  } else if(newSaveFileName) {
    newSaveFileName = "desktopSaveFile-"+Date.now()+"-"+newSaveFileName+"-"+createUniqueId(22);
    cl(newSaveFileName);
    // Copy to new save
    localStorage.setItem(newSaveFileName, localStorage.getItem(key));
    // Remove old save
    clearLocalStorageItem(key);
    // Display new facts
    checkSaveFiles();
  } else {
    console.log("Abort due to cancel click.");
  }
}

function checkSaveFiles() {
  let data = [],
      entry,
      key,
      keys = Object.keys(localStorage),
      i = keys.length;

  while(i--) {
    entry = localStorage.getItem(keys[i])
    key = localStorage.key(i);
    if(key.startsWith("desktopSaveFile-")) data.push({[key]: JSON.parse(entry)});
  }

  let safedFilesList = gebi("safedFilesList");

  if(Object.keys(data).length) {
    safedFilesList.innerHTML = "";
    data.sort(dynamicSort("~firstKey"));
    
    for (saveFile of data) {
      let safeFileKey = Object.keys(saveFile)[0];
      let safeFileName = safeFileKey.split("-")[2];
      safeFileName = safeFileName ? safeFileName : "No name";
      let safeFileDate = safeFileKey.split("-")[1];
      safeFileDate = new Date(parseInt(safeFileDate)).toLocaleString("de-CH");
      /* Create li element */
      let listElement = document.createElement("li");
      listElement.innerHTML = safeFileName + " <span class='grey'>" + saveFile[safeFileKey]["settings"]["workstation"] + "</span>";
      listElement.setAttribute("onclick", "window.location.href='index.html?loadSaveFile="+safeFileKey+"';");
      listElement.setAttribute("class", "relative pointer");
      listElement.setAttribute("title", "Load this save file");
      
      // Add workstation and infos
      let countWindows = Object.keys(saveFile[safeFileKey]["windows"]).length;
      let infoText = [
        safeFileDate,
        saveFile[safeFileKey]["settings"]["username"],
        countWindows + (countWindows === 1 ? " window" : " windows")
      ];
      let info = document.createElement("div");
      info.setAttribute("class", "grey small");
      info.appendChild(document.createTextNode(infoText.join(", ")));
      listElement.appendChild(info);

      
      /* Add file rename button */
      let renameButton = document.createElement("i");
      renameButton.setAttribute("class", "renameButton material-icons small white blueBg circle right top");
      renameButton.setAttribute("title", "Rename this save file");
      renameButton.setAttribute("onclick", "event.stopPropagation(); renameLocalStorageItem('"+safeFileName+"', '"+safeFileKey+"');");
      renameButton.innerHTML="drive_file_rename_outline";

      /* Add delete button */
      let deleteButton = document.createElement("i");
      deleteButton.setAttribute("class", "deleteButton material-icons small white redBg circle right top");
      deleteButton.setAttribute("title", "Remove this save file");
      deleteButton.setAttribute("onclick", "event.stopPropagation(); clearLocalStorageItem('"+safeFileKey+"');");
      deleteButton.innerHTML="delete";

      /* Add download button */
      let downloadButton = document.createElement("i");
      downloadButton.setAttribute("class", "material-icons small white blueBg circle right top");
      downloadButton.setAttribute("title", "Download this save file");
      downloadButton.setAttribute("onclick", "event.stopPropagation(); downloadSaveFileFromStorage('"+safeFileKey+"', '"+safeFileKey+"');");
      downloadButton.innerHTML="file_download";

      /* Cobble the things together */
      listElement.appendChild(renameButton);
      listElement.appendChild(deleteButton);
      listElement.appendChild(downloadButton);
      safedFilesList.appendChild(listElement);
    }
  } else {
    safedFilesList.innerHTML = "There is no data locally stored.";
    cl("There is no data locally stored.");
  }
}

/* SAVING */
function saveAllWindows() {
  let windowsFromDom = document.querySelectorAll("[data-setup-type='window']");
  let windows = [];
  for (windowData of windowsFromDom) {
    let data = JSON.parse(windowData.dataset.setup.replace(/\'/g, '"'));
    windows.push({
      windowName: data[0],
      icon: data[1],
      contentPath: data[2],
      x: parseInt(windowData.style.left),
      y: parseInt(windowData.style.top),
      w: parseInt(windowData.style.width),
      h: parseInt(windowData.style.height),
      hide: windowData.dataset.setupHide == "true",
      zIndex: parseInt(windowData.style.zIndex),
    });
  }
  return windows;
}

function saveAllShortcuts() {
  let shortcutsFromDom = document.querySelectorAll("[data-setup-type='shortcut']");
  let shortcuts = [];
  for (shortcut of shortcutsFromDom) {
    shortcuts.push({
      name: shortcut.dataset.setupName,
      icon: shortcut.dataset.setupIcon,
      x: getPositionInPercentage("left", shortcut.style.left),
      y: getPositionInPercentage("top", shortcut.style.top),
      action: shortcut.dataset.setupAction ? shortcut.dataset.setupAction : "",
    });
  }
  return shortcuts;
}

function saveAllSystemIcons() {
  let iconsFromDom = document.querySelectorAll("[data-setup-system-icons]:not(.hide)"); // ..]
  let systemIcons = [];
  for (icon of iconsFromDom) {
    if (icon.style.display != "none") {
      /* console.log("is shown: ", icon.innerHTML); */
      systemIcons.push(icon.innerHTML);
    }
  }
  // Sepcial case for the system clock
  let clock = gebi("systemIcons-clock");
  if (clock.style.display == "block") {
    /* console.log("is shown: clock ", clock.innerHTML.split(":")); */
    systemIcons.push({ clock: clock.innerHTML.split(":") });
  }
  return systemIcons;
}
