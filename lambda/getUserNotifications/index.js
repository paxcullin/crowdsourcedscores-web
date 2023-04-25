const AWS = require('aws-sdk');

'use strict';

const lambda = new AWS.Lambda();

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    {config} = require('config')

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;
const generateRandomString = function(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};


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

const seasonValues = {
    "pre": 0,
    "reg": 1,
    "post": 2
}

exports.handler = async (event, context, callback) => {
    console.log('processing event: %j', event);
    const { username } = event
        try {
        let getGameWeekResponse = await lambda.invoke(getGameWeekParams).promise()
        let getGameWeekData = JSON.parse(getGameWeekResponse.Payload)
            console.log({getGameWeekData});
            const { sport, season, year } = getGameWeekData
        getWeeklyResultsParams.Payload = JSON.stringify({ message: "getting weekly results for notifications", sport: getGameWeekData.sport,
            season: "post", //getGameWeekData.season,
            year: 2020, //getGameWeekData.year,
            week: 4 // getGameWeekData.week})
        })
        const client = await mongo.connect(MONGO_URL)
        const db = client.db('pcsm');
        const collection = db.collection('profileExtended');
                    
                    const profile = await collection.findOne({username})
                    let notifications = [];
                    if (profile.notifications && profile.notifications.length > 0) {
                        // only return notifications that have not been deleted
                        notifications = profile.notifications.filter(notification => !notification.deleted)
                        // sort notifications by season and gameWeek
                        notifications.sort((a,b) => {

                        	// Sort by votes
                        	// If the first item has a higher number, move it up
                        	// If the first item has a lower number, move it down
                        	if (seasonValues[a.season] > seasonValues[b.season]) return -1;
                        	if (seasonValues[a.season] < seasonValues[b.season]) return 1;
                        
                        	// If the season is the same between both items, sort by GameWeek

                        	if (a.gameWeek > b.gameWeek) { return -1 } else { return 1 };
                        	
                        })
                    }
                    console.log('notifications: ', notifications);
                    
                    const response = {
                        statusCode: 200,
                        body: notifications,
                        
                    };
                    context.done(null, response)

                
        } catch (err) {
            console.log(err)
            callback(err, null)
        }

}

// exports.handler = async (event) => {
//     const { username } = event;
    
//     let notifications = await db.scan({
//         TableName: 'notifications',
//         "FilterExpression": "username = :u",
//         "ExpressionAttributeValues": {
//             ":u": username
//         },
//     }).promise()
//     console.log(notifications)
//     notifications.notificationsUnread = 0;
//     if (notifications && notifications.Items && notifications.Items.length > 0) {
//         notifications.Items.forEach(notification => {
//             if (!notification.notificationRead) {
//                 notifications.notificationsUnread++
//             }
//         })
//     }
    
    
//     // TODO implement
//     const response = {
//         statusCode: 200,
//         body: notifications,
//     };
//     return response;
// };
