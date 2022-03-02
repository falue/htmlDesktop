function shortenUrl() {
    let currentUrl = saveInUrl();
    let host = window.location.protocol + "//" + window.location.host;
    currentUrl = host + currentUrl
                  .replace("?", "?shrt=1&")  // short mark
                  .replace("text", "t")
                  .replace("theme", "th")
                  .replace("speed", "s")
                  .replace("language", "l")
                  .replace("autotype", "a")
                  .replace("humanTyper", "h")
                  .replace("cursor", "c")
                  .replace("truncateText", "tr")
                  .replace("bgColor", "b")
                  .replace("fontColor", "f")
                  .replace("byRows", "r")
                  .replace("startChar", "sc")
                  .replace("paddingRange", "p")
                  .replace("repeatMultipleTexts", "rt")
                  .replace("=true", "=t")
                  .replace("=false", "=f");
    let hasLocalFileLoaded = document.getElementById('filetoRead').value.length > 0;
    let hasEnteredText = document.getElementById('yourOwnText').value.length > 0;
    let message = hasLocalFileLoaded
        ? "Copy & share this URL.\nNote that your local file will not be saved."
        : hasEnteredText
            ? "Copy & share this URL.\n Note that your entered text is not saved."
            : "Copy & share this URL.";
    prompt(message, currentUrl);
}

function expandUrl(currentUrl) {
    currentUrl = currentUrl
                  .replace("?shrt=1&", "?")
                  .replace("t=", "text=")
                  .replace("&th=", "&theme=")
                  .replace("&s=", "&speed=")
                  .replace("&l=", "&language=")
                  .replace("&a=", "&autotype=")
                  .replace("&h=", "&humanTyper=")
                  .replace("&c=", "&cursor=")
                  .replace("&tr=", "&truncateText=")
                  .replace("&b=", "&bgColor=")
                  .replace("&f=", "&fontColor=")
                  .replace("&r=", "&byRows=")
                  .replace("&sc=", "&startChar=")
                  .replace("&p=", "&paddingRange=")
                  .replace("&rt=", "&repeatMultipleTexts=")
                  .replace("=t", "=true")
                  .replace("=f", "=false");
    return currentUrl;
}
