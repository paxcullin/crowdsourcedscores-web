const rp = require('request-promise')
const cheerio = require('cheerio')
const Table = require('cli-table')
const mongo = require('mongodb').MongoClient
const MONGO_URL = 'mongodb://pcsm-user:*dZ2HaWN@ds011775.mlab.com:11775/pcsm';

const assert = require('assert')

let games = []
let urls = [`https://io.oddsshark.com/scores/football/nfl/2019/p0`,
    `https://io.oddsshark.com/scores/football/nfl/2019/p1`,
    `https://io.oddsshark.com/scores/football/nfl/2019/p2`,
    `https://io.oddsshark.com/scores/football/nfl/2019/p3`,
    `https://io.oddsshark.com/scores/football/nfl/2019/p4`,
    `https://io.oddsshark.com/scores/football/nfl/2019/p5`]
/*
`https://io.oddsshark.com/scores/football/nfl/2019/1`,
`https://io.oddsshark.com/scores/football/nfl/2019/2`,
`https://io.oddsshark.com/scores/football/nfl/2019/3`,
`https://io.oddsshark.com/scores/football/nfl/2019/4`,
`https://io.oddsshark.com/scores/football/nfl/2019/5`,
`https://io.oddsshark.com/scores/football/nfl/2019/6`,
`https://io.oddsshark.com/scores/football/nfl/2019/7`,
`https://io.oddsshark.com/scores/football/nfl/2019/8`,
`https://io.oddsshark.com/scores/football/nfl/2019/9`,
`https://io.oddsshark.com/scores/football/nfl/2019/10`,
`https://io.oddsshark.com/scores/football/nfl/2019/11`,
`https://io.oddsshark.com/scores/football/nfl/2019/12`,
`https://io.oddsshark.com/scores/football/nfl/2019/13`,
`https://io.oddsshark.com/scores/football/nfl/2019/14`,
`https://io.oddsshark.com/scores/football/nfl/2019/15`,
`https://io.oddsshark.com/scores/football/nfl/2019/16`,
`https://io.oddsshark.com/scores/football/nfl/2019/17`*/

exports.handler = (event, context) => {
    console.log('Received event :', JSON.stringify(event, null, 2));

gameObjectsArray = [];
queryPromises = [];

function parseGames(games) {
    games.forEach((game, index) => {
        var gameObj = {
            gameId: parseInt(game.event_id),
            startDateTime: new Date(new Date(game.event_date).getTime() + (4*60*60*1000)),
            location: game.stadium,
            awayTeam: {
                fullName: game.away_name,
                shortName: game.away_nick_name,
                code: game.away_abbreviation
            },
            homeTeam: {
                fullName: game.home_name,
                shortName: game.home_nick_name,
                code: game.home_abbreviation
            },
            odds: (game.home_spread || game.total) ? {
                spread: game.home_spread ? parseInt(game.home_spread) : '',
                total: game.total ? parseInt(game.total) : '',
                history: [{ date: new Date(), spread: parseInt(game.home_spread), total: parseInt(game.total)}]
            } : {
                spread: '',
                total: ''
            },
            sport: 'nfl',

            year: 2019,
            status: 'notStarted',
            gameWeek: parseInt(game.week) ? parseInt(game.week) : game.week,
            season: (game.week.indexOf('p') > -1) ? "pre" : (parseInt(game.week) < 18) ? "reg" : "post"
        };
        if (game.away_score && game.home_score) {
            gameObj.results = {
                awayTeam: {
                    score: parseInt(game.away_score)
                },
                homeTeam: {
                    score: parseInt(game.home_score)
                }
            }
            if (game.status === 'FINAL') {
                gameObj.status = 'final';
             } else {
                gameObj.status = 'inProgress'
             } 
        }
        gameObjectsArray.push(gameObj)
    })
    
}

function gameCannotBeUpdated(startDateTime) {
    //cutoff for odds updates is 1 hour prior to start
    const msHour = 3600000;
    var now = new Date();
    var start = Date.parse(startDateTime);
    var cutoff = start - msHour;

    return (now > cutoff)
}

urls.forEach((url, urlIndex) => {
    const options = {
        url: url,
        headers: {
            'Referer': 'https://www.oddsshark.com/nfl/scores'
        },
        json: true
    }
    rp(options)
        .then(async (games) => {
            //console.log('games :', games);
            if (games.length > 0) {
                await parseGames(games)
                if (gameObjectsArray.length > 0) {
                    mongo.connect(MONGO_URL, (err, client) => {
                        assert.equal(err, null)

                        const db = client.db('pcsm')
                        const collection = db.collection('games')
                        gameObjectsArray.forEach((game, gameIndex) => {
                                const gameQuery = {
                                    gameId: game.gameId,
                                    year: game.year,
                                    status: {
                                        $ne: 'final'
                                    }
                                }

                                collection.findOne(gameQuery)
                                .then(gameResult => {
                                    //console.log('game :', gameResult);
                                    var gameUpdate = {}
                                    if (!gameResult) {
                                        gameUpdate = {
                                            $set: {
                                                ...game
                                            }
                                        }
                                    } else {
                                        if (gameResult.status !== "notStarted" || gameCannotBeUpdated(game.startDateTime)) return;
                                        if (game.odds.total !== '' || game.odds.spread !== '') {
                                            gameResult.odds['history'] ? gameResult.odds.history.push({date: new Date(), total: game.odds.total, spread: game.odds.spread}) : gameResult.odds['history'] = [{ date: new Date(), total: game.odds.total, spread: game.odds.spread }]
                                        }
                                        gameResult.odds.spread = game.odds.spread
                                        gameResult.odds.total = game.odds.total
                                        gameUpdate = {
                                            $set: {
                                                odds: gameResult.odds
                                            }
                                        }
                                    }
                                    console.log('gameUpdate :', gameUpdate);
                                    queryPromises.push(collection.updateOne(gameQuery, gameUpdate, { upsert: true }))
                                    if (urlIndex === (urls.length-1) && gameIndex === (games.length -1)) {

                                        
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