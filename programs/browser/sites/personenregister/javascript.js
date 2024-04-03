let isErrored = false;

async function dontFindPerson() {
    if(isErrored) {
        gebi('search').value='';
        gebi('search').classList.remove('wiggleX', 'redBorder', 'red');
        hide('noResults');
    } else {
        gebi('search').classList.add('wiggleX', 'redBorder', 'red');
        show('noResults');
    }
    isErrored = !isErrored;
}

function reset() {
    gebi('search').value='';
    gebi('target').classList.remove('yellowBg');
}