async function setup() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let os = urlParams.get("os");
  let workstation = urlParams.get("workstation");
  let darkMode = urlParams.get("darkMode");
  let scene = urlParams.get("scene");
  let type = urlParams.get("type");

  gebi('body').classList.add(os);
  gebi('body').classList.add(type);
  // if(type) gebi('content').src = `${type}.html?scene=${scene}&os=${os}`

  // Set generic system fonts
  setSystemFont(os);

  switch (os) {
    case "windows95":
        addStylesheet("windows95.css");
        addStylesheet("../../os/windows95/scrollbars.css", false);
    break;
  }

  initializeTable(); // Start with default 12 columns and 46 rows
  handleColumnResizing();
  handleRowResizing();

  if(scene) loadCsv(`data/${scene}.csv`);
}


function setupSpreadhseet() {
    cl('setupSpreadhseet..')
}

function addStylesheet(path, replace = true) {
  let currentStylesheet = gebi("osStylesheet");
  if (currentStylesheet && replace) currentStylesheet.remove();
  let head = document.head;
  let link = document.createElement("link");
  link.id = "osStylesheet"+(replace ? '' : '-'+createUniqueId(4));
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = path;
  head.appendChild(link);
}
