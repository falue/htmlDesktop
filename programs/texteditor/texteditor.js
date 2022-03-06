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

let fontSizeIndex = 3;
function changeFontSize() {
    let fontSizes = [.6, .8, 1, 1.2, 1.5, 1.8, 2.5];
    cl(fontSizeIndex + " " + fontSizes[fontSizeIndex]);
    gebi('textarea').style.fontSize = fontSizes[fontSizeIndex] + "em";
    if(fontSizeIndex < fontSizes.length-1) {
        fontSizeIndex++
    } else {
        fontSizeIndex = 0;
    }
}

let randomTexts = [
    "text1",
    "text2",
    "text3",
]