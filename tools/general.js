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
  // TODO: IGNORES CLASS HIDE
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

function getPositionInPercentage(direction, pixelPosition) {
  // On startup, all objects are positioned with percentage, so just leave
  if(typeof(pixelPosition) === "string" && pixelPosition.endsWith("%")) return parseInt(pixelPosition);
  pixelPosition=parseInt(pixelPosition);
  /* pixelPosition=parseFloat(pixelPosition); */
  let screenSizes = getScreenSize();
  if(direction === "left") {
    // console.log(screenWidth + " : " + pixelPosition + " -> " + 100/screenWidth*pixelPosition + "%");
    return 100/screenSizes[0]*pixelPosition;
  } else {
    // console.log(screenHeight + " : " + pixelPosition + " -> " + 100/screenHeight*pixelPosition + "%");
    return 100/screenSizes[1]*pixelPosition;
  }
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
          if(element.hasAttribute("value")) {
            element.value = i;
          } else {
            element.innerHTML = i + append;
          }
      }
      await delay(waitDuration);
  }
}

// Get array of random integers
function randomIntsBetween(count=1, min=0, max=9) {
  // for loop
  let result = [];
  for(i=0; i<count; i++) {
    result.push(Math.floor(Math.random() * (max - min + 1) + min));
  }
  return result;
}

// Get random integer
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Get random element of array
function getRandomElement(arrayToChoose) {
  return arrayToChoose[chooseRandomKey(arrayToChoose)];
}

// Get random index of array
function chooseRandomKey(arrayToChoose) {
  let max = arrayToChoose.length;
  return randomBetween(0, max-1);
}

// Get n randomized elements from array
function chooseRandomKeys(count, elements) {
  let localColors = elements.slice();
  let results = [];
  for (let i = 0; i < count; i++) {
      let index = chooseRandomKey(localColors);
      results.push(localColors[index]);
      localColors.splice(index, 1);
      if(!localColors.length) localColors = elements.slice();
  }
  return results;
}

// Generate an array of integers, starting at 0
function arrayOfIndexes(count, prepend="", append="") {
  let results = [];
  for (let i = 0; i < count; i++) {
      results.push(`${prepend}${i}${append}`);
  }
  return results;
}

// Function to return true or false randomly
function randomBoolean() {
  return Math.random() >= 0.5;
}

// Generate array of int that can be tewaked
function notSoRandomInts(count, min, max, seed, maxDiff, incline, doNotMaxOut = false) {
  // for loop
  let result = [];
  for(i=0; i<count; i++) {
      let newNumber;
      if(i === 0) {
          if(incline > 0) {
              // start low for inclining graph
              // newNumber = min;
              newNumber = randomBetween(min, (min+max)/2);
          } else if (incline < 0) {
              // start high for declining graph
              // newNumber = max;
              newNumber = randomBetween(max/2, max);
          } else {
              // start at random number
              newNumber = Math.floor(random(seed+i) * (max - min + 1) + min);
          }
      } else {
          // based off the last number in array, get new number in between the max and min with maxDiff
          newNumber = Math.floor(random(seed+i) * ((result[i-1]+maxDiff) - (result[i-1]-maxDiff) + 1) + (result[i-1]-maxDiff));
      }

      // Add incline to newNumber (can be positive or negative)
      newNumber = newNumber + newNumber * incline;
      
      if(doNotMaxOut) {
          // do no hard clamp - get new number below max or above min
          if(newNumber > max) {
              newNumber = max - (newNumber - max) - maxDiff;
          }
          if(newNumber < min) {
              newNumber = min + (newNumber + min) + maxDiff;
          }
      } else {
          // Hard cap number to max and min
          newNumber = clamp(newNumber, min, max);
      }
      result.push(newNumber);
  }
  return result;
}

