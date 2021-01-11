'use strict';

//const { marketData } = require('./../Backend/IBClientPortal.js');
const portal = require('./../Backend/IBClientPortal.js');

class Contract {
    constructor(contractId) {
        this.conid = contractId;
    }

    async init() {
        //console.log(this.conid);
        let data = await portal.contract.getContractInfo(this.conid);

        if (!data) {
            console.log('Failed to obtain contract info.');
            return false;
        }

        this.symbol = data['symbol'];
        this.underlyingConid = data['underlying_con_id'];
        this.multiplier = data['multiplier'];
        this.maturityDate = data['maturity_date'];
        this.instrumentType = data['instrument_type'];
        this.companyName = data['company_name'];
        this.contractMonth = data['contract_month'];
        this.currency = data['currency'];
        this.displayName = data['text'];
        this.priceAction = {
            history: [],
            update: async (next) => {
                this.priceAction.history.unshift(next);
                if (this.priceAction.history.length >= 60)
                    this.priceAction.history.pop();
            }
        };

        /*
        data = await portal.marketData.marketDataHistory(this.conid, settingsPeriod, settingsBar);

        if (!data) {
            console.log('Failed to obtain initial contract price data.');
            return false;
        }

        this.priceHistory = [];
        for (let i in data.data){
            this.priceHistory.push({
                open: data.data[i]['o'],
                close: data.data[i]['c'],
                high: data.data[i]['h'],
                low: data.data[i]['l'],
                vol: data.data[i]['v'],
                time: data.data[i]['t']
            });
        }
        */
        return true;
    }

    async initLongTrend() {
        
    }
}

module.exports = Contract;