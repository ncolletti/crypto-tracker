# Basic Crypto-Currency Tracker

A node.js service that compares your personal coins/tokens and transactions against data retrieved from the [coinmarketcap.com API](https://coinmarketcap.com/api/)

Created by Github user: kingbonio
Modified by Github user: ncolletti


## Get Started

- Ensure npm v5.6.0+ and node v8.9.3+ are installed

- Create a coins.json file in the config folder or edit the existing file. 

- Fill in the details of your purchases following the template below:

```
[
    {
        "name": "bitcoin",
        "purchasePrice": "700.80",
        "volume": "5"
    },
    {
        "name": "ethereum",
        "purchasePrice": "97.50",
        "volume": "15"
    },
    {
        "name": "ripple",
        "purchasePrice": "0.35",
        "volume": "1364"
    }
]
```

> Please note the coin's name must match the name used by coinmarketcap.com, you can find a coin's name at the end of the URL for its page, e.g. [https://coinmarketcap.com/currencies/**bitcoin**/](https://coinmarketcap.com/currencies/bitcoin/)

- Run `npm install` in your console

- Run `npm start` in your console at the root directory

- Wait a few seconds for the response


## Future Changes

- Transfer the features to a web-based system

- Enable search for coin names
