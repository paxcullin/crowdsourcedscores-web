'use strict'
const AWSConfig = { region: "us-west-2" };
var mongo = require("mongodb").MongoClient;
const { profile } = require("console");
// const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda"); // CommonJS import

const {config} = require("./config");
const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

exports.handler = async (event, context, callback) => {
    try {
        console.log(JSON.stringify(`Event: ${JSON.stringify(event)}`))
        const client = await mongo.connect(MONGO_URL);
        const { 
            userId,
            gameId,
            year,
            sport,
            gameWeek,
            season,
            prediction,
            wager } = event;

        const db = client.db('pcsm');
        const session = client.startSession();
        session.startTransaction()
        const userProfile = await db.collection('profileExtended').findOne({ username: userId }, { session });
        let currencyBalance = userProfile.currency;
        console.log('currencyBalance', currencyBalance)
        if (wager.currency <= currencyBalance) {
            let submitWager = await db.collection('wagers').insertOne({
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
                submitted: new Date()
            }, {session});
            console.log('submitWager', submitWager)
            const profileUpdate = await db.collection('profileExtended').updateOne({ username: userId }, { $inc: { currency: wager.currency * -1 }, $addToSet: {
                "wagers.history": {
                    gameId,
                    year,
                    sport,
                    gameWeek,
                    season,
                    ...wager
                }
            }}, {$project: { "currency": 1, "username": 1 }, session})
            console.log('profileUpdate', profileUpdate)
            currencyBalance = profileUpdate.currency;
            if (profileUpdate.modifiedCount === 0) {
                session.abortTransaction()
                console.error("the user's profile was not updated. Aborting session.");
                context.fail({status: 500, message: "the user's profile was not updated. Aborting session."});
            } else {
                session.commitTransaction();
                context.done(null, {status: 200, message: "Wager was successfully placed.", currencyBalance});
            }
        } else {
            session.abortTransaction()
            console.error("insufficient balance");
            context.done(null, {status: 200, message: "The user does not have enough currency to place this wager."});
        }
    } catch (err) {
        console.error(err);
        context.fail({status: 500, message: err});
    }
}