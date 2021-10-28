'use strict';

const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    {config} = require('config'),
    aws = require('aws-sdk');

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;
const client = mongo(MONGO_URL)
const generateRandomString = function(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const TableName = 'notifications';


    var getGameWeekParams = {
        FunctionName: 'getGameWeek', // the lambda function we are going to invoke
        InvocationType: 'RequestResponse',
        LogType: 'None',
        Payload: `{ "message": "calculate weekly results", "sport": "nfl", "year": 2020, "season": "reg"}`
    };
    let getWeeklyResultsParams = {
        FunctionName: 'getWeeklyLeaderboards',
        InvocationType: 'RequestResponse',
        LogType: 'None'
    }

let queryPromises = [];

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

exports.handler = async (event, context, callback) => {
    console.log('processing event: %j', event);
        try {
        let getGameWeekResponse = await lambda.invoke(getGameWeekParams).promise()
        let getGameWeekData = JSON.parse(getGameWeekResponse.Payload)
            console.log({getGameWeekData});
            const { sport, season, year, week} = getGameWeekData
        getWeeklyResultsParams.Payload = JSON.stringify({ message: "getting weekly results for notifications", sport: getGameWeekData.sport,
            season: "post", //getGameWeekData.season,
            year: 2020, //getGameWeekData.year,
            week: 4 // getGameWeekData.week})
        })
        console.log(getWeeklyResultsParams)
        let getWeeklyResults = await lambda.invoke(getWeeklyResultsParams).promise();
        console.log(getWeeklyResults.Payload)
        
                
                let weeklyResults = JSON.parse(getWeeklyResults.Payload)
                let weeklyUserScoreResults = weeklyResults && weeklyResults.weekly ? weeklyResults.weekly.users : null
                let weeklyUserStarsResults = weeklyResults && weeklyResults.weekly ? weeklyResults.weekly.usersStars : null
                weeklyUserStarsResults = weeklyUserStarsResults.filter(user => user.stars.net > 0)
                console.log({weeklyUserScoreResults, weeklyResults, weekly: weeklyResults.weekly, users: weeklyResults.weekly.users})
                if (!weeklyUserScoreResults) {
                    
                    callback(null, { message: 'No results for the week'})
                }
                // mongo.connect(MONGO_URL, (err, dbClient) => {
                //     console.log(`dbClient`, dbClient)
                await client.connect()
                    const db = client.db('pcsm');
                    const collection = db.collection('profileExtended');
                    
                weeklyUserScoreResults.sort((a,b) => b.predictionScore - a.predictionScore)
                let filteredWeeklyUserScoreResults = weeklyUserScoreResults.filter((a, index) => index < 3)
                console.log(`filteredWeeklyUserScoreResults`, filteredWeeklyUserScoreResults);
                let top3usernames = filteredWeeklyUserScoreResults.reduce(user => {
                    return user.username                    
                })
                console.log(`top3usernames`, top3usernames)

                filteredWeeklyUserScoreResults.forEach((user, index) => {
                    const notificationId = generateRandomString(16)
                    
                    if (index < 3) {
                        let filter = {
                            username: user.username,
                            "notifications.$.season": season,
                            "notifications.$.sport": sport,
                            "notifications.$.gameWeek": week,
                            "notifications.$.year": year,
                            "notifications.$.type": "weeklyScoreResults"
                        }
                    
                        let notificaton = {
                            $setOnInsert: {
                                [`notifications.$.gameWeek`]: week,
                                [`notifications.$.season`]: season,
                                [`notifications.$.sport`]: sport,
                                [`notifications.$.year`]: year,
                                [`notifications.$.type`]: "weeklyScoreResults",
                                [`notifications.$.message`]: `Congrats! You took ${ordinal_suffix_of(index+1)} place in Week ${getGameWeekData.week} with a score of ${user.predictionScore}.`
                            }
                        };
                        // console.log(payload)
                        queryPromises.push(collection.findOneAndUpdate(filter, notificaton, { upsert: true }));
                    }
                })
                if (weeklyUserStarsResults && weeklyUserStarsResults.length > 0) {
                    weeklyUserStarsResults.sort((a,b) => b.stars.net - a.stars.net).forEach((user, index) => {
                        const notificationId = generateRandomString(16)
                        
                        if (index < 3) {
                            let filter = {
                                username: user.username,
                                "notifications.$.season": season,
                                "notifications.$.sport": sport,
                                "notifications.$.gameWeek": week,
                                "notifications.$.year": year,
                                "notifications.$.type": "weeklyStarResults"
                            }
                        
                            let notification = {
                                    $setOnInsert: {
                                        [`notifications.$.gameWeek`]: week,
                                        [`notifications.$.season`]: season,
                                        [`notifications.$.sport`]: sport,
                                        [`notifications.$.year`]: year,
                                        [`notifications.$.type`]: "weeklyStarResults",
                                        [`notifications.$.message`]: `Congrats! You took ${ordinal_suffix_of(index+1)} place in Week ${getGameWeekData.week-1} with ${user.stars.net} net stars (${Math.round(user.stars.roi * 100)}% ROI).`
                                    }
                            };
                            // console.log(payload)
                            queryPromises.push(collection.findOneAndUpdate(filter, notification, { upsert: true }));
                        }
                    })
                } else {
                    console.log('weeklyUserStarsResults: ', weeklyUserStarsResults)
                }
                
                console.log(queryPromises)
                let response = await Promise.all(queryPromises)
                    console.log({response})
                    //context.done(null, promiseResults)
                    callback(null, response)

                
            // })
                
        } catch (err) {
            console.log(err)
            callback(err, null)
        }

}