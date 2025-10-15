// let settings;
let os;
let workstation;
let systemColor = "#000000";
let darkMode;
let username;
let password;
let osNotifications;
let selectedSystemMessage;
let hotSwapped;
let rootHtmlFile = "index.html";
let dockAvailable = false;
let bootSpeed = 3;
let localStorageSettings;
let arrowAction = 'NOTHING';

async function setup() {
  // Get Workstation parameter
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  workstation = urlParams.get('workstation');
  let data;
  let host = window.location.origin + window.location.pathname;

  // get current file name without parameters
  rootHtmlFile = window.location.pathname.split("/").pop();
  if(rootHtmlFile.includes("?")) rootHtmlFile = rootHtmlFile.split("?")[0];
  /* cl("Current root file is " + rootHtmlFile); */
  
  // If on telefabi.ch in root, use htmlDesktop as website :)
  // here detect DESKTOP.html
  if(host === `https://www.telefabi.ch/${rootHtmlFile}` || host === `https://telefabi.ch/${rootHtmlFile}`) {
    // If mobile, redirect to "business card" website
    if (window.matchMedia("(max-width: 900px)").matches) {
      window.location.href = "../programs/browser/sites/telefabi/index.html";
      return;
    }
    for(saveButton of document.getElementsByClassName('saveButtonsTooltips')) {
      saveButton.setAttribute("data-title", "Save & export NOT AVAILABLE IN DEMO");
    }
  }

  if(urlParams.get('loadSaveFile')) {
    // User wants to load a file via URL parameters
    data = loadSaveFile(urlParams.get('loadSaveFile'));
    if(!data) return;  // If file path is wrong (dialog from loadSaveFile())
    workstation = data.settings.workstation;
  } else if(workstation) {
    // Use default, git-synchronized settings 
    data = await parseFile("workstations/" + workstation + "/settings.json");
  }

  // get some data from localstorage
  localStorageSettings = JSON.parse(localStorage.getItem('htmlDesktop-settings')) ||  {};
  
  let guiSize = localStorage.getItem('htmlDesktop-guiSize');
  if(guiSize) {
    setGuiSize(parseInt(guiSize), true);
  }

  let brightness = localStorage.getItem('htmlDesktop-brightness');
  if(brightness && gebi('actionMenu')) {
    setBrightness(brightness);
    gebi('brightnessIndicator').innerHTML = brightness;
    gebi('brightnessSlider').value = brightness;
  }

  if(localStorage.getItem('htmlDesktop-arrowAction')) {
    arrowAction = localStorage.getItem('htmlDesktop-arrowAction');
    gebi('leftRightArrowSelect').value = arrowAction;
  }

  // If loadSaveFile OR workstation defined in URL:
  // Load & define all the settings
  let settings;
  let windows;
  let shortcuts;
  let systemIcons;

  if(workstation) {
    settings = data.settings;
    os = settings.os;
    workstation = settings.workstation;
    systemColor = settings.systemColor;
    darkMode = settings.darkMode;
    username = settings.username;
    password = settings.password;
    windows = data.windows;
    shortcuts = data.shortcuts;
    systemIcons = data.systemIcons;
    actions = data.actions;
    osNotifications = data.osNotifications;
  }

  // Fill the workstation chooser overlay
  await setupWorkstationChooser("tools/general.settings");
  
  if(!workstation) { 
    // Missing workstation in url
    show('overlayWorkstation');
    cl("No workstation defined in URL. Abort setup() but show workstation chooser.")
    return;
  }

  // Overwrite OS if defined directly in URL and different from settings.json
  if(urlParams.get('os') && urlParams.get('os') !== os) {
    os = urlParams.get('os');
    /* cl("os overwritten by URL is: " + os); */
    // BUG: If OS was hotswapped without saving AND the os is the same as standard,
    //   the colors get overwritten by the setupSettings() function to the initial
    //   colors from workstation.
    setDefaultSystemColors(os);
  }

  // Overwrite OS if it was hotswapped
  if(urlParams.get('hotSwapOs')) {
    // Rewrite url because hard reload sucks
    if(urlParams.get('lastSavedFile')) {
      // Revert loadSaveFile to original name
      // here detect DESKTOP.html
      history.pushState({}, null, `${rootHtmlFile}?loadSaveFile=${urlParams.get('lastSavedFile')}`);
    } else {
      // No current save file, reset to basic url
      // here detect DESKTOP.html
      history.pushState({}, null, `${rootHtmlFile}?workstation=${workstation}&os=${os}`);
    }

    // Clear all windows, because they get re-set with new icons
    closeAllWindows();
    // Clear all shortcuts, because they get re-set with new icons
    removeAllShortcuts();
    // clear all osNotifications
    gebi('osNotificationsSelect').innerHTML="";
  }

  // Add OS specific styles
  addStylesheet("os/"+os+"/stylesheet.css");
  //  cl("Final workstation: " + workstation + ", OS: " + os);
  if(os === "windows95") {
    addStylesheet("../os/windows95/inputs.css", false);
  }

  // Define if dock is available for OS
  switch(os) {
    case "mac":
      dockAvailable = true;
      break;
    case "spa":
      dockAvailable = true;
      break;
    default:
      dockAvailable = false;
      break;
  }

  if(dockAvailable) {
    show('actionMenuDockLock');
  } else {
    hide('actionMenuDockLock');
  }

  let viewportMargins = localStorage.getItem('htmlDesktop-viewportMargins');
  // This is here because systemBar is set with those os-specific stylesheets
  if(viewportMargins) {
    viewportMargins = JSON.parse(viewportMargins);
    setViewportMargins(viewportMargins);
  }

  // Workstation is chosen, read workstation settings
  // Setup settings
  setupSettings(settings);
  // cl("SETUP: setupSettings success ");

  // Set gradient color of login screen if is in local storage (overwrite settings of workstation)
  let gradient = localStorage.getItem('htmlDesktop-loginGradient');
  if(gradient) {
    setLoginGradient(gradient, false);
  }

  // Get password from storage
  let passwordFromStorage = localStorage.getItem('htmlDesktop-password');
  if(passwordFromStorage) {
    password = passwordFromStorage;
    gebi("passwordHint").innerHTML = passwordFromStorage;
    gebi("passwordHint").classList.add("blue");
  }

  // Loop over shortcuts
  for (let shortcut of shortcuts) {
    placeShortcut(shortcut["name"], shortcut["icon"], shortcut["x"],shortcut["y"], shortcut["action"]);
  }
  // cl("SETUP: placeShortcut success, "+shortcuts.length+" shortcuts placed.");

  // Loop over windows
  setupWindows(windows);
  // cl("SETUP: windows success, "+windows.length+" windows placed.");

  // Hide overlay on frontMostWindow
  // Somehow, the list of windows is empty when called here. Therefore, wait 1s
  window.setTimeout(function() {
    hideFrontMostWindowOverlay();
  }, 1000);
  
  // Loop over windows
  setupSystemIcons(systemIcons);
  // cl("SETUP: systemIcons success, "+systemIcons.length+" icons displayed.");

  // Loop over actions
  setupActions(actions);

  // Loop over osNotifications
  setupSystemMessages(osNotifications);

  // If neither actions nor notifications are set, hide entry in actionmenu
  if(actions.length + osNotifications.length == 0) {
    hide('osNotificationSettingsContainer');
  }
    
  // Show name in actionMenu
  gebi('workstationHint').innerHTML = workstation;
  gebi('workstationHint2').innerHTML = workstation;

  // Create generic Shortcuts if none are defined
  if(!shortcuts.length) {
    cl("create some default shortcuts if none are defined");
    placeShortcut("Computer", "hdd.png", 1,0, "startDefaultProgram('fileManager')");
    placeShortcut("DVD", "dvd.png", 93,67, "startDefaultProgram('fileManager')");
    placeShortcut("Files", "folderFull.png", 2,15, "startDefaultProgram('fileManager')");
    placeShortcut("Trash", "trashFull.png", 93,80, "");
  }

  // cl("SETUP: Finished!");
  return;
}

