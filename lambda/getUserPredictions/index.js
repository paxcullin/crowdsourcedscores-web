'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    {config} = require('./config');

    const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

// console.log('Loading function');

exports.handler = (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    mongo.connect(MONGO_URL, function (err, dbClient) {
        assert.equal(null, err);
        if(err) {
            context.done(err, null);
        }
        const db = dbClient.db('pcsm');
        var collection = db.collection('predictions');
        const { year, week, userId } = event
        if (!year || !week || !userId) { 
            context.done(null, { message: 'No user provided'})
        }
        collection.find({"year": year,"gameWeek":  week, "userId": userId, "results": { "$exists": true } }, {_id: false}).toArray(function(err, docs) {
            assert.equal(err, null);
            if(err) {
                context.done(err, null);
            }
            context.done(null, docs);
        });
    });
};
