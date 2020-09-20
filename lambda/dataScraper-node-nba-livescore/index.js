const rp = require('request-promise')
const AWS = require('aws-sdk');    

const db = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'});

const TableName = 'games-nba';

const lambda = new AWS.Lambda();

const generateRandomString = function(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
const sns = new AWS.SNS();

const assert = require('assert')

let games = []
let dates = [
    20200730
]
    
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

exports.handler = (event, context, callback) => {
    console.log('Received event :', JSON.stringify(event, null, 2));

var gameObjectsArray = [];
var queryPromises = [];

function parseGames(games) {
    games.forEach((gameArray, index) => {
        let game = gameArray.competitions[0]
        let teams = game.competitors;
        let homeTeamArray = teams.filter(team => team.homeAway === "home")
        let awayTeamArray = teams.filter(team => team.homeAway === "away")
        if (homeTeamArray.length === 0 || awayTeamArray.length === 0) {
            return "Teams are missing"
        }
        let homeTeam = homeTeamArray[0]
        let awayTeam = awayTeamArray[0]
        var gameObj = {
            gameId: parseInt(game.id),
            startDateTime: `${new Date(new Date(game.date).getTime() + (4*60*60*1000))}`,
            location: `${game.venue ? `${game.venue.address.city}, ${game.venue.address.state}` : ''}`,
            awayTeam: {
                fullName: awayTeam.team.displayName,
                shortName: awayTeam.team.shortDisplayName,
                code: awayTeam.team.abbreviation
            },
            homeTeam: {
                fullName: homeTeam.team.displayName,
                shortName: homeTeam.team.shortDisplayName,
                code: homeTeam.team.abbreviation
            },
            sport: 'nba',

            year: gameArray.season.year,

            status: 'notStarted',
            season: gameArray.season.type === 3 ? "post" : gameArray.season.type === 1 ? "pre" : "reg"
        };
        if (parseInt(game.status.type.id) !== 1) {
            let homeScore = parseInt(homeTeam.score);
            let awayScore = parseInt(awayTeam.score);
            gameObj.clock = game.status.clock
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
            if (game.status.state === 'post') {
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
    const msHour = 300000;
    var now = new Date();
    var start = Date.parse(startDateTime);
    var cutoff = start - msHour;

    return (now > cutoff)
}

dates.forEach((date, dateIndex) => {
    //https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?lang=en&region=us&calendartype=blacklist&limit=100&showAirings=true&dates=20200731&tz=America%2FNew_York
    const options = {
        url: `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?lang=en&region=us&calendartype=blacklist&limit=100&showAirings=true&dates=${date}&tz=America%2FNew_York`,
        headers: {
            'Referer': 'https://www.espn.com/'
        },
        json: true
    }
    const oddsSharkOptions = {
        url: `https://io.oddsshark.com/scores/nba/${date.toString().substring(0,4)}-${date.toString().substring(4,6)}-${date.toString().substring(6)}`,
        headers: {
            'Referer': 'https://www.oddsshark.com/nba/scores'
        },
        json: true
    }
    gameObjectsArray = []
    rp(options)
        .then(async (scoresJSON) => {
            if (scoresJSON.events && scoresJSON.events.length > 0) {
                rp(oddsSharkOptions)
                .then(oddssharkJSON => {
                    let games = scoresJSON.events;
                    parseGames(games)
                    if (gameObjectsArray.length > 0) {

                            gameObjectsArray.forEach((game, gameIndex) => {
                                    let gameOdds = oddssharkJSON.filter(odds => {
                                        return game.awayTeam.shortName === odds.away_nick_name && game.homeTeam.shortName === odds.home_nick_name
                                        })
                                    if (gameOdds.length > 0) {
                                        game.odds = {
                                            spread: parseFloat(gameOdds[0].home_spread),
                                            total: parseFloat(gameOdds[0].total)
                                        }
                                    }
                                    const gameQuery = {
                                        gameId: game.gameId,
                                        year: game.year
                                    }
                                    let payload = {
                                        TableName: TableName,
                                        Item: {
                                            ...game
                                        }
                                        
                                    };
                                    console.log({game: game.gameId})
                                    db.get({
                                        TableName: TableName,
                                        Key: {
                                            "gameId": game.gameId
                                        }
                                    }, (err, data) => {
                                        console.log({err, data})
                                        if (err) {
                                            queryPromises.push(db.put(payload, function(err,data) {
                                                if (err) {
                                                    callback(err, null)
                                                }
                                                if (data) {
                                                    console.log({ successfulPush: data })
                                                }
                                            }))
                                        }
                                        if (data) {
                                            if (payload.Item.status !== 'notStarted') {
                                                let odds = {...data.Item.odds}
                                                if (odds.history) {
                                                    odds.history.push({
                                                        date: Date.now(),
                                                        ...payload.Item.odds
                                                    })
                                                    payload.Item.odds.history = odds.history
                                                } else {
                                                    payload.Item.odds.history = []
                                                    payload.Item.odds.history.push({
                                                        date: Date.now(),
                                                        ...payload.Item.odds
                                                    })
                                                }
                                                queryPromises.push(db.put(payload, function(err,data) {
                                                    if (err) {
                                                        callback(err, null)
                                                    }
                                                    if (data) {
                                                        console.log({ successfulUpdate: data })
                                                    }
                                                }))
                                            } else {
                                                queryPromises.push(db.update({
                                                    TableName: TableName,
                                                    Key: {
                                                        "gameId": game.gameId
                                                    },
                                                    AttributeUpdates: {
                                                        'results': {
                                                          Action: 'PUT',
                                                          Value: payload.Item.results /* "str" | 10 | true | false | null | [1, "a"] | {a: "b"} */
                                                        }
                                                    }
                                                }, function(err,data) {
                                                    if (err) {
                                                        callback(err, null)
                                                    }
                                                    if (data) {
                                                        console.log({ successfulUpdate: data })
                                                    }
                                                }))
                                                
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

                                    
                                    if (date === (dates.length-1) && gameIndex === (games.length -1)) {

                                        Promise.all(queryPromises)
                                            .then(response => { console.log(`Promise response: ${response}`);  context.done(null, { message: `Response: ${queryPromises.length} updated; ${games.length} total games`}) })
                                            .catch(reject => { console.log(`Promise reject: ${reject}`); context.done(null, { message: `Reject: ${queryPromises.length} updated; ${games.length} total games`})})
                                        
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