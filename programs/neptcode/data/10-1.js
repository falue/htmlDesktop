let data = [
    `createChart("100%", "300px", "canvasAutoId", "targetAutoId", {
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
            borderColor: colors[1],
            data: notSoRandomInts(60, 95, 100, 666, .003, .003, false)
          },
          {
            label: chooseRandomKeys(2, techwords).join(" "),
            fill: true,
            backgroundColor: colorsTransparent[3],
            tension: .2,
            pointRadius: 0,
            borderColor:  colors[3],
            data: notSoRandomInts(60, 80, 82, 666, .03, 0, false)
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
          scales: {
            y: {
                suggestedMin: 0,
                suggestedMax: 110
            }
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
            data: notSoRandomInts(60, 80, 88, 666, 1, 0.0001, false)
          },
          {
            label: chooseRandomKeys(2, techwords).join(" "),
            fill: false,
            tension: .2,
            pointRadius: 0,
            borderColor: chooseRandomKeys(1, colors),
            data: notSoRandomInts(60, 45, 55, 555, 1, 0.0001, false)
          },
          {
            label: chooseRandomKeys(1, techwords).join(" "),
            fill: false,
            tension: .2,
            pointRadius: 0,
            borderColor: chooseRandomKeys(1, colors),
            data: notSoRandomInts(60, 79, 90, 888, 0.05, 0.0001, false)
          },
          {
            label: chooseRandomKeys(1, techwords).join(" "),
            fill: false,
            tension: .2,
            pointRadius: 0,
            borderColor: chooseRandomKeys(1, colors),
            data: notSoRandomInts(60, 10, 15, 999, 1, 0.0001, false)
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
          scales: {
            y: {
                suggestedMin: 0,
                suggestedMax: 100
            }
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
            data: notSoRandomInts(10, 50, 55, 9999, 2, -.0001, false)
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
          scales: {
            y: {
                suggestedMin: 0,
                suggestedMax: 100
            }
          },
        },
      })`,
];

let out = "";
let printedOut = 666;
