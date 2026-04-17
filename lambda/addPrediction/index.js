'use strict';
const { Validator } = require('jsonschema');

const v = new Validator();

const {config} = require("./config");

const EMAIL = process.env.email;
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda"); // ES Modules import
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns"); // ES Modules import
const { request } = require("http");
const AWSConfig = { region: "us-west-2" };
var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    validate = require("jsonschema").validate;
// const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda"); // CommonJS import
const lambda = new LambdaClient(AWSConfig);


// const { SNSClient, SubscribeCommand } = require("@aws-sdk/client-sns"); // CommonJS import
const SNS = new SNSClient(AWSConfig);


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
        "prediction": {
            "type": "object",
            "properties": {
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
                },
                "odds": {
                    "type": "object",
                    "properties": {
                        "spread": {"type": "number"},
                        "total": {"type": "number"}
                    },
                    "required": ["spread", "total"]
                },
                "required": ["awayTeam", "homeTeam", "odds"]
            }
        }
    },
    "required": ["gameId", "prediction"]
};

function normalizeGameDate(value) {
    if (!value && value !== 0) {
        return null;
    }
    const raw = String(value).trim();
    if (!raw) {
        return null;
    }
    if (/^\d{8}$/.test(raw)) {
        return raw;
    }
    const digits = raw.replace(/-/g, '');
    if (/^\d{8}$/.test(digits)) {
        return digits;
    }
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) {
        return null;
    }
    const yyyy = parsed.getUTCFullYear();
    const mm = String(parsed.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(parsed.getUTCDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
}

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

exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    try {
    var result = {
        message: '',
        succeeded: true
    };

    const {prediction, userId, sport, year, gameId, gameWeek, season} = event;
    
    if (!userId || userId === "") {
        return { message: 'no userId', succeeded: false}
    }
    var validateRequest;
    (event.sport !== 'ncaam' && event.sport !== 'ncaab' && event.sport !== 'nba') ? validateRequest = validate(event, requestSchema) : validateRequest =  validate(event, requestSchemaNCAAM) // validate(prediction, requestSchemaNCAAM)
    console.log('validateRequest :>> ', validateRequest);
    console.log('event.sport :>> ', event.sport);
    if (validateRequest.errors && validateRequest.errors.length > 0) {
        result.message = 'Invalid request error(s)';
        result.errors = [];
        result.succeeded = false;
        for (var i = 0; i < validateRequest.errors.length; i++) {
            result.errors.push(validateRequest.errors[i]);
        }
        return { message: 'Invalid request error(s)', sport: event.sport, errors: result.errors, succeeded: false };
    }

    var diff = prediction.awayTeam.score - prediction.homeTeam.score;
    // prediction.spread = diff < 0 ? -1 * (diff) : diff;
    prediction.spread = prediction.awayTeam.score - prediction.homeTeam.score;
    prediction.total = prediction.awayTeam.score + prediction.homeTeam.score;
    prediction.submitted = new Date();
    if (event.isAnonymous === true) {
        prediction.isAnonymous = event.isAnonymous;
    }

    const client = await mongo.connect(MONGO_URL);
        // assert.equal(null, err);

    const db = client.db('pcsm');

        // first make sure the prediction is not too late
        // deadline is 5 min prior to kickoff
        const msHour = 300000;
        
        
        var gamesCollection = 'games';
        var gamesQuery = {"gameId": parseInt(gameId), "year": parseInt(year), "gameWeek": parseInt(gameWeek)};
        if (sport === 'ncaaf') {
            gamesCollection = 'games-ncaaf';
        } else if (sport === 'ncaam') {
            gamesCollection = 'games-ncaam';
            gamesQuery = {"gameId": parseInt(gameId), "year": parseInt(year)};
        } else if (sport === 'ncaab') {
            gamesCollection = 'games-ncaab';
            gamesQuery = {"gameId": parseInt(gameId), "year": parseInt(year)};
        } else if (sport === 'nba') {
            gamesCollection = 'games-nba';
            gamesQuery = {"gameId": parseInt(gameId), "year": parseInt(year)};
        }
        console.log('gamesQuery: ', gamesQuery)
        const game = await db.collection(gamesCollection).findOne(gamesQuery, {_id: false});
            
        // assert.equal(game, null);
        if (!game) {
            return { message: 'Game not found', succeeded: false };
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
                return { message: result.message, succeeded: result.succeeded };
            }

            const gameDate = normalizeGameDate(event.gameDate || game.startDateTime);
            if (gameDate) {
                prediction.gameDate = gameDate;
            }
            if (Number.isInteger(parseInt(gameWeek, 10))) {
                prediction.gameWeek = parseInt(gameWeek, 10);
            }
            prediction.userId = userId;
            prediction.gameId = parseInt(gameId);
            prediction.year = parseInt(year);
            prediction.sport = sport;
            prediction.season = season || game.season;

            var existingObjQuery = {userId: userId, gameId: parseInt(gameId), year: parseInt(year), sport: sport};
            if (sport === 'nba' && gameDate) {
                existingObjQuery.gameDate = gameDate;
            } else if (Number.isInteger(parseInt(gameWeek, 10))) {
                existingObjQuery.gameWeek = parseInt(gameWeek, 10);
            }
            
            //get user groups in order to add groups to predictions for scoring
            
            // db.collection('profileExtended').find({username: userId},{_id:false, groups: 1}).toArray(function(err, groups) {
            const groups = await db.collection('profileExtended').find({username: userId},{_id:false, groups: 1}).toArray();
                console.log("user groups: ", groups)
                // if (err) {
                //     return false;
                // }
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
                if (event.sport === 'ncaaf') {
                    predictionCollection = 'predictions-ncaaf';
                } else if (event.sport === 'ncaam' || event.sport === 'ncaab') {
                    predictionCollection = 'predictions-ncaam';
                } else if (event.sport === 'nba') {
                    predictionCollection = 'predictions-nba';
                }
                const respObj = await db.collection(predictionCollection).updateOne(existingObjQuery, {$set: prediction}, {upsert: true});
                // var respObj = JSON.parse(dbRes);
    
                    // assert.equal(err, null);
                    // assert.equal(respObj.ok, 1);
    
                    // if (err) {
                    //     result.message = err;
                    //     result.succeeded = false;
                    //     return { message: result.message, succeeded: result.succeeded };
                    // }
                    
                    
                    
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
    
                    // var lambdaParams = {
                    //     FunctionName: 'addPredictionsToGroups', // the lambda function we are going to invoke
                    //     InvocationType: 'RequestResponse',
                    //     LogType: 'Tail',
                    //     Payload: '{ "username": "' + userId + '", "prediction": ' + JSON.stringify(prediction) + '}'
                    //   };
                    
                    //   lambda.invoke(lambdaParams, function(err, data) {
                    //       console.log('err', err);
                    //       console.log('data', data);
                    //     if (err) {
                    //       context.fail('addToGroupError', err);
                    //     } else {
                    //       context.succeed('Lambda_B said '+ data.Payload);
                    //     }
                    //   })

                    var lambdaParams = {
                        FunctionName: 'addPredictionsToGroups', // the lambda function we are going to invoke
                        InvocationType: 'RequestResponse',
                        LogType: 'Tail',
                        Payload: '{ "username": "' + userId + '", "prediction": ' + JSON.stringify(prediction) + '}'
                    };
                    
                    const command = new InvokeCommand(lambdaParams, function(err, data) {
                        console.log('err', err);
                        console.log('data', data);
                        if (err) {
                            return { message: 'addToGroupError', error: err, succeeded: false };
                        } else {
                            return { message: 'addToGroupSuccess', data: data.Payload, succeeded: true };
                        }
                    })
                    const lambdaresponse = await lambda.send(command)
                    console.log('lambdaresponse :>> ', lambdaresponse);

                    var predictionsQuery = {userId: userId, year: year, gameWeek: gameWeek, season: season}
                    if (sport === 'ncaam' || sport === 'ncaab') {
                        predictionsQuery = {userId: userId, year: year}
                    } else if (sport === 'nba') {
                        predictionsQuery = {userId: userId, year: year, season: season || game.season}
                        if (gameDate) {
                            predictionsQuery.gameDate = gameDate;
                        }
                    }
                    const predictions = await db.collection(predictionCollection).find(predictionsQuery, {_id:false}).toArray();
                    result.predictionsSubmitted = predictions.length;
                        let starsSubmitted = 0;
                        predictions.forEach((prediction, index) => {
                            if (prediction.stars && ((prediction.stars.spread > 0) || (prediction.stars.total > 0))) {
                                starsSubmitted++;
                                console.log(`prediction.stars: ${JSON.stringify(prediction.stars)}, ${starsSubmitted}`)
                            }
                        })
                        result.predictionsSubmittedStars = starsSubmitted;
                        if (event.collegeBowlPremium !== '1' && event.sport === 'ncaaf') {
                            result.crowd = null;
                        }
                        
                        
                        // kick off new aggregation calculation
                        
                        // var sns = new AWS.SNS();
                        // var params = {
                        //     Message: "Prediction for game " + prediction.gameId + " submitted by " + userId, 
                        //     Subject: "Prediction Submitted",
                        //     TopicArn: "arn:aws:sns:us-west-2:198282214908:predictionSubmitted",
                        //     MessageAttributes: { 
                        //         gameId: {
                        //             DataType: "Number",
                        //             StringValue: game.gameId.toString()
                        //         },
                        //         gameWeek: {
                        //             DataType: "Number",
                        //             StringValue: game.gameWeek.toString()
                        //         },
                        //         year: {
                        //             DataType: "Number",
                        //             StringValue: game.year.toString()
                        //         },
                        //         sport: {
                        //             DataType: "String",
                        //             StringValue: game.sport
                        //         }
                        //     },
                        // };
                        // console.log("SNS Publishing")
                        // sns.publish(params, function(err, response) {
                        //     if (err) {
                        //         context.done("SNS error: " + err, null);
                        //     }
                        //     console.log("SNS Publish complete: ", response);
                        //     context.done (null, result)
                        // });
                    
                            
                        const messageAttributes = {
                            gameId: {
                                DataType: "Number",
                                StringValue: game.gameId.toString()
                            },
                            year: {
                                DataType: "Number",
                                StringValue: game.year.toString()
                            },
                            sport: {
                                DataType: "String",
                                StringValue: game.sport
                            },
                            season: {
                                DataType: "String",
                                StringValue: game.season
                            }
                        };
                        if (Number.isFinite(game.gameWeek)) {
                            messageAttributes.gameWeek = {
                                DataType: "Number",
                                StringValue: game.gameWeek.toString()
                            };
                        }
                        if (gameDate) {
                            messageAttributes.gameDate = {
                                DataType: "String",
                                StringValue: gameDate
                            };
                        }

                        var params = {
                            Message: "Prediction for game " + gameId + " submitted by " + userId, 
                            Subject: "Prediction Submitted",
                            TopicArn: "arn:aws:sns:us-west-2:198282214908:predictionSubmitted",
                            MessageAttributes: messageAttributes,
                        };
                        console.log("SNS Publishing")
                        const SNSPublishCommand = new PublishCommand(params, function(err, response) {
                            if (err) {
                                return { message: "SNS error: " + err, succeeded: false };
                            }
                                console.log("SNS Publish complete: ", response);
                                return { result, message: "SNS Publish complete", succeeded: true };
                            });

                        const SNSResponse = await SNS.send(SNSPublishCommand)
                          
                        return {
                            result
                        };
                    } catch (err) {
                        console.log('Error processing prediction submission.', err);
                        throw Error(err);
                    }
                    
};
