'use strict'

var mongo = require("mongodb").MongoClient,
    assert = require("assert");
const {config} = require("./config");

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

exports.handler = async (event, context, callback) => {
    console.log(`Event: ${JSON.stringify(event)}`)
    try {
        const client = await mongo.connect(MONGO_URL);
        const db = client.db('pcsm');
        const collection = db.collection('profileExtended');
        const user = collection.findOne({ username: username })
        context.done(null, { status: 200, user })
    } catch (getUserCurrencyError) {
        console.log('getUserCurrencyError', getUserCurrencyError)
        context.fail({status: 500, message: `Error: ${JSON.stringify(getUserCurrencyError)}`})
    }
}