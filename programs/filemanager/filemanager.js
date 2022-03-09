let os = "windows";
let workstation = "_generic";
let selectedFolder;
let rootNameDisplay;


async function setupFileManager() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    os = urlParams.get('os');
    workstation = urlParams.get('workstation');
    
    let rootFolderPath = "../../workstations/" + workstation + "/folders.json";
    rootFolders = await parseFile(rootFolderPath);
    
    let computerName;
    // Only for display on top of treeview and in the path-input
    switch(os) {
        case "mac":
            rootNameDisplay = "Macintosh HD"
            computerName = "Macintosh HD"
        break;
        case "windows":
            rootNameDisplay = "C:"
            computerName = "This PC"
        break;
        case "linux":
            rootNameDisplay = "Linux"
            computerName = "Linux"
        break;
    }

    let rootName = "Root";

    // Opened folder
    if(urlParams.get('folderContent')) {
        // Folder was specified in URL
        selectedFolder = [rootName, urlParams.get('folderContent')].join("/");
    } else {
        // Open root folder if nothing specified in URL
        updateFolderContent(rootName, rootFolders[0]["Root"]);
    }
    
    // Cycle through all files to be displayed in treeview
    let list = document.getElementById('treeView');
    for (let file of rootFolders) {
        addFileToTree(list, file, rootName, computerName);
    }

    // Change hardcodedFolders imgs in "Favorites" & "Drives" list to current systemIcons
    let hardcodedIcons = document.querySelectorAll('.hardcodedFolders img');
    hardcodedIcons.forEach(e => {
        e.src = e.src.replace("/windows/", "/"+os+"/");
    });
}

// Display all files and folders in treeview
function addFileToTree(element, content, rootName, computerName) {
    let isFile = typeof(content[0]) === "string";
    let id = "filesystem-"+createUniqueId(16);
    let folderName = Object.keys(content)[0];
    let li = document.createElement("li");
    li.id = id;

    if(isFile) {
        // Add file to UL
        /* cl("FILE: " + content); */
        let span = document.createElement("span");
        span.setAttribute("class", "tree_label");
        // Create icon
        let icon = document.createElement("img");
        icon.setAttribute("id", "icon-"+id);
        icon.setAttribute("src", "../../os/"+os+"/systemIcons"+iconDecider(content[0], false));
        icon.setAttribute("alt", "");
        
        // Add file to list
        span.appendChild(icon);
        span.appendChild(document.createTextNode(content[0]));
        li.appendChild(span);
        element.appendChild(li);

    } else {
        // Add folder to UL
        /* cl("FOLDER: " + folderName + " ("+content[folderName].length+")"); */
        let icon = document.createElement("img");
        icon.setAttribute("id", "icon-"+id);
        icon.setAttribute("src", "../../os/"+os+"/systemIcons"+iconDecider(folderName, content[folderName].length));
        icon.setAttribute("alt", "");
        li.appendChild(icon);
        let checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", "checkbox-"+id);
        li.appendChild(checkbox);
        let label = document.createElement("label");
        label.setAttribute("for", "checkbox-"+id);
        label.setAttribute("class", "tree_label");
        label.appendChild(document.createTextNode((folderName === "Root"? computerName : folderName)));
        li.appendChild(label);

        // Cleanup folder path: If root folder, this would double itslef ("Root/Root") idk..
        let currentFolderpath;
        if(rootName === folderName) {
            currentFolderpath = rootName;
        } else {
            currentFolderpath = [rootName, folderName].join("/");
        }

        // Open clicked folder in content beside:
        label.onclick = function() {
            gebi('fileManagerPath').innerHTML = currentFolderpath.replace("Root", rootNameDisplay);
            updateFolderContent(currentFolderpath, content[folderName]);
        };

        if(content[folderName].length) {
            // This folder has files in it! Make subfolder.

            // Allow for icon to be clicked
            icon.setAttribute("onclick", "gebi('checkbox-"+id+"').checked = !gebi('checkbox-"+id+"').checked;");
            
            // If in URL folderContent was defined, open this as path:
            if(selectedFolder && selectedFolder === currentFolderpath) {
                updateFolderContent(currentFolderpath, content[folderName]);
                gebi('fileManagerPath').innerHTML = selectedFolder.replace("Root", rootNameDisplay);
            }
            
            // Add new UL to LI
            let subFolderElement = document.createElement("ul");
            checkbox.setAttribute("onchange", "openCloseFolderIcon('"+id+"');");
            li.appendChild(subFolderElement);

            // Always open Root folder & Set computer-icon
            if(computerName) {
                checkbox.checked = "true"
                computerName = false;
                icon.setAttribute("src", "../../os/"+os+"/systemIcons/computer.png");
                checkbox.removeAttribute("onchange");  // Do not change computer icon
            }
            // Open folders along the way to selectedFolder
            if(selectedFolder && selectedFolder.startsWith(currentFolderpath)) {
                checkbox.checked = "true"
            } 

            // Go deeper into subfolder
            for (let file of content[folderName]) {
                addFileToTree(subFolderElement, file, currentFolderpath, computerName);
            }
        } else {
            // There are no contents of this folder. No click for you & files to render
            checkbox.setAttribute("disabled", "true");
        }

        // Add the empty or full folder to list
        element.appendChild(li);
    }
}

