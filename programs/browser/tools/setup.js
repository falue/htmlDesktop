let spoofUrls = new Array();
let unikVersion = "1.2-d";

async function setup() {
  // Set unik version
  document.getElementById('unikVersion').innerHTML = "v" + unikVersion;

  // Get Envirenment parameter
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const workstation = urlParams.get('workstation');
  let path = "../../workstations/"+ workstation +"/";

  // If env is chosen, read env settings & URLs
  if(workstation) {
    // Get os parameter if set
    const os = urlParams.get('os');
    
    let data = await parseFile(path + "browser.json");

    // MABYE JOIN
    /* if(workstation !== "_generic") {
      let baseData = await parseFile(path + "../../workstations/_generic/browser.json");
      // TODO: remove douplicats???!
      data = [...data, ...baseData.urls.urls];
    } */

    // Setup settings
    setupSettings(data.settings);
    
    // Setup favorites
    setupFavorites(data.urls);
  } else {
    // If no parameter env is set, display character chooser
    console.log("no workstation in URL !!!")
  }

  // Force cache reload iframe
  reloadIframe();
}

async function setupSettings(settingsData) {
  // set settings like dark mode etc
  if(settingsData["darkMode"]) {
    toggleDarkMode();
    document.getElementById("darkmode").checked = true;
  }

  if(settingsData["hideFavorites"]) {
    toggle("favorites");
    document.getElementById("favoritesToggle").checked = true;
  }

  if(settingsData["hideAddons"]) {
    toggle("addons");
    document.getElementById("addonToggle").checked = true;
  }

  if(settingsData["hideHomeButton"]) {
    toggle("homeButton");
    document.getElementById("homeToggle").checked = true;
  }

  if(settingsData["hideReloadButton"]) {
    toggle("reloadButton");
    document.getElementById("reloadToggle").checked = true;
  }

  if(!settingsData["internetConnection"]) {
    document.getElementById("internetToggle").checked = true;
    hide("iframe");
    document.getElementById('noInternet').innerHTML = "404 Not found";
  }

  document.getElementById("loadToggle").checked = !settingsData["hideLoadingAnimation"];
  if(settingsData["hideLoadingAnimation"]) {
    hide("loaderType");
  } else {
    show("loaderType");
  }

  document.getElementById("loaderCircle").checked = settingsData["loaderType"] == "loaderCircle";
  document.getElementById("loaderLinear").checked = settingsData["loaderType"] == "loaderLinear";
}


async function setupFavorites(urls) {
  let favoritesElement = document.getElementById("favorites");
  // Read favorites
  let favorites = new Array();

  // Do the favorites
  for(url of urls) {
    let showInFavorites = url["showInFavorites"];
    let materialIcon = url["materialIcon"];
    let realUrl = url["realUrl"];
    let spoofUrl = url["spoofUrl"];
    let favoritesName = url["favoritesName"] ? url["favoritesName"] : spoofUrl;
    let metaName = url["metaName"] ? url["metaName"] : favoritesName;

    let onclick = url["onclick"];
    favorites.push([realUrl, spoofUrl, onclick]);

    // Create clickable link in favorites List (?)
    // Add linkfavorites to favorites bar
    if(showInFavorites) {
      let i = document.createElement("i");
      i.classList.add("material-icons", "small");
      i.innerHTML = materialIcon;
      let span = document.createElement("span");
      span.innerHTML = " " + favoritesName;
      // Do not add link if favorite is just for display
      if(realUrl != "./") {
        let action = onclick ? onclick : "";
        span.setAttribute("onclick", "goToUrl('"+realUrl+"', '"+spoofUrl+"'); "+action);
      }
      span.prepend(i);
      favoritesElement.appendChild(span);
    }

    // Add all links to "All working URLs" list
    // except its for show in favorites or mine ;)
    if(realUrl != "./" && realUrl != "sites/telefabi") {
      let urlsList = document.getElementById('savedURLS');
      let iUrlsList = document.createElement("i");
      iUrlsList.classList.add("material-icons", "small");
      iUrlsList.innerHTML = materialIcon;
      let spanUrlsList = document.createElement("span");
      spanUrlsList.innerHTML = " " + metaName;
      let action = onclick ? onclick : "";
      spanUrlsList.setAttribute("onclick", "goToUrl('"+realUrl+"', '"+spoofUrl+"'); "+action);
      spanUrlsList.prepend(iUrlsList);
      urlsList.appendChild(spanUrlsList);
    }

    // Setup spoof urls for entering manual in URL input
    spoofUrls.push([realUrl, spoofUrl, onclick]);
  }

  // Set home button to first favorite
  document.getElementById("homeButton").onclick = function () {
    goToUrl(favorites[0][0], favorites[0][1]);
    eval(favorites[0][2]);
  };

  // Set iframe.src and URL input to favorites[0]
  goToUrl(favorites[0][0], favorites[0][1]);
  if(typeof favorites[0][2] !== 'undefined') {
    eval(favorites[0][2]);
  }
}
