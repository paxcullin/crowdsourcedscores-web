'use strict'

var mongo = require("mongodb").MongoClient,
    assert = require("assert");
const {config} = require("./config");

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;
    
exports.handler = async (event, context, callback) => {
    console.log(JSON.stringify(`Event: event`))
    const { userId, currencyAmount } = event
    if (!userId) {
        context.fail({status: 500, message: 'No user ID provided'})
    }
    try {
        const client = await mongo.connect(MONGO_URL);
        const db = client.db('pcsm');
        const collection = db.collection('profileExtended');
        collection.updateOne({ username: userId }, { $inc: { currency: currencyAmount }})
        context.done(null, { status: 200, message: `The balance of ${userId} was updated successfully. ${currencyAmount}`})
    } catch (addCurrencyError) {
        console.log('addCurrencyError', addCurrencyError)
    }

    // Lambda Code Here
    // context.succeed('Success!')
    // context.fail('Failed!')
}