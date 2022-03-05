function cl(data) {
    console.log(data);
}

function gebi(id) {
  return document.getElementById(id);
}

function hide(id) {
	for(i=0; i< arguments.length; i++) { 
		gebi(arguments[i]).classList.add('hide');
	}
}

function show(id) {
	for(i=0; i< arguments.length; i++) { 
		gebi(arguments[i]).classList.remove('hide');
	}
}

function toggle(id) {
  let element = gebi(id);
  let display = window.getComputedStyle(element, null).display;
  if(display == "" || display == "none") {
    show(id);
    return 1;
  } else {
    hide(id);
    return 0;
  }
}

function swap(id1, id2) {
  toggle(id1);
  toggle(id2);
}

function showClass(className) {
  let elements = document.getElementsByClassName(className);
  for(i=0; i< elements.length; i++) {
		elements[i].classList.remove('hide');
	}
}

function hideClass(className) {
  let elements = document.getElementsByClassName(className);
  for(i=0; i< elements.length; i++) { 
		elements[i].classList.add('hide');
	}
}


function showCssQuery(query) {
  let elements = document.querySelectorAll(query);
  for(i=0; i< elements.length; i++) {
		elements[i].classList.remove('hide');
	}
}

function hideCssQuery(query) {
  let elements = document.querySelectorAll(query);
  for(i=0; i< elements.length; i++) { 
		elements[i].classList.add('hide');
	}
}

function toggleClass(className) {
  /* console.log(className); */
  let element = document.getElementsByClassName(className)[0];
  if(element) {
    let display = window.getComputedStyle(element, null).display;
    if(display == "" || display == "none") {
      showClass(className);
    } else {
      hideClass(className);
    }
  }
}

function swapClasses(elementId, class1, class2) {
  let element = gebi(elementId);
  if(element.classList.contains(class1)) {
    element.classList.remove(class1);
    element.classList.add(class2);
  } else {
    element.classList.add(class1);
    element.classList.remove(class2);
  }
}

function changeImgToSrc(targetElementId, srcSourceElementId) {
  let target = gebi(targetElementId);
  let source = gebi(srcSourceElementId).src;
  target.src = source;
}

function changeTitle(newTitle) {
  document.title = newTitle;
}

function hoverIcon(element, initialIcon, hoverIcon) {
  element.addEventListener("mouseout", function(){ this.innerHTML=initialIcon; });
  element.innerHTML = hoverIcon;
}

function scrollToTop(id) {
  let element = gebi(id);
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  element.scrollTop=0;
}

function getScreenSize() {
  let screenWidth = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
  let screenHeight = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;
  return [screenWidth, screenHeight];
}

function delay(delayTimeMs) {
  return new Promise(resolve => setTimeout(resolve, delayTimeMs));
}

// Counts up from start to stop, e.g. "0% -> 100%"
// Useful for loading percentage
async function counter(targetId, append, duration, jitter, start, stop) {
  // Jitter: if 100 max jitter, 0 no jitter in gui
  let element = gebi(targetId);
  let waitDuration = duration / (stop - start);
  let counterDirection = 1;

  // Do not loop faster than 60fps
  // TODO: Does not work. if increment increases AND waitDuration, the time does not match
  // also the animation is not smooth.
  /* let increment = waitDuration < 17 ? 17: 1;
  waitDuration = waitDuration < 17 ? waitDuration*17 : waitDuration; */
  /* for(i=start; i<=stop; i+=increment) { */
  if(start > stop) {
    waitDuration = duration / (start - stop);
    counterDirection = -1;
  }

  for(i=start; counterDirection == 1 ? i<=stop : i>=stop; i+=counterDirection) {
      /* Only update GUI if start, stop or is jittering. */
      if(i==start || i>= stop || Math.random()*100 > jitter) {
          if(counterDirection == 1) {
            i = i > stop ? stop : i;  // do not overshoot
          } else {
            i = i > start ? start : i;  // do not undershoot
          }
          element.innerHTML = i + append;
      }
      await delay(waitDuration);
  }
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function chooseRandomKey(arrayToChoose) {
  let max = arrayToChoose.length;
  return randomBetween(0, max-1);
}

function clamp(value, min, max) {
  if(value > max) { return max; } else 
  if(value < min) { return min; }
  return value;
}

function wrapAround(value, min, max) {
  if(value > max) { return min; } else
  if(value < min) { return max; }
  return value;
}

function createUniqueId(max) {
  if(!max) max = 28;
  /* return Math.floor(Math.random() * 32000) + "-" + Date.now(); */
  /* return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10); */
  var S4 = function() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4()).substring(0,max);
}

function dynamicSort(keyName) {
  let sortByFirstKey = keyName === "firstKey";
  let sortByFirstKeyReversed = keyName === "~firstKey";
  let sortOrder = sortByFirstKeyReversed ? -1 : 1;

  if(keyName[0] === "-") {
    sortOrder = -1;
    keyName = keyName.substr(1);
  }

  return function (a,b) {
      if(sortOrder == -1){
        if(sortByFirstKeyReversed) {
          // Sorty by first key reversed
          return Object.keys(b)[0].localeCompare(Object.keys(a)[0]);
        } else {
          // Sorty by keyName reversed
          return b[keyName].localeCompare(a[keyName]);
        }
      } else {
        if(sortByFirstKey) {
          // Sorty by first key
          return Object.keys(a)[0].localeCompare(Object.keys(b)[0]);
        } else {
          // Sorty by keyName
          return a[keyName].localeCompare(b[keyName]);
        }
      }
  }
}