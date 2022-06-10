
async function parseFile(filepath, showError=true) {
    let response = await fetch(filepath).then((response) => {
      // Always gets a response, unless there is network error
      // Catch error if file is not available:
      if(response.status != 200) {
        if(showError) {
          console.error("Missing file:\n❌ " + filepath + "\nResponse status: "+response.status);
          alert("Missing file:\n❌ " + filepath + "\nCreate it and try again.");
        }
      }
      return response;
    }).catch((error) => {
      // Catch error i case server is not working
      console.log("Cannot load file because server is not working or file does not exist: " + filepath);
      console.log(error);
      return {"status": 404};
    });
    
    // Do not return content if file is missing (eg. the "404 missing" page)
    if(response?.status != 200) {
      return response?.status;
    }
  
    // Read response stream as text
    let textData = await response.text();
  
    if(filepath.endsWith(".settings") || filepath.endsWith(".fakeBash")) {
      // Return an array of lines
      // Ignore empty rows and rows start with with '#'
      return textData
        .split("\n")
        .filter((n) => n)
        .filter((n) => !n.startsWith("#"));
  
    } else if(filepath.endsWith(".json")) {
      // Return parsed JSON
      return JSON.parse(textData);
  
    } else {
      // Return raw text if not .json, .settings or .fakeBash
      return textData;
    }
  
  }
  