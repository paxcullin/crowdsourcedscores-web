'use strict'

var mongo = require("mongodb").MongoClient,
    assert = require("assert");
const {config} = require("./config");

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;
    
exports.handler = async (event, context, callback) => {
    console.log(`Event: ${JSON.stringify(event)}`)
    const { username , currencyAmount, currencyMultiplier } = event
    if (!username) {
        console.log('No user ID provided')
        context.fail({status: 500, message: 'No user ID provided'})
    }
    if (!currencyAmount || !currencyMultiplier) {
        console.log('No Currency Amount')
        context.fail({status: 500, message: 'No currency amount or multiplier provided'})
    }
    try {
        const client = await mongo.connect(MONGO_URL);
        const db = client.db('pcsm');
        const collection = db.collection('profileExtended');
        collection.updateOne({ username: username }, { $inc: { currency: currencyAmount * currencyMultiplier }})
        context.done(null, { status: 200, message: `The balance of ${username} was updated successfully. ${currencyAmount * currencyMultiplier}`})
    } catch (addCurrencyError) {
        console.log('addCurrencyError', addCurrencyError)
        context.fail({status: 500, message: `Error: ${JSON.stringify(addCurrencyError)}`})
    }
}