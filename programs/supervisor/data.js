let data = {
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
          data: notSoRandomInts(120, 1, 115, 1111, 3, .02, true)
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
                    return value + 'b';
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
          label: "CPU %",
          fill: false,
          backgroundColor: "rgba(127,255,127,0.2)",
          tension: 0,
          pointRadius: 0,
          borderColor: "rgba(127,255,127,1)",
          data: notSoRandomInts(120, 25, 90, 1111, 2, 0, true)
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
        labels: arrayOfIndexes(60),
        datasets: [{
          label: "Neuron count",
          fill: false,
          backgroundColor: colorsTransparent[3],
          tension: 0,
          pointRadius: 2,
          borderColor: colors[3],
          data: notSoRandomInts(60, 88, 115, 1212, 3, .001 , false)
        },
        {
          label: "Neuron count rel",
          fill: false,
          tension: .2,
          pointRadius: 0,
          borderColor: colors[4],
          data: notSoRandomInts(60, 10, 50, null, 3, 0, true)
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
                      return value + 'b';
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