const rp = require('request-promise')
const mongo = require('mongodb').MongoClient
const MONGO_URL = 'mongodb://${username}:${password}@ds011775.mlab.com:11775/pcsm';

const AWS = require('aws-sdk');    
const SNS = new AWS.SNS({ apiVersion: '2010-03-31' });
const sns = new AWS.SNS();

const assert = require('assert')

let games = []
let urls = [
    `https://io.oddsshark.com/scores/football/nfl/2019/p4`,
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
    `https://io.oddsshark.com/scores/football/nfl/2019/17`]
    
/*
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

var gameObjectsArray = [];
var queryPromises = [];

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
                spread: game.home_spread ? parseFloat(game.home_spread) : '',
                total: game.total ? parseFloat(game.total) : '',
                history: [{ date: new Date(), spread: parseInt(game.home_spread), total: parseInt(game.total)}]
            } : {
                spread: '',
                total: ''
            },
            sport: 'nfl',

            year: 2019,
            status: 'notStarted',
            gameWeek: parseInt(game.week) ? parseInt(game.week) : (game.week.indexOf('P') > -1) ? parseInt((game.week[1])) + 1 : game.week,
            season: (game.week.indexOf('P') > -1) ? "pre" : (parseInt(game.week) < 18) ? "reg" : "post"
        };
        if (game.away_score && game.home_score) {
            let homeScore = parseInt(game.home_score)
            let awayScore = parseInt(game.away_score)
            gameObj.results = {
                awayTeam: {
                    score: awayScore
                },
                homeTeam: {
                    score: homeScore
                },
                total: (homeScore + awayScore),
                spread: (awayScore - homeScore),
            }
            if (game.status === 'FINAL') {
                gameObj.status = 'final';
             } else {
                gameObj.status = 'inProgress'
             } 
        }
        //console.log({gameObj});
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
    gameObjectsArray = []
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
                                    year: game.year
                                }

                                collection.findOne(gameQuery)
                                .then(gameResult => {
                                    //console.log('game :', gameResult);
                                    var gameUpdate = {}
                                    let upsert = true;
                                    if (!gameResult) {
                                        gameUpdate = {
                                            $set: {
                                                ...game
                                            }
                                        }
                                    } else {
                                        //update game score
                                        if (game.status === "final" || gameCannotBeUpdated(game.startDateTime)) {
                                            upsert = false;
                                            gameUpdate = {
                                                $set: {
                                                    status: game.status,
                                                    results: game.results
                                                }
                                            }
                                        } else {
                                            if (game.odds.total !== '' || game.odds.spread !== '') {
                                                gameResult.odds['history'] ? gameResult.odds.history.push({date: new Date(), total: game.odds.total, spread: game.odds.spread}) : gameResult.odds['history'] = [{ date: new Date(), total: game.odds.total, spread: game.odds.spread }]
                                            }
                                            gameResult.odds.spread = game.odds.spread
                                            gameResult.odds.total = game.odds.total
                                            gameUpdate = {
                                                $set: {
                                                    startDateTime: game.startDateTime,
                                                    odds: gameResult.odds
                                                }
                                            }
                                        }
                                    }
                                    //console.log('gameUpdate :', gameUpdate);
                                    queryPromises.push(collection.updateOne({gameId: game.gameId,year: game.year}, gameUpdate, { upsert: upsert }))
                                    //console.log({status: game.status, gameResultStatus: gameResult.status, gameResultCrowd: gameResult.crowd})
                                    if (game.status === 'final' && (gameResult.status !== 'final' || (gameResult.crowd && !gameResult.crowd.results))) {
                                        var params = {
                                            Message: "Game " + game.gameId + " updated by OS feed",
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
                                        console.log(`SNS Publishing: ${JSON.stringify(game)}`)
                                        // add an SNS promise to kick off other actions related to a game going final
                                        queryPromises.push(sns.publish(params, (err, response) => {
                                            if (err) {
                                                console.log("SNS error: " + err, null);
                                            }
                                            console.log("SNS Publish complete: ", response);
                                        }))
                                    }
                                    if (urlIndex === (urls.length-1) && gameIndex === (games.length -1)) {

                                        
                                        Promise.all(queryPromises)
                                            .then(response => { console.log(`Promise response: ${response}`);  context.done(null, { message: `Response: ${queryPromises.length} updated; ${games.length} total games`}) })
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