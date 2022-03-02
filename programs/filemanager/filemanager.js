let os = "windows";
let workstation = "dude";
let rootFolders;
let rootName;

async function setupFileManager() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    os = urlParams.get('os');
    workstation = urlParams.get('workstation');
    
    let rootFolderPath = "../../os/" + os + "/folders.json";
    rootFolders = await parseFile(rootFolderPath);
    /* console.log(rootFolderPath); */
    /* console.log(os); */

    // Replace hardcoded root HDD icon 
    document.getElementById('rootIcon').src =  "../../os/"+os+"/systemIcons/hdd.png";
    
    let rootDisplayName;
    switch(os) {
        case "mac":
            rootName = "Macintosh HD"
            rootDisplayName = "Macintosh HD"
        break;
        case "windows":
            rootName = "C:"
            rootDisplayName = "This PC"
        break;
        case "linux":
            rootName = "Linux"
            rootDisplayName = "Linux"
        break;
    }

    document.getElementById('rootName').innerHTML = rootDisplayName;
    document.getElementById('fileManagerPath').innerHTML = rootName+"/";
    

    /* for (var key in rootFolders) { */
    for (let file of rootFolders) {
        //console.log(file[0], file);
        printFileOrFolder("root", file);
    }

    let folderContent;
    if(urlParams.get('folderContent')) {
        folderContent = urlParams.get('folderContent');
        folderContent = await parseFile("../../workstations/"+workstation+"/folders/"+folderContent);
        /* console.log(folderContent); */
    } else {
        folderContent = "";
    }

    updateFolderContent(folderContent);
}

function updateFolderContentFromRoot(partOfFolders, folderContentKey) {
    /* console.log("looking for.. " + folderContentKey); */
    partOfFolders = partOfFolders ? partOfFolders : rootFolders;

    for (let i = 0, len = partOfFolders.length; i < len; i++) {
        /* console.log(folderContentKey + " != " + Object.keys(partOfFolders[i])); */
        if (folderContentKey in partOfFolders[i]) {
        /* if (Object.keys(partOfFolders[i]) == folderContentKey) { */
            /* console.log("match !"); */
            document.getElementById('fileManagerPath').innerHTML = rootName + "/" + folderContentKey;
            /* let newFolders = partOfFolders[i][Object.keys(partOfFolders[i])]; */
            let newFolders = partOfFolders[i][folderContentKey];
            updateFolderContent(newFolders);
            return;
        }
        // Iterate subfolders
        if(!partOfFolders[i][0]) {
            updateFolderContentFromRoot(partOfFolders[i][Object.keys(partOfFolders[i])], folderContentKey);
        }
    }
    return;
}

function updateFolderContent(folderContent) {
    // Clear area
    let container = document.getElementById('folderContent');
    container.innerHTML = "";

    /* document.getElementById('fileManagerPath').innerHTML = rootName+"/"+folderContent[0]; */

    for (let file of folderContent) {
        // TODO List view with file[1] etc
        /* let fileInfo = file[0] +" ("+file[1]+") ("+file[2]+") ("+file[3]+")"; */
        let isFolder = false;
        if(!file[0]) {
            file[0] = Object.keys(file)[0];
            isFolder = true;
        }
        /* document.getElementById('folderContent').innerHTML += "<br>"; */
        let fileTile = document.createElement("div");
        let fileName = document.createElement("div");

        let fileIcon = document.createElement("img");
        fileIcon.setAttribute("alt", "");
        fileIcon.setAttribute("src", iconDecider(file[0], isFolder));
        fileTile.appendChild(fileIcon);

        fileName.appendChild(document.createTextNode(file[0]));
        fileTile.setAttribute("class", "fileTile");
        fileTile.appendChild(fileName);
        container.appendChild(fileTile);
    }
}

function printFileOrFolder(root, content) {
    let folderName = Object.keys(content)[0];
    let fileOrFolder = content[0] ? content[0] : folderName;
    let id = makeValidId(root+"/"+fileOrFolder);

    let container = document.getElementById('treeView');
    let listElement = document.createElement("li");
    let fileIcon = document.createElement("img");
    listElement.setAttribute("id", id);
    fileIcon.setAttribute("alt", "");

    // Hide subfolders initially, inset
    let folderLevel = (root.match(/\//g)||[]).length;
    if(folderLevel > 0) {
        listElement.classList.add("subfolderLevel"+folderLevel);
        listElement.classList.add("hide");
    }

    // Add all steps of the folder structure as classes to the list
    // to open and close everything fomr higher-upper folders...
    let className = "";
    let folderJunks = root.split("/");
    for (i = folderJunks.length-1; i >= 0; i--) {
        className = makeValidId(folderJunks.join("/"));
        folderJunks.pop();
        listElement.classList.add(className);
    }

    let fileName = document.createElement("span");

    if(typeof(content[folderName]) === "object") {
        /* console.log(id) */
        // Its a folder - make clickable and display
        fileIcon.setAttribute("src", iconDecider(folderName, content[folderName].length));
        if(content[folderName].length) {
            listElement.setAttribute("onclick", "toggleClass('"+id+"'); updateFolderContentFromRoot('', '"+folderName+"');");
            /* console.log(JSON.stringify(content[folderName])); */
        }
        fileName.appendChild(document.createTextNode(folderName));
        listElement.appendChild(fileIcon);
        listElement.appendChild(fileName);
        container.appendChild(listElement);
        // Go deeper into the void
        for (let file of content[folderName]) {
            printFileOrFolder(root+"/"+folderName, file);
        }
    } else {
        // Its a file - display
        fileIcon.setAttribute("src", iconDecider(fileOrFolder, false));
        fileName.appendChild(document.createTextNode(fileOrFolder));
        listElement.appendChild(fileIcon);
        listElement.appendChild(fileName);
        container.appendChild(listElement);
    }
}

function makeValidId(value) {
    return value.replace(/ /g, "-").replace(/\//g, "-").replace(/\./g, "-");
}

function iconDecider(filename, folder) {
    let path = "../../os/" + os + "/systemIcons/";
    if(folder === 0) return path + "folderEmpty.png";
    if(folder > 0) return path + "folderFull.png";

    let fileEnding = (filename.split(".")[1] + "").toLowerCase();  // yes this ignores a dot in bewtween filenames
    /* console.log(fileEnding); */

    switch (fileEnding) {
        case "jpg": path += "fileImage.png"; break;
        case "jpeg": path += "fileImage.png"; break;
        case "png": path += "fileImage.png"; break;
        case "tiff": path += "fileImage.png"; break;
        case "psd": path += "fileImage.png"; break;
        case "mov": path += "fileMovie.png"; break;
        case "mp4": path += "fileMovie.png"; break;
        case "avi": path += "fileMovie.png"; break;
        case "mpeg": path += "fileMovie.png"; break;
        case "mkv": path += "fileMovie.png"; break;
        case "hdd": path += "hdd.png"; break;
        case "ssd": path += "hdd.png"; break;
        case "trash": path += "trashFull.png"; break;
        default: path += "file.png"
    }

    return path;
} 