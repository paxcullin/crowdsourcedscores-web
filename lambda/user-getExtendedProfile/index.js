'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    {config} = require('config');

    const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

// console.log('Loading function');

exports.handler = (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    mongo.connect(MONGO_URL, function (err, client) {
        assert.equal(null, err);
        if(err) {
            context.done(err, null);
        }

        const db = client.db('pcsm');
        
        let projectObj = { "username": event.username }
        event.sport ? projectObj.sport = event.sport : null
        event.year ? projectObj.year = event.year : null
        event.season ? projectObj.season = event.season : null
        event.week ? projectObj.week = event.week : null

        var collection = db.collection('profileExtended');
        collection.findOne({"username":event.username}, {username: 1, groups: { $elemMatch: { sport: projectObj.sport, year: projectObj.year } }, results: 1})
        //, [`results['${projectObj.sport}'][${projectObj.year}]['${projectObj.season}'].overall`]: 1, [`results['${projectObj.sport}'][${projectObj.year}]['${projectObj.season}'].weekly`]: { $elemMatch: { gameWeek: event.week }}
        .then(function(extendedProfile) {
            assert.equal(err, null);
            if(err) {
                context.done(err, null);
            }
            console.log("extendedProfile: ", JSON.stringify(extendedProfile))
            if (event.sport && event.year && event.season && event.week && extendedProfile.results && extendedProfile.results[event.sport] && extendedProfile.results[event.sport][event.year] && extendedProfile.results[event.sport][event.year][event.season]) {
                let overallResults = extendedProfile.results[event.sport][event.year][event.season].overall
                let weeklyResultFilteredArray = extendedProfile.results[event.sport][event.year][event.season].weekly.filter((weeklyResult) => {
                    return weeklyResult && (weeklyResult.gameWeek === event.week)
                })
                console.log('weeklyResultFilteredArray: ', weeklyResultFilteredArray)
                extendedProfile.results = {
                    overall: overallResults,
                    weekly: weeklyResultFilteredArray ? weeklyResultFilteredArray[0] : null
                }
            }
            if (!extendedProfile.results || (extendedProfile.results && !extendedProfile.results.weekly)) {
                extendedProfile.results = {
                    ...extendedProfile.results,
                    weekly: null

                }
            }
            context.done(null, extendedProfile);
        })
        .catch(function(reject) {console.log("reject: ", reject)});
    });
};
