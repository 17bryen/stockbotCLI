'use strict';

const axios = require('axios').default;
const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

const rootAddr = 'https://localhost:5000/v1/portal';


//Session functions
const session = {
    async pingServer() {
        let response;
        response = await axios.get(rootAddr + '/sso/validate', { httpsAgent: agent })
            .catch(err => {
            //console.log(err);
            return false;
        });

    return response['data'];
    },

    async authStatus() {
    let response;
    response = await axios.post(rootAddr + '/iserver/auth/status', {}, { 'httpsAgent': agent })
        .catch(err => {
            //console.log(err);
            return false
        });

    if (response['data'] && response['data']['authenticated'])
        return true;
    else {
        console.log('Attempting session reauthentication...');
        response = await session.reauthSession();
        if (response)
            return true;
        else
            return false;
        }
    },

    async reauthSession() {
        let response;
        response = await axios.post(rootAddr + '/iserver/reauthenticate', {}, { 'httpsAgent': agent })
        .catch(err => {
            //console.log(err);
            return false;
        });

        if (!response['data'] || !response['data']['authenticated']) {
            console.log('Failed to reauthenticate...');
            return false;
        } else {
            return true;
        }
    }
}

//Account functions
const account = {
    async getAccounts() {
        let response;
        response = await axios.get(rootAddr + '/portfolio/accounts', { httpsAgent: agent })
        .catch(err => {
            console.log(err['response']['data']);
            return false;
        });

        //console.log(response);

        let toReturn = [];
        for (let i in response['data']) {
            toReturn.push({
                'id': response['data'][i]['id'],
                'displayName': response['data'][i]['displayName'],
                'currency': response['data'][i]['currency'],
                'type': response['data'][i]['type'],
                'tradingType': response['data'][i]['tradingType']
            });
        }

        return toReturn;
    },

async getAccountInfo(accountId) {
    let response = await axios.get(rootAddr + '/portfolio/' + accountId + '/meta', { httpsAgent: agent })
        .catch(err => {
            console.log(err['response']['data']);
            return false;
        })

    //Returns the same info as getAccounts but for 1 accountId... not useful
    return response['data'];
},

async getAccountLedger(accountId) {
    let response;
    response = await axios.get(rootAddr + '/portfolio/' + accountId + '/ledger', { httpsAgent: agent })
        .catch(err => {
            console.log(err['response']['data']);
            return false;
        });

    return response['data'];
},

async getBrokerageAccounts() {
    let response;
    response = await axios.get(rootAddr + '/iserver/accounts', { httpsAgent: agent })
        .catch(err => {
            console.log(err);
            return false;
        })

    return response['data'];
},

    async setSelectAccount(accountId) {
        let response = await axios.post(rootAddr + '/iserver/account', {
            'acctId': accountId
        }, {
            httpsAgent: agent
        }).catch(err => {
            //create if statement logic for already set accounts
            console.log(err);
            return false;
        });

        return response['data'];
    }
/*  //Account Summary divided response functions
{
    async function accountSummary(accountId) {
        var response = await axios.get(rootAddr + '/portfolio/' + accountId + '/summary', { httpsAgent: agent });

        return response;
    }
}
    */
}

//Portfolio functions
const portfolio = {
    async getPortfolios() {
        let response;
response = await axios.get(rootAddr + '/portfolio/accounts', { httpsAgent: agent })
    .catch(err => {
        console.log(err);
        return false;
    });

return response['data'];
}
}

//Contract functions (case sensitive)
const contract = {
    async  futuresBySymbol(symbolsCsl) {
        let response;
        response = await axios.get(rootAddr + '/trsrv/futures', {
            httpsAgent: agent,
            params: { symbols: symbolsCsl }
        }).catch(err => {
            console.log(err['response']['data']);
            return false;
        });

        return response['data'];
    },

    async getContractInfo(conid) {
        let response;
        response = await axios.get(rootAddr + '/iserver/contract/' + conid + '/info', { httpsAgent: agent })
        .catch(err => {
            console.log(err['response']['data']);
            return false;
        })

        return response['data'];
    }
}

//Market Data Functions
const marketData = {
    async marketDataHistory(conid, period, bar) {
        let response = await axios.get(rootAddr + '/iserver/marketdata/history', {
            httpsAgent: agent,
            params: {
                'conid': conid,
                'period': period,
                'bar': bar
            }
        }).catch(error => {
            console.log(error);
            return false;
        });

        return response['data'];
    },

    async marketData(conidCsl, since, fieldsCsl) {
        let response = await axios.get(rootAddr + '/iserver/marketdata/snapshot', {
            httpsAgent: agent,
            params: {
                'conids': conidCsl,
                'since': since,
                'fields': fieldsCsl
            }
        }).catch(error => {
            console.log(error);
            return false;
        });

        return response['data'];
    },

    async marketDataCancel(conid, all = false) {
        if (all) {
            let response = await axios.get(rootAddr + '/iserver/marketdata/unsubscribeall', { httpsAgent: agent }).catch(error => {
                console.log(error);
                return false;
            });

            if (response['data']['confirmed'])
                return true;
            else
                return false;
        } else {
            let response = await axios.get(rootAddr + '/iserver/marketdata/' + conid + '/unsubscribe', { httpsAgent: agent }).catch(error => {
                console.log(error);
                return false;
            });

            if (response['data']['confirmed'] == 'success')
                return true;
            else
                return false;
        }
    }
}

//Order functions
const order = {
    async getLiveOrders() {
        let response;
        response = await axios.get(rootAddr + '/iserver/account/orders', { httpsAgent: agent })
        .catch(err => {
            console.log(err['response']['data']);
            return false;
        })

        return response['data'];
    },

    async previewOrder(accountId, conid, secType, COID, type, price, side, quantity, tif = 'DAY') {
        let response, parameters;
        parameters = {
            conid: conid,
            secType: secType,
            //cOID: COID,
            orderType: type,
            //price: price,
            side: side,
            quantity: quantity,
            tif: tif
        }
        if (COID)
            parameters['cOID'] = COID;
        if (price)
            parameters['price'] = price;

        response = await axios.post(rootAddr + '/iserver/account/' + accountId + '/order/whatif', parameters, { httpsAgent: agent })
        .catch(err => {
            console.log(err['response']);
            return false;
        });

        return response['data'];
    },

    async placeOrder(accountId, conid, secType, COID, type, price, side, quantity, tif = 'DAY') {
        let response, parameters;

        parameters = {
            conid: conid,
            secType: secType,
            //cOID: COID,
            orderType: type,
            //price: price,
            side: side,
            quantity: quantity,
            tif: tif
        }
        if (COID)
            parameters['cOID'] = COID;
        if (price)
            parameters['price'] = price;

        response = await axios.post(rootAddr + '/iserver/account/' + accountId + '/order', parameters, { httpsAgent: agent })
        .catch(err => {
            console.log(err['response']);
            return false;
        });

        return response['data'];
    },

    async placeOrderReply(replyId, answer) {
        let response;
        response = await axios.post(rootAddr + 'iserver/reply/' + replyId, { confirmed: answer }, { httpsAgent: agent })
        .catch(err => {
            console.log(err['response']['data']);
            return false;
        });

        return response;
    },

    async modifyOrder() {

    },

    async cancelOrder() {

    }
}



module.exports = {
    session: session,
    account: account,
    portfolio: portfolio,
    contract: contract,
    marketData: marketData,
    order: order

};