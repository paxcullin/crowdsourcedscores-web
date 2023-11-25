'use strict'

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    {config} = require('./config');

    const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;
/*
Expected: username
If only username, get all wagers for that user
Optional: sport, year, season, gameweek
*/
exports.handler = async (event, context, callback) => {
    console.log('Event: ', event)

    const { userId, sport, year, season, gameWeek, gameId } = event;
    let query = {
        userId
    }
    try {
        const dbClient = await mongo.connect(MONGO_URL);
        const db = dbClient.db('pcsm');
        const collection = await db.collection('wagers');
        if (sport) {
            query.sport = sport
        }
        if (year) {
            query.year = year
        }
        if (season) {
            query.season = season
        }
        if (gameWeek) {
            query.gameWeek = gameWeek
        }
        if (gameId) {
            query.gameId = gameId
        }
        console.log('query', query)
        const wagers = await collection.find(query).toArray();
        console.log('wagers', wagers.length)
        context.done(null, { status: 200, wagers })
    } catch (err) {
        assert.equal(err);
        context.fail(err)

    }
        
    // context.succeed('Success!')
}