let data = [
  {
    target: "target1",
    type: "doughnut",
    data: {
      labels: false,
      datasets: [
        {
          backgroundColor: chooseRandomKeys(5, colors),
          borderWidth: 0,
          data: randomIntsBetween(5, 1, 100),
        },
      ],
    },
    options: {
      cutout: "75%",
      radius: "77%",
      responsive: true,
      circumference:  180,
      rotation: 270,
    },
  },
  {
    target: "target2",
    type: "bar",
    data: {
      labels: arrayOfIndexes(15),
      datasets: [
        {
          label: chooseRandomKeys(1, techwords),
          backgroundColor: chooseRandomKeys(15, colors),
          data: randomIntsBetween(15, 1, 100),
          stack: true,
          barThickness: 25,
        },
        {
          label: chooseRandomKeys(1, techwords),
          backgroundColor: chooseRandomKeys(15, colors),
          data: randomIntsBetween(15, 1, 100),
          stack: true,
          barThickness: 25,
        },
        {
          label: chooseRandomKeys(1, techwords),
          backgroundColor: chooseRandomKeys(15, colors),
          data: randomIntsBetween(15, 1, 100),
          stack: true,
          barThickness: 25,
        },
        {
          label: chooseRandomKeys(1, techwords),
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
  },

  {
    target: "target4",
    type: "line",
    data: {
      labels: arrayOfIndexes(120),
      datasets: [{
        label: chooseRandomKeys(1, techwords),
        fill: true,
        backgroundColor: chooseRandomKeys(1, colorsTransparent),
        tension: 0,
        pointRadius: 0,
        borderColor: chooseRandomKeys(1, colors),
        data: notSoRandomInts(120, 1, 100, 1212, 3, .01, true)
      },
      {
        label: chooseRandomKeys(1, techwords),
        fill: false,
        tension: .2,
        pointRadius: 0,
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
  
];