function addStylesheet(path, replace=true) {
  let currentStylesheet = gebi('osStylesheet');
  if(currentStylesheet && replace) currentStylesheet.remove();
  let head = document.head;
  let link = document.createElement("link");
  link.id = "osStylesheet"
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = path;
  head.appendChild(link);
}

async function setupWorkstationChooser(path) {
    // set settings like dark mode etc
    let settingsData = await parseFile(path);
    settingsData.forEach(function (e) {
      // do stuff with
      let settings = e.split("=");
      let setting = settings[0];
      let value = settings[1];
      value = value === "true" ? true : value;
      value = value === "false" ? false : value;
  
      switch (setting) {
        case "workstation":
          // Setup all workstations in workstations list
          let values = value.split(";");
          let workstationDisplay = values[0];
          let osDisplay = values[1] ? values[1] : "nothing";
          let workstationList = gebi('workstationList');

          let a = document.createElement("a");
          let link = `${rootHtmlFile}?workstation=${workstationDisplay}&os=`;
          link += osDisplay;
          a.href = link;
          let button = document.createElement("button");
          button.setAttribute("title", osDisplay ? osDisplay.toUpperCase() : "");
          button.innerHTML = " " + workstationDisplay[0].toUpperCase() + workstationDisplay.slice(1);
          let i = document.createElement("i");
          i.classList.add("material-icons", "valign");
          let osIcon;
          switch(values[1]) {
            case "mac":
              osIcon = "apple";
              break;
            case "linux":
              osIcon = "dvr";
              break;
            case "spa":
              osIcon = "spa";
              break;
            case "windows":
              osIcon = "view_module";
              break;
            default:
              osIcon = "view_module";
              break;
          }
          i.innerHTML = osIcon;
          button.classList.add("systemButton", "nobr");
          button.append(i);
          a.prepend(button);
          workstationList.appendChild(a);
          workstationList.appendChild(document.createElement("br"));
         
        break;
      }
    });

    if(settingsData.length > 8) {
      let overlayWorkstation = gebi('overlayWorkstation');
        // overlayWorkstation.appendChild(document.createElement("br"));
        let more = document.createElement("span");
        more.innerHTML = "More..";
        more.classList.add("fixed", "bottom", "white", "small", "paddingY1", "op50", "pointer");
        more.style.right = "10%";
        more.id="moreWork"
        more.setAttribute("onclick", "scrollToBottom('workstationContainer'); hide('moreWork')");
        let down = document.createElement("i");
        down.classList.add("material-icons", "valign", "small");
        down.innerHTML = "expand_more";
        more.appendChild(down);
        overlayWorkstation.appendChild(more);
        // overlayWorkstation.appendChild(document.createElement("br"));
    }
}

