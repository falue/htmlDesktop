let bashProfileName;
let commands = [];
let commandIndex = -1;
let blockCommand = false;

async function setup() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let os = urlParams.get("os");
  let workstation = urlParams.get("workstation");
  let darkMode = urlParams.get("darkMode");
  let scriptName = urlParams.get("script") || "script";

  if(darkMode === "true") {
    addStylesheet("darkMode.css");
  }

  let script = await parseFile(
    `../../workstations/${workstation}/bash/${scriptName}.fakeBash`
  );
  loadScript(script);
  playCommandAtIndex(); // Play first command
}

function loadScript(script) {
  bashProfileName = script.shift(); // Get first element and delete it
  for (lines of script) {
    if (lines === "EXIT") break; // Abort parsing file when keyword EXIT is found
    splitCommandLines(lines);
    if (lines != "[br]" && !lines.includes(":nobr")) {
      // Do not add br for "br" "nobr" command
      commands.push({ function: "br" });
    }
  }
  // cl(commands);
}

function splitCommandLines(line) {
  // Split multiple commands "[command1] [command2]" on one line into multiple functions
  // let reBrackets = /\[(.*?)\]/g;  // finds also [ and ] in quotes
  let reBrackets = /(?<!\\)\[(.*?)(?<!\\)\]/g; // ingores \[ and \]
  let found;
  while ((found = reBrackets.exec(line))) {
    // Split comma seperated parameters into array, ignore commas between quotes
    let keys = found[1].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    // Get name of function and optional class names
    let nameOfFunctionParts = keys.shift().split(":");
    let nameOfFunction = nameOfFunctionParts[0];
    let classes = nameOfFunctionParts[1] ? nameOfFunctionParts[1] : "";
    // Remove trailing and leading quotes from parameters, or parse int
    keys.forEach((element, index) => {
      keys[index] = isNaN(element)
        ? element
            .replace(/(^"|"$)/g, "")
            .replace(/\\\[/g, "[")
            .replace(/\\\]/g, "]")
        : parseInt(element);
    });
    commands.push({
      function: nameOfFunction,
      parameters: keys.length ? [...keys] : "",
      classes,
    });
  }
}

function printToConsole(text, classes) {
  let span = document.createElement("span");
  if (classes) span.classList.add(classes);
  span.innerHTML = text.replaceAll("  ", "&nbsp;&nbsp;");
  gebi("console").appendChild(span);
}

function keyboardControllerBash(event) {
  event.preventDefault();
  // Escape: Go fromt he top
  if (event.keyCode === 27) {
    resetConsole();
    return;
  }
  if (!blockCommand) playCommandAtIndex();
}

function playCommandAtIndex(index) {
  if (index === undefined && commandIndex < commands.length - 1) {
    commandIndex++;
    playCommand(commands[commandIndex]);
  } else if (index >= 0) {
    playCommand(commands[index]);
    commandIndex = index;
  }
}

function setupForceType(command) {
  let uid = createUniqueId();
  let span = document.createElement("span");
  span.id = uid;
  span.classList.add("forceType");
  if (command.classes) span.classList.add(command.classes);
  gebi("console").appendChild(span);
  // Swap onkeydown=keyboardControllerBash(event) of body with
  // TODO: if enter complete line, if tab next word
  document.getElementsByTagName("body")[0].setAttribute(
    "onkeydown",
    `forceType(event, gebi('${uid}'), '${command.parameters[0]}', function () { document.getElementsByTagName('body')[0].setAttribute('onkeydown', 'keyboardControllerBash(event);'); playCommandAtIndex();}, true)`
    // To automatically get to the enxt command after last char typed:
    /* `forceType(event, gebi('${uid}'), '${command.parameters[0]}', function () { document.getElementsByTagName('body')[0].setAttribute('onkeydown', 'keyboardControllerBash(event);'); playCommandAtIndex();})`   */
  );
}

