function typing(event, value) {
  /* console.log(event.key); */
  if (event.key === 'Enter') {
    search(value);
  }
}

function goToHome() {
  if(document.getElementById('body').classList.contains('results')) {
    reset();
  }
}

function reset() {
  // RESET SEARCH TO HOME
  swapClasses('body', 'home', 'results');
  document.getElementById('searchbarInput').value = "";
  document.getElementById('iframeSpoofUrl').innerHTML = "https://qsearch.ch";
  setParentTitle("QSEARCH");
  document.getElementById('resultsList').innerHTML = "<span class='grey'>No Results.</span>";
}

function search(value) {
  /* console.log("search begins: " + value); */
  /* window.location = 'searchresults.html?q='+ document.getElementById('searchbarInput').value; */
  for(term in searchTerms) {
    if(isAboutEqual(term, value)) {
      /* console.log(term + " > MATCH"); */
      // Replace UNIK URL..
      //   ..with correct searchterm
      document.getElementById('iframeSpoofUrl').innerHTML = "https://qsearch.ch/q/"+term;
      document.getElementById('searchbarInput').value = term;  // Replace search input with correct term
      //   ..with whatever is typed
      // document.getElementById('iframeSpoofUrl').innerHTML = "https://qsearch.ch/q/"+encodeURIComponent(value);
      setParentTitle("QSEARCH - " + term);
      displayResults(searchTerms[term]);
      if(document.getElementById('body').classList.contains('home')) swapClasses("body", "home", "results");
      break;
    } else {
      /* console.log(term + " > NO MATCH"); */
    }
  }
}

function setParentTitle(value) {
  changeTitle(value);
  parent.setNewTitle();  // FUNCTION OF UNIX browser js
}

function displayResults(data) {
  let results = document.getElementById('resultsList');
  document.getElementById('resultsList').innerHTML = "";
  /*   console.log(data); */
  for (let i = 0; i < data.length; i++) {
    let url = data[i][0];
    let spoofUrl = data[i][1];
    let title = data[i][2];
    let desc = data[i][3];

    let container = document.createElement("div");
    if(url) {
      container.onclick = function() {
        window.location = url;
      };
    }

    let spoofUrlSpan = document.createElement("span");
    spoofUrlSpan.innerHTML = spoofUrl;
    let titleSpan = document.createElement("span");
    titleSpan.innerHTML = title;
    let descSpan = document.createElement("span");
    descSpan.innerHTML = desc;

    container.append(spoofUrlSpan, titleSpan, descSpan);
    results.append(container);
  }
}

function isAboutEqual(a, b, sensitivity) {
  sensitivity = sensitivity ? sensitivity : 50;
  let percent = compare(a, b);
  /* return (percent >= sensitivity) + " (" + percent + "%)"; */
  return percent > sensitivity;
}

function compare(a, b) {
  let lenA = a.length;
  let levDist = levenshteinDistance(a, b);
  let percentage = 100 - (100 / lenA) * levDist;
  return percentage;
}

function levenshteinDistance(a, b) {
  if (a.length == 0) return b.length;
  if (b.length == 0) return a.length;
  var matrix = [];

  // increment along the first column of each row
  var i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1
          )
        ); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
}

