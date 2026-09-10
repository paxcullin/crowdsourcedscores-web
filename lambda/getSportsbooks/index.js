'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    {config} = require('config');

    const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    try {
        const client = await mongo.connect(MONGO_URL);
        const db = client.db('pcsm');
        var collection = db.collection('sportsbooks');
        const sportsbooks = await collection.find({}, {_id: false}).toArray();
        //context.done(null, games);
        console.log("sportsbooks: ", sportsbooks);
        return { status: 200, succeeded: true, sportsbooks: sportsbooks }
    } catch (err) {
        console.log(err);
        return { status: 500, succeeded: false, message: "Something went wrong. Please try again later." }
    }
}