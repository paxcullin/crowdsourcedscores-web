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
        
        
        var collection = db.collection('profileExtended');
        const { userDetails, username }  = event
        let projectObj = { "username": username }
        collection.findOneAndUpdate({"username":username}, { $set: { ...userDetails }})
        //, [`results['${projectObj.sport}'][${projectObj.year}]['${projectObj.season}'].overall`]: 1, [`results['${projectObj.sport}'][${projectObj.year}]['${projectObj.season}'].weekly`]: { $elemMatch: { gameWeek: event.week }}
        .then((err, result) => {
            assert.equal(err, null);
            if(err) {
                context.done(err, null);
            }
            console.log(`result`, result)
            context.done(null, extendedProfile);
        })
        .catch(function(reject) {
            console.log("reject: ", reject);
            context.fail(reject, null)
        });
    });
};
