// THEMES
const gordons_green = '#303531';
const dark_gordons_green = '#262926';
const light_grey_gordons_green = '#8A958C';

// FETCH DATA FROM SERVER

const url = 'http://ec2-15-165-203-22.ap-northeast-2.compute.amazonaws.com:8080/backtest';
const payload = {
   'start_date': '2016-04-30', // start_date should be always April
   'end_date': '2019-04-30', // so is end_date
   'account_code': 'ifrs_Equity', // don't think too much about this right now. At the dropdown menu you made, let's map '순자산' with 'ifrs_Equity' 
   'rank': 10, // not like what I said, this means rank not the percentage.
   'order': 'asc' // asc for ascending order, desc for descending order
};

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
})
  .then(response => response.json())
  .then(data => {
    console.log('Response:', data);
    
    const dates = data.prices.map(price => price.Date);
    const totals = data.prices.map(price => parseFloat(price.total));
    
    console.log(dates);
    console.log(totals);
    
    createPlot(dates, totals);

  })
  .catch(error => {
    console.error('Error:', error);
  });

function createPlot(dates, totals) {
    const trace = {
        x: dates,
        y: totals,
        mode: 'lines',
        line: {
            color: '#53b18c',
            width: 2
        },
        type: 'scatter'
    };

    // Compute the slope between consecutive points and set the line color accordingly
    for (let i = 1; i < totals.length; i++) {
        const slope = totals[i] - totals[i - 1];
        if (slope > 0) {
        trace.line.color[i - 1] = '#53b18c'; // Green color for increasing values
        } else {
        trace.line.color[i - 1] = '#FF4136'; // Red color for decreasing values
        }
    }

    const layout = {
        paper_bgcolor: 'rgba(0, 0, 0, 0)',
        plot_bgcolor: 'rgba(0, 0, 0, 0)',
        font: {
            color: '#FCFCFC',
        },
        dragmode: 'pan',
        margin: {
            r: 40,
            t: 20,
            b: 45,
            l: 30
        },
        xaxis: {
            autorange: true,
            showgrid: true,
            gridcolor: '#525953',
        },
        yaxis: {
            autorange: true,
            dtick: 1000,
            gridcolor: '#525953',
            side: 'right'
        },
    };
    
    const data = [trace];
    
    Plotly.newPlot('chart', data, layout);
}

/* Get Data Input */

const startDateInput = document.getElementById('date-start');
const endDateInput = document.getElementById('date-end');
//const testOut = document.getElementById('test');

console.log(startDateInput.value);
console.log(endDateInput.value);

const dateInputHandler = function(event) {
    //testOut.innerHTML = event.target.value;
    console.log(event.target.value);
    console.log('Start Date Changed: ' + startDateInput.value);
    console.log('End Date Changed: ' + endDateInput.value);



    //const newDates = (startDateInput.value, endDateInput.value);
}

startDateInput.addEventListener('change', dateInputHandler);
endDateInput.addEventListener('change', dateInputHandler);


//TODO : MAke graph update based on start and end date
/*
const updateDate = function(event) {
    
}
*/

/* Get Type input */

const typeInput = document.getElementById('type');
console.log(typeInput.value);

const typeInputHandler = function(event) {
    console.log(event.target.value);
    console.log('Type Changed: ' + typeInput.value);
}

typeInput.addEventListener('change', typeInputHandler);

/* Get Slider Input */

const sliderInput = document.querySelector("input[name=checkbox]");
console.log(sliderInput.checked);

const sliderInputHandler = function(event) {
    if(this.checked) {
        console.log(sliderInput.checked + ": Set to Low");
    } else {
        console.log(sliderInput.checked + ": Set to High");
    }
}

sliderInput.addEventListener('change', sliderInputHandler);

/* Get Percent Input */

const percentInput = document.getElementById('percent');
console.log(percentInput.value);

const percentInputHandler = function(event) {
    console.log(event.target.value);
    console.log('Percent Input Changed: ' + percentInput.value);
}

percentInput.addEventListener('change', percentInputHandler);

/*
 ISSUE: percent input reinitializes webpage when pressing ENTER, but changing the input works
     WORKAROUND: Disable ENTER key -- event.keyCode != 13
 ISSUE: after giving input of 3 digits AND >100 --> can no longer change text, can only change after erasing all of text
*/


