const request = require('request-promise');
const coins = require("./config/coins.json");


const currentPrices = [];
const pricePromises = [];

async function requestCoinData(coin){
    return request(coin.uri)
    .then(results => {
        results = JSON.parse(results);
        currentPrices.push({ name: coin.name, price: results[0].price_usd });
        for (let i = 0; i < coins.length; i++) {
            if (coins[i].name === currentPrice.name) {
                coins[i].currentPrice = results[0].price_usd;
            }
        }
    })
    .catch(() => {
         return "error retrieving data";
    })
}

function calculateProfit(currentPrice) {
    for (let i = 0; i < coins.length; i++) {
        if (coins[i].name === currentPrice.name) {
            let coin = coins[i];
            let changeInValue = (currentPrice.price - coin.purchasePrice) * 100;
            let profitMade = coin.volume * (changeInValue / 100);
            coin.currentPrice = currentPrice.price;
            coin.changeInValue = parseFloat(changeInValue).toFixed(5);
            coin.originalValue = parseFloat(coin.purchasePrice * coin.volume).toFixed(2);
            coin.currentValue = parseFloat(coin.currentPrice * coin.volume).toFixed(2);
            coin.profitMade = parseFloat(profitMade - coin.originalValue).toFixed(2);
        }
    }
}


for (let i = 0; i < coins.length; i++) {
    pricePromises.push(requestCoinData(coins[i]));
}

Promise.all(pricePromises)
    .then(prices => {
        let totalProfit = 0;
        for (let i = 0; i < currentPrices.length; i++) {
            calculateProfit(currentPrices[i]);
        }
        for (let i = 0; i < coins.length; i++) {
            let coin = coins[i];
            console.log(coin.name);
            console.log("original price: $" + coin.purchasePrice);
            console.log("current price: $" + coin.currentPrice);
            console.log("original value: $" + coin.originalValue);
            console.log("current value: $" + coin.currentValue);
            console.log("Change in price = " + coin.changeInValue + "%");
            console.log("Profit made = $" + coin.profitMade + "\n");
            totalProfit += Number(coin.profitMade);
        }
        console.log("\n$" + parseFloat(totalProfit).toFixed(2));
    })
    .catch(err => {
        console.log(err);
    });


// request = promises
// fulfill promises and then calculate results
// Then show results


