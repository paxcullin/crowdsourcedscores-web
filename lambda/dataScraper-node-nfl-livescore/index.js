const rp = require('request-promise')
const AWS = require('aws-sdk');

const db = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'});
// console.log(db)
const TableName = 'games-nfl';

const generateRandomString = function(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
// const sns = new AWS.SNS();

const assert = require('assert')


exports.handler = (event, context, callback) => {
    console.log('Received event :', JSON.stringify(event, null, 2));

var gameObjectsArray = [];
var queryPromises = [];
const months = [
    '09',
    '10',
    '11',
    '12'
]
//https://nfl.cheapdatafeeds.com/api/json/scores/v1/football/nfl?month=09&year=2020&seasonType=Regular&api-key=fc0a9ea1a8e4738bb912beb77adcbe90
function parseGames(games) {
    Object.keys(games).forEach((gameKey, index) => {
        const game = games[gameKey]

        // "id": "306304",
        // "gameUID": "2283021",
        // "sport": "Football",
        // "league": "NFL",
        // "startDate": "2020-09-11T00:20:00Z",
        // "seasonYear": "2020-2021",
        // "seasonType": "Regular",
        // "seasonWeek": "1",
        // "awayTeamAbb": "HOU",
        // "awayTeamCity": "Houston",
        // "awayTeamName": "Texans",
        // "awayTeam": "Houston Texans",
        // "homeTeamAbb": "KC",
        // "homeTeamCity": "Kansas City",
        // "homeTeamName": "Chiefs",
        // "homeTeam": "Kansas City Chiefs",
        // "venueName": "Arrowhead Stadium",
        // "venueCity": "Kansas City, Missouri",
        // "venueCountry": "United States",
        // "venueRoof": "Open",
        // "venueSurface": "Grass",
        // "status": "Completed",
        // "scoreAwayTotal": "20",
        // "scoreHomeTotal": "34",
        // "scoreAwayPeriod1": "7",
        // "scoreAwayPeriod2": "0",
        // "scoreAwayPeriod3": "0",
        // "scoreAwayPeriod4": "13",
        // "scoreHomePeriod1": "0",
        // "scoreHomePeriod2": "17",
        // "scoreHomePeriod3": "7",
        // "scoreHomePeriod4": "10",
        // "changedDate": "2020-09-11T05:04:01Z",
        // "checkedDate": "2020-09-19T17:17:01Z"
        const { 
            gameUID,
            startDate,
            awayTeamAbb,
            awayTeamCity,
            awayTeamName,
            awayTeam,
            homeTeamAbb,
            homeTeamCity,
            homeTeamName,
            homeTeam,
            venueCity,
            venueName,
            seasonYear,
            seasonType,
            seasonWeek,
            status,
            scoreAwayTotal,
            scoreHomeTotal,
            currentPeriod,
            currentPeriodTimeRemaining
        } = game
        // console.log('new Date(new Date(startDate).getTime() + (4*60*60*1000)):', new Date(new Date(startDate).getTime() + (4*60*60*1000)))
        let gameObj = {
            gameId: parseInt(gameUID) ? parseInt(gameUID) : 99999,
            awayhome: awayTeamAbb + homeTeamAbb,
            startDateTime: new Date(new Date(startDate).getTime() + (4*60*60*1000)) ? new Date(new Date(startDate).getTime() + (4*60*60*1000)) : startDate,
            location: venueCity,
            stadium: venueName,
            sport: "nfl",
            year: parseInt(seasonYear) ? parseInt(seasonYear) : 2020,
            season: seasonType,
            awayTeam: {
                fullName: awayTeam,
                shortName: awayTeamName,
                code: awayTeamAbb
            },
            homeTeam: {
                fullName: homeTeam,
                shortName: homeTeamName,
                code: homeTeamAbb
            },
            status: status
        };
        // status: status
        if (status !== 'Unplayed') {
            let homeScore = parseInt(scoreHomeTotal) ? parseInt(scoreHomeTotal) : 0;
            let awayScore = parseInt(scoreAwayTotal) ? parseInt(scoreAwayTotal) : 0;
            gameObj.results = {
                awayTeam: {
                    score: awayScore
                },
                homeTeam: {
                    score: homeScore
                },
                total: (homeScore + awayScore),
                spread: (awayScore - homeScore),
                currentPeriod,
                currentPeriodTimeRemaining
            };
            if (status === 'Completed') {
                gameObj.status = "final";
             } else {
                gameObj.status = "inProgress";
             } 
        }
        // console.log({gameObj});
        gameObjectsArray.push(gameObj);
    });
    
}

function gameCannotBeUpdated(startDateTime) {
    //cutoff for odds updates is 1 hour prior to start
    const msHour = 300000;
    var now = new Date();
    var start = Date.parse(startDateTime);
    var cutoff = start - msHour;

    return (now > cutoff);
}

months.forEach((month, weekIndex) => {
    //https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?lang=en&region=us&calendartype=blacklist&limit=100&showAirings=true&dates=20200731&tz=America%2FNew_York
    const options = {
        url: `https://nfl.cheapdatafeeds.com/api/json/scores/v1/football/nfl?month=${month}&year=2020&seasonType=Regular&api-key=fc0a9ea1a8e4738bb912beb77adcbe90`,
        json: true
    };
    const pinnacleOptions = {
        url: `https://pinnacle.cheapdatafeeds.com/api/json/odds-main/v2/football/nfl?api-key=fc0a9ea1a8e4738bb912beb77adcbe90`,
        json: true
    };
    gameObjectsArray = [];
    rp(options)
        .then((scoresJSON) => {
            // console.log('scoresJSON.games', scoresJSON.games);
            if (scoresJSON.games && Object.keys(scoresJSON.games).length > 0) {
                // console.log('scoresJSON: ', scoresJSON.games[0])
                rp(pinnacleOptions)
                .then(pinnacleJSON => {
                    let pinnacleGames = {};
                    Object.keys(pinnacleJSON.games).forEach(key => {
                        const game = pinnacleJSON.games[key];
                        pinnacleGames[game.gameUID] = {
                            ...game
                        };
                    });
                    let games = scoresJSON.games;
                    parseGames(games);
                    if (gameObjectsArray.length > 0) {
                        // console.log('gameObjectsArray.length > 0', gameObjectsArray.length > 0)
                        gameObjectsArray.map(game => {
                            // console.log('game.gameUID', game.gameId)
                            if (pinnacleGames[game.gameId]) {
                                const pinnacleGame = pinnacleGames[game.gameId];
                                const spread = pinnacleGame.gameSpreadHomeHandicap;
                                const spreadHomePrice = parseInt(pinnacleGame.gameSpreadHomePrice) ? parseInt(pinnacleGame.gameSpreadHomePrice) : null
                                const spreadAwayPrice = parseInt(pinnacleGame.gameSpreadAwayPrice) ? parseInt(pinnacleGame.gameSpreadAwayPrice) : null
                                const total = parseInt(pinnacleGame.gameTotalPoints) ? parseInt(pinnacleGame.gameTotalPoints) : null;
                                const totalOverPrice = pinnacleGame.gameTotalOverPrice;
                                const totalUnderPrice = pinnacleGame.gameTotalUnderPrice;
                                
                                game.odds = {
                                    spread,
                                    total,
                                    prices: {
                                        spreadHomePrice,
                                        spreadAwayPrice,
                                        totalOverPrice,
                                        totalUnderPrice
                                    }
                                };
                            }
                            return game;
                        });
                            gameObjectsArray.forEach((game, gameIndex) => {
                                    let payload = {
                                        TableName: TableName,
                                        Item: {
                                            ...game
                                        }
                                        
                                    };
                                    // console.log({payload});
                                    db.get({
                                        TableName: TableName,
                                        Key: {
                                            "gameId": game.gameId,
                                            "awayhome": game.awayhome
                                        }
                                    }, (err, data) => {
                                        // console.log({err, data, payload: payload.Item})
                                        if (err || !data.Item) {
                                            // console.log('adding new game');
                                            queryPromises.push(db.put(payload, function(err,data) {
                                                if (err) {
                                                    callback(err, null);
                                                }
                                                if (data) {
                                                    // console.log({ successfulPush: data });
                                                }
                                            }));
                                            if (gameIndex === (gameObjectsArray.length -1)) {
                                            // console.log('queryPromises.length:', queryPromises.length)
        
                                                Promise.all(queryPromises)
                                                    .then(response => { console.log(`Promise response: ${JSON.stringify(response)}`);  context.done(null, { message: `Response: ${queryPromises.length} updated; ${games.length} total games`}) })
                                                    .catch(reject => { console.log(`Promise reject: ${reject}`); context.done(null, { message: `Reject: ${queryPromises.length} updated; ${games.length} total games`})})
                                                
                                            }
                                        }
                                        if (data && data.Item) {
                                            
                                            if (payload.Item.status === 'Unplayed' && payload.Item.odds) {
                                                let odds = data.Item && data.Item.odds ? {...data.Item.odds} : payload.Item.odds ? payload.Item.odds : {};
                                                if (payload.Item.odds) {
                                                    odds = {
                                                        ...odds,
                                                        ...payload.Item.odds
                                                    }
                                                }
                                                // console.log({gameId: game.gameId, awayhome: game.awayhome, payload: payload.Item})
                                                if (odds.history) {
                                                    odds.history.push({
                                                        date: Date.now(),
                                                        ...payload.Item.odds
                                                    });
                                                    payload.Item.odds.history = odds.history;
                                                } else {
                                                    odds.history = [];
                                                    odds.history.push({
                                                        date: Date.now(),
                                                        ...payload.Item.odds
                                                    });
                                                }
                                                
                                                // console.log({payload: JSON.stringify(payload)})
                                                const { gameId,
                                                    awayhome,
                                                    status,
                                                    startDateTime,
                                                    location,
                                                    stadium,
                                                    sport,
                                                    year,
                                                    season,
                                                    homeTeam,
                                                    awayTeam
                                                } = payload.Item
                                                /* 
                                                    startDateTime: startDate,
                                                    location: venueCity,
                                                    stadium: venueName,
                                                    sport: "nfl",
                                                    year: parseInt(seasonYear),
                                                    season: seasonType,
                                                    awayTeam: {
                                                        fullName: awayTeam,
                                                        shortName: awayTeamName,
                                                        code: awayTeamAbb
                                                    },
                                                    homeTeam: {
                                                        fullName: homeTeam,
                                                        shortName: homeTeamName,
                                                        code: homeTeamAbb
                                                    },*/
                                                payload.Item = {
                                                    gameId,
                                                    awayhome,
                                                    status,
                                                    startDateTime,
                                                    location,
                                                    stadium,
                                                    sport,
                                                    year,
                                                    season,
                                                    homeTeam: {...homeTeam},
                                                    awayTeam: {...awayTeam},
                                                    odds: {
                                                        spread: odds.spread,
                                                        total: odds.total,
                                                        history: odds.history,
                                                        prices: odds.prices
                                                    }
                                                }
                                                queryPromises.push(db.put(payload).promise());
                                                    // AttributeUpdates: {
                                                    //     'odds': {
                                                    //       Action: 'PUT',
                                                    //       Value: payload.Item.odds /* "str" | 10 | true | false | null | [1, "a"] | {a: "b"} */
                                                    //     },
                                                    //     'startDateTime': {
                                                    //       Action: 'PUT',
                                                    //       Value: payload.Item.startDateTime /* "str" | 10 | true | false | null | [1, "a"] | {a: "b"} */
                                                    //     }
                                                    // }
                                                    
                                                if (gameIndex === (gameObjectsArray.length -1)) {
                                                    // console.log('queryPromises.length:', queryPromises.length)
                                                    Promise.all(queryPromises)
                                                        .then(response => { console.log(`Promise response: ${JSON.stringify(response)}`);  context.done(null, { message: `Response: ${queryPromises.length} updated; ${games.length} total games`}) })
                                                        .catch(reject => { console.log(`Promise reject: ${reject}`); context.done(null, { message: `Reject: ${queryPromises.length} updated; ${games.length} total games`})})
                                                    
                                                }
                                            } else if (payload.Item.results) {
                                                queryPromises.push(db.put(payload).promise());
                                                if (gameIndex === (gameObjectsArray.length -1)) {
                                                    // console.log('queryPromises.length:', queryPromises.length)
            
                                                    Promise.all(queryPromises)
                                                        .then(response => { console.log(`Promise response: ${JSON.stringify(response)}`);  context.done(null, { message: `Response: ${queryPromises.length} updated; ${games.length} total games`}) })
                                                        .catch(reject => { console.log(`Promise reject: ${reject}`); context.done(null, { message: `Reject: ${queryPromises.length} updated; ${games.length} total games`})})
                                                    
                                                }
                                            } else {
                                                // console.log({missingItem: payload.Item})
                                                if (gameIndex === (gameObjectsArray.length -1)) {
                                                    // console.log('queryPromises.length:', queryPromises.length)
            
                                                    Promise.all(queryPromises)
                                                        .then(response => { console.log(`Promise response: ${JSON.stringify(response)}`);  context.done(null, { message: `Response: ${queryPromises.length} updated; ${games.length} total games`}) })
                                                        .catch(reject => { console.log(`Promise reject: ${reject}`); context.done(null, { message: `Reject: ${queryPromises.length} updated; ${games.length} total games`})})
                                                    
                                                }
                                            }
                                        }
                                    })

                                    const readDataCallback = (data) => {
                                        db.get({
                                            TableName: TableName,
                                            Key: {
                                                gameId: game.gameId
                                            }
                                        }, (err, data) => {
                                            if (err) {
                                                callback(err, null)
                                            }
                                            if (data) {
                                                callback(null, data.Item.username)
                                            }
                                        })
                                    }
                            })
                        //})
                    } else {
                        return;
                    }
                })
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