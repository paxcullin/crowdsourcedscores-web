'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    validate = require("jsonschema").validate;
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda"); // ES Modules import
const AWSConfig = { region: "us-west-2" };
const lambda = new LambdaClient({region: 'us-west-2'});

const EMAIL = process.env.email;
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns"); // ES Modules import
const sns = new SNSClient(AWSConfig);


const {config} = require('config')

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;
const requestSchema = {
    "type": "object",
    "properties": {
        "gameId": {"type": "integer"},
        "year": {"type": "integer"},
        "gameWeek": {"type":"integer"},
        "status": {"type": "string"},
        "startDateTime": {"type": "integer"},
        "sport": {"type": "string"},
        "season": {"type": "string"},
        "awayTeam": {
            "type": "object",
            "properties": {
                "score": {"type": "integer"}
            }
        },
        "homeTeam": {
            "type": "object",
            "properties": {
                "score": {"type": "integer"}
            }
        },
        "odds": {
            "type": "object"
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


async function findExistingSubscription(topicArn, nextToken, cb) {
    const params = {
        TopicArn: topicArn,
        NextToken: nextToken || null,
    };
    // SNS.listSubscriptionsByTopic(params, (err, data) => {
    //     if (err) {
    //         console.log('Error listing subscriptions.', err);
    //         return cb(err);
    //     }
    //     const subscription = data.Subscriptions.filter((sub) => sub.Protocol === 'email' && sub.Endpoint === EMAIL)[0];
    //     if (!subscription) {
    //         if (!data.NextToken) {
    //             cb(null, null); // indicate that no subscription was found
    //         } else {
    //             findExistingSubscription(topicArn, data.NextToken, cb); // iterate over next token
    //         }
    //     } else {
    //         cb(null, subscription); // a subscription was found
    //     }
    // });
    console.log("SNS Publishing")
    params = {
        Message: "Game " + gameId + " updated", 
        Subject: "Game Updated",
        TopicArn: "arn:aws:sns:us-west-2:198282214908:gameUpdated",
        MessageAttributes: { 
            gameId: {
                DataType: "Number",
                StringValue: gameId.toString()
            },
            gameWeek: {
                DataType: "Number",
                StringValue: mongoGameWeek.toString()
            },
            year: {
                DataType: "Number",
                StringValue: year.toString()
            },
            sport: {
                DataType: "String",
                StringValue: sport
            },
            season: {
                DataType: "String",
                StringValue: season
            }
        }
    }
    console.log("SNS Publishing")
    const SNSPublishCommand = new PublishCommand(params, function(err, response) {
        if (err) {
            context.done("SNS error: " + err, null);
        }
        console.log("SNS Publish complete: ", response);
        });

    const SNSResponse = await sns.send(SNSPublishCommand)
    console.log('SNSResponse :>> ', SNSResponse);
    context.done(null, {"message": "Received update: " + game})
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

    var result = {
        message: '',
        succeeded: true
    };

    var game = event;
    var validateRequest = validate(game, requestSchema);
    if (validateRequest.errors && validateRequest.errors.length > 0) {
        result.message = 'Invalid request error(s)';
        result.errors = [];
        result.succeeded = false;
        for (var i = 0; i < validateRequest.errors.length; i++) {
            result.errors.push(validateRequest.errors[i]);
        }
        return context.fail(JSON.stringify(result));
    }
    console.log("game: ", game)
    var diff = 0;
    if (game.results) {
        diff = game.results.awayTeam.score - game.results.homeTeam.score;
        // game.spread = diff < 0 ? -1 * (diff) : diff;
        console.log("game.results: ", game.results)
        game.results.spread = game.results.awayTeam.score - game.results.homeTeam.score;
        game.results.total = game.results.awayTeam.score + game.results.homeTeam.score;
    }
    try {
        const client = await mongo.connect(MONGO_URL);
        
        const db = client.db('pcsm');

        // first make sure the prediction is not too late
        // deadline is 1hr prior to kickoff
        const msHour = 3600000;
        
        var now = new Date();
        console.log('now: ', now);
        var kickoff = new Date(game.startDateTime);
        var cutoff = kickoff - msHour;
        var startDateTime = new Date(game.startDateTime)
        if (!game.gameId) {
            

        } else {
            var gameUpdate = {};
            if (game.status === "notStarted") {
                gameUpdate = {
                    $set: {
                        startDateTime: startDateTime,
                        status: game.status,
                        "odds.spread": game.odds.spread,
                        "odds.total": game.odds.total
                    }
                }
            } else if (game.results && game.results.awayTeam.score !== -1) {
                gameUpdate = {
                    $set : {
                        startDateTime: startDateTime,
                        status: game.status,
                        results: {
                            awayTeam: {
                                score: game.results.awayTeam.score
                            },
                            homeTeam: {
                                score: game.results.homeTeam.score
                            },
                            total: game.results.total,
                            spread: game.results.spread
                        }
                    }
                }
            } else {
                console.log("No update");
            }
            console.log("gameUpdate: ", gameUpdate)
            var dbName = 'games';
            if (game.sport === 'ncaaf') dbName = 'games-ncaaf';
            if (game.sport === 'ncaam') dbName = 'games-ncaam';
            //"gameId": parseInt(game.gameId), "year": parseInt(game.year), "gameWeek": parseInt(game.gameWeek)
            if (Object.keys(gameUpdate).length > 0) {
                const gameObj = await db.collection(dbName).updateOne({"gameId": parseInt(game.gameId), "year": parseInt(game.year)}, gameUpdate);
            }
            if (game.status === "final") {
                //console.log("gameObj: ", gameObj)
                
                var params = {
                    Message: "Game " + game.gameId + " updated by " + event.userId,
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
                        },
                        season: {
                            DataType: "String",
                            StringValue: game.season
                        }
                        
                    },
                    Subject: "Game Update",
                    TopicArn: "arn:aws:sns:us-west-2:198282214908:gameUpdated"
                };
                console.log("SNS Publishing")
                // sns.publish(params, function(err, response) {
                // if (err) {
                //     context.done("SNS error: " + err, null);
                // }
                // console.log("SNS Publish complete: ", response);
                // context.done (null, result)
                // })
                console.log('params :>> ', params);
                const SNSPublishCommand = new PublishCommand(params, function(err, response) {
                    if (err) {
                        context.done("SNS error: " + err, null);
                    }
                    console.log("SNS Publish complete: ", response);
                    });

                const SNSResponse = await sns.send(SNSPublishCommand)
                console.log('SNSResponse :>> ', SNSResponse);
                context.done(null, {"message": "Received update: " + game})
            } else {
                var oddsHistoryUpdate = { 
                    $push: {
                        "odds.history": {
                            spread: game.odds.spread,
                            total: game.odds.total,
                            date: Date.now()
                        }
                    }
                }
                try {
                    console.log('oddsHistoryUpdate: ', oddsHistoryUpdate);
                    const updateOddsHistoryResponse = await db.collection('games').update({"gameId": parseInt(game.gameId), "year": parseInt(game.year), "gameWeek": parseInt(game.gameWeek)}, oddsHistoryUpdate)
                        console.log('update odds response: ', updateOddsHistoryResponse.result);
                        context.done(null, {"message": "Received update: " + game})
                } catch(updateOddsHistoryReject) {
                    console.log('updateOddsHistoryReject: ', updateOddsHistoryReject); 
                    context.done(null, updateOddsHistoryReject) 
                }
            }
        }
    } catch (err) {
        console.log('Error: ', err);
        context.done(err, null);
    }
};
