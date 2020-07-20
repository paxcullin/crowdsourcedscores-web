'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert");
    
    var AWS = require('aws-sdk');
    var cognitoidentityserviceprovider = AWS.CognitoIdentityServiceProvider;
    var client = new cognitoidentityserviceprovider({ apiVersion: '2016-04-19', region: 'us-west-2' });

const MONGO_URL = 'mongodb://${username}:${password}@ds011775.mlab.com:11775/pcsm';

// console.log('Loading function');

exports.handler = (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const { year, week, season, sport } = event;
    const limit = event.limit ? parseInt(event.limit) : 100;
    mongo.connect(MONGO_URL, function (err, db) {
        assert.equal(null, err);
        if(err) {
            context.done(err, null);
        }
        
        if (!event.week) {
            context.done(null, { success: false, message: "No week submitted"})
        }
        
        const dbPCSM = db.db('pcsm');
        const leaderboardsCollection = dbPCSM.collection('leaderboards');
        const profileExtendedCollection = dbPCSM.collection('profileExtended');
        
        
        
        leaderboardsCollection.findOne({ sport: sport, year: year, gameWeek: week, season: season })
        .then(async (leaderboard) => {
            console.log({ leaderboard })
            if (leaderboard && leaderboard.weekly && leaderboard.weekly.users && leaderboard.overall && leaderboard.overall.users) {
                var leaderboardWeeklyArrayLength = leaderboard.weekly.users.length;
                var leaderboardWeeklyUsers = leaderboard.weekly.users;
                var leaderboardOverallArrayLength = leaderboard.overall.users.length;
                var leaderboardOverallUsers = leaderboard.overall.users;
                //console.log({leaderboardUsers})
                let leaderboardWeeklyUsersMapped = await Promise.all(leaderboardWeeklyUsers.map(async (user) => {
                    try {
                        let epUser = await profileExtendedCollection.findOne({ username: user.username });
                        user.preferred_username = epUser.preferred_username;
                        //console.log({user})
                        leaderboardWeeklyArrayLength--;
                        return user;
                    } catch (extendedProfileError) {
                        console.log({ extendedProfileError })
                        leaderboardWeeklyArrayLength--;
                        return user;
                    }
                }))
                let leaderboardOverallUsersMapped = await Promise.all(leaderboardOverallUsers.map(async (user) => {
                    try {
                        let epUser = await profileExtendedCollection.findOne({ username: user.username })
                        user.preferred_username = epUser.preferred_username;
                        console.log({user})
                        leaderboardOverallArrayLength--;
                        return user;
                    } catch (extendedProfileError) {
                        console.log({ extendedProfileError })
                        leaderboardOverallArrayLength--;
                        return user;
                    }
                }))
                //console.log({leaderboardArrayLength, leaderboardUsers})
                
                if (leaderboardWeeklyArrayLength === 0 && leaderboardOverallArrayLength === 0) {
                    let leaderboardWeeklyStars = leaderboardWeeklyUsersMapped.filter(user => {
                        if (user.stars && user.stars.roi) return user;
                    })
                    let leaderboardOverallStars = leaderboardOverallUsersMapped.filter(user => {
                        if (user.stars && user.stars.roi) return user;
                    })
                    console.log({ leaderboardOverallStars: JSON.stringify(leaderboardOverallStars), leaderboardWeeklyStars: JSON.stringify(leaderboardWeeklyStars) })
                    leaderboardWeeklyStars.sort((a,b) => {
                        return (a.stars.roi - b.stars.roi) * -1 || (a.stars.net - b.stars.net) * -1
                        
                        // if (a.stars.roi > b.stars.roi) return 1
                        // if (a.stars.roi < b.stars.roi) return -1
                    })
                    leaderboardOverallStars.sort((a,b) => {
                        return (a.stars.roi - b.stars.roi) * -1 || (a.stars.net - b.stars.net) * -1
                    })
                    leaderboard.weekly.users = leaderboardWeeklyUsersMapped
                    leaderboard.overall.users = leaderboardOverallUsersMapped
                    leaderboard.weekly.usersStars = leaderboardWeeklyStars
                    leaderboard.overall.usersStars = leaderboardOverallStars
                    console.log({ Leaderboard: JSON.stringify(leaderboard)})
                    context.done(null, leaderboard)
                }
            } else {
                console.log({
                        year,
                        season,
                        sport,
                        week
                    })
                context.done(null, { 
                    leaderboard: {
                        year,
                        season,
                        sport,
                        week
                    }
                })
            }
        })
        .catch(getLeaderboardError => console.log({getLeaderboardError}))
            
        //})
        
    });
};
