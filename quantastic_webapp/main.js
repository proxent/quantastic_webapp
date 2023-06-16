// THEMES
const gordons_green = '#303531';
const dark_gordons_green = '#262926';
const light_grey_gordons_green = '#8A958C';
const keppel_green = '#53b18c';
const custom_red = '#FF4136';

// FETCH DATA FROM SERVER
const url = 'http://ec2-15-165-203-22.ap-northeast-2.compute.amazonaws.com:8080/backtest';
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
        dtick: 10,
        gridcolor: '#525953',
        side: 'right'
    },
};
const payload = {
    'start_date': '2016-04-30', // start_date should be always April
    'end_date': '2019-04-30', // so is end_date
    'account_code': 'ifrs_Equity', // don't think too much about this right now. At the dropdown menu you made, let's map '순자산' with 'ifrs_Equity' 
    'rank': 10, // not like what I said, this means rank not the percentage.
    'order': 'asc' // asc for ascending order, desc for descending order
};

function showLoading() {
    document.querySelector(".loading").style.display = "block";
}

function hideLoading() {
    document.querySelector(".loading").style.display = "none";
}

async function fetchAPI() {
    showLoading();
    const payload = {
        'start_date': document.getElementById('date-start').value,
        'end_date': document.getElementById('date-end').value,
        'account_code': document.getElementById('account_type').value,
        'rank': document.getElementById('rank').value,
        'order': document.getElementById('order').checked ? 'desc' : 'asc',
    };
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    const data = await response.json();

    const dates = data.prices.map(price => price.Date);
    const totals = data.prices.map(price => parseFloat(price.total));
    const benchmark = data.benchmark.map(price => parseFloat(price.total));

    var account_code = payload.account_code;
    //var account_name = getAccountName(account_code);
    var account_name = accountData[account_code];
    var change = getChange(totals);

    createPlot(dates, totals, benchmark);
    createDataTable(account_code, account_name, dates, totals, change);
    hideLoading();

}

function createPlot(dates, totals, benchmark) {
    const target = {
        name: 'Target',
        x: dates,
        y: totals,
        mode: 'lines',
        line: {
            color: '#53b18c',
            width: 2
        },
        type: 'scatter'
    };

    const benchmarkLines = {
        name: 'KODEX 200',
        x: dates,
        y: benchmark,
        mode: 'lines',
        line: {
            color: '#ac4e73',
            witdth: 2
        },
        type: 'scatter'
    };

    const data = [target, benchmarkLines];
    Plotly.newPlot('chart', data, layout);
}

