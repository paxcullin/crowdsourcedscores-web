const rp = require('request-promise')
const cheerio = require('cheerio')
const Table = require('cli-table')
const mongo = require('mongodb').MongoClient
const MONGO_URL = 'mongodb://pcsm-user:*dZ2HaWN@ds011775.mlab.com:11775/pcsm';

const assert = require('assert')

let games = []
let urls = [`https://io.oddsshark.com/scores/ncaab/2019-03-28`, `https://io.oddsshark.com/scores/ncaab/2019-03-29`]

exports.handler = (event, context) => {
    console.log('Received event :', JSON.stringify(event, null, 2));

gameObjectsArray = [];
queryPromises = [];

function parseGames(games) {
    games.forEach((game, index) => {
        const gameObj = {
            gameId: parseInt(game.event_id),
            startDateTime: new Date(game.event_date),
            location: game.stadium,
            awayTeam: {
                fullName: game.away_name,
                shortName: game.away_display_name,
                code: game.away_abbreviation,
                rank: game.away_rank
            },
            homeTeam: {
                fullName: game.home_name,
                shortName: game.home_display_name,
                code: game.home_abbreviation,
                rank: game.home_rank
            },
            odds: {
                spread: parseInt(game.home_spread),
                total: parseInt(game.total),
                history: [{ date: new Date(), spread: parseInt(game.home_spread), total: parseInt(game.total)}]
            },
            sport: 'ncaam',
            year: 2019,
            status: 'notStarted',
            gameWeek: 12
        }
        gameObjectsArray.push(gameObj)
    })
    
}

urls.forEach((url, urlIndex) => {
    const options = {
        url: url,
        headers: {
            'Referer': 'https://www.oddsshark.com/ncaab/scores'
        },
        json: true
    }
    rp(options)
        .then(async (games) => {
            console.log('games :', games);
            if (games.length > 0) {
                await parseGames(games)
                if (gameObjectsArray.length > 0) {
                    mongo.connect(MONGO_URL, (err, client) => {
                        assert.equal(err, null)

                        const db = client.db('pcsm')
                        const collection = db.collection('games-ncaam')
                        gameObjectsArray.forEach((game, gameIndex) => {
                                const gameQuery = {
                                    gameId: game.gameId,
                                    year: game.year
                                }

                                collection.findOne(gameQuery)
                                .then(gameResult => {
                                    console.log('game :', gameResult);
                                    var gameUpdate = {}
                                    if (!gameResult) {
                                        gameUpdate = {
                                            $set: {
                                                ...game
                                            }
                                        }
                                    } else {
                                        gameResult.odds['history'] ? gameResult.odds.history.push({date: new Date(), total: game.odds.total, spread: game.odds.spread}) : gameResult.odds['history'] = [{ date: new Date(), total: game.odds.total, spread: game.odds.spread }]
                                        gameUpdate = {
                                            $set: {
                                                odds: gameResult.odds
                                            }
                                        }
                                    }
                                    console.log(`gameQuery: ${JSON.stringify(gameQuery)}; gameUpdate: ${JSON.stringify(gameUpdate)}`);
                                    queryPromises.push(collection.updateOne(gameQuery, gameUpdate, { upsert: true }))
                                    if (urlIndex === (urls.length-1) && gameIndex === (games.length -1)) {

                                        console.log('queryPromises.length :', queryPromises.length);
                                        Promise.all(queryPromises)
                                            .then(response => { console.log(`Promise response: ${response}`); context.done(null, { message: `Response: ${queryPromises.length} updated; ${games.length} total games`}) })
                                            .catch(reject => { console.log(`Promise reject: ${reject}`); context.done(null, { message: `Reject: ${queryPromises.length} updated; ${games.length} total games`})})
                                        
                                    }
                                })
                                .catch(gameReject => {
                                    console.log('gameReject :', gameReject)
                                    if (urlIndex === (urls.length -1) && gameIndex === (games.length -1)) {
                                        context.done(null, { message: `${queryPromises.length} updated; ${games.length} total games`})
                                    }
                                })
                        })
                    })
                } else {
                    return;
                }
            } else {
                return;
            }

        })
        .catch(rpError => {
            console.log('rpError :', rpError)
            context.done(rpError, null)
        })
    })
}