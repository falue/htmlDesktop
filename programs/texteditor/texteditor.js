async function setup() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let text = urlParams.get('text');
    let textarea = document.getElementById('textarea');
    if(text) {
        textarea.innerHTML = text;
    }

    textarea.focus();
}