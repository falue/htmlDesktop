let data = [
    `createChart("100%", "300px", "canvasAutoId", "targetAutoId", {
        target: "targetAutoId",
        type: "line",
        data: {
          labels: arrayOfIndexes(60),
          datasets: [{
            label: chooseRandomKeys(1, techwords).join(" "),
            fill: true,
            backgroundColor: chooseRandomKeys(1, colorsTransparent),
            tension: 0,
            pointRadius: 0,
            borderColor: chooseRandomKeys(1, colors),
            data: notSoRandomInts(60, 1, 100, 666, 3, .01, true)
          },
          {
            label: chooseRandomKeys(2, techwords).join(" "),
            fill: false,
            tension: .2,
            pointRadius: 0,
            borderColor: chooseRandomKeys(1, colors),
            data: notSoRandomInts(60, 10, 50, null, 3, 0, true)
          }]
        },
        options: {
          responsive: true, 
          title: {
            display: true,
            text: "inclining numbers",
            fontSize: 16,
            fontColor: 'white',
          },
        },
      })`,
      `createChart("100%", "200px", "canvasAutoId", "targetAutoId", {
        target: "targetAutoId",
        type: "line",
        data: {
          labels: arrayOfIndexes(60),
          datasets: [{
            label: chooseRandomKeys(1, techwords).join(" "),
            fill: false,
            backgroundColor: chooseRandomKeys(1, colorsTransparent),
            tension: 0,
            pointRadius: 0,
            borderColor: chooseRandomKeys(1, colors),
            data: notSoRandomInts(60, 1, 100, 666, 3, .01, true)
          },
          {
            label: chooseRandomKeys(2, techwords).join(" "),
            fill: false,
            tension: .2,
            pointRadius: 0,
            borderColor: chooseRandomKeys(1, colors),
            data: notSoRandomInts(60, 10, 50, null, 3, 0, true)
          },
          {
            label: chooseRandomKeys(1, techwords).join(" "),
            fill: false,
            tension: .2,
            pointRadius: 0,
            borderColor: chooseRandomKeys(1, colors),
            data: notSoRandomInts(60, 10, 50, null, 3, 0, true)
          },
          {
            label: chooseRandomKeys(1, techwords).join(" "),
            fill: false,
            tension: .2,
            pointRadius: 0,
            borderColor: chooseRandomKeys(1, colors),
            data: notSoRandomInts(60, 10, 50, null, 3, 0, true)
          }]
        },
        options: {
          responsive: true, 
          title: {
            display: true,
            text: "inclining numbers",
            fontSize: 16,
            fontColor: 'white',
          },
        },
      })`,
      `createChart("100%", "122px", "canvasAutoId", "targetAutoId", {
        target: "targetAutoId",
        type: "bar",
        data: {
          labels: arrayOfIndexes(15),
          datasets: [
            {
              label: chooseRandomKeys(1, techwords).join(" "),
              backgroundColor: chooseRandomKeys(15, colors),
              data: randomIntsBetween(15, 1, 100),
              stack: true,
              barThickness: 25,
            },
            {
              label: chooseRandomKeys(1, techwords).join(" "),
              backgroundColor: chooseRandomKeys(15, colors),
              data: randomIntsBetween(15, 1, 100),
              stack: true,
              barThickness: 25,
            },
            {
              label: chooseRandomKeys(1, techwords).join(" "),
              backgroundColor: chooseRandomKeys(15, colors),
              data: randomIntsBetween(15, 1, 100),
              stack: true,
              barThickness: 25,
            },
            {
              label: chooseRandomKeys(1, techwords).join(" "),
              backgroundColor: chooseRandomKeys(15, colors),
              data: randomIntsBetween(15, 1, 100),
              stack: true,
              barThickness: 25,
            },
          ],
        },
        options: {
          legend: {display: false},
        },
      })`,
      `createChart("100%", "200px", "canvasAutoId", "targetAutoId", {
        target: "targetAutoId",
        type: "line",
        data: {
          labels: arrayOfIndexes(10),
          datasets: [{
            label: chooseRandomKeys(1, techwords).join(" "),
            fill: false,
            backgroundColor: chooseRandomKeys(1, colorsTransparent),
            tension: 0,
            pointRadius: 0,
            borderColor: chooseRandomKeys(1, colors),
            data: notSoRandomInts(10, 1, 100, 666, 3, .01, true)
          }]
        },
        options: {
          responsive: true, 
          title: {
            display: true,
            text: "inclining numbers",
            fontSize: 16,
            fontColor: 'white',
          },
        },
      })`,
];

let out = "";
let printedOut = 666;
