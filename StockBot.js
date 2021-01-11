'use strict';
//const portal = require('./Backend/IBClientPortal.js');
const Objects = require('./Objects/Objects.js');
const back = require('./backTest.js');
const real = require('./realTime.js');

let session = new Objects.Program();
let watchList = [];

async function main() {
    //Variable for tracking progress of main thread:
    let thread = false;

    // Connect to IBKR Client Portal
    console.log('Attempting to contact client portal...');
    thread = await session.init();
    if (!thread){
        //console.log('Failed to contact IBKR portal. Try logging in again before relaunching...');
        return;
    } else {
        console.log('Successfully authenticated through IBKR portal.');
    }

    // Select correct accounts
    console.log('Enumerating investment accounts associated with login...');
    let account = false;
    thread = await session.getAccounts();
    if (!thread || thread == []) {
        console.log('Failed to retrieve account list from IBKR portal.');
        return;
    } else {
        account = thread[0];
        console.log('Account ' + account.id + '(' + account.currency + ') selected.');
    }

    // Search and select correct contract
    let contract = false;
    console.log('Searching for contracts matching ConID...');
    thread = await session.searchContracts(['MES']);
    if (!thread || thread == []) {
        console.log('Failed to find contracts for given ConID.');
        return;
    } else {
        let temp = false;
        for (let i in thread){
            temp = new Objects.Contract(thread[i][0].conid);
            temp.init();
            watchList.push(temp);
        }
        console.log('Contracts selected.');
    }

    // Select backtest or realtime test
    console.log('Init main complete. Continuing to runtime...');
    await sleep(3000);
    //back(account, watchList);
    real(account, watchList);
}

async function setAccount(accId){
    if (!accId.accId){
        console.log('request contained improper account ID');
        return false;
    }
    this.account = new Objects.Account(accId.accId);
    let thread = await this.account.init();
    return thread;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main();

{
  /*
    let conidArray = await app.searchContracts(['MES', 'ES', 'YM', 'NQ']);
    if (!conidArray)
        return;

    let conids = {};
    let longestUnder, earliestConid;
    
    for (let symb in conidArray) {                              //Iterate through symbols
        for (let under in conidArray[symb]) {                   //Iterate through underlying conids per symbol
            if (!longestUnder || conidArray[symb][under].length > longestUnder.length)
                longestUnder = conidArray[symb][under];
        }

        for (let conid in longestUnder) {                      //Iterate through conids in longestUnder
            if (earliestConid) {
                if (parseInt(longestUnder[conid]['expirationDate'].toString().substr(0, 4)) <= parseInt(earliestConid['expirationDate'].toString().substr(0, 4)))
                    if (parseInt(longestUnder[conid]['expirationDate'].toString().substr(4, 2)) <= parseInt(earliestConid['expirationDate'].toString().substr(4, 2)))
                        if (parseInt(longestUnder[conid]['expirationDate'].toString().substr(6, 2)) <= parseInt(earliestConid['expirationDate'].toString().substr(6, 2)))
                            earliestConid = longestUnder[conid];
            } else {
                earliestConid = longestUnder[conid];
            }
        }

        if (earliestConid)
            conids[symb] = earliestConid;
        longestUnder = undefined;
        earliestConid = undefined;

    }

    let contract;
    conidArray = [];

    for (let i in conids) {
        contract = new objects.Contract(conids[i]['conid']);
        thread = await contract.init();
        if (!thread)
            return;
        conidArray.push(contract);
    }

    //console.log(conidArray);

    //Branch into two main threads, backtest or real-time

    
    thread = await app.getHistData(conidArray[0], '1h', '5min');
    if (!thread)
        return

    */

/*
 * 0|app    | { symbol: 'MES',
0|app    |   text: 'Micro E-Mini S&P 500 Stock Price Index',
0|app    |   priceFactor: 4,
0|app    |   startTime: '20201013-19:25:00',
0|app    |   high: '14063/7583/10',
0|app    |   low: '14000/4840/40',
0|app    |   timePeriod: '3600s',
0|app    |   barLength: 300,
0|app    |   mdAvailability: 'D',
0|app    |   mktDataDelay: 600,
0|app    |   outsideRth: false,
0|app    |   volumeFactor: 1,
0|app    |   priceDisplayRule: 1,
0|app    |   priceDisplayValue: '2',
0|app    |   negativeCapable: false,
0|app    |   messageVersion: 2,
0|app    |   data:
0|app    |    [ { o: 3512.5,
0|app    |        c: 3512.25,
0|app    |        h: 3514.5,
0|app    |        l: 3511,
0|app    |        v: 7429,
0|app    |        t: 1602617100000 },
0|app    |      { o: 3512.5,
0|app    |        c: 3514.75,
0|app    |        h: 3515.25,
0|app    |        l: 3512.25,
0|app    |        v: 5306,
0|app    |        t: 1602617400000 },
0|app    |      { o: 3514.75,
0|app    |        c: 3512.75,
0|app    |        h: 3515.75,
0|app    |        l: 3510.75,
0|app    |        v: 7583,
0|app    |        t: 1602617700000 },
0|app    |      { o: 3513,
0|app    |        c: 3512,
0|app    |        h: 3515.25,
0|app    |        l: 3511.75,
0|app    |        v: 4269,
0|app    |        t: 1602618000000 },
0|app    |      { o: 3512,
0|app    |        c: 3508,
0|app    |        h: 3513.75,
0|app    |        l: 3507.75,
0|app    |        v: 6255,
0|app    |        t: 1602618300000 },
0|app    |      { o: 3508.25,
0|app    |        c: 3508,
0|app    |        h: 3511.25,
0|app    |        l: 3507.75,
0|app    |        v: 9776,
0|app    |        t: 1602618600000 },
0|app    |      { o: 3508.25,
0|app    |        c: 3502,
0|app    |        h: 3509,
0|app    |        l: 3502,
0|app    |        v: 13790,
0|app    |        t: 1602618900000 },
0|app    |      { o: 3502.25,
0|app    |        c: 3502.75,
0|app    |        h: 3505,
0|app    |        l: 3501.5,
0|app    |        v: 6914,
0|app    |        t: 1602619200000 },
0|app    |      { o: 3502.75,
0|app    |        c: 3503,
0|app    |        h: 3503.75,
0|app    |        l: 3500,
0|app    |        v: 4840,
0|app    |        t: 1602619500000 },
0|app    |      { o: 3503,
0|app    |        c: 3505.25,
0|app    |        h: 3505.5,
0|app    |        l: 3502.5,
0|app    |        v: 2249,
0|app    |        t: 1602619800000 },
0|app    |      { o: 3505.5,
0|app    |        c: 3504.25,
0|app    |        h: 3506.75,
0|app    |        l: 3504,
0|app    |        v: 716,
0|app    |        t: 1602621000000 } ],
0|app    |   points: 10,
0|app    |   travelTime: 3 }
0|app    | { amount: { amount: 'NA', commission: '0.47 USD', total: 'NA' },
0|app    |   equity: { current: '10,000', change: '-2', after: '9,998' },
0|app    |   initial: { current: '0', change: '1,515', after: '1,515' },
0|app    |   maintenance: { current: '0', change: '1,278', after: '1,278' },
0|app    |   warn:
0|app    |    '18/You are trying to submit an order without having market data for this instrument. \nIB strongly recommends against this kind of blind trading which may result in \nerroneous or unexpected trades.',
0|app    |   error: null }
0|app    | success!

*/
}
