let messages = [];
let messagesInitial = [];
let messageIndex = -1;  // where in the history of the chat you are
let isTyping = false;
let editMessages = false;
let typeIndicator = true;
let chatEdit = false;
let forceSend = false;
let autoAdvance = true;
let blockTypingWhileAnswerinprogress = false;
let loop = true;

async function setup() {
    /* 
        URL parameter
        `scene`: is scene number. looks for '{scene}/chat.json' file
        `sharpCorners`: make the corners on every bubble not rounded but isntead adds a pointer thingy
        `bg`: hex code of background color
        `loop`: default true; if true the chat restarts after the last pre-programmed message without deleting the chat history.
        if false the user is allowed to type for "real" any message they want
    */
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let os = urlParams.get('os');
    let workstation = urlParams.get('workstation');
    let darkMode = urlParams.get('darkMode');

    if(urlParams.get('sharpCorners') === 'true') {
        document.getElementsByTagName('body')[0].classList.add('sharpCorners');
    }
    if(urlParams.get('bg')) {
        let color = urlParams.get('bg');
        document.getElementsByTagName('body')[0].style.backgroundColor = `#${color}`;
        if(!isLightColor(color)) {
            gebi('inputs').classList.add('invertKeepColors');
            // gebi('inputs').style.filter = 'invert(1) hue-rotate(180deg)';
        }
    }

    typeIndicator = localStorage.getItem('chat-typeIndicator') === 'true';
    gebi('typeIndicator-checkbox').checked = typeIndicator;

    loop = urlParams.get('loop') === "true" || !urlParams.get('loop');
    gebi('loop-checkbox').checked = loop;
    
    let chat = urlParams.get('scene');
    if(!chat) {
        cl("URL parameter chat is not defined; default to _example");
        chat = "_example";
    }
    messages = await parseFile(`data/${chat}/chat.json`, false);
    messagesInitial = JSON.parse(JSON.stringify(messages));

    setupNextMessage(messageIndex);
    
    // Set generic system fonts
    setSystemFont(os);
}

