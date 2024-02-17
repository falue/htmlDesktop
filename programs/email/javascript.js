let scene;
let inbox;
let emails = [];
let selectedEmail;
let windowId;
let workstation;
let emailIndex;
let account;

async function setup() {
    /* 
        URL PARAMS:
            scene: defines which folder is searched in programs/email/data/~scene~ folder for the email list.
                   also, defines which email is written when writing a new email
            inbox: defines which inbox is "opened" and defines the filename of the json ion the email/data folder
                   if scene=33 and inbox=customInbox (if inbox empty, default "inbox") it looks for a file called data/33/customInbox.json.
                   if neither scene or inbox specified, it loads the file programs/email/data/default.json

            selected: index of already opened email to display on the right

            account: if specified, is the recipient of all the emails; also the account name when webmail is true
            
            webmail: if true, shows logout button top right and hides program bar in window. Also displays account name near logout button.

            if you click "new email", the file programs/email/data/~scene~/newMail.json is loaded for force typing. Name newMail is fixed.

            other inboxes:
            if a file in data/~scene~/....json is called inbox, drafts, spam, flagged or archived they will show up when clicked on the mailbox.
            if those file do not exists, it will shuffle the emails in data/default.json around.
    */

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let os = urlParams.get('os');
    workstation = urlParams.get('workstation');
    let darkMode = urlParams.get('darkMode');
    let webmail = urlParams.get('webmail');
    account = urlParams.get('account') ? urlParams.get('account') : workstation;
    if(urlParams.get('account')) gebi('webmail-account').innerHTML = account;
    
    // Set generic system fonts
    setSystemFont(os);

    if(webmail === "true") {
        show('webmail');
    } else {
        show('programBar');
        gebi('header').style.paddingTop = '1.75em'
    }

    scene = urlParams.get('scene');
    inbox = urlParams.get('inbox');
    if(scene) {
        emails = await parseFile(
        `data/${scene}/${inbox ? inbox : 'inbox'}.json`
        );
        // use typeof for when in webmail (its a frame in a frame, needs parent.parent.addWindow)
        gebi('newEmailButton').setAttribute("onclick", `if(typeof parent.addWindow !== 'undefined') { parent.addWindow('Write new email', 'mark_email_unread', 'email/write.html?scene=${scene}', 5,5, 666,450, false) } else { parent.parent.addWindow('Write new email', 'mark_email_unread', 'email/write.html?scene=${scene}', 5,5, 666,450, false) }`);
    } else {
        emails = await parseFile(
            `data/default.json`
        );
        // use typeof for when in webmail (its a frame in a frame, needs parent.parent.addWindow)
        gebi('newEmailButton').setAttribute("onclick", `if(typeof parent.addWindow !== 'undefined') { parent.addWindow('Write new email', 'mark_email_unread', 'email/write.html', 5,5, 666,450, false) } else { parent.parent.addWindow('Write new email', 'mark_email_unread', 'email/write.html', 5,5, 666,450, false) }`);
    }

    if(inbox) {
        gebi('inbox-name').innerHTML = `Mailbox: ${inbox} - ${emails.length} Emails`;
    }
    
    selectedEmail = urlParams.get('selected');
    if(selectedEmail) {
        selectedEmail = parseInt(selectedEmail);
        previewEmail(selectedEmail, inbox);
    /* } else {
        gebi('preview-email').innerHTML = "no email to display"; */
    }
    
    if(emails.length) {
        createEmailOverview(emails, inbox);
    } else {
        gebi('email-list-container').innerHTML="No emails to display";
    }
}

async function setupWriteEmail() {
    cl('do stuff when writing');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let  currentScene = urlParams.get('scene');
    windowId = urlParams.get('windowId');

    if(currentScene) {
        let writeEmail = await parseFile(
            `data/${currentScene}/newEmail.json`
            );
        if(writeEmail.to.length) gebi('to').setAttribute('onkeydown', `forceType(event, this, '${writeEmail.to}')`);
        if(writeEmail.cc.length) gebi('cc').setAttribute('onkeydown', `forceType(event, this, '${writeEmail.cc}')`);
        if(writeEmail.bcc.length) gebi('bcc').setAttribute('onkeydown', `forceType(event, this, '${writeEmail.bcc}')`);
        if(writeEmail.subject.length) gebi('subject').setAttribute('onkeydown', `forceType(event, this, '${writeEmail.subject}')`);
        if(writeEmail.message.length) gebi('message').setAttribute('onkeydown', `forceType(event, this, '${writeEmail.message.replace(/(<([^>]+)>)/gi, " ")}')`);
    }
}

function clearEmail() {
    gebi('to').value='';
    gebi('cc').value='';
    gebi('bcc').value='';
    gebi('subject').value='';
    gebi('message').value='';
}

async function sendEmail() {
    gebi('body').classList.add('op50');
    gebi('send-button').innerHTML="Sending..";
    setTimeout(() => {
        parent.showSystemMessage({title: `Email sent`, description: gebi('to').value.length ? 'To: '+gebi('to').value : '', icon:"email", timeOut: 1500});
        parent.closeWindow(windowId);
    }, 2000);
}

