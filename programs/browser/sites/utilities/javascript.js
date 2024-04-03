document.addEventListener('DOMContentLoaded', function() {
    // Example of a simple script to show an alert when the website is loaded
    // alert('Welcome to Utilities & More!');
});


function keyTester(event) {
    if (event.key === 'VolumeDown') {
        console.log("process logic of volume-down");
    } else if (event.key === 'VolumeUp') {
        console.log("process logic of volume-up");
    } else {
        console.log("Else:");
        console.log(event);
    }
    event.preventDefault(); // to stop system app from processing keydown event
}