async function setupSettings(settings) {
  // set settings like dark mode etc
  for(setting in settings) {
    /* cl(setting); */
    let value = settings[setting];

    switch (setting) {
      case "systemColor":
        if (value  && !hotSwapped) {
          /* console.log("Hex SystemColor: ", value); */
          systemColor = value;
          setSystemColors(value);
          gebi('systemColorPicker').value = value;
        }
      break;
      // test: loginGradient: "linear-gradient(146deg, rgb(247, 247, 247) 1%, rgb(190, 45, 171) 49%, rgb(150, 135, 161) 99%)"
      case "loginGradient":
        setLoginGradient(value, false);
      break;
      case "darkMode":
        if (value) {
          /* console.log("darkMode: DOES NOTHING", value); */
          /* this does nothing right now */
          darkMode = value;
        }
      break;
      case "username":
        if (value) {
          username = value;
          /* console.log("Username is " + value); */
          gebi('usernameStartMenu').innerHTML = value;
          gebi('userHint').innerHTML = value;
        }
      break;
      case "password":
        password = value;
        if (value) {
          gebi("passwordHint").innerHTML = value;
        } else {
          gebi("passwordHint").innerHTML = "<span class='italics'>none - type whatever</span>";
        }
      break;
      case "desktopImg":
        if (value) {
          // TODO: test relative/absolute path, what happens if default img is used?
          /* console.log("workstations/" + workstation + "/" +value);
          setDesktopImg("workstations/" + workstation + "/" +value); */
          /* console.log(value); */
          setDesktopImg(value);
        }
      break;
      case "desktopColor":
        if (value) {
          /* console.log("Hex desktopColor: ", value); */
          gebi('desktop').style.backgroundImage = 'none';
          gebi('desktop').style.backgroundColor = value;
          gebi('BGColor').value = value;
        }
      break;
      case "osNotificationsDelay":
        setDelayUi(value);
      break;
      case "selectedSystemMessage":
        selectedSystemMessage = value;
      break;
      case "bootSpeed":
        setBootSpeed(value);
      break;
      default:
        // Show error if setting is not parsed and should not be here:
        if(!["workstation", "os"].includes(setting)) cl("Unknown setting: "+setting);
      break

    }
  };
}

