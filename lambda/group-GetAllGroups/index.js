'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    {config} = require('config');

    const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

// console.log('Loading function');

exports.handler = (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const { sport, year, season } = event

    mongo.connect(MONGO_URL, (err, client) => {
        assert.equal(null, err);
        if(err) {
            context.done(err, null);
        }
        var limit = 100;

        if (event.limit && event.limit != "") {
            limit = parseInt(event.limit);
        }
        const db = client.db('pcsm');
        var collection = db.collection('groups');
        const sortQuery = `results[${sport}][${year}]${season ? `[${season}]` : ''}overall.predictionScore`
        collection.find({"sport": event.sport, "year": parseInt(event.year), "groupId": { $gt: 0 }, "hidden": { $ne: true } }, {groupId: true, groupName: true, public: true, sport: true, year: true, results: true, picture: true},{sort: {[sortQuery]: -1}, limit: limit}).toArray(function(err, groups) {
            
            assert.equal(err, null);
            if(err) {
                context.done(err, null);
            }
            if (season) {
                groups = groups.filter(group => group.results && group.results[sport] && group.results[sport][year] && group.results[sport][year][season])
                groups.sort((a,b) => b.results[sport][year][season].overall.predictionScore - a.results[sport][year][season].overall.predictionScore)
            }
            //console.log("groups returned:", groups);
            context.done(null, groups);
        });
    });
};
