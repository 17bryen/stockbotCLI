'use strict';
const ta = require('./Logic/TechnicalAnalysis.js');
const settings = require('./Logic/config.json');
const portal = require('./Backend/IBClientPortal.js');
const buyLogic = require('./Logic/BuyIndicators.js');
const sellLogic = require('./Logic/SellIndicators.js')

let account;
let watchList = [];

async function realtime(rTrader, forWatchList) {
    //Prepare variables needed for runtime
    console.clear();
    let thread;
    account = rTrader;
    watchList = forWatchList;
  
    //Display realtime settings
    console.log('Beginning a ' + settings.frequency[0] + settings.frequency[1] + ' REALTIME test using account ' + account.id + ' on contract ' + forWatchList[0].displayName);
  
    //Retrieve past 60 unit data to bring stockbot current
    thread = await portal.marketData.marketDataHistory(watchList[0].conid, 120 + settings.frequency[1], settings.frequency[0] + settings.frequency[1]);
    if (!thread || thread.data == []){
        console.log('Failed to retrieve historical contract data...');
        return;
    } else {    //Init contract data
        let tempDate, tempUpdate = false;
        for (let i = 0; i <= thread.data.length; i++) {
            tempUpdate = thread.data.shift();
            tempDate = new Date(tempUpdate.t);
            watchList[0].priceAction.history.unshift({
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
        watchList[0].priceAction.RSI = await ta.RSI.calculate(watchList[0].priceAction, 9);
        watchList[0].priceAction.MACD = await ta.MACD.calculate(watchList[0].priceAction, 26, 12);
        
        //Long term 

    //Main Realtime Loop
    console.log('All the actions up until completed successfully');
    console.log('Current server time: ' + Date(Date.now()));
    console.log('Current price history length: ' + watchList[0].priceAction.history.length);
    console.log(watchList[0].priceAction.history);    

}

module.exports = realtime;