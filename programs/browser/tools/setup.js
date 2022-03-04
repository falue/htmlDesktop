let spoofUrls = new Array();
let unikVersion = 1.1;

async function setup() {
  // Set unik version
  document.getElementById('unikVersion').innerHTML = "v" + unikVersion;

  // Get Envirenment parameter
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const env = urlParams.get('env');
  let path = "../../workstations/"+ env +"/browser";

  // If env is chosen, read env settings & URLs
  if(env) {
    // Get os parameter if set
    const os = urlParams.get('os');
    
    // Setup settings
    setupSettings(path);
    
    // Setup favorites
    setupFavorites(path);
  } else {
    // If no parameter env is set, display character chooser
    console.log("no env in URL !!!")
  }

  // Force cache reload iframe
  reloadIframe();

}

async function setupSettings(path) {
  // set settings like dark mode etc
  let settingsData = await parseFile(path + "/settings.txt");
  settingsData.forEach(function (e) {
    // do stuff with
    let settings = e.split("=");
    let setting = settings[0];
    let value = settings[1];
    value = value === "true" ? true : value;
    value = value === "false" ? false : value;

    switch (setting) {
      case "darkMode":
        if (value) {
          toggleDarkMode();
          document.getElementById("darkmode").checked = true;
        }
        break;

      case "hideFavorites":
        if (value) {
          toggle("favorites");
          document.getElementById("favoritesToggle").checked = true;
        }
        break;

      case "hideAddons":
        if (value) {
          toggle("addons");
          document.getElementById("addonToggle").checked = true;
        }
        break;

      case "hideHomeButton":
        if (value) {
          toggle("homeButton");
          document.getElementById("homeToggle").checked = true;
        }
        break;

      case "hideReloadButton":
        if (value) {
          toggle("reloadButton");
          document.getElementById("reloadToggle").checked = true;
        }
        break;

      case "hideLoadingAnimation":
        document.getElementById("loadToggle").checked = !value;
        if (value) {
          hide("loaderType");
        } else {
          show("loaderType");
        } 
        break;

      case "loaderType":
        if (value == "loaderCircle")
          document.getElementById("loaderCircle").checked = true;
        if (value == "loaderLinear")
          document.getElementById("loaderLinear").checked = true;
        break;

      case "internetConnection":
        if (!value) {
          document.getElementById("internetToggle").checked = true;
          hide("iframe");
        }
        break;

      case "browserColor":
        if (value != "default") {
          Array.from(document.getElementsByClassName("fake-browser-bar")).forEach(
            function(element, index, array) {
              element.style.backgroundColor = value;
              }
          );
        }
        break;

      case "browserFontColor":
        if (value != "default") {
          Array.from(document.getElementsByClassName("fake-browser-bar")).forEach(
            function(element, index, array) {
              element.style.color = value;
              }
          );
        }
        break;
    }
  });
}

async function setupFavorites(path) {
  let favoritesElement = document.getElementById("favorites");
  // Read favorites
  let favoritesData = await parseFile(path + "/urls.txt");
  let favorites = new Array();

  // Do the favorites
  favoritesData.forEach(function (e) {
    let favorite = e.split(", ");
    let showInFavorites = favorite[0] == "show";
    let material_icon = favorite[1];
    let realUrl = favorite[2];
    let spoofUrlWithFakeTitle = favorite[3].split('$');
    let spoofUrl = spoofUrlWithFakeTitle[0];
    let titleUrlUser = spoofUrlWithFakeTitle[1] ? spoofUrlWithFakeTitle[1] : spoofUrlWithFakeTitle[0];
    let optionalOnClick = favorite[4];

    favorites.push([realUrl, spoofUrl, optionalOnClick]);

    // Create clickable link
    let i = document.createElement("i");
    i.classList.add("material-icons", "small");
    i.innerHTML = material_icon;
    let span = document.createElement("span");
    span.innerHTML = " " + titleUrlUser;
    // Do not add link if favorite is just for display
    if(realUrl != "./") {
      span.onclick = function () {
        goToUrl(realUrl, spoofUrl);
        eval(optionalOnClick);
      };
    }
    span.prepend(i);

      // Add linkfavorites to favorites bar
    if(showInFavorites) {
      favoritesElement.appendChild(span);
    }

    // Add link to URLs list anyways
    // except its for show or mine ;)
    if(realUrl != "./" && realUrl != "https://telefabi.ch") {
      let urlsList = document.getElementById('savedURLS');
      let urlElement = span.cloneNode(true);
      urlElement.onclick = function () {  // somehow missing when cloning
        goToUrl(realUrl, spoofUrl);
        eval(optionalOnClick);
        hide("favoritesMenu");
      };
      urlsList.appendChild(urlElement);
    }

    // Setup spoof urls for entering manual in URL input
    spoofUrls.push([realUrl, spoofUrl, optionalOnClick]);
  });

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

async function parseFile(filepath) {
  let response = await fetch(filepath).then((response) => {
    // Always gets a response, unless there is network error
    // Catch error if file is not available:
    if(response.status != 200) {
      console.log(response.status);
      alert("Missing file:\n❌ " + filepath + "\nCreate it and try again.");
    }
    return response;
  }).catch((error) => {
    // Catch error i case server is not working
    console.log("Cannot load file: " + filepath);
    show("overlayServerError");
  });

  // Read response stream as text
  let textData = await response.text();

  // Ignore empty rows and rows start with with '#'
  let fileContent = textData
    .split("\n")
    .filter((n) => n)
    .filter((n) => !n.startsWith("#"));

  return fileContent;
}
