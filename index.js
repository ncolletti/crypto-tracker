const request = require('request-promise');
const coins = require('./config/coins.json');
// *NC: adding ability to save data to csv file
const json2csv = require('json2csv');
const fs = require("fs");

const uri = 'https://api.coinmarketcap.com/v1/ticker/';
const currentPrices = [];
const pricePromises = [];
const resultsPrint = [];
const fontColor = {
    down: '33m\u2193 ',
    up: '32m\u2191 '
}


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
        // resultsPrint.push(results);

        // Set changes in value to coin
        coin.change1hr = results[0].percent_change_1h;
        coin.change24hr = results[0].percent_change_24h;
        coin.change7d = results[0].percent_change_7d;

        // Set the colour and direction for each 3 time periods
        coin.change24hrArrow =  coin.change1hr > 0 ? fontColor.up : fontColor.down;
        coin.change1hrArrow =  coin.change24hr > 0 ? fontColor.up : fontColor.down;
        coin.change7dArrow = coin.change7d > 0 ? fontColor.up : fontColor.down;
    })
    .catch(() => {
         return 'error retrieving data';
    })
}

function calculateChanges(currentPrice) {
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


console.log("Collecting Data...\n");
for (let i = 0; i < coins.length; i++) {
    pricePromises.push(requestCoinData(coins[i]));
}

Promise.all(pricePromises)
    .then(prices => {
                      let totalProfit = 0;
                      for (let i = 0; i < currentPrices.length; i++) {
                        calculateChanges(currentPrices[i]);
                      }

                      // setup for csv file
                      let fields = ["coin", "original_price", "current_price", "change_1hr", "change_24hr", "change_7d", "original_value", "current_value", "change_price", "profit_made"];
                      let myCoins = [{
                          
                      }];

                      // Print details of each coin to console
                      for (let i = 0; i < coins.length; i++) {
                        let coin = coins[i];
                        console.log(coin.name);
                        console.log("original price: $" + coin.purchasePrice);
                        console.log("current price: $" + coin.currentPrice);
                        console.log("change in 1hr: \x1b[" + coin.change1hrArrow + "1hr " + coin.change1hr + "%\x1b[0m");
                        console.log("change in 24hr: \x1b[" + coin.change24hrArrow + "24hr " + coin.change24hr + "%\x1b[0m");
                        console.log("change in 7d: \x1b[" + coin.change7dArrow + "7d " + coin.change7d + "%\x1b[0m");
                        console.log("original value: $" + coin.originalValue);
                        console.log("current value: $" + coin.currentValue);
                        console.log("Change in price: " + coin.changeInValue + "%");
                        console.log("Profit made: \x1b[" + coin.profitArrow + "$" + coin.profitMade + "\x1b[0m\n");
                        totalProfit += Number(coin.profitMade);

                        // *NC: append each coin to table object
                        let myNewCoin = {};
                    
                        myNewCoin.coin = coin.name;
                        myNewCoin.original_price = coin.purchasePrice;
                        myNewCoin.current_price = coin.currentPrice;
                        myNewCoin.change_1hr = coin.change1hr;
                        myNewCoin.change_24hr = coin.change24hr;
                        myNewCoin.change_7d = coin.change7d;
                        myNewCoin.original_value = coin.originalValue;
                        myNewCoin.current_value = coin.currentValue;
                        myNewCoin.change_price = coin.changeInValue;
                        myNewCoin.profit_made = coin.profitMade;

                        myCoins.push(myNewCoin);
                      }
                      // console.log(resultsPrint);
                      console.log("\n$" + parseFloat(totalProfit).toFixed(2));

                      // *NC: write csv with all coin data
                      let coinCsv = json2csv({
                          data: myCoins,
                          fields: fields
                      });

                      // *NC: write csv to hard drive
                      fs.writeFile('mycoins.csv', coinCsv, function(err){
                          if (err) throw err;
                          console.log('mycoins.csv has been saved');
                      });

                    })
    .catch(err => {
        console.log(err);
    });
