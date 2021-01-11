'use strict';

const portal = require('./../Backend/IBClientPortal.js');

class Account {
    constructor(accId) {
        this.accountId = accId;
        //this.displayName = accObj['displayName'];
        //this.
    }

    async init() {
        let initialData = await portal.account.getAccountLedger(this.accountId);

        if (!initialData) {
            console.log('Could not load initial account data.');
            return false;
        }

        this.commodityMarketValue = initialData['BASE'].commoditymarketvalue;
        this.futureMarketValue = initialData['BASE'].futuremarketvalue;
        this.settledCash = initialData['BASE'].settledcash;
        this.exchangeRate = initialData['BASE'].exchangerate;
        this.sessionId = initialData['BASE'].sessionid;
        this.cashBalance = initialData['BASE'].cashbalance;
        this.corporatebondsMarketValue = initialData['BASE'].corporatebondsmarketvalue;
        this.warrantsMarketValue = initialData['BASE'].warrantsmarketvalue;
        this.netLiquidationValue = initialData['BASE'].netliquidationvalue;
        this.interest = initialData['BASE'].interest;
        this.unrealizedPnL = initialData['BASE'].unrealizedpnl;
        this.stockmarketValue = initialData['BASE'].stockmarketvalue;
        this.moneyFunds = initialData['BASE'].moneyfunds;
        this.currency = initialData['BASE'].currency;
        this.realizedPnL = initialData['BASE'].realizedpnl;
        this.funds = initialData['BASE'].funds;
        this.accountCode = initialData['BASE'].acctcode;
        this.issueroptionsMarketValue = initialData['BASE'].issueroptionsmarketvalue;
        this.key = initialData['BASE'].key;
        this.lastUpdated = initialData['BASE'].timestamp;
        this.severity = initialData['BASE'].severity;

        return true;
    }

    async updateData() {
        let initialData = await portal.account.getAccountLedger(this.accountId);
        if (!initialData) {
            console.log('Could not load initial account data.');
            return false;
        }

        this.commodityMarketValue = initialData['BASE'].commoditymarketvalue;
        this.futureMarketValue = initialData['BASE'].futuremarketvalue;
        this.settledCash = initialData['BASE'].settledcash;
        this.exchangeRate = initialData['BASE'].exchangerate;
        this.sessionId = initialData['BASE'].sessionid;
        this.cashBalance = initialData['BASE'].cashbalance;
        this.corporatebondsMarketValue = initialData['BASE'].corporatebondsmarketvalue;
        this.warrantsMarketValue = initialData['BASE'].warrantsmarketvalue;
        this.netLiquidationValue = initialData['BASE'].netliquidationvalue;
        this.interest = initialData['BASE'].interest;
        this.unrealizedPnL = initialData['BASE'].unrealizedpnl;
        this.stockmarketValue = initialData['BASE'].stockmarketvalue;
        this.moneyFunds = initialData['BASE'].moneyfunds;
        this.currency = initialData['BASE'].currency;
        this.realizedPnL = initialData['BASE'].realizedpnl;
        this.funds = initialData['BASE'].funds;
        this.accountCode = initialData['BASE'].acctcode;
        this.issueroptionsMarketValue = initialData['BASE'].issueroptionsmarketvalue;
        this.key = initialData['BASE'].key;
        this.lastUpdated = initialData['BASE'].timestamp;
        this.severity = initialData['BASE'].severity;

        return true;
    }

    async buy(security, quantity, orderType, price = undefined, COID = undefined) {
        let commit = await portal.order.previewOrder(this.accountId, security['conid'], security['instrumentType'], COID, orderType, price, 'BUY', quantity);
        if (!commit) {
            console.log('Failed to place buy order.');
            return false;
        }

        return commit;
    }

    async sell(security, quantity, orderType, price = '', COID = '') {
        let uncommit = await portal.order.previewOrder(this.accountId, security['conid'], security['instrumentType'], COID, orderType, price, 'SELL', quantity);
        if (!uncommit) {
            console.log('Failed to place sell order.');
            return false;
        }

        return uncommit;
    }
}

module.exports = Account;