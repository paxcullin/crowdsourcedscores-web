'use strict';
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda"); // ES Modules import
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns"); // ES Modules import
const AWSConfig = { region: "us-west-2" };
var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    validate = require("jsonschema").validate;
// const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda"); // CommonJS import
const lambda = new LambdaClient(AWSConfig);


const {config} = require("./config");

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

/* 
The function creates a session with Mongo in order to ensure that the prediction is submitted
and the currency is deducted 
it checks the user's current virtual currency balance to ensure there is enough to cover
It then returnns the total currency wagered for the given week for the user's 
stake slip
*/

exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    try {
        var result = {
            message: '',
            succeeded: true
        };

        var {prediction, wager, userId } = event;
        
        if (!userId || userId === "") {
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

        prediction.spread = prediction.awayTeam.score - prediction.homeTeam.score;
        prediction.total = prediction.awayTeam.score + prediction.homeTeam.score;
        prediction.submitted = new Date();

        const client = await mongo.connect(MONGO_URL);

            const db = client.db('pcsm');
            const session = client.startSession();

            const transactionOptions = {
                readConcern: { level: 'snapshot' },
                writeConcern: { w: 'majority' },
                readPreference: 'primary'
            };
            try {
                const transactionResults = await session.withTransaction(async () => { 
                
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

                // check for game start time to ensure the prediction is 5 minutes before kickoff
                const game = await db.collection(gamesCollection).findOne(gamesQuery, { session })
                console.log('game', game)
                    if (!game) {
                        throw new Error('Something went wrong. Please try again.')
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
                        return context.done(null, {status: 200, message: JSON.stringify(result)});
                    }
                // end kickoff time check
                
                var existingObjQuery = {userId: userId, gameId: parseInt(prediction.gameId), year: parseInt(prediction.year), sport: sport, season: season};
                    
                    //get user groups in order to add groups to predictions for scoring
                    
                    const userProfile = await db.collection('profileExtended').findOne({username: userId},{_id:false, groups: 1, session});
                        if (userProfile) {
                            prediction.groups = userProfile.groups;
                            if (prediction.groups && prediction.groups.length > 0) {
                                prediction.groups = prediction.groups.filter(group => group.year === year && group.sport === sport)
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
                        
                        // Insert or Update the user's prediction to the prediction collection
                        const dbRes = await db.collection(predictionCollection).updateOne(existingObjQuery, {"$set": prediction}, {upsert: true, session});
                        var respObj = JSON.parse(dbRes);
                        assert.equal(respObj.ok, 1);
                            
                            
                            // return prediction update results to the client
                            // along with the game details

                            result.game = game;
                            result.prediction = prediction;
                            if (respObj.upserted) {
                                result.updated = false;
                            } else {
                                result.updated = true;
                            }
                            result.succeeded = true;
                            result.message = 'Prediction saved';
            
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
                                context.fail('addToGroupError', err);
                                } else {
                                context.succeed('Lambda_B said '+ data.Payload);
                                }
                            })
                            const lambdaresponse = await lambda.send(command)

                            /* record the wager
                            Each prediction will include an array of up to 3 wagers
                            {
                                userId: 'cmaronchick',
                                gameId: prediction.gameId,
                                sport,
                                season,
                                gameWeek,
                                year, 
                                calendarWeek: new Date.getWeek(),
                                calendarYear: new Date.getYear(),
                                prediction: {
                                    awayTeam: {
                                        score: 24
                                    },
                                    homeTeam: {
                                        score: 27
                                    },
                                    odds: {
                                        spread: -3.5,
                                        total: 47
                                    }
                                },
                                wager: {
                                    currency: 100,
                                    wagerType: 'moneyline' | 'spread' | 'total',
                                    odds: -110,
                                    result: 0 = push, 1 = win, -1 = lose 
                                }
                                submitted: new Date.now()
                            }
                            */
                            const addWager = await db.collection('wagers').insertOne({
                                userId,
                                gameId,
                                year,
                                sport,
                                gameWeek,
                                season,
                                prediction: {
                                    awayTeam: {
                                        score: prediction.awayTeam.score
                                    },
                                    homeTeam: {
                                        score: prediction.homeTeam.score
                                    },
                                    odds: {
                                        spread: prediction.odds.spread,
                                        total: prediction.odds.total
                                    }
                                },
                                wager,
                                submitted: prediction.submitted
                            }, {session})
                            // update user's VC balance
                            if (wager) {
                                const profileUpdate = await db.collection('profileExtended').updateOne({ username: userId }, { $inc: { currency: wager.currency * -1 }, $addToSet: {
                                    "wagers.history": {
                                        gameId,
                                        year,
                                        sport,
                                        gameWeek,
                                        season,
                                        ...wager
                                    }
                                }}, {session})
                                if (profileUpdate.modifiedCount === 0) {
                                    session.abortSession()
                                    console.error("the user's profile was not updated. Aborting session.");
                                }
                            }
                            // get total currency bet for a given week
                            var predictionsQuery = {userId: userId, year: prediction.year, gameWeek: prediction.gameWeek, season: season}
                            const predictions = await db.collection(predictionCollection).find(predictionsQuery, {_id:false}).toArray();
                            
                                // if (err) {
                                //     return context.done(null, result);
                                // }
                                
                                result.predictionsSubmitted = predictions.length;
                                let currencyWagered = 0;
                                const {currency} = prediction
                                predictions.forEach((prediction, index) => {
                                    if (currency && (currency.spread || currency.total || currency.moneyline) && ((currency.spread.currencyWagered > 0) || (prediction.total.currencyWagered > 0 || prediction.moneyline.currencyWagered > 0))) {
                                        if (currency.spread && currency.spread.currencyWagered > 0) {
                                            currencyWagered += currency.spread.currencyWagered
                                        }
                                        if (currency.total && currency.total.currencyWagered > 0) {
                                            currencyWagered += currency.total.currencyWagered
                                        }
                                        if (currency.moneyline && currency.moneyline.currencyWagered > 0) {
                                            currencyWagered += currency.moneyline.currencyWagered
                                        }
                                        console.log(`currencyWagered: ${currencyWagered}`)
                                    }
                                })
                                result.currencyWagered = currencyWagered;
                                if (prediction.collegeBowlPremium !== '1' && prediction.sport === 'ncaaf') {
                                    result.crowd = null;
                                }
                                
                                
                                // kick off new aggregation calculation
                                
                                var params = {
                                    Message: "Prediction for game " + prediction.gameId + " submitted by " + userId, 
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
                                const SNSPublishCommand = new PublishCommand(params, function(err, response) {
                                    if (err) {
                                        context.done("SNS error: " + err, null);
                                    }
                                    console.log("SNS Publish complete: ", response);
                                    context.done (null, result)
                                    });

                                const SNSResponse = await SNS.send(SNSPublishCommand)
                           
            },transactionOptions);            
            } catch (transactionError) {
                console.log('transactionError', transactionError);
            } finally {

                await session.endSession();
                await client.close();
                console.log(`Wagers and Predictions submitted; ${result}`);
                context.done(null, { status: 200, message: `Wagers and Predictions submitted; ${result}`})
            }
    } catch (addPredictionError) {
        context.fail({status: 500, message: addPredictionError}, null);
    }
};
