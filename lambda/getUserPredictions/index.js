'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    {config} = require('./config');

    const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

// console.log('Loading function');

exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    try {
        const dbClient = await mongo.connect(MONGO_URL);
        const db = dbClient.db('pcsm');
        const collection = await db.collection('predictions');
        const { year, week, userId } = event
        if (!year || !week || !userId) { 
            context.done(null, { message: 'No user provided'})
        }
        const docs = await collection.find({"year": year,"gameWeek":  week, "preferred_username": userId, "results": { "$exists": true } }, {_id: false}).toArray();
        context.done(null, docs);
    } catch(err) {
        assert.equal(null, err);
        if(err) {
            context.fail(err, null);
        }
    }
};