async function setupReadEmail() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let  currentScene = urlParams.get('scene');
    let  currentInbox = urlParams.get('inbox');
    let  currentSelected = urlParams.get('selected');

    emails = await parseFile(
        `data/${currentScene}/${currentInbox}.json`, false
    );

    if(!emails.length) {
        emails = await parseFile(
            `data/default.json`, false
        );
    }

    gebi('preview-header').innerHTML = createHeader(emails[currentSelected]);
    gebi('preview-email').innerHTML = emails[currentSelected].message;
}

async function displayInbox(name) {
    // inbox = name;
    let path = name !== 'default' && scene ? `data/${scene}/${name}.json` : `data/default.json`;
    emails = await parseFile(path, false);
    if(emails === 404 || name === 'default') {
        // name.json does not exist - use default and shuffle!
        emails = await parseFile(`data/default.json`);
        emails = shuffle(emails);
    }
    gebi('inbox-name').innerHTML = `Mailbox: ${name} - ${emails.length} Emails`;
    createEmailOverview(emails, name);
}

function createEmailOverview(data, name) {
    let messagesList = gebi('email-list-container');
    messagesList.innerHTML= "";

    let fromTo = name === 'sent' ? 'to' :'from';

    data.forEach((email, index) => {
        // Create the main div for the email
        const p = document.createElement('p');
        p.setAttribute('onclick', `previewEmail(${index}, '${name}'); this.classList.remove('unread')`);
        p.setAttribute('tabIndex', '0');
        // Fixme: if emails reverts to data/default.json, this does not work
        p.setAttribute("ondblclick", `if(typeof parent.addWindow !== 'undefined') { parent.addWindow('Email ${fromTo} ${email.sender.name}', 'email', 'email/read.html?scene=${scene}&inbox=${inbox}&selected=${index}', 5,5, 666,450, false) } else { parent.parent.addWindow('Email from ${email.sender.name}', 'email', 'email/read.html?scene=${scene}&inbox=${inbox}&selected=${index}', 5,5, 666,450, false) }`);
        if(email.flags.spam) p.classList.add('spam');

        // Create and append the sender name as a <p>
        const sender = document.createElement('div');
        sender.classList.add('sender');
        /* sender.textContent = `${index}. From: ${email.sender.name}`; */
        sender.innerHTML = `<span class='op50 italics capitalize'>${fromTo}:</span> ${printHtmlEntities(email.sender.name)}`;
        p.appendChild(sender);

        // Create and append the subject as an <h3>
        const subject = document.createElement('h3');
        subject.textContent = email.subject;
        p.appendChild(subject);
        
        if(!email.flags.read) {
            p.classList.add('unread');
            // subject.textContent = `!! ${email.subject}`;
        }

        // Create and append the message as a <p>, removing HTML entities and limiting to 100 chars
        const message = document.createElement('div');
        const cleanMessage = email.message.replace(/(<([^>]+)>)/gi, " "); // .substring(0, 100);
        message.textContent = cleanMessage;
        message.classList.add('summary');
        p.appendChild(message);

        // Add the complete div to the array
        messagesList.appendChild(p);
        if(selectedEmail === index) p.focus();
    });
}

function previewEmail(index, name) {
    let fromTo = name === 'sent' ? 'to' :'from';
    emailIndex = index;
    show('preview-header');
    gebi('preview-email').classList.remove('emptyPreview');
    emails[index].flags.read = true;
    let header = gebi('preview-header');
    let headerContent = createHeader(emails[index], fromTo);
    header.innerHTML = headerContent;
    gebi('preview-email').innerHTML = emails[index].message;
}

function createHeader(email, fromTo="from") {
    email = `<div class='relative'>
        <div class='left top relative avatar greyBg white uppercase'>
            ${email.sender.avatar ? email.sender.avatar : email.sender.name[0] }
        </div>
        <div style='padding-left:3.5em'>
          <div class='small'>
          <span class='op50 italics capitalize'>${fromTo}:</span> ${printHtmlEntities(email.sender.name)}
          </div>
          <div class='marginY25' style='width:calc(100% - 3em)'>
            ${email.subject}
          </div>
          <div>
            <span class='small'>${workstation === 'generic' || !workstation ? account && account !== 'generic' ? 'To: '+ account : '' : 'To: '+account ? account : workstation}</span>
          </div>
        </div>
        <div class='right top relative op50 small'>
        ${email.date}
        </div>
        <div class='right bottom relative op50'>
            <i class="material-icons small">attachment</i>
            <i class="material-icons small" onclick="printEmail()">print</i>
        </div>
    </div>`;
    return email
}

function printHtmlEntities(text) {
    return text.replace(/[\u00A0-\u9999<>\&]/g, i => '&#'+i.charCodeAt(0)+';');
}

// Yes we're all mad here
function printEmail() {
    let mail = emails[emailIndex];
    let print = `${[`From: ${mail.sender.name} - ${mail.date}`, `<h3>${mail.subject}</h3>`].join('<br>')}<br><br>${mail.message}<hr>`;

    if(parent.parent) {
        parent.parent.addWindow(`Print Email "${mail.subject}"`, 'print', `print/index.html?printText=${encodeURI(print)}&pages=1`, 22,13, 800,555, false);
    } else {
        parent.addWindow(`Print Email "${mail.subject}"`, 'print', `print/index.html?printText=${encodeURI(print)}&pages=1`, 22,13, 800,555, false);
    }
}