const accountData = {
    'ifrs_Assets': '자산총계',
    'ifrs_CurrentAssets': '유동자산',
    'ifrs_CashAndCashEquivalents': '현금및현금성자산',
    'ifrs_TradeAndOtherCurrentReceivables': '매출채권 및 기타유동채권',
    'ifrs_Inventories': '재고자산',
    'ifrs_OtherCurrentNonfinancialAssets': '기타유동자산',
    'ifrs_NoncurrentAssets': '비유동자산',
    'dart_LongTermTradeAndOtherNonCurrentReceivablesGross': '장기성수취채권',
    'ifrs_PropertyPlantAndEquipment': '유형자산',
    'ifrs_InvestmentProperty': '투자부동산',
    'ifrs_IntangibleAssetsOtherThanGoodwill': '무형자산',
    'ifrs_OtherNoncurrentFinancialAssets': '장기금융자산',
    'ifrs_DeferredTaxAssets': '이연법인세자산',
    'ifrs_Liabilities': '부채총계',
    'ifrs_CurrentLiabilities': '유동부채',
    'ifrs_TradeAndOtherCurrentPayables': '매입채무 및 기타유동채무',
    'dart_ShortTermBorrowings': '단기차입금',
    'ifrs_CurrentPortionOfLongtermBorrowings': '유동성장기차입금',
    'ifrs_CurrentProvisions': '유동충당부채',
    'ifrs_CurrentTaxLiabilities': '당기법인세부채',
    'ifrs_NoncurrentLiabilities': '비유동부채',
    'ifrs_OtherNoncurrentFinancialLiabilities': '기타비유동금융부채',
    'dart_LongTermBorrowingsGross': '장기차입금',
    'ifrs_DeferredTaxLiabilities': '이연법인세부채',
    'ifrs_Equity': '자본총계',
    'EquityAttributableToOwnersOfParent': '지배기업의 소유지분',
    'dart_ContributedEquity': '납입자본',
    'ifrs_IssuedCapital': '자본금',
    'ifrs_RetainedEarnings': '이익잉여금(결손금)',
    'dart_ElementsOfOtherStockholdersEquity': '기타자본구성요소',
    'ifrs_NoncontrollingInterests': '비지배주주지분',
    'ifrs_CashFlowsFromUsedInOperatingActivities': '영업활동 현금흐름',
    'dart_ProfitLossForStatementOfCashFlows': '당기순이익',
    'ifrs_AdjustmentsForReconcileProfitLoss': '당기순이익조정을 위한 가감',
    'dart_AdjustmentsForAssetsLiabilitiesOfOperatingActivities': '영업활동으로 인한 자산부채의 변동',
    'ifrs_InterestPaidClassifiedAsOperatingActivities': '이자지급',
    'ifrs_InterestReceivedClassifiedAsOperatingActivities': '이자수취',
    'ifrs_DividendsReceivedClassifiedAsOperatingActivities': '배당금수취',
    'ifrs_IncomeTaxesPaidRefundClassifiedAsOperatingActivities': '법인세납부액',
    'ifrs_CashFlowsFromUsedInInvestingActivities': '투자활동 현금흐름',
    'dart_PurchaseOfShortTermFinancialInstruments': '단기금융상품의 취득',
    'dart_PurchaseOfLongTermFinancialInstruments': '장기금융상품의 취득',
    'dart_ProceedsFromSalesOfShortTermFinancialInstruments': '단기금융상품의 처분',
    'dart_ProceedsFromSalesOfLongTermFinancialInstruments': '단기금융상품의 처분',
    'dart_PurchaseOfOtherNonCurrentFinancialAssets': '기타비유동자산의 취득',
    'dart_ProceedsFromSalesOfOtherNonCurrentFinancialAssets': '기타비유동자산의 처분',
    'ifrs_ProceedsFromSalesOfPropertyPlantAndEquipmentClassifiedAsInvestingActivities': '유형자산의 처분',
    'ifrs_ProceedsFromSalesOfIntangibleAssetsClassifiedAsInvestingActivities': '무형자산의 처분',
    'ifrs_PurchaseOfPropertyPlantAndEquipmentClassifiedAsInvestingActivities': '유형자산의 취득',
    'ifrs_PurchaseOfIntangibleAssetsClassifiedAsInvestingActivities': '유형자산의 취득',
    'dart_ProceedsFromSalesOfInvestmentProperty': '투자부동산의 처분',
    'ifrs_CashFlowsFromUsedInFinancingActivities': '재무활동 현금흐름',
    'dart_ProceedsFromShortTermBorrowings': '단기차입금의 차입',
    'dart_ProceedsFromLongTermBorrowings': '장기차입금의 차입',
    'dart_RepaymentsOfShortTermBorrowings': '단기차입금의 상환',
    'dart_RepaymentsOfLongTermBorrowings': '장기차입금의 상환',
    'ifrs_EffectOfExchangeRateChangesOnCashAndCashEquivalents': '현금및현금성자산에 대한 환율변동효과',
    'ifrs_IncreaseDecreaseInCashAndCashEquivalents': '현금및현금성자산의순증가',
    'dart_CashAndCashEquivalentsAtBeginningOfPeriodCf': '기초현금및현금성자산',
    'dart_CashAndCashEquivalentsAtEndOfPeriodCf': '기말현금및현금성자산'
}

// FLOW - 지표 선택
// Based on chosen option from dropdown menu, update account_code on payload
// Based on account_code on payload, call getAccountName(account_name)

