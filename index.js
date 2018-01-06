const request = require('request-promise');
const coins = require('./config/coins.json');

const uri = 'https://api.coinmarketcap.com/v1/ticker/';
const currentPrices = [];
const pricePromises = [];
const fontColor = {
    down: '33m\u2193 ',
    up: '32m\u2191 '
}

const resultsPrint =[];

async function requestCoinData(coin){
    return request(uri + coin.name)
    .then(results => {
        results = JSON.parse(results);
        currentPrices.push(
            {
                name: coin.name, 
                price: results[0].price_usd           
            }
        );
        resultsPrint.push(results);

        coin.change1hr = results[0].percent_change_1h;
        coin.change1hrArrow =  results[0].percent_change_1h > 0 ? fontColor.up : fontColor.down;
        coin.change24hr = results[0].percent_change_24h;
        coin.change24hrArrow =  results[0].percent_change_24h > 0 ? fontColor.up : fontColor.down;
        coin.change7d = results[0].percent_change_7d;
        coin.change7dArrow = results[0].percent_change_7d > 0 ? fontColor.up : fontColor.down;

        for (let i = 0; i < coins.length; i++) {
            if (coins[i].name === currentPrice.name) {
                coins[i].currentPrice = results[0].price_usd;
            }
        }
    })
    .catch(() => {
         return 'error retrieving data';
    })
}

function calculateProfit(currentPrice) {
    for (let i = 0; i < coins.length; i++) {
        if (coins[i].name === currentPrice.name) {
            let coin = coins[i];
            let changeInValue = (currentPrice.price / coin.purchasePrice) * 100;
            let profitMade = coin.volume * (changeInValue / 100);
            coin.currentPrice = currentPrice.price;
            coin.changeInValue = parseFloat(changeInValue).toFixed(5);
            coin.originalValue = parseFloat(coin.purchasePrice * coin.volume).toFixed(2);
            coin.currentValue = parseFloat(coin.currentPrice * coin.volume).toFixed(2);
            coin.profitMade = parseFloat(coin.currentValue - coin.originalValue).toFixed(2);
            coin.profitArrow = coin.profitMade < 0 ? fontColor.down : fontColor.up;
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
            console.log('original price: $' + coin.purchasePrice);
            console.log('current price: ' + coin.currentPrice);
            console.log('change in 1hr: \x1b[' + coin.change1hrArrow + '1hr $' + coin.change1hr + '%\x1b[0m');
            console.log('change in 24hr: \x1b[' + coin.change24hrArrow + '24hr $' + coin.change24hr + '%\x1b[0m');
            console.log('change in 7d: \x1b[' + coin.change1hrArrow + '7d $' + coin.change7d + '%\x1b[0m');
            console.log('original value: $' + coin.originalValue);
            console.log('current value: $' + coin.currentValue);
            console.log('Change in price: ' + coin.changeInValue + '%');
            console.log('Profit made: \x1b[' + coin.profitArrow + '$' + coin.profitMade + '\x1b[0m\n');;
            totalProfit += Number(coin.profitMade);
        }
        // console.log(resultsPrint);
        console.log('\n$' + parseFloat(totalProfit).toFixed(2));
    })
    .catch(err => {
        console.log(err);
    });
