let speed = 100;
let speedScan = 1000;

async function setup() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let os = urlParams.get('os');
    let workstation = urlParams.get('workstation');
    let darkMode = urlParams.get('darkMode');
    
    // Set generic system fonts
    setSystemFont(os);

    speedScan = localStorage.getItem('finger-speedScan') || speedScan;
    speed = localStorage.getItem('finger-speed') || speed;

    gebi('speed-label').innerHTML = speed;
    gebi('speedScan-label').innerHTML = speedScan;
    gebi('speedScan-range').value = speedScan;
    gebi('speed-range').value = speed;

    if(localStorage.getItem('finger-invert') === 'true') {
        gebi('prints').classList.toggle('invert');
    }
}

async function startScan() {
    hide('scanBtn')
    show('resetBtn')

    show('overlay')
    show('scanning')
    hide('status-idle')
    show('status-scanning')

    counter("status-scanning-bar", "%", 2500, 92, 0, 100);

    await delay(speedScan/2);
    gebi('printsBinary-iframe').src="../terminal/index.html?byRows=true&startChar=0&text=hexdump&theme=hybrid&speed=3&language=none&autotype=true&humanTyper=false&cursor=true&truncateText=700&bgColor=0d0d0d&fontColor=339e91&paddingRange=5";
    swap('fingerprint-empty', 'fingerprint-scanned');
    await delay(speedScan);
    
    swap('match-1', 'match-2');
    await delay(speedScan/3);
    swap('match-2', 'match-3');
    await delay(speedScan*1.5);
    swap('match-3', 'match-4');
    
    await delay(speedScan/2);

    hide('status-scanning')
    
    hide('overlay')
    hide('scanning')
    await delay(speedScan/2);
    gebi('printsBinary-iframe').src="";
    show('compareScanBtn');
}

function setSpeedScan(value) {
    gebi('speedScan-label').innerHTML = value;
    localStorage.setItem('finger-speedScan', value);
    speedScan = parseInt(value);
}

function setSpeed(value) {
    gebi('speed-label').innerHTML = value;
    localStorage.setItem('finger-speed', value);
    speed = parseInt(value);
}


async function compareScan() {
    show('data-1');
    await delay(speedScan/2);
    show('data-2');
    await delay(speedScan);
    show('data-3');
    await delay(speedScan/2);

    await searchDb();

    show('results');
    show('overlay');
}

function invertScanView() {
    // gebi('result').classList.toggle('invert');
    gebi('prints').classList.toggle('invert');
    localStorage.setItem('finger-invert', gebi('prints').classList.contains('invert'));
    /* gebi().style.backgroundColor=
    gebi('match-1').classList.toggle('invert');
    gebi('match-1').classList.toggle('invert');
    gebi('match-2').classList.toggle('invert');
    gebi('match-3').classList.toggle('invert');
    gebi('match-4').classList.toggle('invert'); */
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