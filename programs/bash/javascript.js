let bashProfileName;
let commands = [];
let commandIndex = -1;
let blockCommand = false;
let freeTextCommand = "";

async function setup() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let os = urlParams.get("os");
  let workstation = urlParams.get("workstation");
  let darkMode = urlParams.get("darkMode");
  let scriptName = urlParams.get("script");
  let script = [];
  if(scriptName) {
    script = await parseFile(
      `../../workstations/${workstation}/bash/${scriptName}.fakeBash`
    );
  } else {
    // make default bashProfile and enable freetext bashing
    script[0] = `<span class='green'>admin</span>@<span class='red'>localhost</span>:<span class='path grey'>~</span> $ `;
    script.push(`[bashProfile] [freeText]`);
    script.push(`[goto:nobr,0]`);
    darkMode = "true";
  }

  if(darkMode === "true") {
    addStylesheet("darkMode.css");
  }

  commands = loadScript(script);
  playCommandAtIndex(); // Play first command
}

/* GENERAL */

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

function loadScript(script, getBashProfile = true) {
  let localCommands = [];
  if(getBashProfile) bashProfileName = script.shift(); // Get first element and delete it
  for (lines of script) {
    if (lines === "EXIT") break; // Abort parsing file when keyword EXIT is found
    localCommands = [...localCommands, ...splitCommandLines(lines)];
    if (lines != "[br]" && !lines.includes(":nobr")) {
      // Do not add br for "br" "nobr" command
      localCommands.push({ function: "br" });
    }
  }
  return localCommands;
}

function splitCommandLines(line) {
  let localCommands = [];
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
    localCommands.push({
      function: nameOfFunction,
      parameters: keys.length ? [...keys] : "",
      classes,
    });
  }
  return localCommands;
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

function resetConsole() {
  gebi("console").innerHTML = "";
  playCommandAtIndex(0);
}

function removeLastCommandOutput(className) {
  // If no class is specified, remove every command
  let lastCommandOutput = document.querySelectorAll(`#console${className ? ` .${className}` : '>*'}`);
  if (lastCommandOutput[lastCommandOutput.length-1]) {
    lastCommandOutput[lastCommandOutput.length-1].remove();
  }
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

/* SPECIFIC */

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

function freeText(keyCode) {
  return new Promise((resolve) => {
    document.addEventListener("keydown", onKeyHandler);
    async function onKeyHandler(e) {
      if (e.keyCode === keyCode) {
        document.removeEventListener("keydown", onKeyHandler);
        evalCommand(freeTextCommand);
        freeTextCommand = "";
        resolve();
      } else {
        // Ignore shift, ctrl, alt, meta, etc.
        let printCommand = "";
        if (e.key.length === 1) {
          printCommand = e.key;
        } else if (e.keyCode === 8) {
          removeLastCommandOutput("freeText");
          freeTextCommand = freeTextCommand.slice(0, -1);
          return;
        } else if (e.keyCode === 78) {
          printCommand = "~";
        } else if (e.keyCode === 187 && e.shiftKey) {
          printCommand = "^";
        } else if (e.keyCode === 187 && !e.shiftKey) {
          printCommand = "`";
        } else if (e.keyCode === 221) {
          printCommand = "¨";
        }

        freeTextCommand += printCommand;
        printToConsole(printCommand, "freeText");
      }
    }
  });
}

async function evalCommand(command) {
  command = command.replace("sudo ", "").replace("sudo", "");
  // For 'cd' to work, initial bashProfileName (path) must include "..~<.." !
  if(command === "cd") {
    return;
  } else if(command === "cd ~") {
    bashProfileName = `${bashProfileName.replace(/\~(.*?)\</, `~<`)}`;
  } else if(command.startsWith("cd ..")) {
    bashProfileName = `${bashProfileName.replace(/\~(.*?)\/[^\/]+\</, `~$1<`)}`;
  } else if(command.startsWith("cd .")) {
    return;
  } else if(command.startsWith("cd ")) {
    // Replace path with current command parameter
    bashProfileName = `${bashProfileName.replace(/(\~.*?)\</, `$1/${command.replace("cd ", "")}<`)}`;
  } else if(command === "ls") {
    printToConsole(`<br>bin   dev  home  lost+found  mnt  proc  run   srv  tmp  var<br>
  boot  etc  lib   media       opt  root  sbin  sys  usr`, "grey");
  } else if(command.startsWith("ls -l")) {
    printToConsole(`<br>total 60<br>
lrwxrwxrwx   1 root root     7 Jan 11  2021 bin -> usr/bin<br>
drwxr-xr-x   5 root root  4096 Jan  1  1970 boot<br>
drwxr-xr-x  18 root root  3820 Feb 24 09:17 dev<br>
drwxr-xr-x 118 root root  4096 Feb 21  2021 etc<br>
drwxr-xr-x   3 root root  4096 Jan 11  2021 home<br>
lrwxrwxrwx   1 root root     7 Jan 11  2021 lib -> usr/lib<br>
drwx------   2 root root 16384 Jan 11  2021 lost+found<br>
drwxr-xr-x   2 root root  4096 Jan 11  2021 media<br>
drwxr-xr-x   3 root root  4096 Jan 27  2021 mnt<br>
drwxr-xr-x   4 root root  4096 Jan 11  2021 opt<br>
dr-xr-xr-x 137 root root     0 Jan  1  1970 proc<br>
drwx------   5 root root  4096 Jan 27  2021 root<br>
drwxr-xr-x  29 root root   860 Apr  9 15:46 run<br>
lrwxrwxrwx   1 root root     8 Jan 11  2021 sbin -> usr/sbin<br>
drwxr-xr-x   2 root root  4096 Jan 11  2021 srv<br>
dr-xr-xr-x  12 root root     0 Jan  1  1970 sys<br>
drwxrwxrwt  10 root root  4096 Apr  9 12:53 tmp<br>
drwxr-xr-x  11 root root  4096 Jan 11  2021 usr<br>
drwxr-xr-x  11 root root  4096 Jan 11  2021 var`, "grey");    
  } else if(command) {
    printToConsole(`<br>-bash: ${command}: command not found`, "grey");
  }
}

/* PLAY / REPLAY / KEYBOARD INPUT EVALUATION */

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
    case "freeText":
      show("cursor");
      await freeText(13);
      playCommandAtIndex();
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
  if (["forceType", "wait", "freeText"].includes(command.function)) {
    // Halt for user input
    show("cursor");
  } else {
    hide("cursor");
    if (!["nobr"].includes(command.classes)) playCommandAtIndex();
  }
}