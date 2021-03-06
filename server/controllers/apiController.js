const fetch = require('node-fetch'); // npm i node-fetch on April 20th to help make API requests from backend
const dotenv = require('dotenv').config() // protect API key - Added on April 20th 
STOCK_KEY = process.env.API_KEY; // variable for using API key for API requests - Added on April 20th
const User = require('../models/userModel.js');

// Middleware for Stock GET and POST requests - Added on April 19th 
const apiController = {

    // redirected from GET '/api/:symbol' endpoint
    // edited getStockValue on April 20th 
    getStockValue(req, res, next) {
        console.log('API key >>>', STOCK_KEY)
        console.log(req.params.symbol)
        fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${req.params.symbol}&interval=5min&apikey=${STOCK_KEY}`)
        .then(res => res.json())
        .then(data => {
            res.locals.stockInfo = {symbol: req.params.symbol, price: Math.floor(data['Time Series (5min)']['2020-04-20 16:00:00']['4. close'])}
            next()
            })
        .catch(err => {
            console.log('this is the error >>>', err);
            });
     },

    // redirected from POST '/api/buy' endpoint
    // updated on April 20th
    buyStock(req, res, next) {
        // add symbol and shares to stocklist array
        // [fb, 20]
        // subtract total from req.body from cash
        console.log('established connection')
       // const user = await User.findById(req.body._id)
       // const {stockList, cash} = user;
        User.findOneAndUpdate({_id: req.body._id}, {"$set": {stocks: [{stock: req.body.symbol, shares: req.body.shares, currValue: req.body.currValue}], cash: 100000 - req.body.total}}, {new: true}, (err, user) => {
            if (err) return next(err)
            if (!user) return next("User not found")
            res.locals.user = user;
            next();
        })
    },
    // redirected from POST '/api/sell' endpoint
    sellStock(req, res, next) {

    }
}

module.exports = apiController;