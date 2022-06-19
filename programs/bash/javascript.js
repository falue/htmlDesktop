let bashProfileName;
let bashProfileNameInitial;
let commands = {"main": []};
let currentCommandKey = "main";
let commandIndex = new Array();
commandIndex["main"] = -1;
let blockCommand = false;
let freeTextCommand = "";
let lastFreeTextCommand = "";
// Filenames in folder defaultScripts. sudo is seperatly handled
let availableBasicCommands = ["top", "ls", "ls -l", "ls -l -a"];

async function setup() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let os = urlParams.get("os");
  let workstation = urlParams.get("workstation");
  let darkMode = urlParams.get("darkMode");
  let scriptName = urlParams.get("script");
  let script = [];
  if(scriptName && scriptName != "default") {
    script = await parseFile(
      `../../workstations/${workstation}/bash/${scriptName}.fakeBash`
    );
  } else {
    // make default bashProfile and enable freetext bashing
    script[0] = `<span class='green'>${workstation || "admin"}</span>@<span class='red'>localhost</span>:<span class='path grey'>~</span> $ `;
    script.push(`[bashProfile] [freeText]`);
    script.push(`[goto:nobr,0]`);
    darkMode = "true";
  }

  if(darkMode === "true") {
    addStylesheet("darkMode.css");
  }

  commands.main = loadScript(script);
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
  // Get first element and delete it
  if(getBashProfile) {
    bashProfileName = script.shift();
    bashProfileNameInitial = bashProfileName;
  }
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

async function playCommandAtIndex(index) {
  cl(commandIndex[currentCommandKey]);
  if (index === undefined && commandIndex[currentCommandKey] < commands[currentCommandKey].length - 1) {
    commandIndex[currentCommandKey]++;
    await playCommand(commands[currentCommandKey][commandIndex[currentCommandKey]]);
  } else if (index >= 0) {
    await playCommand(commands[currentCommandKey][index]);
    commandIndex[currentCommandKey] = index;
  } else {
    // End reached - reset if not main commands for further use of same command
    if(currentCommandKey != "main") {
      cl("end of subprocess reached");
      // reset index of last command
      commandIndex[currentCommandKey] = -1;
      // Revert to main commands
      currentCommandKey = "main";
      playCommandAtIndex();
    }
  }
}

function resetConsole() {
  /* gebi("console").innerHTML = "";
  bashProfileName = bashProfileNameInitial;
  playCommandAtIndex(0); */
  const url = new URL(window.location.href);
  url.searchParams.set('reloadTime', Date.now().toString());
  window.location.href = url.toString();
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
      if (keyCode.includes(e.keyCode)) {
        document.removeEventListener("keydown", onKeyHandler);
        resolve(e.keyCode);
      }
    }
  });
}

/* SPECIFIC */
let credentialsTrials = 0;
async function askCredentials(outcome) {
  /* cl("outcome::");
  cl(outcome); */
  // Scroll to bottom of console
  scrollToBottom();
  await delay(50); // wait for release of enter from action before!
  printToConsole("Password:<i class='material-icons small valign'>lock</i> ");
  // enter 13
  // f=fail = 70
  // s=succeed = 83
  let returnKey;
  // Do not wait for success/fail/enter key if outcome is not a number (eg success is pre-determined)
  if(!Number.isInteger(outcome)) {  
    returnKey = await waitForKey([13, 70, 83]);
  }
  let enterKey;
  // Ignore enter detection if enter was pressed empty before
  if(returnKey != 13) enterKey = await waitForKey([13]);
  // If "s" & enter ist typed, or outcome is true and not false and not "real", then grant access
  if((((returnKey === 83 && enterKey === 13) && credentialsTrials < 3) || outcome === true || outcome === credentialsTrials+1) && outcome != false) {
    printToConsole("<br>Access granted.<br>", "success");
    credentialsTrials = 0;
    return true;
  } else {
    if(credentialsTrials >= 2) {
      printToConsole("<br>sudo: 3 incorrect password attempts<br>", "error");
      credentialsTrials = 0;
      return false;
    } else if(credentialsTrials < 3 || outcome === false) {
      credentialsTrials++;
      printToConsole("<br>Sorry, try again.<br>", "grey");
      return await askCredentials(outcome);
    }
  }
}

