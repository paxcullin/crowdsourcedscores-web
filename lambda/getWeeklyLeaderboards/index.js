    'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    {config} = require('config');
    
    // var AWS = require('aws-sdk');
    // var cognitoidentityserviceprovider = AWS.CognitoIdentityServiceProvider;
    // var client = new cognitoidentityserviceprovider({ apiVersion: '2016-04-19', region: 'us-west-2' });

    const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

// console.log('Loading function');

// Context must return an array

exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const { year, week, season, sport } = event;
    const limit = event.limit ? parseInt(event.limit) : 100;
    try {
        const client = await mongo.connect(MONGO_URL);
        const db = client.db('pcsm');
    
        
        if (!event.week) {
            context.done(null, { success: false, message: "No week submitted"})
        }
        
        const leaderboardsCollection = db.collection('leaderboards');
        const profileExtendedCollection = db.collection('profileExtended');
        
        
        
        const leaderboard = await leaderboardsCollection.findOne({ sport: sport, year: year, gameWeek: week, season: season })
        // console.log({ leaderboard })
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
                    if (user.stars && user.stars.roi !== null && user.stars.wagered > 0) return user;
                })
                let leaderboardOverallStars = leaderboardOverallUsersMapped.filter(user => {
                    if (user.stars && user.stars.roi!==null && user.stars.wagered >= (leaderboard.gameWeek * 5)) return user;
                })
                //console.log({ leaderboardOverallStars: JSON.stringify(leaderboardOverallStars), leaderboardWeeklyStars: JSON.stringify(leaderboardWeeklyStars) })
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
                // console.log({ Leaderboard: JSON.stringify(leaderboard)})
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
                    weekly: {},
                    overall: {}
            })
            
        }
    } catch (err) {
        console.log('getWeeklyLeaderboard err:', err)
        context.fail({ status: 500, message: `Error: ${JSON.stringify(err)}`,
            weekly: {},
            overall: {}
        })
    }
}