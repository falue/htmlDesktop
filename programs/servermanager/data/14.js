let data = [
  {
    target: "target1",
    type: "line",
    data: {
      labels: arrayOfIndexes(120),
      datasets: [{
        label: "CPU %",
        fill: false,
        backgroundColor: "rgba(127,255,127,0.2)",
        tension: 0,
        pointRadius: 0,
        borderColor: "rgba(127,255,127,1)",
        data: notSoRandomInts(120, 1, 120, 1212, 6, .05, true)
      },{
        label: "Memory Usage",
        fill: false,
        backgroundColor: "rgba(0,127,127,0.2)",
        tension: 0,
        pointRadius: 0,
        borderColor: "rgba(0,127,127,0.8)",
        data: notSoRandomInts(120, 60, 98, 666, 16, 0.1, false)
      },{
        label: "Temperature",
        fill: false,
        backgroundColor: "rgba(127,127,127,0.2)",
        tension: 0,
        pointRadius: 0,
        borderColor: "rgba(255,127,127,0.2)",
        data: notSoRandomInts(120, 1, 50, 667, 6, 0, false)
      },{
        label: chooseRandomKeys(1, techwords),
        fill: true,
        backgroundColor: "rgba(127,127,127,0.05)",
        tension: 0,
        pointRadius: 0,
        borderColor: "rgba(127,127,127,0.2)",
        data: notSoRandomInts(120, 1, 22, 668, 16, 0, false)
      }]
    },
    
    options: {
      responsive: true, 
      legend: {display: false},
      plugins: {
        legend: {
            display: true,
            labels: {
                color: 'white',
            }
        }
      },
      scales: {
        y: {
            ticks: {
                // Add % to Y scale
                stepSize: 20, /* total/4 shows 0, 25%, 50%, 75%, 100% */             
                callback: function(value, index, values) {
                    return (Math.floor((value / 100) * 100)) + '%';
                }
            },
            grid: {
              // Make 100% line red
              drawBorder: true,
              color: function(context) {
                if (context.tick.value === 100) {
                  return "red";
                }
                return 'rgba(0,0,0,0.2)';
              },
          }

        }
    },
      title: {
        display: true,
        text: "inclining numbers",
        fontSize: 16,
        fontColor: 'white',
      },
    },
  },

  {
    target: "target3",
    type: "doughnut",
    data: {
      labels: chooseRandomKeys(3, techwords),
      datasets: [
        {
          backgroundColor: chooseRandomKeys(5, colors),
          borderWidth: 0,
          data: randomIntsBetween(3, 1, 100),
        },
      ],
    },
    options: {
      cutout: "72%",
      radius: "77%",
      responsive: true,
      circumference:  180,
      rotation: 270,
      plugins: {
        legend: {
            display: true,
            labels: {
                color: 'white',
            }
        }
      },
    },
  },

  {
    target: "target4",
    type: "doughnut",
    data: {
      labels: chooseRandomKeys(3, techwords),
      datasets: [
        {
          backgroundColor: chooseRandomKeys(5, colors),
          borderWidth: 0,
          data: randomIntsBetween(3, 1, 100),
        },
      ],
    },
    options: {
      cutout: "72%",
      radius: "77%",
      responsive: true,
      circumference:  180,
      rotation: 270,
      plugins: {
        legend: {
            display: true,
            labels: {
                color: 'white',
            }
        }
      },
    },
  },


  {
    target: "target5",
    type: "doughnut",
    data: {
      labels: chooseRandomKeys(3, techwords),
      datasets: [
        {
          backgroundColor: chooseRandomKeys(5, colors),
          borderWidth: 0,
          data: randomIntsBetween(3, 1, 100),
        },
      ],
    },
    options: {
      cutout: "72%",
      radius: "77%",
      responsive: true,
      circumference:  180,
      rotation: 270,
      plugins: {
        legend: {
            display: true,
            labels: {
                color: 'white',
            }
        }
      },
    },
  },

  {
    target: "target6",
    type: "line",
    data: {
      labels: arrayOfIndexes(120),
      datasets: [{
        label: chooseRandomKeys(1, techwords),
        fill: false,
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
      plugins: {
        legend: {
          display: true,
          labels: {
              color: 'white',
          }
        }
      },
    },
  },

  {
    target: "target7",
    type: "bar",
    data: {
      labels: arrayOfIndexes(12),
      datasets: [
        {
          label: chooseRandomKeys(1, techwords),
          backgroundColor: chooseRandomKeys(15, colors),
          data: randomIntsBetween(12, 1, 100),
          stack: true,
          barThickness: 12,
        },
        {
          label: chooseRandomKeys(1, techwords),
          backgroundColor: chooseRandomKeys(15, colors),
          data: randomIntsBetween(12, 1, 100),
          stack: true,
          barThickness: 12,
        },
        {
          label: chooseRandomKeys(1, techwords),
          backgroundColor: chooseRandomKeys(15, colors),
          data: randomIntsBetween(12, 1, 100),
          barThickness: 12,
        },
        {
          label: chooseRandomKeys(1, techwords),
          backgroundColor: chooseRandomKeys(15, colors),
          data: randomIntsBetween(12, 1, 100),
          barThickness: 12,
        },
      ],
    },
    options: {
      responsive: true, 
      plugins: {
        legend: {
          display: true,
          labels: {
              color: 'white',
          }
        }
      },
    },
  }
  
];
