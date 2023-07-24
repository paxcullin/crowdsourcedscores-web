'use strict'

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    {config} = require('config');

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

exports.handler = async (event, context, callback) => {
    const { season, sport, year, team } = event;
    console.log(JSON.stringify(`Event: event`));
    const client = await mongo.connect(MONGO_URL);
    const db = client.db('pcsm');
    const collection = db.collection('wintotals');
    const query = {
        season,
        sport,
        year
    }
    if (team) {
        query.code = team
    }
    console.log('query', query)
    let teamWins = await collection.find(query).toArray()
    console.log('teamWins', teamWins)
    context.done(null, { status: 200, teamWins: teamWins})

    // Lambda Code Here
    // context.succeed('Success!')
    // context.fail('Failed!')
}