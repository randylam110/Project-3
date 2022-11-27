

// Flask address route calls
const rangeData = "ev-ranges";
const salesData = "ev-sales";
const stationCount = "ev-station-counts"

function init() {
        
  // Initializes the page with a default plots
  rangePlot();
  salesPlot();  
}
    
// Call the initialization
init();

// Creates slider
$("#years").slider({});
    
// Create action event listener for slider
$("#years").on('slide', function (range) {
  let timeString = $('#years').val();
  let timeArray = timeString.split(',');
  let yMin = timeArray[0];
  let yMax = timeArray[1];
  rangePlot(yMin,yMax);
  salesPlot(yMin,yMax);
});
     
// Use plotly JSON data to make an animated graph of the average and max ranges of EVs by year

function salesPlot(yearMin = 2010, yearMax = 2021) {
  Promise.all([
    d3.json(salesData),
    d3.json(stationCount)
  ]).then(function([sales, counts]) {
    // some error proofing to ensure the range selected is in the array (change to read max value in array)
    if (yearMin < 2010){
      yearMin = 2010;
    }
    if (yearMin > 2021){
      yearMin = 2021;
    }
    if (yearMax < 2010){
      yearMax = 2010;
    }
    if (yearMax > 2021){
      yearMax = 2021;
    }

    // Setting the initial plot parameters
    let saleData = sales.data;
    let countData = counts.data;

    // Create indexes for slicing from the years
    let minYearIndex = yearMin - 2010;
    let maxYearIndex = yearMax - 2010;
       
    let plotSample = saleData.slice(minYearIndex,maxYearIndex+1);
    
    let  plotYears = [];
    let  plotStationCounts = [];
    let  plotSales = [];

    for (let i =0; i < plotSample.length; i++){
      plotYears.push(plotSample[i][0]);
      plotStationCounts.push(countData[i+13][2]);
      plotSales.push(plotSample[i][1]);
    }

    let plot1 = { 
      type: "scatter",
      mode: "lines",
      name : 'Station Counts',
      fill: 'tozeroy',
      line: {color: 'darkgrey'},
      x: plotYears,
      y: plotStationCounts,     
    };

    let plot2 = {
      type: "scatter",
      mode: "lines",
      name: 'EV Sales',
      fill: 'tozeroy',
      line: {color: 'lightblue'},
      x: plotYears,
      y: plotSales,     
    };

    let trace = [plot1, plot2];

    let layout = {
      title : {
        text: "<br><b>Number of EV Stations and EV Sales by Year</b>",
        font: {
          family: 'Courier New',
          size: 18,
        }
      },
      margin: {t: 50, l: 140},
      barmode: 'group',
      xaxis: {
        title: {
          text: '<b>Years</b>',
          font: {
            family: 'Courier New, monospace',
            size: 14
          }
        },
      },
      yaxis: {
        title: {
          text: '<b>Counts</b>',
          font: {
            family: 'Courier New, monospace',
            size: 14
          }
        }
      },
      yaxis2: {
        title: {
          text: '<b>Sales of EVs</b>',
          font: {
            family: 'Courier New, monospace',
            size: 14
          }
        },
        overlaying: 'n',
        side: 'right'
      }
    };
    
    let config = {responsive: true};
      
    Plotly.newPlot("fill-plot", trace, layout, config);

  });
}

// Use plotly JSON data to make a grouped bar graph of the average and max ranges of EVs by year
function rangePlot(yearMin = 2010, yearMax = 2021) {
  d3.json(rangeData).then(function(data) {
    // Setting the initial plot parameters
    
    // some error proofing to ensure the range selected is in the array (change to read max value in array)
    if (yearMin < 2010){
      yearMin = 2010;
    }
    if (yearMin > 2021){
      yearMin = 2021;
    }
    if (yearMax < 2010){
      yearMax = 2010;
    }
    if (yearMax > 2021){
      yearMax = 2021;
    }

    // Setting the initial plot parameters
    let ranges = data.data

    // Create indexes for slicing from the years and adjusting for the fact that 2010 starts at index 13
    let minYearIndex = yearMin - 2010;
    let maxYearIndex = yearMax - 2010;
 
    let plotSample = ranges.slice(minYearIndex,maxYearIndex+1);
    
    let  plotYears = [];
    let  plotAvgRange = [];
    let  plotMaxRange = [];
    for (let i =0; i < plotSample.length; i++){
      plotYears.push(plotSample[i][0]);
      plotAvgRange.push(plotSample[i][1]);
      plotMaxRange.push(plotSample[i][2]);
    }

    // code taken from https://plotly.com/javascript/filled-area-animation/
    var frames = []
    var x = plotYears;
    var y = plotMaxRange;
    var x2 = plotYears;
    var y2 = plotAvgRange;
  
    var n = 11;
    for (var i = 0; i < n; i++) { 
      frames[i] = {data: [{x: [], y: []}, {x: [], y: []}]}
      frames[i].data[1].x = x.slice(0, i+1);
      frames[i].data[1].y = y.slice(0, i+1);
      frames[i].data[0].x = x2.slice(0, i+1);
      frames[i].data[0].y = y2.slice(0, i+1);
    }
  
    var trace2 = {
      type: "scatter",
      mode: "lines",
      name: 'Max Range',
      fill: 'tonexty',
      x: frames[5].data[1].x,
      y: frames[5].data[1].y,
      line: {color: 'grey'}
    }

    var trace1 = {
      type: "scatter",
      mode: "lines",
      name: 'Average Range',
      x: frames[5].data[0].x,
      y: frames[5].data[0].y,
      line: {color: 'lightgrey'}
    }

    var data = [trace1,trace2]; 
    
    var layout = {
      title: '<b>Average and Maximum Ranges for EVs by Year</b>',
      xaxis: {
        range: [frames[10].data[0].x[0], frames[10].data[0].x[10]],
        showgrid: false
      },
      yaxis: {
        range: [0, 400],
        showgrid: false
      },
      legend: {
        orientation: 'h',
        x: 0.5,
        y: 1.2,
        xanchor: 'center'
      },
      updatemenus: [{
        x: 0.5,
        y: 0,
        yanchor: "top",
        xanchor: "center",
        showactive: false,
        direction: "left",
        type: "buttons",
        pad: {"t": 87, "r": 10},
        buttons: [
          {
            method: "animate",
            args: [ null, { fromcurrent: true, transition: { duration: 5}, frame: { duration: 40, redraw: false} } ],
            label: "Play"
          }, 
          {
            method: "animate",
            args: [[null], { mode: "immediate", transition: { duration: 0 }, frame: { duration: 0, redraw: false} } ],
            label: "Pause"
          }
        ]
      }]
    };

    Plotly.newPlot('anim-fill-plot', data, layout).then(function() {
      Plotly.addFrames('anim-fill-plot', frames);
    });
  });
}