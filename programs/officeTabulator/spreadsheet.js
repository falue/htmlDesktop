// Function to load CSV from a path (URL or file path)
async function loadCsv(path, resetStyles = true) {
  try {
    const response = await fetch(path);
    const csv = await response.text(); // Wait for the CSV content
    processCsv(csv, resetStyles); // Process the CSV once it's fully loaded
  } catch (error) {
    console.error("Error loading CSV:", error);
  }
}

// Function to load CSV from file input
function loadCsvFromFileInput(event) {
  const file = event.target.files[0]; // Get the first selected file
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const csv = e.target.result; // The CSV file content
      processCsv(csv); // Process the CSV
    };
    reader.readAsText(file); // Read the file content as text
  } else {
    console.error("No file selected");
  }
}

// Function to process and display the CSV data
function processCsv(csv, resetStyles = true) {
    // Parse the CSV while ignoring commas inside double quotes
    const rows = parseCSV(csv);
  
    // Remove the first row (it contains column definitions and should not be displayed)
    const columnDefinitions = rows.shift();
  
    // Ensure at least 12 columns and 66 rows
    const columnCount = Math.max(rows[0].length, 12);
    const rowCount = Math.max(rows.length, 66);
  
    // Initialize the table with at least 12 columns and 46 rows
    if(resetStyles) {
      initializeTable(columnCount, rowCount);
    }
  
    // Process the first row to set column widths
    const headerRow = document
      .getElementById("spreadsheet")
      .getElementsByTagName("thead")[0]
      .getElementsByTagName("tr")[0];
    columnDefinitions.forEach((definition, colIndex) => {
      const match = definition.match(/\[width:(\d+px)\]/);
      if (match) {
        const width = match[1];
        const th = headerRow.getElementsByTagName("th")[colIndex + 1]; // +1 to skip row header
        th.style.width = width;
      }
    });
  
    // Populate table with CSV data
    const table = document
      .getElementById("spreadsheet")
      .getElementsByTagName("tbody")[0];
    rows.forEach((row, rowIndex) => {
      const tr = table.getElementsByTagName("tr")[rowIndex];
  
      row.forEach((cell, cellIndex) => {
        const td = tr.getElementsByTagName("td")[cellIndex];
        const input = td.getElementsByTagName("input")[0];
  
        // Extract the value and any classes/styles
        const cellMatch = cell.match(/(.*)\[(.*)\]$/);
        let value = cell.trim();
        if (cellMatch) {
          value = cellMatch[1].trim();
          const attributes = cellMatch[2]
            .split(";") // Split by semicolon
            .map((attr) => attr.trim()) // Trim whitespace from each attribute
            .filter((attr) => attr.length); // Remove empty attributes (in case of trailing semicolon)
  
          attributes.forEach((attr) => {
            if (attr.includes(":")) {
              // This is a style or attribute (e.g., colspan:3 or color:red)
              const [key, val] = attr.split(":").map((str) => str.trim());
              if (key === "colspan" && val) {
                td.colSpan = parseInt(val);
              } else if (key === "forceType") {
                const strippedVal = val.replace(/^'(.*)'$/, '$1');
                input.setAttribute("onkeydown", `forceType(event, this, '${strippedVal}', false, true)`);
              } else {
                input.style[key] = val;
              }
            } else {
              // This is a class
              input.classList.add(attr);
            }
          });
        }
        // Set the cleaned value to the input field
        input.value = value;
      });
    });
  
    // Reapply resizing after updating the table
    handleColumnResizing();
    handleRowResizing();
}
  
function resetFile() {
  loadCsv(`data/${scene}.csv`, false);
}

