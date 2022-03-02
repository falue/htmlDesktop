// list of files in text
let textFiles = ["add-emails", "add-emails-start", "apt-get", "hexdump", "log", "sqlHack#sql", "sql#sql", "lorem_ipsum_binary", "apollo_guidance_computer#sql", "randall#python", "shining", "psf#python", "lorem_ipsum", "javascript#javascript", "donut#c", "ascii_schema", "creative-commence-license", "ascii_highvoltage", "test"];
let texts = new Array();

// readFilesToVariables() is run in main startup() function due to waiting for reading all the files

async function readFilesToVariables() {
    // set settings like dark mode etc
    let fileListGui = document.getElementById("fileList");
    if(textFiles.length) fileListGui.innerHTML = "";

    // AKADEMIE DOES NOT NEED "../" in parseFile() somehow!!
    for(const instance of textFiles) {
        let data = instance.split("#");
        let file = data[0];
        let language = data[1];
        language = !language ? "none" : language;
        language = language !== "none" ? "language-"+language : language;

        await parseFile("text/"+file+".txt", false).then((response) => {
            texts[file] = response;
            // Fill menu
            let a = document.createElement("a");
            a.href = "#";
            a.innerHTML = " " + file;
            a.onclick = function() {
                loadText(file);
                toggleSyntaxHighlights(true, language);
                saveInUrl();
            };
            
            let prependSpan = document.createElement("span");
            prependSpan.classList.add("op75");
            prependSpan.innerHTML = "📝";

            a.prepend(prependSpan);

            if(language !== "none") {
                let appendSpan = document.createElement("span");
                appendSpan.classList.add("op25");
                appendSpan.innerHTML = "." + data[1];
                a.appendChild(appendSpan);
            }
            
            fileListGui.appendChild(a);
            /* fileListGui.appendChild(document.createElement("br")); */
        });
    }
}




async function parseFile(filepath, returnArrayOfLines) {
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
            console.log("XXX Cannot load file: " + filepath);
            // TODO uncomment alert("❌ Cannot load file due to not being served.\nDo not open this file directly in your browser.");
    });

    // Read response stream as text
    let textData = await response.text();

    // Ignore empty rows and rows start with with '#'
    if(returnArrayOfLines) {
        let fileContent = textData
        .split("\n")
        .filter((n) => n)
        .filter((n) => !n.startsWith("#"));
        return fileContent;
    } else {
        return textData;
    }
}