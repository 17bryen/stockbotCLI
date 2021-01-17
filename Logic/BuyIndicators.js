/*
TO INCORPORATE:
-Determine market conditions and decide which indicators to make use of:
    -Trending markets:
        -Incorporate MA Ribbons to decide when to enter long and short positions

    -Ranging markets:
        -Use bollinger bands to choose where to short and sell(?)

-Support & Resistance:
    -Algorithmically calculate support and resistance levels:
        -Take recent maxima/minima and solve for dy/dx
        -Correlate past volume bars and price movement to find areas with high volume and low price movement -> possibly predicts future levels?
-Trend Lines:
    -Algorithmically calculate lines:
        -Maybe use technical indicator to bypass need for lines?
        -Accurately determine which direction price is headed and how far
-Two-Legged Pullback:
    -How to calculate the pull backs?
    -How determine a trending market?
*/

'use strict';

async function buy(contract) {
    
}

let indicators = {
    async tick(watchList, tickData) {

    },

    async lowTick() {

    },

    async medTick() {

    },

    async highTick() {
      
    }
}

module.exports = indicators;