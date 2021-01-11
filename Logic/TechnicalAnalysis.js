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
            for (let j = 0; j < length; j++){
                sum += priceAction.history[j][i];
            }
            toReturn[i] = sum / length;
        }
        toReturn.t = priceAction.history[0].t;

        return toReturn;
    }
}

let EMA = {
    // Function Calculates initial EMA object
    async calculate(priceAction, length) {
        if (priceAction.history.length < (length + 1)) {
            console.log('Not enough data to create EMA from contract');
            return false;
        }
        let toReturn = {
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

        toReturn.history.unshift(toAdd);
        return toReturn;
    }, 
    // Function Updates previously created EMA function when new values are added to timeline
    async update(priceAction, prevEMA) {
        let toAdd = {};
        let sum = 0;
        for (let i in settings.technicalIndicators.TAValues) {
            sum = 0;
            sum = (priceAction.history[0][i] * prevEMA.k) + ( prevEMA.history[0][i] * (1 - prevEMA.k));
            toAdd[i] = sum;
        }
        toAdd.t = priceAction.history[0].t;

        prevEMA.hisotry.unshift(toAdd);
        if (prevEMA.history.length > settings.technicalIndicators.historyLength)
            prevEMA.history.pop();
      
        return prevEMA;
    }
}

let RSI = {
    // RSI Object Structure 
    /*
    RSI = {
        history: [{
            avgGain: float,
            avgLoss: float,
            rsi: float,
            t: Date
        }],
        length: int
    }
    */
    
    async calculate(priceAction, length) {
        if (priceAction.history.length < (length + 1)) {
            console.log('Not enough data to create RSI from contract');
            return false;
        }
        let toReturn = {
            history: [],
            length: length
        }
        let toAdd = {
            avgGain: 0,
            avgLoss: 0
        }
        
        let tempPerc = 0, gainSum = 0, lossSum = 0;
        for (let i = length; i > 0; i--) {
            tempPerc = (priceAction.history[i - 1].lastPrice / priceAction.history[i].lastPrice) - 1;
            if (tempPerc > 0) {
                gainSum += tempPerc;
            } else if (tempPerc < 0){
                lossSum += tempPerc;
            }
        }
        toAdd.avgGain = gainSum / length;
        toAdd.avgLoss = (lossSum / length) * -1;
        toAdd.rsi = 100 - (100 / (1 + (toAdd.avgGain / toAdd.avgLoss)));
        toAdd.t = priceAction.history[0].t;
      
        toReturn.history.push(toAdd);
        return toReturn;
    },
    
    async update(priceAction, prevRSI) {
        let toAdd = {
            avgGain: 0,
            avgLoss: 0
        }
        let percChange = (priceAction.history[0].lastPrice / priceAction.history[1].lastPrice) - 1;
        if (percChange > 0){
            toAdd.avgGain = ((prevRSI.history[0].avgGain * (prevRSI.length - 1)) + percChange) / prevRSI.length;
            toAdd.avgLoss = (prevRSI.history[0].avgLoss * (prevRSI.length - 1)) / prevRSI.length;
        } else if (percChange < 0){
            toAdd.avgLoss = ((prevRSI.history[0].avgLoss * (prevRSI.length - 1)) + (percChange * -1)) / prevRSI.length;
            toAdd.avgGain = (prevRSI.history[0].avgGain * (prevRSI.length - 1)) / prevRSI.length;
        }
        toAdd.rsi = 100 - (100 / (1 + (toAdd.avgGain / toAdd.avgLoss)));
        toAdd.t = priceAction.history[0].t;

        prevRSI.history.unshift(toAdd);
        if (prevRSI.history.length > settings.technicalIndicators.historyLength)
            prevRSI.history.pop()

        return prevRSI;
    }
}

let MACD = {
    // MACD Object Structure 
    /*
    MACD = {
        history: [{
            lastPrice: float,
            l: float,
            h: float,
            v: int,
            t: Date
        }],
        upperEMA: EMA,
        lowerEMA: EMA,
        signal: EMA,
        signalLength: int
    }
    */

    async calculate(priceAction, longerEMA, shorterEMA, signal) {
        if (priceAction.history.length < (longerEMA + 1)){
            console.log('Not enough data to create MACD from contract');
            return false;
        }
        let toReturn = {
            history: [],
            upperEMA: false,
            lowerEMA: false,
            signal: false,
            signalLength: signal
        }
        let toAdd = { };
        
        toReturn.lowerEMA = await EMA.calculate(priceAction, shorterEMA);
        toReturn.upperEMA = await EMA.calculate(priceAction, longerEMA);
      
        for (let i in settings.technicalIndicators.TAValues)
            toAdd[i] = (toReturn.lowerEMA.history[0][i] - toReturn.upperEMA.history[0][i]);
        toAdd.t = priceAction.history[0].t;
        
        toReturn.history.push(toAdd);
        return toReturn;
    },

    async update(priceAction, prevMACD) {
        await EMA.update(priceAction, prevMACD.upperEMA);
        await EMA.update(priceAction, prevMACD.lowerEMA);

        let toAdd = { };
        for (let i in settings.technicalIndicators.TAValues)
            toAdd[i] = (toReturn.lowerEMA.history[0][i] - toReturn.upperEMA.history[0][i]);
        toAdd.t = priceAction.history[0].t;
        prevMACD.history.unshift(toAdd);

        if (prevMACD.signal) {
            await EMA.update(prevMACD, prevMACD.signal);
        } else if (prevMACD.history.length > (prevMACD.signalLength + 1)) {
            prevMACD.signal = await EMA.calculate(prevMACD, prevMACD.signalLength);
        }

        return prevMACD;
    }
}


module.exports = {
    EMA: EMA,
    RSI: RSI,
    MACD: MACD
}