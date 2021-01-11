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
    thread = await portal.marketData.marketDataHistory(watchList[0].conid, 60 + settings.frequency[1], settings.frequency[0] + settings.frequency[1]);
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
    thread = await portal.marketData.marketDataHistory(watchList[0].conid, 201 + 'd', settings.frequency[0] + settings.frequency[1]);
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

    //Init TA in use
        //Short term

        //Long term 
        /*
    watchList[0].trendAction.day10 = await ta.EMA.calculate(priceActionTemp, 10);
    watchList[0].trendAction.day20 = await ta.EMA.calculate(priceActionTemp, 20);
    watchList[0].trendAction.day50 = await ta.EMA.calculate(priceActionTemp, 50);
    watchList[0].trendAction.day200 = await ta.EMA.calculate(priceActionTemp, 200);
*/
    //Main Realtime Loop
    console.log('All the actions up until completed successfully');    

}

module.exports = realtime;