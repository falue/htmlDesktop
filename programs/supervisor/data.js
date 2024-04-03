let data = {
  10: [{
    width:"100%",
    height:"250px",
    target: "target1",
    type: "line",
    data: {
      labels: arrayOfIndexes(120),
      datasets: [{
        label: "Neuron count",
        fill: false,
        backgroundColor: "#638c52",
        tension: 0,
        pointRadius: 0,
        borderColor: "#638c52",
        data: notSoRandomInts(120, 5, 5.5, 1212, 1.2, .001, false)
  // function notSoRandomInts(count, min, max, seed, maxDiff, incline, doNotMaxOut = false)
      }]
    },
    options: {
      responsive: true, 
      legend: {display: false},
      scales: {
        y: {
            suggestedMin: 0,
            suggestedMax: 25,
            ticks: {
              // Add % to Y scale
              stepSize: 20, /* total/4 shows 0, 25%, 50%, 75%, 100% */             
              callback: function(value, index, values) {
                  return value + 'M';
              }
          },
        }
      },
      plugins: {
        legend: {
            display: true,
            labels: {
                color: 'white',
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
  },{
    height:"250px",
    width:"100%",
    target: "target2",
    type: "line",
    data: {
      labels: arrayOfIndexes(25),
      datasets: [{
        label: "Compression rate",
        fill: false,
        backgroundColor: "#46659d",
        tension: .4,
        pointRadius: 0,
        borderColor: "#46659d",
        data: notSoRandomInts(25, 1, 100, 7878, 2, .00003, true)
        // function notSoRandomInts(count, min, max, seed, maxDiff, incline, doNotMaxOut = false)
      },{
        label: "Memory expansion rate",
        fill: false,
        backgroundColor: "#c086ef",
        tension: 0,
        pointRadius: 3,
        borderColor: "#c086ef",
        data: notSoRandomInts(25, 0, 50, 2323, 2, .000155, true)
        // function notSoRandomInts(count, min, max, seed, maxDiff, incline, doNotMaxOut = false)
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
      title: {
        display: true,
        text: "inclining numbers",
        fontSize: 16,
        fontColor: 'white',
      },
    },
  },{
    height:"150px",
    width:"100%",
    target: "target3",
    type: "doughnut",
    data: {
      labels: chooseRandomKeys(5, techwords),
      datasets: [
        {
          label: "Data 3",
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
      plugins: {
        legend: {
            display: true,
            labels: {
                color: 'white',
            }
        }
        },
    },
  },{
    height:"150px",
    width:"100%",
    target: "target4",
    type: "doughnut",
    data: {
      labels: chooseRandomKeys(5, techwords),
      datasets: [
        {
        label: "Data 3",
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
      plugins: {
        legend: {
            display: true,
            labels: {
                color: 'white',
            }
        }
        },
    },
  },{
    height:"150px",
    width:"100%",
    target: "target5",
    type: "doughnut",
    data: {
      labels: chooseRandomKeys(5, techwords),
      datasets: [
        {
        label: "Data 3",
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
      plugins: {
        legend: {
            display: true,
            labels: {
                color: 'white',
            }
        }
        },
    },
  },{
    height:"150px",
    width:"100%",
    target: "target6",
    type: "doughnut",
    data: {
      labels: chooseRandomKeys(5, techwords),
      datasets: [
        {
        label: "Data 3",
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
    width:"100%",
    height:"100%",
    target: "target8",
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
  },

  {
    width:"100%",
    height:"100%",
    target: "target9",
    type: "bar",
    data: {
      labels: arrayOfIndexes(15),
      datasets: [
        {
            label: chooseRandomKeys(1, techwords),
            backgroundColor: chooseRandomKeys(15, colors),
            data: randomIntsBetween(15, 1, 100),
            barThickness: 3,
          },
          {
            label: chooseRandomKeys(1, techwords),
            backgroundColor: chooseRandomKeys(15, colors),
            data: randomIntsBetween(15, 1, 100),
            barThickness: 3,
          },
          {
            label: chooseRandomKeys(1, techwords),
            backgroundColor: chooseRandomKeys(15, colors),
            data: randomIntsBetween(15, 1, 100),
            barThickness: 3,
          },
          {
            label: chooseRandomKeys(1, techwords),
            backgroundColor: chooseRandomKeys(15, colors),
            data: randomIntsBetween(15, 1, 100),
            barThickness: 3,
          },
          {
            label: chooseRandomKeys(1, techwords),
            backgroundColor: chooseRandomKeys(15, colors),
            data: randomIntsBetween(15, 1, 100),
            barThickness: 3,
          },
          {
            label: chooseRandomKeys(1, techwords),
            backgroundColor: chooseRandomKeys(15, colors),
            data: randomIntsBetween(15, 1, 100),
            barThickness: 3,
          },
          {
            label: chooseRandomKeys(1, techwords),
            backgroundColor: chooseRandomKeys(15, colors),
            data: randomIntsBetween(15, 1, 100),
            barThickness: 3,
          },
          {
            label: chooseRandomKeys(1, techwords),
            backgroundColor: chooseRandomKeys(15, colors),
            data: randomIntsBetween(15, 1, 100),
            barThickness: 3,
          },
      ],
    },
  },

  {
    width:"100%",
    height:"100%",
    target: "target10",
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
  },
  {
    width:"100%",
    height:"100%",
    target: "target11",
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
  }
],
    41: [{
        width:"100%",
        height:"250px",
        target: "target1",
        type: "line",
        data: {
          labels: arrayOfIndexes(120),
          datasets: [{
            label: "Neuron count",
            fill: false,
            backgroundColor: "#638c52",
            tension: 0,
            pointRadius: 0,
            borderColor: "#638c52",
            data: notSoRandomInts(120, 1, 100, 1212, 5, .0155, false)
            // function notSoRandomInts(count, min, max, seed, maxDiff, incline, doNotMaxOut = false)
          }]
        },
        options: {
          responsive: true, 
          legend: {display: false},
          scales: {
            y: {
                ticks: {
                  // Add % to Y scale
                  stepSize: 20, /* total/4 shows 0, 25%, 50%, 75%, 100% */             
                  callback: function(value, index, values) {
                      return value + 'M';
                  }
              },
            }
          },
          plugins: {
            legend: {
                display: true,
                labels: {
                    color: 'white',
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
      },{
        height:"250px",
        width:"100%",
        target: "target2",
        type: "line",
        data: {
          labels: arrayOfIndexes(25),
          datasets: [{
            label: "Compression rate",
            fill: false,
            backgroundColor: "#46659d",
            tension: .4,
            pointRadius: 0,
            borderColor: "#46659d",
            data: notSoRandomInts(25, 1, 100, 1212, 2, .03, true)
            // function notSoRandomInts(count, min, max, seed, maxDiff, incline, doNotMaxOut = false)
          },{
            label: "Memory expansion rate",
            fill: false,
            backgroundColor: "#c086ef",
            tension: 0,
            pointRadius: 3,
            borderColor: "#c086ef",
            data: notSoRandomInts(25, 0, 50, 666, 2, .0155, true)
            // function notSoRandomInts(count, min, max, seed, maxDiff, incline, doNotMaxOut = false)
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
          title: {
            display: true,
            text: "inclining numbers",
            fontSize: 16,
            fontColor: 'white',
          },
        },
      },{
        height:"150px",
        width:"100%",
        target: "target3",
        type: "doughnut",
        data: {
          labels: chooseRandomKeys(5, techwords),
          datasets: [
            {
              label: "Data 3",
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
          plugins: {
            legend: {
                display: true,
                labels: {
                    color: 'white',
                }
            }
            },
        },
      },{
        height:"150px",
        width:"100%",
        target: "target4",
        type: "doughnut",
        data: {
          labels: chooseRandomKeys(5, techwords),
          datasets: [
            {
            label: "Data 3",
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
          plugins: {
            legend: {
                display: true,
                labels: {
                    color: 'white',
                }
            }
            },
        },
      },{
        height:"150px",
        width:"100%",
        target: "target5",
        type: "doughnut",
        data: {
          labels: chooseRandomKeys(5, techwords),
          datasets: [
            {
            label: "Data 3",
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
          plugins: {
            legend: {
                display: true,
                labels: {
                    color: 'white',
                }
            }
            },
        },
      },{
        height:"150px",
        width:"100%",
        target: "target6",
        type: "doughnut",
        data: {
          labels: chooseRandomKeys(5, techwords),
          datasets: [
            {
            label: "Data 3",
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
        width:"100%",
        height:"100%",
        target: "target8",
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
      },

      {
        width:"100%",
        height:"100%",
        target: "target9",
        type: "bar",
        data: {
          labels: arrayOfIndexes(15),
          datasets: [
            {
                label: chooseRandomKeys(1, techwords),
                backgroundColor: chooseRandomKeys(15, colors),
                data: randomIntsBetween(15, 1, 100),
                barThickness: 3,
              },
              {
                label: chooseRandomKeys(1, techwords),
                backgroundColor: chooseRandomKeys(15, colors),
                data: randomIntsBetween(15, 1, 100),
                barThickness: 3,
              },
              {
                label: chooseRandomKeys(1, techwords),
                backgroundColor: chooseRandomKeys(15, colors),
                data: randomIntsBetween(15, 1, 100),
                barThickness: 3,
              },
              {
                label: chooseRandomKeys(1, techwords),
                backgroundColor: chooseRandomKeys(15, colors),
                data: randomIntsBetween(15, 1, 100),
                barThickness: 3,
              },
              {
                label: chooseRandomKeys(1, techwords),
                backgroundColor: chooseRandomKeys(15, colors),
                data: randomIntsBetween(15, 1, 100),
                barThickness: 3,
              },
              {
                label: chooseRandomKeys(1, techwords),
                backgroundColor: chooseRandomKeys(15, colors),
                data: randomIntsBetween(15, 1, 100),
                barThickness: 3,
              },
              {
                label: chooseRandomKeys(1, techwords),
                backgroundColor: chooseRandomKeys(15, colors),
                data: randomIntsBetween(15, 1, 100),
                barThickness: 3,
              },
              {
                label: chooseRandomKeys(1, techwords),
                backgroundColor: chooseRandomKeys(15, colors),
                data: randomIntsBetween(15, 1, 100),
                barThickness: 3,
              },
          ],
        },
      },

      {
        width:"100%",
        height:"100%",
        target: "target10",
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
      },
      {
        width:"100%",
        height:"100%",
        target: "target11",
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
      }
    ],
    34: [{
      width:"100%",
      height:"200px",
      target: "target1",
      type: "line",
      data: {
        labels: arrayOfIndexes(120),
        datasets: [{
          label: "Neuron count",
          fill: false,
          backgroundColor: "#638c52",
          tension: 0,
          pointRadius: 0,
          borderColor: "#638c52",
          // data: notSoRandomInts(120, 700, 760, 1111, 4, .0002, false)
          data: [ 708.1416,705.141,702.1404,700.14,704.1408,700.14,703.1406,704.1408,705.141,705.141,707.1414,707.1414,704.1408,702.1404,706.1412,705.141,702.1404,703.1406,702.1404,700.14,700,702.1404,706.1412,710.142,710.142,712.1424,713.1426,712.1424,710.142,714.1428,711.1422,714.1428,719.1438,723.1446,728.1456,725.145,728.1456,725.145,727.1454,728.1456,732.1464,734.1468,731.1462,734.1468,734.1468,730.146,728.1456,728.1456,729.1458,731.1462,729.1458,731.1462,732.1464,728.1456,732.1464,736.1472,737.1474,740.148,736.1472,737.1474,740.148,738.1476,738.1476,735.147,734.1468,738.1476,739.1478,743.1486,744.1488,748.1496,746.1492,747.1494,746.1492,743.1486,740.148,744.1488,746.1492,749.1498,753.1506,755.151,753.1506,753.1506,751.1502,752.1504,751.1502,751.1502,749.1498,753.1506,750.15,748.1496,752.1504,755.151,756.1512,757.1514,760,757.1514,759.1518,758.1516,758.1516,760,758.1516,756.1512,753.1506,755.151,752.1504,753.1506,753.1506,753.1506,750.15,751.1502,750.15,751.1502,749.1498,746.1492,747.1494,749.1498,748.1496,746.1492,750.15,746.1492]
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
            suggestedMin: 600,
            suggestedMax: 800,
            ticks: {
                // Add % to Y scale
                stepSize: 20, /* total/4 shows 0, 25%, 50%, 75%, 100% */             
                callback: function(value, index, values) {
                    return value + 'M';
                }
            },
            grid: {
              // Make 100% line blue
              drawBorder: true,
              color: function(context) {
                if (context.tick.value === 100) {
                  return "#46659d";
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
    },{
      width:"100%",
      height:"200px",
      target: "target2",
      type: "line",
      data: {
        labels: arrayOfIndexes(25),
        datasets: [{
          label: "Compression rate",
          fill: true,
          backgroundColor: "rgba(70, 101, 157, .15)",
          tension: 0,
          pointRadius: 0,
          borderColor: "#46659d",
          data: notSoRandomInts(25, 1, 100, 1616, 6, 0.08, false)
        },{
          label: "Memory expansion rate",
          fill: true,
          backgroundColor: "rgba(192, 134, 239, .15)",
          tension: 0,
          pointRadius: 3,
          borderColor: "#c086ef",
          data: notSoRandomInts(25, 15, 100, 999, 2, 0, false)
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
        title: {
          display: true,
          text: "inclining numbers",
          fontSize: 16,
          fontColor: 'white',
        },
      },
    },{
      height:"150px",
      width:"100%",
      target: "target3",
      type: "doughnut",
      data: {
        labels: chooseRandomKeys(5, techwords),
        datasets: [
          {
            label: "Data 3",
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
        plugins: {
          legend: {
              display: true,
              labels: {
                  color: 'white',
              }
          }
          },
      },
    },{
      height:"150px",
      width:"100%",
      target: "target4",
      type: "doughnut",
      data: {
        labels: chooseRandomKeys(5, techwords),
        datasets: [
          {
          label: "Data 3",
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
        plugins: {
          legend: {
              display: true,
              labels: {
                  color: 'white',
              }
          }
          },
      },
    },{
      height:"150px",
      width:"100%",
      target: "target5",
      type: "doughnut",
      data: {
        labels: chooseRandomKeys(5, techwords),
        datasets: [
          {
          label: "Data 3",
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
        plugins: {
          legend: {
              display: true,
              labels: {
                  color: 'white',
              }
          }
          },
      },
    },{
      height:"150px",
      width:"100%",
      target: "target6",
      type: "doughnut",
      data: {
        labels: chooseRandomKeys(5, techwords),
        datasets: [
          {
          label: "Data 3",
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
      width:"100%",
      height:"100%",
      target: "target8",
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
    },

    {
      width:"100%",
      height:"100%",
      target: "target9",
      type: "bar",
      data: {
        labels: arrayOfIndexes(15),
        datasets: [
          {
              label: chooseRandomKeys(1, techwords),
              backgroundColor: chooseRandomKeys(15, colors),
              data: randomIntsBetween(15, 1, 100),
              barThickness: 3,
            },
            {
              label: chooseRandomKeys(1, techwords),
              backgroundColor: chooseRandomKeys(15, colors),
              data: randomIntsBetween(15, 1, 100),
              barThickness: 3,
            },
            {
              label: chooseRandomKeys(1, techwords),
              backgroundColor: chooseRandomKeys(15, colors),
              data: randomIntsBetween(15, 1, 100),
              barThickness: 3,
            },
            {
              label: chooseRandomKeys(1, techwords),
              backgroundColor: chooseRandomKeys(15, colors),
              data: randomIntsBetween(15, 1, 100),
              barThickness: 3,
            },
            {
              label: chooseRandomKeys(1, techwords),
              backgroundColor: chooseRandomKeys(15, colors),
              data: randomIntsBetween(15, 1, 100),
              barThickness: 3,
            },
            {
              label: chooseRandomKeys(1, techwords),
              backgroundColor: chooseRandomKeys(15, colors),
              data: randomIntsBetween(15, 1, 100),
              barThickness: 3,
            },
            {
              label: chooseRandomKeys(1, techwords),
              backgroundColor: chooseRandomKeys(15, colors),
              data: randomIntsBetween(15, 1, 100),
              barThickness: 3,
            },
            {
              label: chooseRandomKeys(1, techwords),
              backgroundColor: chooseRandomKeys(15, colors),
              data: randomIntsBetween(15, 1, 100),
              barThickness: 3,
            },
        ],
      },
    },

    {
      width:"100%",
      height:"100%",
      target: "target10",
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
    },{
      width:"100%",
      height:"100%",
      target: "target11",
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
    }
  ],
  67: [
    {
      width:"100%",
      height:"100%",
      target: "target1",
      type: "line",
      data: {
        labels: arrayOfIndexes(120),
        datasets: [{
          label: "Efficiency",
          fill: false,
          backgroundColor: "rgba(127,255,127,0.2)",
          tension: 0,
          pointRadius: 0,
          borderColor: "rgba(127,255,127,1)",
          // data: notSoRandomInts(120, 25, 90, 1111, 2, 0, true)
          // längere gerade kure am schluss: data: [26,24,22,21,23,21,23,23,24,24,25,25,23,22,24,24,22,22,21,20,20,21,23,25,25,26,27,26,25,27,25,27,29,31,33,31,34,33,35,37,40,42,41,44,47,47,48,48,50,57,64,77,78,78,78,80,81,83,81,81,83,82,82,80,79,81,81,83,84,86,85,86,85,84,82,84,84,84,84,84,84,84,85,84,86,92,95,105,119,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140,140]
          data: [26,24,22,21,23,21,23,23,24,24,25,25,23,22,24,24,22,22,21,20,20,21,23,25,25,26,27,26,25,27,25,27,29,31,33,31,34,33,35,37,40,42,41,44,47,47,48,48,50,57,64,77,78,78,78,80,81,83,81,81,83,82,82,80,79,81,81,83,84,86,85,86,85,84,82,84,84,84,84,84,84,84,85,84,86,87,87,88,86,87,87,87,88,87,86,85,86,84,85,85,85,83,83,83,83,82,80,81,82,81,81,80,82,80,86,92,95,105,119,140]
        },{
          label: "Memory Usage",
          fill: false,
          backgroundColor: "rgba(0,127,127,0.2)",
          tension: 0,
          pointRadius: 0,
          borderColor: "rgba(0,127,127,0.8)",
          data: notSoRandomInts(120, 25, 98, 3333, 2, 0, false)
        },{
          label: "Temperature",
          fill: false,
          backgroundColor: "rgba(127,127,127,0.2)",
          tension: 0,
          pointRadius: 0,
          borderColor: "rgba(255,127,127,0.2)",
          data: notSoRandomInts(120, 1, 50, 4444, 6, 0, false)
        },{
          label: chooseRandomKeys(1, techwords),
          fill: true,
          backgroundColor: "rgba(127,127,127,0.05)",
          tension: 0,
          pointRadius: 0,
          borderColor: "rgba(127,127,127,0.2)",
          data: notSoRandomInts(120, 1, 22, 2222, 16, 0, false)
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
      width:"100%",
      height:"100%",
      target: "target4",
      type: "doughnut",
      data: {
        labels: chooseRandomKeys(3, techwords),
        datasets: [
          {
            backgroundColor: chooseRandomKeys(5, colors),
            borderWidth: 0,
            data: randomIntsBetween(3, 10, 80),
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
      width:"100%",
      height:"100%",
      target: "target3",
      type: "doughnut",
      data: {
        labels: chooseRandomKeys(3, techwords),
        datasets: [
          {
            backgroundColor: chooseRandomKeys(5, colors),
            borderWidth: 0,
            data: randomIntsBetween(3, 5, 100),
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
      width:"100%",
      height:"100%",
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
    }, {
      width:"100%",
      height:"100%",
      target: "target6",
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
      width:"100%",
      height:"100%",
      target: "target2",
      type: "line",
      data: {
        labels: arrayOfIndexes(255),
        datasets: [{
          label: "GPU %",
          fill: false,
          backgroundColor: colorsTransparent[3],
          tension: 0,
          pointRadius: 0,
          borderColor: colors[3],
          // data: notSoRandomInts(255, 88, 115, 1212, 3, .001 , false)
          data: notSoRandomInts(255, 1, 115, 9999, 4, .01 , true)
        },
        {
          label: "GPU memory",
          fill: false,
          tension: .2,
          pointRadius: 0,
          borderColor: colors[2],
          data: notSoRandomInts(255, 10, 35, 666, 3, 0.02, true)
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
        scales: {
          y: {
              ticks: {
                  // Add % to Y scale
                  stepSize: 20, /* total/4 shows 0, 25%, 50%, 75%, 100% */             
                  callback: function(value, index, values) {
                      return value + '%';
                  }
              }
          },
        x: {
          ticks: {
              callback: function(value, index, values) {
                // return (Math.floor((value / 100) * 100)) + '%';
                return 't-' + (56-value).toFixed(1);
            }
          }
        },
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
      width:"100%",
      height:"100%",
      target: "target11",
      type: "line",
      data: {
        labels: arrayOfIndexes(60),
        datasets: [{
          label: "Neuron count",
          fill: true,
          backgroundColor: colorsTransparent[3],
          tension: 0,
          pointRadius: 0,
          borderColor: colors[3],
          // data: notSoRandomInts(60, 88, 115, 1212, 3, .001 , false)
          // data: notSoRandomInts(60, 1, 115, 1111, 4, .008 , false)
          // data: [38.2173,36.1515,34.0857,33.0528,37.1844,34.0857,38.2173,40.2831,43.3818,45.4476,49.5792,51.645,50.6121,50.6121,56.8095,57.8424,56.8095,58.8753,59.9082,58.8753,59.9082,63.0069,68.1714,74.3688,77.4675,82.632,86.7636,88.82939999999999,89.8623,97.0926,97.0926,103.29,111.5532,107.2165,110.3152,110.5203,108.2494,108.4545,113.619,107.2165,114.6519,106.1836,106.3887,112.5861,110.3152,109.4874,110.5203,114.6519,106.1836,111.5532,113.619,106.1836,110.5203,109.4874,109.2823,109.2823,114.6519,104.1178,103.29,107.4216]
          data: [53.424,50.4,47.376,45.36,49.392,45.36,49.392,50.4,52.416,53.424,56.448,57.456,54.432,53.424,58.464,58.464,56.448,57.456,56.448,54.432,54.432,56.448,60.48,65.52,66.528,69.552,71.568,71.568,70.56,75.6,73.584,77.616,82.656,87.696,92.736,90.72,94.752,91.728,94.752,96.768,101.808,103.824,100.8,104.832,104.832,101.808,99.792,100.8,102.816,105.84,104.832,107.856,108.864,105.84,109.872,114.912,115,115,111.888,113.904]
        }/* ,
        {
          label: "Neuron count rel",
          fill: false,
          tension: .2,
          pointRadius: 0,
          borderColor: colors[2],
          data: notSoRandomInts(60, 10, 35, null, 3, 0.01, true)
        } */]
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
        scales: {
          y: {
              ticks: {
                  // Add % to Y scale
                  stepSize: 20, /* total/4 shows 0, 25%, 50%, 75%, 100% */             
                  callback: function(value, index, values) {
                      return value + 'B';
                  },
                  color: function(context) {
                    if (context.tick.value === 100) {
                      return "red";
                    }
                    return "grey";
                  }
              },
              grid: {
                // Make 100% line red
                drawBorder: true,
                lineWidth: function(context) {
                  if (context.tick.value === 100) {
                    return 3;
                  }
                  return 1
                },
                color: function(context) {
                  if (context.tick.value === 100) {
                    return "red";
                  }
                  return 'rgba(0,0,0,0.2)';
                },
            }
          },
        x: {
          ticks: {
              callback: function(value, index, values) {
                // return (Math.floor((value / 100) * 100)) + '%';
                return 't-' + (56-value).toFixed(1);
            }
          }
        },
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
      width:"100%",
      height:"100%",
      target: "target8",
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
    },
    {
      width:"100%",
      height:"100%",
      target: "target9",
      type: "bar",
      data: {
        labels: arrayOfIndexes(15),
        datasets: [
          {
              label: chooseRandomKeys(1, techwords),
              backgroundColor: chooseRandomKeys(15, colors),
              data: randomIntsBetween(15, 1, 100),
              barThickness: 3,
            },
            {
              label: chooseRandomKeys(1, techwords),
              backgroundColor: chooseRandomKeys(15, colors),
              data: randomIntsBetween(15, 1, 100),
              barThickness: 3,
            },
            {
              label: chooseRandomKeys(1, techwords),
              backgroundColor: chooseRandomKeys(15, colors),
              data: randomIntsBetween(15, 1, 100),
              barThickness: 3,
            },
            {
              label: chooseRandomKeys(1, techwords),
              backgroundColor: chooseRandomKeys(15, colors),
              data: randomIntsBetween(15, 1, 100),
              barThickness: 3,
            },
            {
              label: chooseRandomKeys(1, techwords),
              backgroundColor: chooseRandomKeys(15, colors),
              data: randomIntsBetween(15, 1, 100),
              barThickness: 3,
            },
            {
              label: chooseRandomKeys(1, techwords),
              backgroundColor: chooseRandomKeys(15, colors),
              data: randomIntsBetween(15, 1, 100),
              barThickness: 3,
            },
            {
              label: chooseRandomKeys(1, techwords),
              backgroundColor: chooseRandomKeys(15, colors),
              data: randomIntsBetween(15, 1, 100),
              barThickness: 3,
            },
            {
              label: chooseRandomKeys(1, techwords),
              backgroundColor: chooseRandomKeys(15, colors),
              data: randomIntsBetween(15, 1, 100),
              barThickness: 3,
            },
        ],
      },
    },

    {
      width:"100%",
      height:"100%",
      target: "target10",
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
    }
  ]
}