'use strict';
const ta = require('./Logic/TechnicalAnalysis.js');
const settings = require('./Logic/config.json');
const portal = require('./Backend/IBClientPortal.js');
const buyLogic = require('./Logic/BuyIndicators.js');
const sellLogic = require('./Logic/SellIndicators.js')

let thread, account;
let watchList = [];

let intervalID = 0; 
let tempTick = [], lowTick = [], medTick = [], highTick = [];

async function realtime(rTrader, forWatchList) {
    //Prepare variables needed for runtime
    console.clear();
    account = rTrader;
    watchList = forWatchList;
  
    //Display realtime settings
    console.log('Beginning a ' + settings.frequency[0] + settings.frequency[1] + ' REALTIME test using account ' + account.id + ' on contract ' + forWatchList[0].displayName);
  
    //Retrieve past 60 unit data to bring stockbot current
    for (let x in watchList) {
        watchList[x].lowAction = [];
        watchList[x].medAction = [];
        watchList[x].highAction = [];

        thread = await portal.marketData.marketDataHistory(watchList[x].conid, 120 + settings.frequency[1], settings.frequency[0] + settings.frequency[1]);
        if (!thread || thread.data == []){
        console.log('Failed to retrieve historical contract data...');
        return;
        } else {    //Init contract data
            let tempDate, tempUpdate = false;
            for (let i = 0; i <= thread.data.length; i++) {
                tempUpdate = thread.data.shift();
                tempDate = new Date(tempUpdate.t);
                watchList[x].priceAction.history.unshift({
                    lastPrice: tempUpdate.c,
                    l: tempUpdate.l,
                    h: tempUpdate.h,
                    v: tempUpdate.v,
                    t: tempDate
                });
            }
        }
    
        //ALSO init long term trend tracking data
        {
        /* 
        thread = await portal.marketData.marketDataHistory(watchList[0].conid, 201 + 'd', '1d');
        if (!thread || thread.data == []){
            console.log('Failed to retrieve long term historical contract data...');
            return;
        } else {    
            let priceActionTemp = {history: []};
            let tempDate, tempUpdate = false;
            for (let i = 0; i <= thread.data.length; i++) {
                tempUpdate = thread.data.shift();
                tempDate = new Date(tempUpdate.t);
                priceActionTemp.history.unshift({
                    lastPrice: tempUpdate.c,
                    l: tempUpdate.l,
                    h: tempUpdate.h,
                    v: tempUpdate.v,
                    t: tempDate
                });
            }
            watchList[0].trendAction = priceActionTemp;
        }
        */
        }

    //Init TA in use
        //Short term
        watchList[x].priceAction.RSI = await ta.RSI.calculate(watchList[x].priceAction, 9);
        watchList[x].priceAction.MACD = await ta.MACD.calculate(watchList[x].priceAction, 26, 12);
        
        //Long term 

    }

    //Main Realtime Loop
    console.log('Beginning realtime loop now...');
    console.log('Current personal server time: ' + Date(Date.now()));
    console.log('Current price history length: ' + watchList[0].priceAction.history.length);
    console.log(watchList[0].priceAction.history);
    console.log('');

    //First tick iteration
    for (let x in watchList) {
        thread = await portal.marketData.marketData(watchList[x].conid);
        console.log(thread);
        tempTick[x] = [thread];         //TO-DO: Turn this array into structured objects

        intervalID = setInterval(mainLoop, 15000);
    }
}

async function mainLoop() {
    for (let x in watchList) {
        //Get most recent tick first
        thread = await portal.marketData.marketData(watchList[x].conid);
        tempTick[x].unshift(thread);
        console.log(thread);

        //Coagulate ticks from small to high
        if (tempTick[x].length == 4) {
            for (let y in tempTick[x]){
                lowTick[x].unshift();           //TO-DO: ADD UP DATA HERE
            }
            tempTick[x].clear();
        }
        
    }

    await portal.marketData.marketDataCancel(watchList[0].conid, true);
    clearInterval(intervalID);
}

module.exports = realtime;