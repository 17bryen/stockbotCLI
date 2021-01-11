'use strict';

const portal = require('../Backend/IBClientPortal.js');

class Program {
    constructor() {
        
    }

    async init() {
        let response = await portal.session.authStatus();
        //await portal.pingServer();
        if (!response) {
            console.log('Connection to web portal failed. Try logging in before running again.');
            return false;
        }

        return true;
    }

    async verifyConnection(){
        await portal.session.pingServer();
        let response = portal.session.authStatus();
        return response;
    }

    async getAccounts() {
        let toReturn = await portal.account.getAccounts();
        if (!toReturn || toReturn == []) {
            console.log('Unable to retrieve client accounts.');
            return false;
        } else {
            return toReturn;
        }
    }

    async setActiveAccount(account) {
        let toReturn = await portal.account.setSelectAccount(account['accountId']);
        if (!toReturn) {
            console.log('Failed to set active account');
            return false;
        } else {
            //Handle return values here
            return toReturn;
        }
    }

    async searchContracts(symbolsArray) {
        let foundArray = '';
        for (let i in symbolsArray)
            foundArray += (symbolsArray[i] + ',');

        let data = await portal.contract.futuresBySymbol(foundArray);
        if (!data) {
            console.log('Failed to obtain contracts from server...');
            return false;
        }

        for (let i in data) {
            for (let j in data[i]){
                let temp = await portal.contract.getContractInfo(data[i][j]['conid']);
                if (!temp) {
                    temp = {company_name: 'ERROR'};
                    temp.text = 'ERROR';
                }
                data[i][j]['name'] = temp.company_name;
                data[i][j]['displayName'] = temp.text;
            }
        }


        return data;

    }

    async getMarketData(contract, addFields = "") {
        let response = await portal.marketData.marketData(contract['conid'], contract.priceAction.history[0].t.getTime());
        if (!response) {
            console.log('Failed to retrieve current market data');
            return false;
        }
        let toReturn = {
            lastPrice: response["31"],
            h: response["70"],
            l: response["71"],
            position: response["72"],
            marketVal: response["73"],
            avgPrice: response["74"],
            priceChng: response["82"],
            priceChngPrct: response["83"],
            bid: response["84"],
            askSize: response["85"],
            ask: response["86"],
            v: response["87"],
            bidSize: response["88"],
        }

        return toReturn;
    }

    async endMarketData(contract) {
        let response;
        if (!contract) {
            response = await portal.marketData.marketDataCancel(contract, true);
            if (!response) {
                console.log('Failed to cancel all market data streams.');
                return false;
            }
            return true;
        } else {
            response = await portal.marketData.marketDataCancel(contract['conid']);
            if (!response) {
                console.log('Failed to cancel market data stream for contract ' + contract.displayName + '.');
                return false;
            }
            return true;
        }
    }

    async getHistData(contract, period, bar) {
        let response = await portal.marketData.marketDataHistory(contract['conid'], period, bar);
        if (!response) {
            console.log('Failed to retrieve historical market data.');
            return false;
        }

        return response;
    }
}

module.exports = Program;