async function sendMessage(text, sender) {
    if(isTyping && blockTypingWhileAnswerinprogress) return;  // refuse when other is typing
    if(!text) return;  // refuse empty texts
    let bubble = document.createElement("div");
    let bubbleWrapper = document.createElement("div");
    let alignment = sender === 'me' ? 'rightBubble' : 'leftBubble';
    bubbleWrapper.classList.add('bubbleWrapper', alignment);
    bubble.classList.add('bubble', sender === 'me' ? 'popInRight' : 'popInLeft');
    bubble.id = 'bubble-'+messageIndex;
    bubble.setAttribute('onclick', `if(editMessages) editThisMessage(${messageIndex})`);
    if(messages[messageIndex]) {
        if(messages[messageIndex].sent) bubble.classList.add('sent');
        if(messages[messageIndex].seen) bubble.classList.add('seen');
        if(messages[messageIndex].error.length) {
            bubble.classList.add('error');
            bubble.dataset.error = "⚠ " + messages[messageIndex].error;
            bubble.style.marginBottom = '2em';
        }
    }
    bubble.innerHTML = text.replaceAll("\n", "<br>");;  // 
    bubbleWrapper.appendChild(bubble);
    gebi('bubbleContainer').appendChild(bubbleWrapper);
    scrollToBottom('bubbleContainer');
    gebi('chatInput').value ='';
    gebi('chatInput').focus();
    if(messages[messageIndex] && !chatEdit) {
        messages[messageIndex].sent = true;
        messages[messageIndex].seen = true;  // how and when is this seen?
    } /* else if(!messages[messageIndex] && !chatEdit) {
        messages.push({
            "message": text,
            "data": "",
            "action": "",
            "sender": "me",
            "delay": 0,
            "date": "",
            "sent": false,
            "seen": false,
            "error": ""
        })
    } */
    setTimeout(() => {
        bubble.classList.add('sent');
        setTimeout(() => {
            bubble.classList.add('seen');
        }, randomBetween(200, 1500));
    }, randomBetween(200, 1500));

    if(autoAdvance) {
        await setupNextMessage(messageIndex);
    } else {
        messageIndex++;
    }
}
async function setupNextMessage(index) {
    messageIndex = index+1;
    /* cl(messageIndex);
    cl(messages.length);
    cl("----------"); */
    /* messageIndex = messageIndex >= messages.length && loop ? 0 : messageIndex;
    cl(messageIndex)
    cl(messages[messageIndex]); */
    let chatInput = gebi('chatInput');

    // Enhance the history if loop and last message
    if(messageIndex >= messages.length && loop && messagesInitial.length > 0) {
        messages = messages.concat(JSON.parse(JSON.stringify(messagesInitial)));
    }

    if(messageIndex < messages.length) {
        let messageObject = messages[messageIndex];
        // if(!messageObject.sent) return
        if(messageObject.sender === 'me' && !messageObject.sent && !chatEdit && !forceSend) {
            chatInput.setAttribute('onkeydown', `if(!isTyping || !blockTypingWhileAnswerinprogress) {parent.forceType(event, this, '${messageObject.message}', function () { sendMessage('${messageObject.message}', '${messageObject.sender}')}, true)} else { event.preventDefault(); }`);
            // chatInput.setAttribute('onkeydown', `parent.forceType(event, this, '${messageObject.message}', function () { sendMessage('${messageObject.message}', '${messageObject.sender}')}, true)`);
        } else {
            if(!messageObject.sent && !chatEdit) {
                let typingDelay = messageObject.message.length*50;
                isTyping = true;
                if(!forceSend) await delay(messageObject.delay);
                if(typeIndicator && messageObject.sender !== 'me') {
                    showTypeIndicator();
                    typingDelay = typingDelay > 3500 ? 3500 : typingDelay;
                    await delay(typingDelay);
                    hideTypeIndicator();
                }
                isTyping = false;
            }
            await sendMessage(messageObject.message, messageObject.sender);
        }
    } else {
        // chatInput.removeAttribute('onkeydown');  // if enter, sendMessage
        chatInput.setAttribute('onkeydown', "if(event.key === 'Enter') sendMessage(this.value, 'me')");  // if enter, sendMessage
    }
}

function setupEditMessage() {
    chatEdit = true;
    document.getElementsByTagName('body')[0].classList.add('edit', 'redBg');
    editMessages = true;
    hide('menu-content');
    //gebi('menu-content').classList.add('op25', 'noPointerEvents');
    show('editMessagesFinish');
    hide('editMessages')
    show('editMessage')
    hide('resetChat');

    resetChat();
}
function finishEditMessage() {
    chatEdit = false;

    document.getElementsByTagName('body')[0].classList.remove('edit', 'redBg');
    editMessages = false;
    hide('editMessagesFinish');
    //gebi('menu-content').classList.remove('op25', 'noPointerEvents');
    show('editMessages')
    hide('editMessage')
    hide('menu-content');
    show('resetChat');

    // resetChat();
}

function resetChat() {
    // rebuild chat
    messageIndex = -1;
    messages = messagesInitial;
    gebi('bubbleContainer').innerHTML = '';
    setupNextMessage(messageIndex);
}