/* Button Listeners */

const watchlistEventListener = document.getElementById('watchlist_toggle');

var showWatchlist = true;
const dataDiv = document.querySelector('.visualized-data');

const watchlistInputHandler = function(event) {
    /*TODO: toggle watchlist*/
    /*change candlestick-chart top=50%, max-height=700px*/
    /*change data-table dislplay to none*/
    /*candlestick-chart.maximized*/
    /*data-table-rect.hide*/

    showWatchlist = !(showWatchlist);
    console.log(showWatchlist);
    console.log("Watchlist Toggle Pressed");


    if (showWatchlist == false) {
        Array.from(dataDiv.children).forEach(childDiv => {
            childDiv.classList.remove('candlestick-chart');
            childDiv.classList.remove('data-table');
            childDiv.removeAttribute('data-table-rect');
            childDiv.removeAttribute('data-table-chart');
            childDiv.id = 'candlestick-chart-maximized';
        });
    }
    else if (showWatchlist == true) {
        Array.from(dataDiv.children).forEach(childDiv => {
            childDiv.classList.remove('candlestick-chart-maximized');
            childDiv.id = 'candlestick-chart';
        })
        const newDiv = document.createElement('div');
        newDiv.classList.add('data-table');
        newDiv.classList.add('data-table-rect');
        newDiv.classList.add('data-table-chart');
        dataDiv.appendChild(newDiv);
    }
}

watchlistEventListener.addEventListener('click', watchlistInputHandler);

// Box Zoom
const zoomButton = document.getElementById('zoom_button');

const zoomButtonHandler = function(event) {
    console.log("Zoom Button Pressed");
};

zoomButton.addEventListener('click', zoomButtonHandler);

// Zoom Out
const zoomOutButton = document.getElementById('zoom_out_button');

const zoomOutButtonHandler = function(event) {
    console.log("Zoom Out Button Pressed");
}

zoomOutButton.addEventListener('click', zoomOutButtonHandler);

// Undo

const undoButton = document.getElementById('undo_button');

const undoButtonHandler = function(event) {
    console.log("Undo Button Pressed");
}

undoButton.addEventListener('click', undoButtonHandler);

// Redo

const redoButton = document.getElementById('redo_button');

const redoButtonHandler = function(event) {
    console.log("Redo Button Pressed");
}

redoButton.addEventListener('click', redoButtonHandler);

// Reset

const resetButton = document.getElementById('reset_button');

const resetButtonHandler = function(event) {
    console.log("Reset Button Pressed");
}

resetButton.addEventListener('click', resetButtonHandler);

// Save

const saveButton = document.getElementById('save_button');

const saveButtonHandler = function(event) {
    console.log('Save Button Pressed');
}

saveButton.addEventListener('click', saveButtonHandler);


/* Data Table 구현 */

var dataTableValues = [
    ['<b>SAM</b>', '<b>COU</b>', '<b>NAV</b>', '<b>KAK</b>', '<b>SMI</b>'],
    ['<b>Samsung Electronics</b>', '<b>Coupang</b>', '<b>NAVER</b>', '<b>Kakao</b>', '<b>Smilegates</b>'],
    [1300000, 20000, 70000, 2000, 130902000],
    [1300000, 20000, 70000, 2000, 130902000],
    [1300000, 20000, 70000, 2000, 130902000]
]

var dataTableData = [{
    type: 'table',
    header: {
        values: [["<b>INDEX</b>"], ["<b>NAME</b>"], ["<b>LAST</b>"],
                    ["<b>CHANGE(AMT)</b>"], ["<b>CHANGE(%)</b>"]],
        align: ["left", "left"],
        line: {width: 1, color: dark_gordons_green},
        fill: {color: dark_gordons_green},
        font: {family: "Droid Sans", size: 12, color: "white"}
    },
    cells: {
        values: dataTableValues,
        align: ["left", "left"],
        line: {color: dark_gordons_green, width: 1},
        fill: {color: [dark_gordons_green, dark_gordons_green]},
        font: {family: "Droid Sans", size: 11, color: [light_grey_gordons_green]}
    }
}]

var dataTableLayout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    margin: {
        r: 20,
        t: 0,
        b: 0,
        l: 20,
    },
}

Plotly.newPlot('data-table-chart', dataTableData, dataTableLayout);

