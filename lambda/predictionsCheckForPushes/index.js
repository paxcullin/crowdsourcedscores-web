'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    validate = require("jsonschema").validate;
const AWS = require('aws-sdk');    
const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });

const EMAIL = process.env.email;
const SNS = new AWS.SNS({ apiVersion: '2010-03-31' });

const MONGO_URL = 'mongodb://${username}:${password}@ds011775.mlab.com:11775';
const requestSchema = {
    "type": "object",
    "properties": {
        "gameId": {"type": "integer"},
        "year": {"type": "integer"},
        "gameWeek": {"type":"integer"},
        "status": {"type": "string"},
        "startDateTime": {"type": "integer"},
        "sport": {"type": "string"},
        "awayTeam": {
            "type": "object",
            "properties": {
                "score": {"type": "integer", "minimum": 0, "maximum": 50}
            }
        },
        "homeTeam": {
            "type": "object",
            "properties": {
                "score": {"type": "integer", "minimum": 0, "maximum": 50}
            }
        },
        "odds": {
            "type": "object",
            "properties": {
                "spread": {"type": "number"},
                "total": {"type": "number"}
            }
        }
    }
};

// console.log('Loading function');

/* Sample prediction request
 {
 "year": "2017",
 "gameId": "1",
 "gameWeek": "1",
 "awayTeam": {
 "code": "CAR",
 "fullName": "Carolina Panthers",
 "shortName": "Carolina",
 "score": 20
 },
 "homeTeam": {
 "code": "DEN",
 "fullName": "Denver Broncos",
 "shortName": "Denver",
 "score": 17
 }
 }
 */


function findExistingSubscription(topicArn, nextToken, cb) {
    const params = {
        TopicArn: topicArn,
        NextToken: nextToken || null,
    };
    SNS.listSubscriptionsByTopic(params, (err, data) => {
        if (err) {
            console.log('Error listing subscriptions.', err);
            return cb(err);
        }
        const subscription = data.Subscriptions.filter((sub) => sub.Protocol === 'email' && sub.Endpoint === EMAIL)[0];
        if (!subscription) {
            if (!data.NextToken) {
                cb(null, null); // indicate that no subscription was found
            } else {
                findExistingSubscription(topicArn, data.NextToken, cb); // iterate over next token
            }
        } else {
            cb(null, subscription); // a subscription was found
        }
    });
}

/**
 * Subscribe the specified EMAIL to a topic.
 */
function createSubscription(topicArn, cb) {
    // check to see if a subscription already exists
    findExistingSubscription(topicArn, null, (err, res) => {
        if (err) {
            console.log('Error finding existing subscription.', err);
            return cb(err);
        }
        if (!res) {
            // no subscription, create one
            const params = {
                Protocol: 'email',
                TopicArn: topicArn,
                Endpoint: EMAIL,
            };
            SNS.subscribe(params, (subscribeErr) => {
                if (subscribeErr) {
                    console.log('Error setting up email subscription.', subscribeErr);
                    return cb(subscribeErr);
                }
                // subscription complete
                console.log(`Subscribed ${EMAIL} to ${topicArn}.`);
                cb(null, topicArn);
            });
        } else {
            // subscription already exists, continue
            cb(null, topicArn);
        }
    });
}
 
/**
 * Create a topic.
 */
function createTopic(topicName, cb) {
    SNS.createTopic({ Name: topicName }, (err, data) => {
        if (err) {
            console.log('Creating topic failed.', err);
            return cb(err);
        }
        const topicArn = "arn:aws:sns:us-west-2:198282214908:predictionSubmitted";
        console.log(`Created topic: ${topicArn}`);
        console.log('Creating subscriptions.');
        createSubscription(topicArn, (subscribeErr) => {
            if (subscribeErr) {
                return cb(subscribeErr);
            }
            // everything is good
            console.log('Topic setup complete.');
            cb(null, topicArn);
        });
    });
}

exports.handler = (event, context) => {
    var gamesQuery = {};
    
    // There are two options here
    // If the game odds are updated in the adminUpdate Lambda, it fires an event to this
    // The parameters sent are the game ID information, and the query includes only the game ID
    // Otherwise the query is to check the current Game Week

    
    if (event.gameId) {
        gamesQuery = {
            gameId: event.gameId,
            year: event.year,
            results: {
                $exists: false
            }
        }
    } else {
        // call getGameWeek Lambda
        gamesQuery = {
            gameWeek: event.gameWeek,
            year: event.year,
            results: {
                $exists: false
            }
        }
    }

    
    console.log('Received event:', JSON.stringify(event, null, 2));

    var result = {
        message: '',
        succeeded: true
    };

    
    mongo.connect(MONGO_URL, function (err, myDB) {
        
        assert.equal(null, err);
        if (err || !myDB) {
            console.log('connect err: ', err);
            
            return context.done(err, null);
        }
        const db = myDB.db('pcsm')
        
        
        var userNotificationArray = [];
        db.collection('games').find(gamesQuery)
        .toArray(function (err, games) {
            assert.equal(null, err);
            if (err) {
                context.done(err, null);
            }
            console.log('games result: ', games);

            games.forEach(game => {
                if (game.odds) {
                    var totalPredictionsQuery = query;
                    totalPredictionsQuery = {
                        totalPredictionsQuery,
                        total: game.odds.total
                    }
                    var spreadPredictionsQuery = query;
                    spreadPredictionsQuery = {
                        spreadPredictionsQuery,
                        spread: game.odds.spread
                    }
                    console.log("spreadPredictionsQuery: ", spreadPredictionsQuery);
                    console.log('totalPredictionsQuery: ', totalPredictionsQuery);
                    db.collection('predictions').find({ $or: [ totalPredictionsQuery, spreadPredictionsQuery]})
                    .toArray(function(err, predictions) {
                        console.log('predictions: ', predictions)
                        if (predictions.length > 0) {
                            console.log('predictions result: ', predictions);
                            predictions.forEach(prediction => {
                                if (prediction.spread === game.odds.spread || prediction.total === game.odds.total) {
                                    userNotificationObject = {
                                        userId: prediction.userId,
                                        game: game,
                                        prediction: prediction
                                    }
                                    userNotificationArray.push(userNotificationObject);
                                }
                            }); // end predictions.forEach
                        } // end predictions.length
                    }) // end predictions db call
                } // end if game.odds statement
                if (game.hasNext === false) {
                    if (userNotificationArray.length > 0) {
                        var lambdaParams = {
                            FunctionName: 'predictionsPushNotifications', // the lambda function we are going to invoke
                            InvocationType: 'RequestResponse',
                            LogType: 'Tail',
                            Payload: `{ "userNotificationArray" : ${userNotificationArray} }`
                        };
                        
                        lambda.invoke(lambdaParams, function(err, data) {
                            if (err) {
                            context.fail(err);
                            } else {
                            context.succeed('Lambda_B said '+ data.Payload);
                            }
                        })
                    } else {
                        console.log('No pushes identified');
                        context.done(null, null);
                    }
                }
            }); //end game forEach
        }); // ends games DB call 

    });
};
