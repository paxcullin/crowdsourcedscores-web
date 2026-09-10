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
        assert.notEqual(client, null);
        if(!client) {
            return {
                status: 500,
                message: JSON.stringify({ error: "Failed to connect to MongoDB" })
            };
        }

        const db = client.db('pcsm');
        
        
        var collection = db.collection('profileExtended');
        const { userDetails, username }  = event
        let projectObj = { "username": username }
        const result = await collection.findOneAndUpdate({"username":username}, { $set: { ...userDetails }})
        //, [`results['${projectObj.sport}'][${projectObj.year}]['${projectObj.season}'].overall`]: 1, [`results['${projectObj.sport}'][${projectObj.year}]['${projectObj.season}'].weekly`]: { $elemMatch: { gameWeek: event.week }}
        assert.notEqual(result, null);
        if(!result) {
            return {
                status: 500,
                message: JSON.stringify({ error: "Failed to find user profile" })
            };
        }   
        console.log(`result`, result)
        return {
            status: 200,
            message: JSON.stringify({ success: "User profile updated successfully", result }),
            extendedProfile: result.value
        };
    } catch(updatedExtendedProfileError) {
            console.log("reject: ", updatedExtendedProfileError);
            return {
                status: 500,
                message: JSON.stringify({ error: "Failed to update user profile", details: updatedExtendedProfileError })
            };
    }
};
