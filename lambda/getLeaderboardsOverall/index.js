'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    {config} = require('config');
    
    const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

// console.log('Loading function');

exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const { year, week, season } = event;
    const limit = event.limit ? parseInt(event.limit) : 100;
    try {
        const db = await mongo.connect(MONGO_URL);
            
        if (!event.week) {
            context.done(null, { success: false, message: "No week submitted"})
        }
        
        const dbPCSM = db.db('pcsm');
        const leaderboardsCollection = dbPCSM.collection('leaderboards');
        const profileExtendedCollection = dbPCSM.collection('profileExtended');
        
        
        
        const leaderboard = await leaderboardsCollection.findOne({ year: year, gameWeek: week })
        console.log({ leaderboard })
        if (!leaderboard.overall.users) {
            context.done(null, { leaderboard })
        }
        var leaderboardArrayLength = leaderboard.overall.users.length;
        var leaderboardUsers = leaderboard.overall.users;
        console.log({leaderboardUsers})
        let leaderboardUsersMapped = await Promise.all(leaderboardUsers.map(async (user) => {
            try {
                let epUser = await profileExtendedCollection.findOne({ username: user.username })
                user.preferred_username = epUser.preferred_username;
                console.log({user})
                leaderboardArrayLength--;
                return user;
            } catch (extendedProfileError) {
                console.log({ extendedProfileError })
                leaderboardArrayLength--;
                return user;
            }
        }))
        console.log({leaderboardArrayLength, leaderboardUsers})
        
        if (leaderboardArrayLength === 0) {
            leaderboard.overall.users = leaderboardUsers
            console.log({ Leaderboard: JSON.stringify(leaderboard)})
            context.done(null, leaderboard)
        }
    } catch(err) {

        assert.equal(null, err);
        context.fail(err, null);
    }
};