function setupForceType(command) {
  let uid = createUniqueId();
  let span = document.createElement("span");
  span.id = uid;
  span.classList.add("forceType");
  if (command.classes) span.classList.add(command.classes);
  gebi("console").appendChild(span);
  // Check if forceTyped command is a default programm
  let includesDefaultCommands = ["clear", ...availableBasicCommands].includes(command.parameters[0]) || command.parameters[0].startsWith("cd ") || command.parameters[0].startsWith("sudo ");
  // Check sudo outcome parameter
  let sudoOutcome;
  if(command.parameters[0].startsWith("sudo ")) {
    sudoOutcome = command.parameters[1] ? command.parameters[1] === "true" : command.parameters[1] === "false" ? false : undefined;
    sudoOutcome = Number.isInteger(command.parameters[1]) ? command.parameters[1] : sudoOutcome;
    if(sudoOutcome !== undefined) sudoOutcome = `, ${sudoOutcome}`;
  }
  // Swap onkeydown=keyboardControllerBash(event) of body with
  document.getElementsByTagName("body")[0].setAttribute(
    "onkeydown",
    `forceType(event, gebi('${uid}'), '${
      command.parameters[0]
    }', async function () { document.getElementsByTagName('body')[0].setAttribute('onkeydown', 'keyboardControllerBash(event);'); ${
      includesDefaultCommands
        // If default command is set to forceType, try to execute command
        ? `await evalCommand('${command.parameters[0]}'${sudoOutcome || ""}); await playCommandAtIndex();`
        : "playCommandAtIndex();"
    }}, true)`
    /* `forceType(event, gebi('${uid}'), '${command.parameters[0]}', function () { document.getElementsByTagName('body')[0].setAttribute('onkeydown', 'keyboardControllerBash(event);'); playCommandAtIndex();}, true)` */
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
        await evalCommand(freeTextCommand);
        if(freeTextCommand) lastFreeTextCommand = freeTextCommand ;
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
        } else if (e.keyCode === 38) {  // 38 arrow up
          printCommand = lastFreeTextCommand;
          lastFreeTextCommand = "";
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

async function loadExternalScript(scriptName) {
  scriptName = scriptName.replaceAll(" ", "");
  currentCommandKey = scriptName;
  commandIndex[currentCommandKey] = -1;
  let newScripts = await parseFile(`defaultScripts/${scriptName}.fakeBash`);
  commands[currentCommandKey] = loadScript(newScripts, false);
  printToConsole("<br>");
}

async function evalCommand(command, sudoOutcome) {
  // Preemptively add sudo before actual command
  if(command.startsWith("sudo")) {
    blockCommand = true;
    printToConsole("<br>");
    let success = await askCredentials(sudoOutcome);  // add param real, true or false!!
    if(success) {
      command = command.replace("sudo ", "").replace("sudo", "");
    } else {
      // Wrong passwor (no "s" typed in pw!)
      return;
    }
    blockCommand = false;
  }

  // For 'cd' to work, initial bashProfileName (path) must include "..~<.." !
  if(availableBasicCommands.includes(command)) {
    // Load "top" and others
    await loadExternalScript(command);

  } else if(command === "clear") {
    gebi("console").innerHTML = "";

  } else if(command === "cd") {
    return;  // ignore when empty parameter

  } else if(command === "cd ~") {
    bashProfileName = `${bashProfileName.replace(/\~(.*?)\</, `~<`)}`;

  } else if(command.startsWith("cd ..")) {
    bashProfileName = `${bashProfileName.replace(/\~(.*?)\/[^\/]+\</, `~$1<`)}`;

  } else if(command.startsWith("cd .")) {
    return;

  } else if(command.startsWith("cd ")) {
    // Replace path with current command parameter
    bashProfileName = `${bashProfileName.replace(/(\~.*?)\</, `$1/${command.replace("cd ", "")}<`)}`;

  // } else if(command) {
  //   printToConsole(`<br>-bash: ${command}: command not found`, "grey");

  } else {
    cl("empty command received");
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
    case "waitForEnter":
      show("cursor");
      await waitForKey([13]);
      break;
    case "credentials":
      // TODO: key gets pressed already
      await askCredentials(command.parameters[0] === undefined ? "real" : Number.isInteger(command.parameters[0]) ? command.parameters[0] : command.parameters[0] === "true");
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
      await playCommandAtIndex(command.parameters[0]);
      break;
    case "br":
      printToConsole("<br>");
      break;
    case "loader":
      await setupLoader(command);
      break;
  }
  blockCommand = false; // Releases keyboard input block

  // Scroll to bottom of console
  scrollToBottom();

  // If not waiting for the user, play next command automatically
  if (["forceType", "wait", "freeText"].includes(command.function)) {
    // Halt for user input
    show("cursor");
  } else {
    hide("cursor");
    if (!["nobr"].includes(command.classes)) playCommandAtIndex();
  }
}

function scrollToBottom() {
  let body = document.getElementsByTagName("body")[0];
  body.scrollTop = body.scrollHeight;
}