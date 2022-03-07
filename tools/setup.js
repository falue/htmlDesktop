// let settings;
let os;
let workstation;
let systemColor = "#000000";
let darkMode;
let username;
let password;
let systemMessages;
let selectedSystemMessage;

async function setup() {
  // Get Workstation parameter
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  workstation = urlParams.get('workstation');
  let data;

  if(urlParams.get('loadSaveFile')) {
    // User wants to load a file via URL parameters
    data = loadSaveFile(urlParams.get('loadSaveFile'));
    if(!data) return;  // If file path is wrong (dialog from loadSaveFile())
    workstation = data.settings.workstation;
  } else if(workstation) {
    // Use default, git-synchronized settings 
    data = await parseFile("workstations/" + workstation + "/settings.json");
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
    systemMessages = data.systemMessages;
    /* selectedSystemMessage = data.selectedSystemMessage; */
  }

  // Fill the workstation chooser overlay
  await setupWorkstationChooser("tools/generalSettings.txt");
  
  if(!workstation) { 
    // Missing workstation in url
    show('overlayWorkstation');
    cl("No workstation defined in URL. Abort setup() but show workstation chooser.")
    return;
  }

  // Overwrite OS if defined directly in URL and different from settings.json
  if(urlParams.get('os') && urlParams.get('os') !== os) {
    os = urlParams.get('os');
    cl("os overwritten by URL is: " + os);
  }

  // Add OS specific styles
  addStylesheet("os/"+os+"/stylesheet.css");
  //  cl("Final workstation: " + workstation + ", OS: " + os);

  // Workstation is chosen, read workstation settings
  // Setup settings
  setupSettings(settings);
  // cl("SETUP: setupSettings success ");

  // Loop over shortcuts
  for (let shortcut of shortcuts) {
    placeShortcut(shortcut["name"], shortcut["icon"], shortcut["x"],shortcut["y"], shortcut["action"]);
  }
  // cl("SETUP: placeShortcut success, "+shortcuts.length+" shortcuts placed.");

  // Loop over windows
  setupWindows(windows);
  // cl("SETUP: windows success, "+windows.length+" windows placed.");
  
  // Loop over windows
  setupSystemIcons(systemIcons);
  // cl("SETUP: systemIcons success, "+systemIcons.length+" icons displayed.");

  // Loop over systemMessages
  setupSystemMessages(systemMessages);

  // Create generic Shortcuts if none are defined
  if(!shortcuts.length) {
    cl("create some default shortcuts if none are defined");
    placeShortcut("Computer", "hdd.png", 1,0, "");
    placeShortcut("DVD", "dvd.png", 93,67, "");
    placeShortcut("Files", "folderFull.png", 2,15, "addWindow('File manager dblClick', 'folder', 'filemanager/index.html?workstation="+workstation+"&os="+os+"&folderContent=folders.json', 5,5, 600,350, false)");
    placeShortcut("Trash", "trashFull.png", 93,80, "");
  }

  // cl("SETUP: Finished!");
  return;
}

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
          let link = "index.html?workstation="+workstationDisplay+"&os=";
          link += osDisplay;
          a.href = link;
          let button = document.createElement("button");
          osDisplay = osDisplay ? ", " + osDisplay.toUpperCase() : "";
          button.innerHTML = " " + workstationDisplay[0].toUpperCase() + workstationDisplay.slice(1) + osDisplay;
          let i = document.createElement("i");
          i.classList.add("material-icons", "valign");
          i.innerHTML = "computer";
          button.classList.add("systemButton");
          button.prepend(i);
          a.prepend(button);
          workstationList.appendChild(a);
          workstationList.appendChild(document.createElement("br"));
        break;
      }
    });
}

async function setupSettings(settings) {
  // set settings like dark mode etc
  for(setting in settings) {
    /* cl(setting); */
    let value = settings[setting];

    switch (setting) {
      case "systemColor":
        if (value) {
          /* console.log("Hex SystemColor: ", value); */
          systemColor = value;
          setSystemColors(value);
          gebi('systemColorPicker').value = value;
        }
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
        }
      break;
      case "password":
        if (value) {
          password = value;
          /* console.log("the password is " + value); */
          gebi("passwordCheck").value = value;
          gebi("passwordHint").innerHTML = value;
          show('logoutAction');
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
      case "systemMessagesDelay":
        setDelayUi(value);
      break;
      case "selectedSystemMessage":
        selectedSystemMessage = value;
      break;
      default:
        cl("Unknown setting: "+setting);
      break

    }
  };
}

function setupWindows(windows) {
    // Loop over windows
  let listOfWindows = gebi('currentWindowActions');
  if(Object.keys(windows).length) listOfWindows.innerHTML = "";

  /* for (let window of windows.windows) { */
  for (let window of windows) {
    addWindow(window["windowName"], window["icon"], window["contentPath"], window["x"], window["y"], window["w"], window["h"], window["hide"], window["zIndex"] ? window["zIndex"] : false);
    /* Add links to start menu */
    let listElement = document.createElement("li");
    let windowIcon = document.createElement("i");
    windowIcon.setAttribute("class", "material-icons small systemColors clearBg");
    windowIcon.appendChild(document.createTextNode(window["icon"]));
    listElement.appendChild(windowIcon);
    listElement.appendChild(document.createTextNode(" "+window["windowName"]));
    /* listElement.setAttribute("title", "Application: "+window["contentPath"]); */
    listElement.setAttribute("onclick", 'addWindow(\"'+window["windowName"]+'\", \"'+window["icon"]+'\", \"'+window["contentPath"]+'\", '+window["x"]+', '+window["y"]+', '+window["w"]+', '+window["h"]+', false)');
    listOfWindows.appendChild(listElement);
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


function setupSystemMessages(messages) {
  let selectionBox = gebi('systemMessagesSelect');
  for (let message in messages) {
    // Add to select box with index as value of option
    let option = document.createElement("option");
    option.value = message;
    option.innerHTML = messages[message][0];
    option.innerHTML += messages[message][3] !== true ? " (Timeout: "+(messages[message][3]/1000)+"s)" : "";

    // select the saved option
    if(message == selectedSystemMessage) option.selected = true;
    selectionBox.appendChild(option);
  }
}