
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
      console.log("Cannot load file because server is not working: " + filepath);
      /* hide("overlayEnv");
      show("overlayServerError"); */
    });
  
    // Read response stream as text
    let textData = await response.text();
  
    if(filepath.endsWith(".txt")) {
      // Ignore empty rows and rows start with with '#'
      return textData
        .split("\n")
        .filter((n) => n)
        .filter((n) => !n.startsWith("#"));
  
    } else if(filepath.endsWith(".json")) {
      return JSON.parse(textData);
  
    } else {
      return textData;
    }
  
  }
  