// Display files of openend folder in content area
function updateFolderContent(path, folderContent) {
    // Clear area
    let container = document.getElementById('folderContent');
    container.innerHTML = "";

    // Add folder info
    let countFilesInFolder = Object.keys(folderContent).length;
    gebi('folderInfo').innerHTML = countFilesInFolder + (countFilesInFolder === 1 ? " file" : " files");

    for (let file of folderContent) {
        // Make a copy! because apparently changes on "file" changes the initial array..?
        let currentFile = {...file};
        let filename = currentFile[0];
        let extension;
        let action = currentFile[1];
        let size = currentFile[2];
        let data = currentFile[3];
        // TODO List view with file[1] etc
        // let fileInfo = file[0] +" ("+file[1]+") ("+file[2]+")";

        // Check if it's folder
        let isFolder = false;
        if(!filename) {
            filename = Object.keys(currentFile)[0];
            isFolder = true;
        } else {
            // +"" because if a file does not have an extension (toLowerCase() would fail)
            extension = (filename.split(".")[1]+"").toLowerCase();
        }
        
        // Create shortcuts
        let fileTile = document.createElement("div");
        let fileName = document.createElement("div");
        let fileIcon = document.createElement("img");
        fileIcon.setAttribute("alt", "");
        fileIcon.setAttribute("src", "../../os/"+os+"/systemIcons"+iconDecider(filename, isFolder));
        fileTile.appendChild(fileIcon);
        fileName.appendChild(document.createTextNode(filename));
        fileTile.setAttribute("class", "fileTile");

        // Set actions ondblclick
        if(action && action !== "action") {
            // An action is defined manually in folders.json
            fileTile.setAttribute("ondblclick", action);
        } else {
            // On DBLclikc: open programs
            if(["jpg","jpeg","png","tiff","psd","pdf","mp4","avi","mpeg","mkv"].includes(extension)) {
                // Image: filename can be named anything.
                //   Image viewer only opens if real path is defined in data (eg. "1.jpg" or "1.jpg|2.jpg").
                //   path relative to workstation root.
                if(data && data !== "data") {
                    fileTile.setAttribute("ondblclick", "parent.addWindow('Image viewer', 'image', 'imageviewer/index.html?files="+data+"', 5,5, 666,450, false)");
                }
            } else if(["doc","docx","pyc","py","txt","rtf"].includes(extension)) {
                // Text file
                //   If nothing is in data element, open random text
                let text = data && data !== "data" ? data : "random";
                fileTile.setAttribute("ondblclick", "parent.addWindow('Text editor', 'edit_note', 'texteditor/index.html?text="+text+"', 5, 5, 666,450, false)");
            } else if(isFolder) {
                // Open folder directly
                // Find index of subfolder in current folder
                // Maybe terrible..
                let indexOfSubfolder = folderContent.map(e => Object.keys(e)[0]).indexOf(filename);
                let nextPath = [path, filename].join("/");
                fileTile.ondblclick = function() {
                    gebi('fileManagerPath').innerHTML = nextPath.replace("Root", rootNameDisplay);
                    updateFolderContent(nextPath, folderContent[indexOfSubfolder][filename]);
                };
            }
        }
        fileTile.appendChild(fileName);
        container.appendChild(fileTile);
    }
}

// Swap icon in treeview
function openCloseFolderIcon(id) {
    let checkbox = document.getElementById("checkbox-"+id);
    let icon = document.getElementById("icon-"+id);
    if(checkbox.checked) {
        icon.src = "../../os/"+os+"/systemIcons/folderEmpty.png"
    } else {
        icon.src = "../../os/"+os+"/systemIcons/folderFull.png"
    }
}
