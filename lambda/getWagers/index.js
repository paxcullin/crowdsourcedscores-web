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
        const collection = db.collection('wagers');
        const gamesCollection = sport === 'ncaaf' ? db.collection('games-ncaaf') : db.collection('games');
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
        let wagerGameIds = [];
        let updateWagerIds = [];
        let updateWagers = [];
        let queryPromises = [];
        if (wagers && wagers.length > 0) {
            wagers.forEach(wager => {
                if ((!wager.awayTeam || !wager.homeTeam) && wager.gameId) {
                    wagerGameIds.push(wager.gameId)
                    updateWagerIds.push(wager._id)
                    updateWagers.push(wager)
                }
            })
            if (wagerGameIds.length > 0) {
                console.log('wagerGameIds', wagerGameIds)
                const games = await gamesCollection.find({ gameId: { $in: wagerGameIds } }).toArray();
                console.log('games.length', games.length)
                if (games && games.length > 0) {
                    updateWagers.map(wager => {
                        let wagerGame = games.filter(game => game.gameId === wager.gameId);
                        if (wagerGame && wagerGame.length > 0) {

                            wager.awayTeam = wagerGame[0].awayTeam;
                            wager.homeTeam = wagerGame[0].homeTeam;
                            queryPromises.push(collection.updateOne({ _id: wager._id }, { $set: { awayTeam: wager.awayTeam, homeTeam: wager.homeTeam } }))
                        }
                    })
                }
            }
            console.log('updateWagers.length', updateWagers.length, wagerGameIds.length)
            console.log('queryPromises.length', queryPromises.length)    
            console.log('updateWagers[0]', updateWagers[0])
            if (queryPromises.length > 0) {
                const updateWagersResponse = await Promise.all(queryPromises)
                console.log('updateWagersResponse', updateWagersResponse)
            }

        }
        console.log('wagers', wagers.length)
        context.done(null, { status: 200, wagers })
    } catch (err) {
        console.log('err', err)
        assert.equal(err);
        context.fail(err)

    }
        
    // context.succeed('Success!')
}