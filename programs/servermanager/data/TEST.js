let data = [
  {
    target: "target1",
    type: "doughnut",
    data: {
      labels: chooseRandomKeys(5, techwords),
      datasets: [
        {
          backgroundColor: chooseRandomKeys(5, colors),
          borderWidth: 0,
          data: randomIntsBetween(5, 1, 100)
        },
      ],
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: chooseRandomKeys(3, techwords).join(" "),
        fontColor: 'white',
      },
      legend: {
        labels: {
            // This more specific font property overrides the global property
            fontColor: 'white'
        }
      }
    },
  },
  {
    target: "target3",
    type: "line",
    data: {
      labels: arrayOfIndexes(12, "C ", ".00"),
      datasets: [{
        fill: randomBoolean(),
        tension: .35,
        pointRadius: 3,
        borderColor: chooseRandomKeys(1, colors),
        data: randomIntsBetween(12, 1, 100)
      }]
    },
    options: {
      responsive: true, 
      legend: {display: false},
      title: {
        display: true,
        text: "random numbers",
        fontSize: 16,
        fontColor: 'white',
      },
    },
  },
  {
    target: "target2",
    type: "line",
    data: {
      labels: arrayOfIndexes(120),
      datasets: [{
        fill: true,
        backgroundColor: chooseRandomKeys(1, colorsTransparent),
        tension: 0,
        pointRadius: 3,
        borderColor: chooseRandomKeys(1, colors),
        data: notSoRandomInts(120, 1, 100, 1212, 3, .01, true)
      },
      {
        fill: false,
        tension: .2,
        pointRadius: 3,
        borderColor: chooseRandomKeys(1, colors),
        data: notSoRandomInts(120, 10, 50, null, 3, 0, true)
      }]
    },
    options: {
      responsive: true, 
      legend: {display: false},
      title: {
        display: true,
        text: "inclining numbers",
        fontSize: 16,
        fontColor: 'white',
      },
    },
  },

  {
    target: "target6",
    type: "line",
    data: {
      labels: arrayOfIndexes(12, "C ", ".00"),
      datasets: [{
        fill: randomBoolean(),
        tension: .35,
        pointRadius: 3,
        borderColor: chooseRandomKeys(1, colors),
        data: randomIntsBetween(12, 1, 100)
      }]
    },
    options: {
      responsive: true, 
      legend: {display: false},
      title: {
        display: true,
        text: "random numbers",
        fontSize: 16,
        fontColor: 'white',
      },
    },
  },
];