function setupWindows(windows) {
    // Loop over windows
  let listOfWindows = gebi('currentWindowActions');
  if(Object.keys(windows).length) listOfWindows.innerHTML = "";

  for (let window of windows) {
    /* Add links to start menu */
    let listElement = document.createElement("li");
    listElement.setAttribute("class", "ellipsis");
    let windowIcon = document.createElement("i");
    windowIcon.setAttribute("class", "material-icons small grey");
    windowIcon.appendChild(document.createTextNode(window["icon"]));
    listElement.title = window["contentPath"] + ' - ' + window["metaTitle"] || window["windowName"];
    listElement.appendChild(windowIcon);
    listElement.innerHTML+=" "+(window["metaTitle"] || window["windowName"]).replaceAll(/#(\d\w+)/gm, `<span class='green'>#$1</span>`);
    listElement.setAttribute("onclick", `addWindow('${window["windowName"]}', '${window["icon"]}', '${window["contentPath"]}', ${window["x"]}, ${window["y"]}, ${window["w"]}, ${window["h"]}, false); hide("actionMenu");`);
    listOfWindows.appendChild(listElement);

    // If app is "renderToDom" or "minimized", make addWindow(..)
    if(window["renderToDom"] || window["minimized"]) {
      addWindow(window["windowName"], window["icon"], window["contentPath"], window["x"], window["y"], window["w"], window["h"], window["minimized"], window["zIndex"] ? window["zIndex"] : false);
    }

    // Mark not-to-DOM-rendered windows for saving.
    // Add data to fetch later (this is normally done by addWIndow())
    listElement.setAttribute("data-setup-type", "windowInitialState");
    listElement.setAttribute("data-setup", "['"+[window["windowName"], window["icon"], window["contentPath"], window["x"], window["y"], window["w"], window["h"], window["zIndex"]].join("', '")+"']");
    listElement.setAttribute("data-setup-minimized", window["minimized"]);
    listElement.setAttribute("data-setup-render-to-dom", "false"); 
  }
  // Show fadeout and arrow indicator if necessary
  if(windows.length > 6) {
    gebi('currentWindowsSettings').classList.add('maxHeight175', 'overflowAutoY', 'fadeOutBottom', 'arrowIndicator');
  }
  if(windows.length > 5) {
    gebi('computerFunctionsList').classList.add('maxHeight175', 'overflowAutoY', 'fadeOutBottom', 'arrowIndicator');
  }
}


// systemIcons
function setupSystemIcons(systemIconsShown) {
  let time = "";
  systemIconsShown.forEach(function (currentSystemIconShow) {
    if(Object.keys(currentSystemIconShow)[0] === "clock"){
      time = currentSystemIconShow["clock"][0] + ":" + currentSystemIconShow["clock"][1];
    }
  });

  // Loop over all DOM systemIcons on site
     // so settings.json can be old, and new icons on the site.
     // Allows new icons to be hidden automatically, but are accessible.
  let systemIcons = document.querySelectorAll("[data-setup-system-icons]");

  for (systemIcon of systemIcons) {
    let currentIcon;
    if(systemIcon.id === "systemIcons-clock") {
      currentIcon = "clock";
    } else {
      currentIcon = systemIcon.innerHTML;
    } 

    let showIcon = systemIconsShown.includes(currentIcon) || (currentIcon === "clock" && !!time.length);
    /* cl(currentIcon + "  is shown: " + showIcon); */
    if(showIcon) {
      show('systemIcons-'+currentIcon);
      if(currentIcon === "clock") {
        /* cl(time); */
        gebi('editTaskbarIcon-'+currentIcon).value = time;
        gebi('editTaskbarIcon-'+currentIcon).classList.add('blueBg');
        gebi('systemIcons-clock').innerHTML = time;
      } else {
        gebi('editTaskbarIcon-'+currentIcon).checked = true;
      }
    } else {
      hide('systemIcons-'+currentIcon);
      if(currentIcon === "clock") {
        gebi('editTaskbarIcon-'+currentIcon).value = "";
      } else {
        gebi('editTaskbarIcon-'+currentIcon).checked = false;
      }
    }
  }
}

function setupActions(actions) {
  let selectionBox = gebi('osNotificationsSelect');
  // iterate over array with i++
    for (let i = 0; i < actions?.length; i++) {
      // Add to select box with index as value of option
      let option = document.createElement("option");
      option.value = actions[i][1];
      option.setAttribute("data-action", "true");
      option.innerHTML = `⚡ ${actions[i][0]}`;
      // select the saved option
      if(i === selectedSystemMessage) option.selected = true;
      selectionBox.appendChild(option);
  }
}

function setupSystemMessages(messages) {
  let selectionBox = gebi('osNotificationsSelect');
  /* for (let message in messages) { */
    // cycle through object with index

  for (let i = 0; i < messages?.length; i++) {
    // Add to select box with index as value of option
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = "🔔 ";
    option.innerHTML += messages[i].metaTitle.length ? messages[i].metaTitle : messages[i].title;
    option.innerHTML += messages[i].timeOut > 0 ? " (Timeout: "+(messages[i].timeOut/1000)+"s)" : "";

    // select the saved option
    if(i+actions?.length === selectedSystemMessage) option.selected = true;
    selectionBox.appendChild(option);
  }
}