let speed = 1000;

async function setup() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let os = urlParams.get('os');
    let workstation = urlParams.get('workstation');
    let darkMode = urlParams.get('darkMode');
    
    // Set generic system fonts
    setSystemFont(os);
}

async function startScan() {
    show('overlay')
    show('scanning')
    await delay(speed/2);
    swap('fingerprint-empty', 'fingerprint-scanned');
    await delay(speed);
    swap('match-1', 'match-2');
    await delay(speed/3);
    swap('match-2', 'match-3');
    await delay(speed*1.5);
    swap('match-3', 'match-4');
    
    await delay(speed/2);

    hide('overlay')
    hide('scanning')
    await delay(speed/2);
    show('compareScanBtn');
}

async function compareScan() {
    show('data-1');
    await delay(speed/2);
    show('data-2');
    await delay(speed);
    show('data-3');
    await delay(speed/2);

    await searchDb();

    show('results');
    show('overlay');
}

async function searchDb() {
    for (const fingi of Array.from(document.querySelectorAll('.fingerprint')).slice(0, -30)) {
        fingi.querySelectorAll('.score')[0].classList.remove('op0');
        await delay(randomBetween(10, speed/3));
        fingi.remove();
        await delay(randomBetween(10, speed/15));
    }
    cl("now");
    gebi('joyce-score').classList.remove('op0');
}

function keyboardControllerFingerlab(event) {
    // cl(event.key);
    if(event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        startScan();
        return;
    }
    // Trigger main keyboard controller
    if(typeof parent.keyboardController === 'function') {
        parent.keyboardController(event);
    }
}