var selectedAccountCode = 'ifrs_Assets'; //selected from dropdown menu
var selectedAccountName = accountData[selectedAccountCode];

/*
function getAccountName(account_code) {
    var account_name = "";

    if (account_code == "ifrs_Equity") {
        account_name = "순자산";
    };

    return account_name;
}
*/

function changePayload(payload) {
    payload.acocunt_code = account_code;

    return payload;
}

function getChange(totals) {
    const change_amt = [0];
    const change_percent = [0];

    for (let i = 1; i < totals.length; i++) {
        const change = totals[i] - totals[i - 1];
        const percent = (((change / totals[i - 1]) * 100) * 100).toFixed(1) + '%';

        change_amt.push(change);
        change_percent.push(percent);
    }

    return { change_amt, change_percent };
}

/* Data Table */

function createDataTable(account_code, account_name, dates, totals, change) {
    var dataTableValues = [
        Array(totals.length).fill(account_code),
        Array(totals.length).fill(account_name),
        dates,
        totals,
        change.change_amt,
        change.change_percent
    ]

    var dataTableData = [{
        type: 'table',
        header: {
            values: [["<b>INDEX</b>"], ["<b>NAME</b>"], ["<b>DATE</b>"], ["<b>TOTAL</b>"],
            ["<b>CHANGE(AMT)</b>"], ["<b>CHANGE(%)</b>"]],
            align: ["left", "left"],
            line: { width: 1, color: dark_gordons_green },
            fill: { color: dark_gordons_green },
            font: { family: "Noto Sans", size: 12, color: "white" }
        },
        cells: {
            values: dataTableValues,
            align: ["left", "left"],
            line: { color: dark_gordons_green, width: 1 },
            fill: { color: [dark_gordons_green, dark_gordons_green] },
            font: { family: "Noto Sans", size: 11, color: [light_grey_gordons_green] }
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
}

function UpdatePlot(data, layout) {
    Plotly.newPlot('candlestick-chart', data, layout);
}

/*
 ISSUE: percent input reinitializes webpage when pressing ENTER, but changing the input works
     WORKAROUND: Disable ENTER key -- event.keyCode != 13
 ISSUE: after giving input of 3 digits AND >100 --> can no longer change text, can only change after erasing all of text
*/


/* Button Listeners */

const watchlistEventListener = document.getElementById('watchlist_toggle');

var showWatchlist = true;
const dataDiv = document.querySelector('.visualized-data');

const watchlistInputHandler = function (event) {
    /*TODO: toggle watchlist*/
    /*change candlestick-chart top=50%, max-height=700px*/
    /*change data-table dislplay to none*/
    /*candlestick-chart.maximized*/
    /*data-table-rect.hide*/

    alert("Watchlist Toggle : Not yet implemented. ");

    /*
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
    */

}

watchlistEventListener.addEventListener('click', watchlistInputHandler);

const chart = document.getElementById('chart');

// Box Zoom
const zoomButton = document.getElementById('zoom_button');

const zoomButtonHandler = function (event) {
    Plotly.relayout(chart, { dragmode: 'zoom' });
};

zoomButton.addEventListener('click', zoomButtonHandler);

// Zoom Out
const zoomOutButton = document.getElementById('zoom_out_button');

const zoomOutButtonHandler = function (event) {
    Plotly.relayout(chart, {
        'dragmode': 'pan', 'xaxis.autorange': true, 'yaxis.autorange': true
    });
}

zoomOutButton.addEventListener('click', zoomOutButtonHandler);

// Save
const saveButton = document.getElementById('save_button');

const saveButtonHandler = function (event) {
    console.log('Save Button Pressed');
}

saveButton.addEventListener('click', saveButtonHandler);

// User Profile
const userButton = document.getElementById('user_profile');

const userButtonHandler = function (event) {
    alert("User Profile: Not yet implemented.");
}

userButton.addEventListener('click', userButtonHandler);