// Levenstein test
function test() {
  document.getElementById("test").innerHTML =
    '"Metis", "metis": ' +
    (isAboutEqual("Metis", "metis")
      ? "<i class='green bold'>MATCH</i>"
      : "<i class='red'>no match</i>") +
    "<br>";
  document.getElementById("test").innerHTML +=
    '"AAAA", "A": ' +
    (isAboutEqual("AAAA", "A")
      ? "<i class='green bold'>MATCH</i>"
      : "<i class='red'>no match</i>") +
    "<br>";
  document.getElementById("test").innerHTML +=
    '"AAAA", "AA": ' +
    (isAboutEqual("AAAA", "AA")
      ? "<i class='green bold'>MATCH</i>"
      : "<i class='red'>no match</i>") +
    "<br>";
  document.getElementById("test").innerHTML +=
    '"AAAA", "AAA": ' +
    (isAboutEqual("AAAA", "AAA")
      ? "<i class='green bold'>MATCH</i>"
      : "<i class='red'>no match</i>") +
    "<br>";
  document.getElementById("test").innerHTML +=
    '"AAAA", "AAAA": ' +
    (isAboutEqual("AAAA", "AAAA")
      ? "<i class='green bold'>MATCH</i>"
      : "<i class='red'>no match</i>") +
    "<br>";
  document.getElementById("test").innerHTML +=
    '"AAAA", "AAAAA": ' +
    (isAboutEqual("AAAA", "AAAAA")
      ? "<i class='green bold'>MATCH</i>"
      : "<i class='red'>no match</i>") +
    "<br>";
  document.getElementById("test").innerHTML +=
    '"AAAA", "AAAAAAAAA": ' +
    (isAboutEqual("AAAA", "AAAAAAAAA")
      ? "<i class='green bold'>MATCH</i>"
      : "<i class='red'>no match</i>") +
    "<br>";

  document.getElementById("test").innerHTML +=
    '"A", "AAAA": ' +
    (isAboutEqual("A", "AAAA")
      ? "<i class='green bold'>MATCH</i>"
      : "<i class='red'>no match</i>") +
    "<br>";
  document.getElementById("test").innerHTML +=
    '"AA", "AAAA": ' +
    (isAboutEqual("AA", "AAAA")
      ? "<i class='green bold'>MATCH</i>"
      : "<i class='red'>no match</i>") +
    "<br>";
  document.getElementById("test").innerHTML +=
    '"AAA", "AAAA": ' +
    (isAboutEqual("AAA", "AAAA")
      ? "<i class='green bold'>MATCH</i>"
      : "<i class='red'>no match</i>") +
    "<br>";
  document.getElementById("test").innerHTML +=
    '"AAAA", "AAAA": ' +
    (isAboutEqual("AAAA", "AAAA")
      ? "<i class='green bold'>MATCH</i>"
      : "<i class='red'>no match</i>") +
    "<br>";
  document.getElementById("test").innerHTML +=
    '"AAAAA", "AAAA": ' +
    (isAboutEqual("AAAAA", "AAAA")
      ? "<i class='green bold'>MATCH</i>"
      : "<i class='red'>no match</i>") +
    "<br>";
  document.getElementById("test").innerHTML +=
    '"AAAA", "AAAAAAAAA": ' +
    (isAboutEqual("AAAAAAAAA", "AAAA")
      ? "<i class='green bold'>MATCH</i>"
      : "<i class='red'>no match</i>") +
    "<br>";

  document.getElementById("test").innerHTML +=
    '"metis", "metis": ' +
    (isAboutEqual("metis", "metis")
      ? "<i class='green bold'>MATCH</i>"
      : "<i class='red'>no match</i>") +
    "<br>";
    document.getElementById("test").innerHTML +=
      '"Metis", "Sapienz": ' +
      (isAboutEqual("Metis", "Sapienz")
        ? "<i class='green bold'>MATCH</i>"
        : "<i class='red'>no match</i>") +
      "<br>";
      document.getElementById("test").innerHTML +=
        '"Sapienz", "Metis": ' +
        (isAboutEqual("Sapienz", "Metis")
          ? "<i class='green bold'>MATCH</i>"
          : "<i class='red'>no match</i>") +
        "<br>";
  document.getElementById("test").innerHTML +=
    '"Metis", "Meetis": ' +
    (isAboutEqual("Metis", "Meetis")
      ? "<i class='green bold'>MATCH</i>"
      : "<i class='red'>no match</i>") +
    "<br>";
  document.getElementById("test").innerHTML +=
    '"Metis", "aMetis": ' +
    (isAboutEqual("Metis", "aMetis")
      ? "<i class='green bold'>MATCH</i>"
      : "<i class='red'>no match</i>") +
    "<br>";
  document.getElementById("test").innerHTML +=
    '"Metis", "Metisz very shitty": ' +
    (isAboutEqual("Metis", "Metisz very shitty")
      ? "<i class='green bold'>MATCH</i>"
      : "<i class='red'>no match</i>") +
    "<br>";
  document.getElementById("test").innerHTML +=
    '"Metis", "12345": ' +
    (isAboutEqual("Metis", "12345")
      ? "<i class='green bold'>MATCH</i>"
      : "<i class='red'>no match</i>") +
    "<br>";
  document.getElementById("test").innerHTML +=
    '"Metis", "12345/&%ç": ' +
    (isAboutEqual("Metis", "12345/&%ç")
      ? "<i class='green bold'>MATCH</i>"
      : "<i class='red'>no match</i>") +
    "<br>";
  document.getElementById("test").innerHTML +=
    '"Metis", "äöüöä`!)([]": ' +
    (isAboutEqual("Metis", "äöüöä`!)([]")
      ? "<i class='green bold'>MATCH</i>"
      : "<i class='red'>no match</i>") +
    "<br>";
}
