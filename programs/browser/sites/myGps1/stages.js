let stage = 0;

async function nextStage(delayMs, arguments) {
	await delay(delayMs);
	stage++;
    delayMs = delayMs ? delayMs : 0;
    arguments = arguments ? arguments : "";
	playStage(stage, arguments);
}

function playStage(currentStage, arguments) {
    stage = currentStage;
    arguments = arguments ? arguments : "";
    /* console.log(currentStage); */
	executeFunctionByName("stage"+currentStage, arguments);
}


function executeFunctionByName(functionName, arguments) {   //, args * context, 
    try {
        window[functionName](...arguments.split(", "));
      } catch (error) {
          // Reset to stage 0 if end reached
          stage = 0;
          playStage(stage);
          /* console.error(error); */
      }
}

// https://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string
