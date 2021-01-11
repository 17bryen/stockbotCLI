'use strict'
const settings = require('./config.json');
let EMAWeight = 2;

let SMA = {
    async calulate(priceAction, length) {
        if (priceAction.history.length < length) {
            console.log('Not enough data to create SMA from contract');
            return false;
        }
        let toReturn = {};

        let sum = 0;
        for (let i in settings.technicalIndicators.TAValues) {
            sum = 0;
            for (j = 0; j < length; j++){
                sum += priceAction.history[j][i];
            }
            toReturn[i] = sum / length;
        }
        toReturn.t = priceAction.history[0].t;

        return toReturn;
    }
}

let EMA = {
    async calculate(priceAction, length) {
        if (priceAction.history.length < (length + 1)) {
            console.log('Not enough data to create EMA from contract');
            return false;
        }
        toReturn = {
            history: [{}],
            k: (EMAWeight / (length + 1)),
            length: length
        }

        let tempNewest = priceAction.history.shift();
        toReturn.history.push(SMA.calulate(priceAction, length));
        priceAction.history.unshift(tempNewest);
    
        let toAdd = {};
        let sum = 0;
        for (let i in settings.technicalIndicators.TAValues) {
            sum = 0;
            sum = (priceAction.history[0][i] * toReturn.k) + (toReturn.history[0][i] * (1 - toReturn.k));
            toAdd[i] = sum;
        }
        toAdd.t = priceAction.history[0].t;

        toReturn = 
    },
    async update(priceAction, prevEMA, length) {
        
    }
}

let RSI = {
    async calculate(priceAction) {
        
    },
    async update(priceAction) {
        
    }
}

let MACD = {
    async calculate(priceAction) {
        
    },
    async update(priceAction) {
        
    }
}


module.exports = {
    EMA: EMA,
    RSI: RSI,
    MACD: MACD
}