function editThisMessage(index) {
    if(messages[index]) {
        show('menu-content');
        show('editMessage');
        //gebi('menu-content').classList.remove('op25', 'noPointerEvents');
        let container = gebi('editMessage-container');
        container.innerHTML = '';
        const keyNames = ["message", "sender", "delay", "date", "sent", "seen", "error"];

        // Iterate over the array of key names
        keyNames.forEach(key => {
            // Create a new div for each key
            const element = document.createElement("div");

            // Create a label for the input
            const label = document.createElement("label");
            label.textContent = key;
            if(key === 'delay') label.textContent = `${key}(ms)`;
            label.classList.add('capitalize')
            element.appendChild(label);

            // Create an input element
            const input = document.createElement("input");

            if(key === 'sender') {
                const radio1 = document.createElement("input");
                radio1.type = "radio";
                radio1.id = "radio1";
                radio1.name = "sender";
                radio1.value= "someoneElse"
                radio1.checked = messages[index][key] !== 'me';
                radio1.onchange = (event) => {
                    // Update the dataObject with the input's value when a key is pressed
                    messages[index][key] = event.target.checked;
                    cl(key);
                    cl(messages[index][key]);
                };
                const radio1Label = document.createElement("span");
                radio1Label.innerHTML = "Other";
                radio1Label.for="radio1"

                const radioContainer = document.createElement("div");
                const radio2 = document.createElement("input");
                radio2.type = "radio";
                radio2.id = "radio2";
                radio2.name = "sender";
                radio2.value= "me"
                radio2.checked = messages[index][key] === 'me';
                radio2.onchange = (event) => {
                    // Update the dataObject with the input's value when a key is pressed
                    messages[index][key] = event.target.checked;
                    cl(key);
                    cl(messages[index][key]);
                };
                const radio2Label = document.createElement("span");
                radio2Label.innerHTML = "Me";
                radio2Label.for="radio2"
                radio2Label.classList.add('marginX2')

                // Append the input to the div
                radio1Label.prepend(radio1);
                radioContainer.appendChild(radio1Label);
                radio2Label.prepend(radio2);
                radioContainer.appendChild(radio2Label);
                element.appendChild(radioContainer);

            } else if(typeof messages[index][key] === 'boolean') {
                input.type = "checkbox"; // or "file" if you meant to use file inputs
                input.checked = messages[index][key]; // or "file" if you meant to use file inputs
                // Set the onkeydown attribute
                input.onchange = (event) => {
                    // Update the dataObject with the input's value when a key is pressed
                    messages[index][key] = event.target.checked;
                    cl(key);
                    cl(messages[index][key]);
                };
                // Append the input to the div
                element.appendChild(input);
            } else {
                input.type = "text"; // or "file" if you meant to use file inputs
                input.value = messages[index][key]; // or "file" if you meant to use file inputs
                // Set the onkeydown attribute
                input.onkeyup = (event) => {
                    // Update the dataObject with the input's value when a key is pressed
                    messages[index][key] = event.target.value;
                    cl(key);
                    cl(messages[index][key]);
                };
            
                // Append the input to the div
                element.appendChild(input);
    
            }
            // Append the div to the container
            container.appendChild(element);
        });
    } else {
        cl("custom message cannot be edited");
    }
}

function showTypeIndicator() {
    let dots = `
    <div class="typing">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>`
  let typer = document.createElement("div");
  typer.id = "typeIndicator";
  typer.classList.add("typeIndicator");
  typer.innerHTML = dots;
  gebi('bubbleContainer').appendChild(typer);
  scrollToBottom('bubbleContainer');
}

function hideTypeIndicator() {
    // remove all because sometimes they overlap
    document.querySelectorAll('.typeIndicator').forEach(indicator => {
        indicator.remove();
      });
}

function keyboardController(event) {
    // Trigger next message
    // FIXME: crashes - infinite loop
    if(event.key === 'ArrowRight') {
        if(!isTyping) {
            forceSend = true;
            messageIndex -= 1;  // current msg is already loaded
            setupNextMessage(messageIndex);  // 
            forceSend = false;
        }
    }
    // remove last message
    // FIXME: does not set correct next forcetyping when overflowing
    if(event.key === 'ArrowLeft') {
        if(!isTyping && messageIndex > 0) {
            gebi('bubbleContainer').querySelectorAll('.bubbleContainer > .bubbleWrapper:last-of-type')[0]?.remove();
            messageIndex -= 1;  // current msg is already loaded
            messages[messageIndex].sent = false;
        }
    }

    // else key: trigger parent...'s parent controller ..?
}

function changeFontSize(target) {
    let bubbleContainer = gebi('bubbleContainer');
    let chatInput = gebi('inputs');
    /* const cssObj = window.getComputedStyle(gebi('chatInput'), null);
    let fontSize = parseInt(cssObj.getPropertyValue("font-size").split('px')[0]);
    cl(fontSize) */

    bubbleContainer.style.fontSize = target+"px";
    chatInput.style.fontSize = target+"px";
    gebi('fontSize').innerHTML = target+"px";
}