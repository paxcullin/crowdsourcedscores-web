'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert");
    
    var AWS = require('aws-sdk');
    var cognitoidentityserviceprovider = AWS.CognitoIdentityServiceProvider;
    var client = new cognitoidentityserviceprovider({ apiVersion: '2016-04-19', region: 'us-west-2' });

const MONGO_URL = 'mongodb://pcsm-user:*dZ2HaWN@ds011775.mlab.com:11775/pcsm';

// console.log('Loading function');

exports.handler = (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const { year, week, season } = event;
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
        
        
        
        leaderboardsCollection.findOne({ year: year, gameWeek: week })
        .then(async (leaderboard) => {
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
                
                // console.log('extendedProfiles: ', extendedProfiles)
                // var extendedProfilesArrayLength = extendedProfiles.length;
                // if (extendedProfiles.length === 0 || !extendedProfiles) {
                //     context.done(null,[])
                // }
                // extendedProfiles.map(function(extendedProfile) {
                // var weeklyResultsArray = extendedProfile.results.weekly.filter(function(result) {
                //     return result.gameWeek === gameWeek
                // });
                // extendedProfile.results.weekly = weeklyResultsArray[0];
                // extendedProfile.groups = [];
                
                // console.log('extendedProfile.results.weekly: ', extendedProfile.results.weekly);
                // if (!extendedProfile.results) {
                //     extendedProfile.results = {
                //         weekly: [],
                //         overall: {
                //             predictionScore: 0
                //         }
                //     }
                // }
                // extendedProfilesArrayLength--;
                // if (extendedProfilesArrayLength === 0) {
                //     extendedProfiles.sort(function(a,b) {
                //         if (a.results.weekly.predictionScore > b.results.weekly.predictionScore) return -1
                //         if (a.results.weekly.predictionScore < b.results.weekly.predictionScore) return 1
                //         return 0
                //     })
                //     console.log('extendedProfiles: ', extendedProfiles)
                //     context.done(null, extendedProfiles)
                // }
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
        })
        .catch(getLeaderboardError => console.log({getLeaderboardError}))
            
        //})
        
    });
};
