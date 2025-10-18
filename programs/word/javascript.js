let editor;
let scene;
let wordContent;
let forcetype = false;

async function setup() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let os = urlParams.get("os");
  let workstation = urlParams.get("workstation");
  let darkMode = urlParams.get("darkMode");
  scene = urlParams.get("scene");
  file = urlParams.get("file");
  forcetype = urlParams.get("forcetype") == "true";

  // Set generic system fonts
  setSystemFont(os);

  setWysiwygEditor();

  // Set starting content
  if(scene) {
    file = file ? file : 'index';
    let path = `data/${scene}/${file}.html`
    loadDoc(path);
  }

}

function loadDoc(path) {
  fetch(path)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} – ${response.statusText}`)
      }
      return response.text()
    })
    .then(html => {
      wordContent = html;
      editor.content.innerHTML = wordContent;
      toggleForceType(forcetype);
    })
    .catch(err => {
      console.error('Failed to load HTML:', err);
      alert("404 - Document not found. Path: " + path)
      // editor.content.innerHTML = `<p style="color:red;">⚠️ Failed to load <code>${path}</code></p>`
    })
}

function hyperlink(path) {
  path = `data/${scene ? scene +'/' : ''}${path}`
  loadDoc(path);
}

function setWysiwygEditor() {
  editor = pell.init({
    element: document.getElementById("editor"),
    // onChange: (html) => console.log(html),
    onChange: () => {},
    actions: actions
  });
}

function toggleForceType(enabled) {
  const container = document.querySelector('.pell-content');
  if (container) {
    const elements = container.querySelectorAll('*:not(br)');
    elements.forEach((el, i) => {
      if(enabled) {
        // Give every element inside editor a forcetype thing.
        let maxText=el.innerText.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\n/g,"\\n");
        el.innerHTML = maxText;
        el.id = `forceTypeElement-${i}`;
        el.class = "forcetype";
        el.setAttribute("contenteditable", "true");
        el.setAttribute("ondblclick", `this.innerHTML='';`);
        el.onkeydown = new Function(
          "event",
          `event.preventDefault();
          forceType(event, this, '${maxText}', function(){ focusNextForceType(${i + 1}); });
          placeCaretAtEnd(this);
          `
        );
      } else {
        // Remove every forcetype thing.
        el.removeAttribute('onkeydown');
        el.removeAttribute('ondblclick');
        el.removeAttribute("contenteditable");
      }
    });

    if(enabled) {
      gebi('bolt-action').innerHTML = "flash_auto";
      focusNextForceType(0);  // Start at beginning
      container.setAttribute("contenteditable", "false");
    } else {
      gebi('bolt-action').innerHTML = "bolt";
      container.setAttribute("contenteditable", "true");
    }
  } else {
    cl("no container :(")
  }
}

function placeCaretAtEnd(el) {
  // Only move caret if this element is still the focused one
  if (document.activeElement !== el) return;

  if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false); // false → end of content
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

function focusNextForceType(next) {
  let nextEl = gebi(`forceTypeElement-${next}`);
  if(nextEl) {
    nextEl.focus();
    placeCaretAtEnd(nextEl);
  } else {
    console.log("reached end of editable content")
  }
}

function changeFontSize(increment) {
  const container = gebi('editor'); // or document.getElementById('editor')
  // get current font size (inline or computed)
  const currentSize = parseFloat(
    container.style.fontSize ||
    getComputedStyle(container).fontSize
  );
  const newSize = currentSize + increment;
  container.style.fontSize = newSize + 'px';
  console.log('old:', currentSize, '→ new:', newSize);
}


// pell actions
const actions = [
  // File etc
  { name: 'open', icon: '<i class="material-icons medium">file_open</i>', title: 'Open Document', result: () => {} },
  { name: 'save', icon: '<i class="material-icons medium">save</i>', title: 'Save Document', result: () => {} },
  { name: 'new', icon: '<i class="material-icons medium">note_add</i>', title: 'New Document', result: () => {} },
  { name: '', icon: '', title: 'partition', result: () => {} },
  
  // UNDO/REDO
  { name: 'undo', icon: '<i class="material-icons small">undo</i>', title: 'Undo', result: () => pell.exec('undo') },
  { name: 'forceType', icon: '<i class="material-icons small" id="bolt-action">bolt</i>', title: 'toggle forceType this document', result: () => {
      forcetype = !forcetype;
      toggleForceType(forcetype);
    }
  },
  { name: 'redo', icon: '<i class="material-icons small">redo</i>', title: 'Redo', result: () => pell.exec('redo') },
  { name: '', icon: '', title: 'partition', result: () => {} },
  
  // TEXT STYLE
  // { name: 'title1', icon: '<span style="font-weight:bold; color:#666; margin:0 4px;">TEXT</span>', title: 'Formatting tools', result: () => {} },
  { name: 'bold', icon: '<b>B</b>', title: 'Bold', result: () => pell.exec('bold') },
  { name: 'italic', icon: '<i>I</i>', title: 'Italic', result: () => pell.exec('italic') },
  { name: 'underline', icon: '<u>U</u>', title: 'Underline', result: () => pell.exec('underline') },
  { name: 'strikeThrough', icon: '<s>S</s>', title: 'Strike', result: () => pell.exec('strikeThrough') },
  { name: 'subscript', icon: 'x<sub class="tiny">2</sub>', title: 'Subscript', result: () => pell.exec('subscript') },
  { name: 'superscript', icon: 'x<sup class="tiny">2</sup>', title: 'Superscript', result: () => pell.exec('superscript') },
  { name: 'removeFormat', icon: '<i class="material-icons small">format_clear</i>', title: 'Remove format', result: () => pell.exec('removeFormat') },
  { name: '', icon: '', title: 'partition', result: () => {} },
  
  // BLOCK / HEADINGS
  { name: 'paragraph', icon: '¶', title: 'Paragraph', result: () => pell.exec('formatBlock', '<P>') },
  { name: 'h1', icon: '<b>H1</b>', title: 'Heading 1', result: () => pell.exec('formatBlock', '<H1>') },
  { name: 'h2', icon: '<b>H2</b>', title: 'Heading 2', result: () => pell.exec('formatBlock', '<H2>') },
  { name: 'blockquote', icon: '❝❞', title: 'Quote', result: () => pell.exec('formatBlock', '<BLOCKQUOTE>') },
  { name: 'pre', icon: '&lt;/&gt;', title: 'Preformatted', result: () => pell.exec('formatBlock', '<PRE>') },
  { name: '', icon: '', title: 'partition', result: () => {} },
  
  // LISTS
  { name: 'ul', icon: '<i class="material-icons medium">format_list_bulleted</i>', title: 'Bulleted list', result: () => pell.exec('insertUnorderedList') },
  { name: 'ol', icon: '<i class="material-icons medium">format_list_numbered</i>', title: 'Numbered list', result: () => pell.exec('insertOrderedList') },
  { name: '', icon: '', title: 'partition', result: () => {} },
  
  // ALIGNMENT
  { name: 'indent', icon: '<i class="material-icons medium">format_indent_increase</i>', title: 'Indent', result: () => pell.exec('indent') },
  { name: 'outdent', icon: '<i class="material-icons medium">format_indent_decrease</i>', title: 'Outdent', result: () => pell.exec('outdent') },
  { name: 'left', icon: '<i class="material-icons medium">format_align_left</i>', title: 'Align left', result: () => pell.exec('justifyLeft') },
  { name: 'center', icon: '<i class="material-icons medium">format_align_center</i>', title: 'Align center', result: () => pell.exec('justifyCenter') },
  { name: 'right', icon: '<i class="material-icons medium">format_align_right</i>', title: 'Align right', result: () => pell.exec('justifyRight') },
  { name: 'justify', icon: '<i class="material-icons medium">format_align_justify</i>', title: 'Justify', result: () => pell.exec('justifyFull') },
  { name: '', icon: '', title: 'partition', result: () => {} },
  
  // LINKS & MEDIA
  // REAL link 
  /* { name: 'link', icon: '<i class="material-icons medium">link</i>', title: 'Insert link', result: () => {
    const url = prompt('Enter URL:')
    if (url) pell.exec('createLink', url)
  }
}, */
// FAKE hyperlink
{ name: 'link',
icon: '<i class="material-icons medium">link</i>',
title: 'Insert link',
result: () => {
  // const scene = 'myscene' // or use your real variable
  const url = prompt(`Enter hyperlink (from 'data/${scene}/'):`)
  if (!url) return
  
  const sel = window.getSelection()
  const originalContent = sel.toString() || 'link'
  
  pell.exec(
    'insertHTML',
    `<a href="#" onclick="hyperlink('${url}');">${originalContent}</a>`
    )
  }
},

{ name: 'unlink', icon: '<i class="material-icons medium">link_off</i>', title: 'Remove link', result: () => pell.exec('unlink') },
{ name: 'image', icon: '<i class="material-icons medium">photo_size_select_actual</i>', title: 'Insert image', result: () => {
  const url = prompt('Image URL:')
  if (url) pell.exec('insertImage', url)
}
},
{ name: '', icon: '', title: 'partition', result: () => {} },
{ name: 'hr', icon: '―', title: 'Horizontal rule', result: () => pell.exec('insertHorizontalRule') },
{ name: '', icon: '', title: 'partition', result: () => {} },

  // COLORS & FONT
  { name: 'color', icon: '<i class="material-icons small red">palette</i>', title: 'Text color', result: () => {
      const c = prompt('Text color (e.g. red, #f00, rgb(255,0,0))')
      if (c) pell.exec('foreColor', c)
    }
  },
  { name: 'highlight', icon: '<i class="material-icons small green">format_color_fill</i>', title: 'Highlight', result: () => {
      const c = prompt('Highlight color (background)?')
      if (c) pell.exec('hiliteColor', c)
    }
  },
  { name: 'font', icon: '<i class="material-icons small blue">font_download</i>', title: 'Font family', result: () => {
      const f = prompt('Font name (e.g. Arial, Courier New)')
      if (f) pell.exec('fontName', f)
    }
  },
  { name: '', icon: '', title: 'partition', result: () => {} },

  // Font sizes
  { name: 'size', icon: '<i class="material-icons small">format_size</i>', title: 'Font size (1-7)', result: () => {
    const s = prompt('Font size (1-7)')
    if (s) pell.exec('fontSize', s)
  }
},
{ name: 'bigger', icon: '<i class="material-icons medium">text_increase</i>', title: 'Increase Document font size', result: () => changeFontSize(0.2) },
{ name: 'smaller', icon: '<i class="material-icons medium">text_decrease</i>', title: 'Decrease Document font size', result: () => changeFontSize(-0.2) },
{ name: '', icon: '', title: 'partition', result: () => {} },
  
  // CUSTOM SPECIAL TAG
  { name: 'special', icon: '⚙️', title: 'Insert special tag', result: () => {
      const content = prompt('Special tag content:');
      pell.exec('insertHTML', `<special>${content || 'special block'}</special>`);
    }
  }
]