// Function to initialize the table with headers and empty cells
function initializeTable(columnCount = 12, rowCount = 46) {
  const table = document.getElementById("spreadsheet");
  const tbody = table.getElementsByTagName("tbody")[0];
  const thead = table.getElementsByTagName("thead")[0];

  // Ensure minimum 12 columns and 46 rows
  columnCount = Math.max(columnCount, 12);
  rowCount = Math.max(rowCount, 46);

  // Clear existing rows
  tbody.innerHTML = "";
  thead.innerHTML = "";

  // Create headers for the columns (A to as many as needed)
  const headerRow = document.createElement("tr");
  const fixedHeader = document.createElement("th"); // Empty top-left corner
  fixedHeader.style.width = "50px"; // Fixed width for row number column
  headerRow.appendChild(fixedHeader);

  // Create column headers (A, B, C, ..., Z, AA, AB, etc. if needed)
  for (let i = 0; i < columnCount; i++) {
    const th = document.createElement("th");
    th.textContent = getColumnLetter(i); // Column A, B, C, etc.
    th.style.width = "100px"; // Default initial width
    th.classList.add("resizable-column");
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);

  // Create rows numbered 1 to rowCount
  for (let i = 0; i < rowCount; i++) {
    const tr = document.createElement("tr");

    // Create row header (1 to rowCount)
    const th = document.createElement("th");
    th.textContent = i + 1;
    th.classList.add("resizable-row");
    //th.style.width = '50px'; // Width of row number column
    tr.appendChild(th);

    // Create cells with input elements
    for (let j = 0; j < columnCount; j++) {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "text";
      /* input.setAttribute("onfocus", "this.classList.add('focus')"); */
      /* input.setAttribute("onfocus", "setFocus(this)"); */
      /* input.setAttribute("onfocus", "document.getElementsByClassname('focus')[0].classList.remove('focus'); this.classList.add('focus')"); */
      input.style.width = "100%"; // Make sure input takes the full width of the cell
      input.style.height = "100%"; // Make sure input takes the full height of the cell
      td.appendChild(input);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  setTabulatorFont(gebi('tabulatorFont').value);
  setFontSize(gebi('fontSize').value);
  setBgColor(gebi('bgColorInput').value);
  setBorderColor(gebi('borderColorInput').value);
  setFontColor(gebi('fontColorInput').value);
  zoomTable(gebi('zoomScale').value);

}

// Helper function to convert a number to a column letter (e.g., 0 -> A, 25 -> Z, 26 -> AA)
function getColumnLetter(index) {
  let letter = "";
  while (index >= 0) {
    letter = String.fromCharCode((index % 26) + 65) + letter;
    index = Math.floor(index / 26) - 1;
  }
  return letter;
}

// Function to parse CSV while ignoring commas inside double quotes
function parseCSV(csv) {
  const rows = [];
  const lines = csv.split("\n"); // Split the CSV into lines

  lines.forEach((line) => {
    const cells = [];
    let cell = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      // If we encounter a double quote, toggle the insideQuotes flag
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        // If we hit a comma and we're not inside quotes, it's the end of a cell
        cells.push(cell.trim());
        cell = ""; // Reset the cell
      } else {
        // Otherwise, just keep adding characters to the current cell
        cell += char;
      }
    }
    // Add the last cell in the row
    cells.push(cell.trim());
    rows.push(cells);
  });

  return rows;
}

// Function to handle column resizing
function handleColumnResizing() {
  const columns = document.querySelectorAll(".resizable-column");
  columns.forEach(function (th) {
    th.addEventListener("mousedown", function (e) {
      const startX = e.pageX;
      const startWidth = th.offsetWidth;
      const onMouseMove = function (e) {
        const newWidth = startWidth + (e.pageX - startX);
        th.style.width = newWidth + "px"; // Adjust width in pixels
      };
      const onMouseUp = function () {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  });
}

// Function to handle row resizing
function handleRowResizing() {
  const rows = document.querySelectorAll(".resizable-row");
  rows.forEach(function (th) {
    th.addEventListener("mousedown", function (e) {
      const startY = e.pageY;
      const startHeight = th.offsetHeight;
      const onMouseMove = function (e) {
        const newHeight = startHeight + (e.pageY - startY);
        th.parentElement.style.height = newHeight + "px"; // Adjust height in pixels
      };
      const onMouseUp = function () {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  });
}

function setTabulatorFont(fontName) {
  gebi('spreadsheet').style.fontFamily = fontName;
}

function setFontSize(size) {
  let focusedElements = document.getElementsByClassName('focus');
  if(focusedElements.length > 0) {
    focusedElements[0].style.fontSize = parseInt(size)/12 + "em";
  } else {
    gebi('spreadsheet').style.fontSize = parseInt(size)/12 + "em";
  }
}

function setBgColor(color) {
    cl("setBgColor: " + color);
    gebi('spreadsheetContainer').style.backgroundColor = color;
    gebi('spreadsheet').style.backgroundColor = color;
}

function setBorderColor(color) {
    cl("setBorderColor: " + color);
    // Select all <th> and <td> elements inside the table
    const cells = document.querySelectorAll('#spreadsheet th, #spreadsheet td');
    // Loop through all <th> and <td> elements and change their border color
    cells.forEach(function(cell) {
        cell.style.borderColor = color;
    });
}

function setFontColor(color) {
    cl("setFontColor: " + color);
    gebi('spreadsheet').style.color = color;
}

function toggleRulers(hideRulers=2) {
  let rulers = document.getElementsByTagName('th');
  cl(hideRulers);
  for(let i = 0;i < rulers.length; i++) {
    if(hideRulers===false) {
      rulers[i].classList.remove('op0');
    } else if(hideRulers===true) {
      rulers[i].classList.add('op0');
    } else if(hideRulers===2) {
      rulers[i].classList.toggle('op0');
    }
  }
}

let currentZoom = 100; // Start with 100%, meaning no zoom applied initially

function zoomTable(newZoom) {
    const table = document.getElementById('spreadsheet');

    // Clamp the new zoom level between 10% and 300%
    newZoom = Math.max(10, Math.min(newZoom, 300));

    // Apply the zoom to the table using CSS transform: scale
    table.style.transform = `scale(${newZoom / 100})`;
    table.style.transformOrigin = 'top left'; // Ensure zoom happens from the top-left corner

    // Update the current zoom level
    currentZoom = newZoom;
    gebi('currentZoom').innerHTML = currentZoom+"%"

    // Update the slider's value to reflect the current zoom
    document.getElementById('zoomScale').value = newZoom; 
}
