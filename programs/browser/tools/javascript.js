function goToUrl(url, spoofUrl = url) {
  showLoader(true);
  let iframe = document.getElementsByTagName('iframe')[0];
  // reset css top
  iframe.style.top="0";

  // If manual entered URL is a spoofed one, fake URL
  spoofUrls.forEach(function (e) {
    let realUrl = e[0];
    let spoofUrl = e[1];
    let optionalOnClick = e[2];
    // TODO if only part was entered does not work
    if(url.includes(spoofUrl)) {
      url = realUrl;
      spoofUrl = spoofUrl;
      eval(optionalOnClick);
    }
  })

  // Load url in iFrame
  iframe.src = url;  // set src to exactly what is typed

  // Display fake or real
  spoofUrl = spoofUrl.startsWith('http://') || spoofUrl.startsWith('https://') ? spoofUrl : "https://" + spoofUrl;
  spoofUrl = spoofUrl.endsWith('/') ? spoofUrl : spoofUrl + "/";
  document.getElementById('url-bar').value=spoofUrl;
  document.getElementById('url-bar').blur();

  // Make lock green if httpS
  let lock = document.getElementById('httpsLock');
  if(spoofUrl.startsWith('https://')) {
    lock.classList.add('green');
    lock.innerHTML = 'lock';
  } else {
    lock.classList.remove('green');
    lock.innerHTML = 'gpp_maybe';  // error_outline';
  }

  /* only MAYBE works on local files due to cross browser stuff */
  document.title = spoofUrl;
  setTimeout(function() {
    try {
      setNewTitle();
    } catch (error) {
      document.title = "UNIK BROWSER " + unikVersion;
    }
  }, 666);
}

function setNewTitle() {
  let iframe = document.getElementsByTagName('iframe')[0];
  let innerDoc = (iframe.contentDocument) ? iframe.contentDocument : iframe.contentWindow.document;
  if(innerDoc) {
    let iframeTitle = innerDoc.getElementsByTagName('title')[0].innerHTML;
    document.title = iframeTitle;

    // Set display URL
    let iframeSpoofUrl = innerDoc.getElementById('iframeSpoofUrl');
    iframeSpoofUrl = iframeSpoofUrl ? iframeSpoofUrl.innerHTML : "";
    if(iframeSpoofUrl) document.getElementById('url-bar').value = iframeSpoofUrl;

    // 404 error because wrongly typed URL in fake browser
    // "Disable" internet
    if(iframeTitle == "File not found") {
      hide('iframe');
    } else {
      show('iframe');
    }
  }
}

function reloadIframe() {
  showLoader(true);
  let iframe = document.getElementsByTagName('iframe')[0];
  let url = iframe.src;
  iframe.src = "";
  let rand = Math.floor((Math.random()*1000000)+1);  // force cache refresh
  iframe.src = url + "?uid="+rand;
}

function hoverIcon(element, initialIcon, hoverIcon) {
  element.addEventListener("mouseout", function(){ this.innerHTML=initialIcon; });
  element.innerHTML = hoverIcon;
}

function toggleElement(elementId) {
  let element = document.getElementById(elementId);
  let status = element.style.display;
  console.log(status);
  element.style.display = status == "" || status == "block" ? 'none' : 'block';
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

function showLoader(isLoading) {
  let loadingIsActivated = document.getElementById('loadToggle').checked;
  let loadingTypeCircle = document.getElementById('loaderCircle').checked;
  let loadingTypeLinear = document.getElementById('loaderLinear').checked;
  if(loadingIsActivated) {
    let loadingIconCircle = document.getElementById('afterUrlIcon');

    // if "linear" is defined via settings.txt,
    // loading is triggered before the read settings are,
    // circle loader will be shown before the desired linear loader is ... loaded
    if(loadingTypeCircle || loadingIconCircle.classList.contains("spin")) {  
      if(isLoading) {
        loadingIconCircle.classList.add('spin', 'blue');
        loadingIconCircle.innerHTML = "autorenew";
      } else {
        loadingIconCircle.classList.remove('spin', 'blue');
        loadingIconCircle.innerHTML = "star_outline";
      }
    }
    
    if(loadingTypeLinear) {
      if(isLoading) {
        show('linearLoader');
      } else {
        hide('linearLoader');
      }
    }
  }
}

function delayHideLoader() {
  setTimeout(function() {
    showLoader(false);
  }, 500);
}

function hide(id) {
	for(i=0; i< arguments.length; i++) { 
		document.getElementById(arguments[i]).style.display = 'none';
	}
}

function show(id) {
	for(i=0; i< arguments.length; i++) { 
		document.getElementById(arguments[i]).style.display = 'block';
	}
}

function toggle(id) {
  let element = document.getElementById(id);
  let display = window.getComputedStyle(element, null).display;
  if(display == "" || display == "none") {
    show(id);
  } else {
    hide(id);
  }
}

function historyBack() {
  window.history.back();
  /* console.log("back?");
  setNewTitle();   */
}

function historyForward() {
  window.history.forward();
  /* console.log("forward?");
  setNewTitle();   */
}