async function setupLoader(command) {
  // startChar, loadingChar, endChar, displayLoadingChar, duration, counterStart, counterEnd, counterPrepend, counterAppend
  let startChar = command.parameters[0];
  let asciiChar = command.parameters[1];
  let asciiCharEmpty = command.parameters[2];
  let endChar = command.parameters[3];
  let maxLoadingCharRepeats = command.parameters[4];
  let duration = command.parameters[5];
  let start = command.parameters[6];
  let stop = command.parameters[7];
  let prepend = command.parameters[8];
  let append = command.parameters[9];

  let uid = createUniqueId();
  let span = document.createElement("span");
  span.classList.add("loader");
  span.id = uid;
  if (command.classes) span.classList.add(command.classes);
  gebi("console").appendChild(span);
  await counterAscii(
    uid,
    append,
    prepend,
    duration,
    94,
    start,
    stop,
    asciiChar,
    asciiCharEmpty,
    startChar,
    endChar,
    maxLoadingCharRepeats
  );
}

async function counterAscii(
  targetId,
  append,
  prepend,
  duration,
  jitter,
  start,
  stop,
  asciiChar,
  asciiCharEmpty,
  startChar,
  endChar,
  maxLoadingCharRepeats
) {
  // Jitter: if 100 max jitter, 0 no jitter in gui
  let element = gebi(targetId);
  let waitDuration = duration / (stop - start);
  let counterDirection = 1;

  if (start > stop) {
    waitDuration = duration / (start - stop);
    counterDirection = -1;
  }

  for (
    i = start;
    counterDirection == 1 ? i <= stop : i >= stop;
    i += counterDirection
  ) {
    /* Only update GUI if start, stop or is jittering. */
    if (i == start || i >= stop || Math.random() * 100 > jitter) {
      if (counterDirection == 1) {
        i = i > stop ? stop : i; // do not overshoot
      } else {
        i = i > start ? start : i; // do not undershoot
      }
      let loadingProgressAscii = Math.floor((i / stop) * maxLoadingCharRepeats);
      element.innerHTML = `${startChar}${asciiChar.repeat(
        loadingProgressAscii
      )}${asciiCharEmpty.repeat(
        maxLoadingCharRepeats - loadingProgressAscii
      )}${endChar} ${prepend}${i}${append}`;
    }
    await delay(waitDuration);
  }
  return;
}

function resetConsole() {
  gebi("console").innerHTML = "";
  playCommandAtIndex(0);
}

function waitForKey(keyCode) {
  return new Promise((resolve) => {
    document.addEventListener("keydown", onKeyHandler);
    function onKeyHandler(e) {
      if (e.keyCode === keyCode) {
        document.removeEventListener("keydown", onKeyHandler);
        resolve();
      }
    }
  });
}

async function playCommand(command) {
  // Execute command
  blockCommand = true; // Disables keyboard input
  switch (command.function) {
    case "bashProfile":
      printToConsole(bashProfileName, command.classes);
      break;
    case "autoType":
      await delay(command.parameters[1]);
      printToConsole(command.parameters[0], command.classes);
      break;
    case "forceType":
      setupForceType(command);
      break;
    case "pwd":
      show("cursor");
      await waitForKey(13);
      break;
    case "sleep":
      await delay(command.parameters[0]);
      break;
    case "clear":
      gebi("console").innerHTML = "";
      break;
    case "goto":
      playCommandAtIndex(command.parameters[0]);
      break;
    case "br":
      printToConsole("<br>");
      break;
    case "loader":
      await setupLoader(command);
      break;
  }
  blockCommand = false; // Releases keyboard input block

  // Scroll to bottom
  let body = document.getElementsByTagName("body")[0];
  body.scrollTop = body.scrollHeight;

  // If not waiting for the user, play next command automatically
  if (["forceType", "wait"].includes(command.function)) {
    // Halt for user input
    show("cursor");
  } else {
    hide("cursor");
    if (!["nobr"].includes(command.classes)) playCommandAtIndex();
  }
}

function addStylesheet(path) {
  let currentStylesheet = gebi('osStylesheet');
  if(currentStylesheet) currentStylesheet.remove();
  let head = document.head;
  let link = document.createElement("link");
  link.id = "osStylesheet"
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = path;
  head.appendChild(link);
}
