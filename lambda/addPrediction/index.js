'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    validate = require("jsonschema").validate;
const AWS = require('aws-sdk');    
const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });

const {config} = require("./config");

const EMAIL = process.env.email;
const SNS = new AWS.SNS({ apiVersion: '2010-03-31' });

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;
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
                "score": {"type": "integer", "minimum": 0, "maximum": 99}
            },
            "required": ["code", "fullName", "shortName", "score"]
        },
        "homeTeam": {
            "type": "object",
            "properties": {
                "code": {"type": "string"},
                "fullName": {"type": "string"},
                "shortName": {"type": "string"},
                "score": {"type": "integer", "minimum": 0, "maximum": 99}
            },
            "required": ["code", "fullName", "shortName", "score"]
        }
    },
    "required": ["gameId", "awayTeam", "homeTeam"]
};
const requestSchemaNCAAM = {
    "type": "object",
    "properties": {
        "gameId": {"type": "integer"},
        "year": {"type": "integer"},
        "awayTeam": {
            "type": "object",
            "properties": {
                "code": {"type": "string"},
                "fullName": {"type": "string"},
                "shortName": {"type": "string"},
                "score": {"type": "integer", "minimum": 0, "maximum": 150}
            },
            "required": ["code", "fullName", "shortName", "score"]
        },
        "homeTeam": {
            "type": "object",
            "properties": {
                "code": {"type": "string"},
                "fullName": {"type": "string"},
                "shortName": {"type": "string"},
                "score": {"type": "integer", "minimum": 0, "maximum": 150}
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
    
    if (!prediction.userId || prediction.userId === "") {
        context.done(null, { succeeded: false})
    }
    var validateRequest;
    (event.sport !== 'ncaam') ? validateRequest = validate(prediction, requestSchema) : validateRequest = validate(prediction, requestSchemaNCAAM)
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
    prediction.submitted = new Date();

    mongo.connect(MONGO_URL, function (err, client) {
        assert.equal(null, err);

        if (err) {
            return context.done(err, null);
        }
        const db = client.db('pcsm');

        // first make sure the prediction is not too late
        // deadline is 5 min prior to kickoff
        const msHour = 300000;
        
        const { gameId, year, sport, gameWeek, season } = prediction
        
        var gamesCollection = 'games';
        var gamesQuery = {"gameId": parseInt(gameId), "year": parseInt(year), "gameWeek": parseInt(gameWeek)};
        if (sport === 'ncaaf') {
            gamesCollection = 'games-ncaaf';
        } else if (sport === 'ncaam') {
            gamesCollection = 'games-ncaam';
            gamesQuery = {"gameId": parseInt(gameId), "year": parseInt(year)};
        }
        console.log('gamesQuery: ', gamesQuery)
        db.collection(gamesCollection).findOne(gamesQuery, {_id: false}, function (err, game) {
            
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
            
            //get user groups in order to add groups to predictions for scoring
            
            db.collection('profileExtended').find({username: prediction.userId},{_id:false, groups: 1}).toArray(function(err, groups) {
                console.log("user groups: ", groups)
                if (err) {
                    return false;
                }
                if (groups[0]) {
                    prediction.groups = groups[0].groups;
                    if (prediction.groups && prediction.groups.length > 0) {
                        prediction.groups = prediction.groups.filter(group => group.year === year && group.sport === sport)
                        console.log("prediction.groups: ", prediction.groups)
                    }
                }
            
                // update existing if prediction exists for userId and gameId combo
                // else treat as new prediction and add to collection
                
                var predictionCollection = 'predictions';
                if (prediction.sport === 'ncaaf') {
                    predictionCollection = 'predictions-ncaaf';
                } else if (prediction.sport === 'ncaam') {
                    predictionCollection = 'predictions-ncaam';
                }
                db.collection(predictionCollection).update(existingObjQuery, prediction, {upsert: true}, function (err, dbRes) {
                    var respObj = JSON.parse(dbRes);
    
                    assert.equal(err, null);
                    assert.equal(respObj.ok, 1);
    
                    if (err) {
                        result.message = err;
                        result.succeeded = false;
                        return context.fail(JSON.stringify(result));
                    }
                    
                    
                    
                    result.game = game;
                    if (game.weather) {
                        result.game.weather.temp = Math.round((game.weather.temp * 1.8) - 459.67);
                    }
                    result.prediction = prediction;
                    if (respObj.upserted) {
                        result.updated = false;
                    } else {
                        result.updated = true;
                    }
                    result.succeeded = true;
                    result.message = 'Prediction saved';
                    console.log('result: ', result);
                    console.log('prediction: ', prediction);
    
                    var lambdaParams = {
                        FunctionName: 'addPredictionsToGroups', // the lambda function we are going to invoke
                        InvocationType: 'RequestResponse',
                        LogType: 'Tail',
                        Payload: '{ "username": "' + event.userId + '", "prediction": ' + JSON.stringify(prediction) + '}'
                      };
                    
                      lambda.invoke(lambdaParams, function(err, data) {
                          console.log('err', err);
                          console.log('data', data);
                        if (err) {
                          context.fail('addToGroupError', err);
                        } else {
                          context.succeed('Lambda_B said '+ data.Payload);
                        }
                      })
                    var predictionsQuery = {userId: prediction.userId, year: prediction.year, gameWeek: prediction.gameWeek, season: season}
                    if (prediction.sport === 'ncaam') {
                        predictionsQuery = {userId: prediction.userId, year: prediction.year}
                    }
                    db.collection(predictionCollection).find(predictionsQuery, {_id:false}).toArray(function(err, predictions) {
                        if (err) {
                            return context.done(null, result);
                        }
                        
                        result.predictionsSubmitted = predictions.length;
                        let starsSubmitted = 0;
                        predictions.forEach((prediction, index) => {
                            if (prediction.stars && ((prediction.stars.spread > 0) || (prediction.stars.total > 0))) {
                                starsSubmitted++;
                                console.log(`prediction.stars: ${JSON.stringify(prediction.stars)}, ${starsSubmitted}`)
                            }
                        })
                        result.predictionsSubmittedStars = starsSubmitted;
                        if (prediction.collegeBowlPremium !== '1' && prediction.sport === 'ncaaf') {
                            result.crowd = null;
                        }
                        
                        
                        // kick off new aggregation calculation
                        
                        var sns = new AWS.SNS();
                        var params = {
                            Message: "Prediction for game " + prediction.gameId + " submitted by " + event.userId, 
                            Subject: "Prediction Submitted",
                            TopicArn: "arn:aws:sns:us-west-2:198282214908:predictionSubmitted",
                            MessageAttributes: { 
                                gameId: {
                                    DataType: "Number",
                                    StringValue: game.gameId.toString()
                                },
                                gameWeek: {
                                    DataType: "Number",
                                    StringValue: game.gameWeek.toString()
                                },
                                year: {
                                    DataType: "Number",
                                    StringValue: game.year.toString()
                                },
                                sport: {
                                    DataType: "String",
                                    StringValue: game.sport
                                }
                            },
                        };
                        console.log("SNS Publishing")
                        sns.publish(params, function(err, response) {
                            if (err) {
                                context.done("SNS error: " + err, null);
                            }
                            console.log("SNS Publish complete: ", response);
                            context.done (null, result)
                            });
                          
                        
                    })
                    
                });
            });
        });
    });
};
