<<<<<<< HEAD
=======
let scene;

>>>>>>> halifax
async function setup() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let os = urlParams.get("os");
  let workstation = urlParams.get("workstation");
  let darkMode = urlParams.get("darkMode");
<<<<<<< HEAD
  let scene = urlParams.get("scene");
=======
  scene = urlParams.get("scene");
>>>>>>> halifax
  let type = urlParams.get("type");

  let tabulatorFont =  urlParams.get("font");
  let fontSize =  urlParams.get("fontSize");
  let bgColor =  urlParams.get("bgColor");
  let borderColor =  urlParams.get("borderColor");
  let fontColor =  urlParams.get("fontColor");
  let zoom =  urlParams.get("zoom");
  let hideRulers =  urlParams.get("hideRulers") === "true";
  let hideTextBtns =  urlParams.get("hideTextBtns") === "true";

  gebi('body').classList.add(os);
  gebi('body').classList.add(type);
  // if(type) gebi('content').src = `${type}.html?scene=${scene}&os=${os}`

  // Set generic system fonts
  setSystemFont(os);

  switch (os) {
    case "windows95":
        addStylesheet("windows95.css", false);
        addStylesheet("../../os/windows95/inputs.css", false);
    break;
  }

  initializeTable(); // Start with default 12 columns and 46 rows
  handleColumnResizing();
  handleRowResizing();

  if(scene) await loadCsv(`data/${scene}.csv`);

  if(tabulatorFont){
     setTabulatorFont(tabulatorFont);
  }
  if(fontSize) {
    setFontSize(parseInt(fontSize));
  }
  if(bgColor) {
    setBgColor("#"+bgColor);
    gebi('bgColorInput').value="#"+bgColor;
  }
  if(borderColor) {
    setBorderColor("#"+borderColor);
    gebi('borderColorInput').value="#"+borderColor;
  }
  if(fontColor) {
    setFontColor("#"+fontColor);
    gebi('fontColorInput').value="#"+fontColor;
  }
  if(zoom) {
    zoomTable(parseInt(zoom));
  }
  
  toggleRulers(hideRulers);

  if(hideTextBtns) swapClasses('fontSettings', 'hide', 'flex')
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
