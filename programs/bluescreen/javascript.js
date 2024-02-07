async function setup() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let os = urlParams.get('os');

    /* 
        Set these URL parameters to some text to display as title or text:
            title
            text

        Set this parameter to false to hide it. Default is showing the blinking cursor.
            cursor
    */
    
    let title = urlParams.get('title');
    if(title) {
        gebi('title').innerHTML = title;
    }

    let text = urlParams.get('text');
    if(text) {
        gebi('text').innerHTML = text;
    }

    let cursor = urlParams.get('cursor');
    if(cursor === "false") {
        hide('cursor');
    }

    
    // title
    // text
    // cursor
    }