// Random with ssed - for same seed, produces same "random" number
function random(seed) {
  if(!seed) return Math.random();
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function isHtml(data) {
  return /<\/?[a-z][\s\S]*>/i.test(data);
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

// Ignore user input
function epD(event) {
  event.preventDefault();
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


function iconDecider(filename, folderContentAmount) {
  let path;
  if(folderContentAmount === 0) return "folderEmpty.png";
  if(folderContentAmount > 0) return "folderFull.png";

  let fileEnding = (filename.split(".")[1] + "").toLowerCase();  // yes this ignores a dot in bewtween filenames

  switch (fileEnding) {
      case "jpg": path = "fileImage.png"; break;
      case "jpeg": path = "fileImage.png"; break;
      case "png": path = "fileImage.png"; break;
      case "tiff": path = "fileImage.png"; break;
      case "psd": path = "fileImage.png"; break;
      case "doc": path = "doc.png"; break;
      case "docx": path = "doc.png"; break;
      case "pyc": path = "python.png"; break;
      case "py": path = "python.png"; break;
      case "txt": path = "txt.png"; break;
      case "rtf": path = "txt.png"; break;
      case "pdf": path = "pdf.png"; break;
      case "zip": path = "zip.png"; break;
      case "mp3": path = "mp3.png"; break;
      case "mp4": path = "fileMovie.png"; break;
      case "avi": path = "fileMovie.png"; break;
      case "mpeg": path = "fileMovie.png"; break;
      case "mkv": path = "fileMovie.png"; break;
      case "trash": path = "trashFull.png"; break;
      default: path = "file.png"
  }

  return path;
}


function forceType(event, element, text, endAction = false, waitForEnter = false) {
  // FIXME: if text to type contains ' it breaks
  // If its an input or textarea, and possibly empty, .value is a string nontheless
  let currentText = typeof(element.value) === "string" ? element.value : element.innerHTML ? element.innerHTML : "";
  let index = currentText.length;
  let newTypedText;

  switch(event.keyCode) {
    case 39:
      // cl("arrow right");
      // Do nothing
      newTypedText = currentText;
      break;

    case 37:
      // cl("arrow left");
      // Do nothing
      newTypedText = currentText;
      break;
    case 38:
      // cl("arrow up");
      // Do nothing
      newTypedText = currentText;
      break;

    case 40:
      // cl("arrow down");
      // Do nothing
      newTypedText = currentText;
      break;

    case 8:
      // cl("backspace");
      event.preventDefault();
      newTypedText = text.substring(0,index-1);
      index--;
      break; 
        
    case 9:
      // cl("tab");
      // Word completion
      event.preventDefault();
      let restOfText = text.substring(index, text.length);
      if(restOfText[0] === " ") currentText += " ";
      let nextWord = restOfText.split(" ").filter(n => n);
      newTypedText = currentText + (nextWord.length ? nextWord[0] : "");
      index = newTypedText.length;
      break;
        
    case 13:
      // cl("enter");
      event.preventDefault();
      newTypedText = text;
      index = text.length;
      break;

    case 46:
      // cl("delete");
      event.preventDefault();
      newTypedText = text.substring(0,index-1);
      index--;
      break;

    default:
      // Magic
      // cl(event.keyCode);
      event.preventDefault();
      newTypedText = text.substring(0,index+1);
      break;
  }

  if(typeof(element.value) === "string") {
    element.value = newTypedText;
  } else {
    element.innerHTML = newTypedText;
  }

  // If end of text is reached, execute endAction
  let endReached = newTypedText.length >= text.length;
  if(endReached && (!waitForEnter || (waitForEnter && event.keyCode === 13))) {
      if(endAction) {
        endAction();
      } else {
        // execute default action if none defined
        focusNextElement(true);
      }
  }
}

function focusNextElement (loop=true) {
  // Add all elements we want to include in our selection
  // a:not([disabled]), 
  let focussableElements = 'button:not([disabled]), input[type=text]:not([disabled]), input[type=button]:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"]), textarea';
  if (document.activeElement) {  // && document.activeElement.form) {
      let focussable = Array.prototype.filter.call(document.querySelectorAll(focussableElements),  // .activeElement.form
      function (element) {
          // Check for visibility while always include the current activeElement 
          return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement
      });
      let index = focussable.indexOf(document.activeElement);
      if(index > -1) {
         let nextElement = focussable[index + 1] || focussable[0];
         if((loop && nextElement) || (nextElement && focussable[index + 1])) {
           nextElement.focus();
         }
      }
  }
}

// Yes this does not belong here but i do not want to include any other JS files in all programs.
function setSystemFont(os) {
  switch(os) {
    case "mac":
        document.getElementsByTagName('body')[0].style.fontFamily = "Garuda, Roboto, Arial, Helvetica, sans-serif";
    break;
    case "windows":
        document.getElementsByTagName('body')[0].style.fontFamily = "weblysleek, Roboto, Arial, Helvetica, sans-serif";
    break;
    case "linux":
        document.getElementsByTagName('body')[0].style.fontFamily = "Roboto, Arial, Helvetica, sans-serif";
    break;
  }
}