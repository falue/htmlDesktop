async function setup() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let os = urlParams.get('os');
    let workstation = urlParams.get('workstation');
    let darkMode = urlParams.get('darkMode');
    let fit = urlParams.get('fit');
    let videoElement = gebi("video");

    // contain
    switch(fit) {
      case "contain":
        videoElement.style.objectFit = "contain";
      break;
      case "cover":
        videoElement.style.objectFit = "cover";
        videoElement.style.objectPosition = "center center";
      break;
      default:
          videoElement.style.objectFit = "cover";
          videoElement.style.objectPosition = "top center";
      break;
    }
    /* 
    
    /* fit=contain *
    /* for contain, nothing is necessary *
    /* object-fit: contain; *
    
    /* fit=cover *
    object-fit: cover;
    object-position: center center;


    /* fit=coverX *
    /* object-fit: cover;
    object-position: top center; *
    */
    
    start();
}



// From https://github.com/webrtc/samples/tree/gh-pages/src/content/devices/input-output

const videoElement = document.querySelector("video");
const videoSelect = document.querySelector("select#videoSource");
const selectors = [videoSelect];

function gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
  const values = selectors.map((select) => select.value);
  selectors.forEach((select) => {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement("option");
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === "videoinput") {
      option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
      videoSelect.appendChild(option);
    } else {
      console.log("Some other kind of source/device: ", deviceInfo);
    }
  }
  selectors.forEach((select, selectorIndex) => {
    if (
      Array.prototype.slice
        .call(select.childNodes)
        .some((n) => n.value === values[selectorIndex])
    ) {
      select.value = values[selectorIndex];
    }
  });
}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoElement.srcObject = stream;
  // Refresh button list in case labels have become available
  return navigator.mediaDevices.enumerateDevices();
}

function handleError(error) {
  console.log(
    "navigator.MediaDevices.getUserMedia error: ",
    error.message,
    error.name
  );
}

function start() {
  if (window.stream) {
    window.stream.getTracks().forEach((track) => {
      track.stop();
    });
  }
  const videoSource = videoSelect.value;
  const constraints = {
    video: { deviceId: videoSource ? { exact: videoSource } : undefined },
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(gotStream)
    .then(gotDevices)
    .catch(handleError);
}

videoSelect.onchange = start;


