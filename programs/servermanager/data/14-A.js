data = [
  {
    target: "target1",
    type: "line",
    width: "100%",
    height: "100%",
    data: {
      labels: arrayOfIndexes(12),
      datasets: [{
        label: "CPU %",
        fill: false,
        backgroundColor: "rgba(127,255,127,0.2)",
        tension: 0,
        pointRadius: 0,
        borderColor: "#46659d",
        //data: notSoRandomInts(12, 50, 66, 1212, .5, 0, false)
        data: randomIntsBetween(12, 50, 62)
      },{
        label: "Memory Usage",
        fill: false,
        backgroundColor: "rgba(0,127,127,0.2)",
        tension: 0,
        pointRadius: 0,
        borderColor: "rgba(0,127,127,0.8)",
        //data: notSoRandomInts(12, 5, 25, 666, 2, 0, false)
        data: randomIntsBetween(12, 5, 25)
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
            suggestedMin: 0,
            suggestedMax: 100,
            /* grid: {
              // Make 100% line red
              drawBorder: true,
              color: function(context) {
                if (context.tick.value === 100) {
                  return "red";
                }
                return 'rgba(0,0,0,0.2)';
              },
          } */
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
    width: "100%",
    height: "100%",
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
    width: "100%",
    height: "100%",
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
    width: "100%",
    height: "100%",
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
    width: "100%",
    height: "100%",
    data: {
      labels: arrayOfIndexes(12),
      datasets: [{
        label: "Neuron count",
        fill: false,
        backgroundColor: chooseRandomKeys(1, colorsTransparent),
        tension: 0,
        pointRadius: 0,
        borderColor: chooseRandomKeys(1, colors),
        data: notSoRandomInts(12, 1, 65, 1212, 1, 0, true)
      },
      {
        label: "Neuron count rel",
        fill: false,
        tension: .2,
        pointRadius: 0,
        borderColor: chooseRandomKeys(1, colors),
        data: notSoRandomInts(12, 10, 43, 666, 2, 0, true)
      }]
    },
    options: {
      responsive: true, 
      legend: {display: false},
      scales: {
        y: {
            suggestedMin: 0,
            suggestedMax: 100
        }
      },
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
    width: "100%",
    height: "100%",
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
