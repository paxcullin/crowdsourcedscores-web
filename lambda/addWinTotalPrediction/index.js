'use strict'
var  mongo = require("mongodb").MongoClient,
assert = require("assert"),
{config} = require('./config');

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;


exports.handler = async (event, context, callback) => {
    console.log(JSON.stringify(`Event: event`))
    // Get Event payload
    const { userId, season, year, sport, teamCode, predictedWins, oddsWins, odds } = event

    // Confirm required fields
    if (!userId, !season, !year, !sport, !teamCode, !predictedWins, !oddsWins, !odds) {
        context.fail({ status: 500, message: 'Sorry, there was an issue with your prediction. Please try again.'})
    }

    const client = await mongo.connect(MONGO_URL);
    const db = client.db('pcsm');
    const collection = db.collection('predictions-wintotals');

    const query = {
        userId,
        sport,
        year,
        season,
        teamCode
    }
    console.log('query', query);
    const prediction = {
        ...query,
        predictedWins,
        oddsWins,
        odds
    }
    console.log('prediction', prediction)
    try {
        let addPredictionResponse = await collection.updateOne(query, {$set: prediction}, { upsert: true })
        console.log('addPredictionResponse', JSON.stringify(addPredictionResponse));
        if (addPredictionResponse.matchedCount === 1 || addPredictionResponse.modifiedCount === 1) {
            context.done(null, {status: 200, message: 'Prediction updated successfully.'})
        }
    } catch (addPredictionError) {
        context.fail({status: 500, message: addPredictionError})
    }
    
    
    // context.succeed('Success!')
    // context.fail('Failed!')
}