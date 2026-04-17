'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    {config} = require('config');

    const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

// console.log('Loading function');

exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    try {
    const client = await mongo.connect(MONGO_URL);
    const db = client.db('pcsm');
    const collection = db.collection('profileExtended');
        
        let projectObj = { "username": event.username }
        event.sport ? projectObj.sport = event.sport : null
        event.year ? projectObj.year = event.year : null
        event.season ? projectObj.season = event.season : null
        event.week ? projectObj.week = event.week : null

    const extendedProfile = await collection.findOne({"username":event.username}, {username: 1, groups: { $elemMatch: { sport: projectObj.sport, year: projectObj.year } }, results: 1})
        //, [`results['${projectObj.sport}'][${projectObj.year}]['${projectObj.season}'].overall`]: 1, [`results['${projectObj.sport}'][${projectObj.year}]['${projectObj.season}'].weekly`]: { $elemMatch: { gameWeek: event.week }}
        if (!extendedProfile) {
            context.done(null, {status: 200, message: "No extended profile found"});
        }
        console.log('extendedProfile', extendedProfile.currency);
        if (extendedProfile && (extendedProfile.currency === null || extendedProfile.currency === undefined))  {
            let updatedProfile = await collection.updateOne({username: event.username}, {$set: {currency: 10000, currencyHistory: {history: [{amount: 10000, transactionType: "grant", type: 1, date: Date.now()}]}}})
            console.log('updatedProfile', updatedProfile)
            if (updatedProfile.modifiedCount === 1) {
                extendedProfile.currency = 10000
            }
        }
            // console.log("extendedProfile: ", JSON.stringify(extendedProfile))
            if (event.sport && event.year && event.season && event.week && extendedProfile.results && extendedProfile.results[event.sport] && extendedProfile.results[event.sport][event.year] && extendedProfile.results[event.sport][event.year][event.season]) {
                let overallResults = extendedProfile.results[event.sport][event.year][event.season].overall
                let weeklyResultFilteredArray = extendedProfile.results[event.sport][event.year][event.season].weekly ? extendedProfile.results[event.sport][event.year][event.season].weekly.filter((weeklyResult) => {
                    return weeklyResult && (weeklyResult.gameWeek === event.week)
                }) : [];
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
    } catch (err) {
        console.log(err);
        context.done(err, null);
    }
};
