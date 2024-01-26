async function setup() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let os = urlParams.get('os');
    /* let workstation = urlParams.get('workstation');
    let darkMode = urlParams.get('darkMode'); */
    /* let id = urlParams.get('id'); */
    /* let id = window.parent.document.getElementById('#target');  */
    let thisWindow = window.parent.document.querySelectorAll("[data-setup*='magic']")[0];
    let id = thisWindow.id;
    let newSrc = await parent.showDialog("Set new window path", "Type new absolute path or URL.<br>Including localhost or live URLs.", false, "https://");
    if(newSrc && newSrc != "~EMPTY") {
        let windowTitle = await parent.setWindowTitle(`title-${id}`, {"altKey": true});
        let windowIcon = await parent.setWindowIcon(`${id}`, {"altKey": true});
        thisWindow.setAttribute('data-setup', `['${windowTitle}', '${windowIcon}', '${newSrc}']`);
        thisWindow.getElementsByTagName('iframe')[0].src = newSrc;
    }
}
