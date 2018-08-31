'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    validate = require("jsonschema").validate;
const AWS = require('aws-sdk');    
const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });

const EMAIL = process.env.email;
const SNS = new AWS.SNS({ apiVersion: '2010-03-31' });

const MONGO_URL = 'mongodb://pcsm-user:*dZ2HaWN@ds011775.mlab.com:11775/pcsm';
const requestSchema = {
    "type": "object",
    "properties": {
        "gameId": {"type": "integer"},
        "year": {"type": "integer"},
        "gameWeek": {"type":"integer"},
        "awayTeam": {
            "type": "object",
            "properties": {
                "code": {"type": "string"},
                "fullName": {"type": "string"},
                "shortName": {"type": "string"},
                "score": {"type": "integer", "minimum": 0, "maximum": 50}
            },
            "required": ["code", "fullName", "shortName", "score"]
        },
        "homeTeam": {
            "type": "object",
            "properties": {
                "code": {"type": "string"},
                "fullName": {"type": "string"},
                "shortName": {"type": "string"},
                "score": {"type": "integer", "minimum": 0, "maximum": 50}
            },
            "required": ["code", "fullName", "shortName", "score"]
        }
    },
    "required": ["gameId", "awayTeam", "homeTeam"]
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
    console.log('Received event:', JSON.stringify(event, null, 2));

    var result = {
        message: '',
        succeeded: true
    };

    var prediction = event;
    var validateRequest = validate(prediction, requestSchema);
    if (validateRequest.errors && validateRequest.errors.length > 0) {
        result.message = 'Invalid request error(s)';
        result.errors = [];
        result.succeeded = false;
        for (var i = 0; i < validateRequest.errors.length; i++) {
            result.errors.push(validateRequest.errors[i]);
        }
        return context.fail(JSON.stringify(result));
    }

    var diff = prediction.awayTeam.score - prediction.homeTeam.score;
    // prediction.spread = diff < 0 ? -1 * (diff) : diff;
    prediction.spread = prediction.awayTeam.score - prediction.homeTeam.score;
    prediction.total = prediction.awayTeam.score + prediction.homeTeam.score;
    prediction.submitted = new Date().toISOString();
    prediction.year = 2018;

    mongo.connect(MONGO_URL, function (err, db) {
        assert.equal(null, err);

        if (err) {
            return context.done(err, null);
        }

        // first make sure the prediction is not too late
        // deadline is 1hr prior to kickoff
        const msHour = 3600000;
        

        db.collection('games').findOne({"gameId": parseInt(prediction.gameId), "year": parseInt(prediction.year), "gameWeek": parseInt(prediction.gameWeek)}, {_id: false}, function (err, game) {
            assert.equal(err, null);
            if (err) {
                context.fail(err, null);
            }
            
            var now = new Date();
            var kickoff = Date.parse(game.startDateTime);
            var cutoff = kickoff - msHour;

            // console.log("now: " + now);
            // console.log("kickoff: " + new Date(game.startDateTime));
            // console.log("cutoff: " + new Date(cutoff));

            if (now > cutoff) {
                result.message = "The cutoff for predicting this game has passed.";
                result.succeeded = false;
                return context.done(JSON.stringify(result));
            }

            var existingObjQuery = {userId: prediction.userId, gameId: parseInt(prediction.gameId), year: parseInt(prediction.year)};
            
            //get user groups
            
            db.collection('profileExtended').find({username: prediction.userId},{_id:false, groups: 1}).toArray(function(err, groups) {
                console.log("user groups: ", groups)
                if (err) {
                    return false;
                }
                if (groups[0]) {
                    prediction.groups = groups[0].groups;
                    console.log("prediction.groups: ", prediction.groups)
                }
            
                // update existing if prediction exists for userId and gameId combo
                // else treat as new prediction and add to collection
                db.collection('predictions').update(existingObjQuery, prediction, {upsert: true}, function (err, dbRes) {
                    var respObj = JSON.parse(dbRes);
    
                    assert.equal(err, null);
                    assert.equal(respObj.ok, 1);
    
                    if (err) {
                        result.message = err;
                        result.succeeded = false;
                        return context.fail(JSON.stringify(result));
                    }
    
                    result.data = prediction;
                    if (respObj.upserted) {
                        result.updated = false;
                    } else {
                        result.updated = true;
                    }
                    result.message = 'Prediction saved';
    
                    // var lambdaParams = {
                    //     FunctionName: 'addPredictionsToGroups', // the lambda function we are going to invoke
                    //     InvocationType: 'RequestResponse',
                    //     LogType: 'Tail',
                    //     Payload: '{ "username": "' + event.userId + '", ' + prediction + '}'
                    //   };
                    
                    //   lambda.invoke(lambdaParams, function(err, data) {
                    //     if (err) {
                    //       context.fail(err);
                    //     } else {
                    //       context.succeed('Lambda_B said '+ data.Payload);
                    //     }
                    //   })
                    db.collection('predictions').find({userId: prediction.userId, year: prediction.year, gameWeek: prediction.gameWeek}, {_id:false}).toArray(function(err, predictions) {
                        if (err) {
                            return context.done(null, result);
                        }
                        
                        result.predictionsSubmitted = predictions.length;
                        
                        
                        // create/get topic
                        
                        var sns = new AWS.SNS();
                        var params = {
                            Message: "Prediction submitted by " + event.userId, 
                            Subject: "Prediction Submitted",
                            TopicArn: "arn:aws:sns:us-west-2:198282214908:predictionSubmitted"
                        };
                        console.log("SNS Publishing")
                        sns.publish(params, function(err, response) {
                            if (err) {
                                context.done("SNS error: " + err, null);
                            }
                            console.log("SNS Publish complete: ", response);
                            context.done (null, result)
                            });
                          
                        console.log("calling joinGroup")
                            var lambdaParams = {
                                FunctionName: 'group-joinGroup', // the lambda function we are going to invoke
                                InvocationType: 'Event',
                                LogType: 'None',
                                Payload: '{ "username": "' + event.userId + '", "preferred_username": "' + event.preferred_username + '", "userFullName": "' + event.firstName + ' ' + event.lastName + '", "sport": "nfl", "year": "' + prediction.year + '", "groupId": 0}'
                              };
                            
                              lambda.invoke(lambdaParams, function(err, data) {
                                if (err) {
                                  console.log("group-joinGroup call err: ", err);
                                } else {
                                  console.log("group-joinGroup call data: ", data);
                                }
                              })
                        //return context.done(null, result);
                        
                    })
                    
                });
            });
        });
    });
};
