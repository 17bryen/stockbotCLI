'use strict';
const settings = require('./Logic/config.json');
const portal = require('./Backend/IBClientPortal.js');
const buyLogic = require('./Logic/BuyIndicators.js');
const sellLogic = require('./Logic/SellIndicators.js');

let account;
let watchList = [];

async function backtest(inAccount, forWatchList) {
    //Prepare variables needed for runtime
    console.clear();
    let thread;
    account = inAccount;
    watchList = forWatchList;
    
    //Display Backtest Settings
    console.log('Beginning a ' + settings.frequency[0] + settings.frequency[1] + ' back test using account ' + account.id + ' on contract ' + forWatchList[0].displayName);
    
    //Retrieve historical data for backtest length                   --//min, h, d, m     --//Oldest first
    thread = await portal.marketData.marketDataHistory(watchList[0].conid, settings.backtest.length[0] + settings.backtest.length[1], settings.frequency[0] + settings.frequency[1]);
    if (!thread || thread.data == []){
        console.log('Failed to retrieve historical contract data...');
        return;
    }

    //Use historical data to init contract
    let tempDate, tempUpdate = false;
    for (let i = 0; i <= 59; i++) {
        tempUpdate = thread.data.shift();
        tempDate = new Date(tempUpdate['t']);
        watchList[0].priceAction.history.unshift({
            open: tempUpdate['o'],
            close: tempUpdate['c'],
            low: tempUpdate['l'],
            high: tempUpdate['h'],
            vol: tempUpdate['v'],
            time: tempDate
        });
    }

    //Init TA in use

    //Main Backtest Loop
    for (let i in thread.data){

        //Keep contract and TA current
        tempDate = new Date(thread.data[i]['t']);
        watchList[0].priceAction.update({
            open: thread.data[i]['o'],
            close: thread.data[i]['c'],
            low: thread.data[i]['l'],
            high: thread.data[i]['h'],
            vol: thread.data[i]['v'],
            time: tempDate
        });

        //Run sell contract logic
        for (let j in watchList)
            await sellLogic(watchList[j]);


        //Run buy contract logic
        for (let j in watchList)
            await buyLogic(watchList[j]);
    }
    
    console.log(watchList[0].priceAction.history.length);
    //console.log(thread.data[thread.data.length - 1]);
}

module.exports = backtest; 