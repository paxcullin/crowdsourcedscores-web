var  mongo = require("mongodb").MongoClient,
assert = require("assert"),
AWS = require('aws-sdk'),
{config} = require('config');

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

const lambda = new AWS.Lambda()

const generateRandomString = function(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
const sns = new AWS.SNS();

const axios = require("axios");

let gameWeek = 1;
// (function getGameWeek() {
    
//     var getGameWeekParams = {
//         FunctionName: 'getGameWeek', // the lambda function we are going to invoke
//         InvocationType: 'RequestResponse',
//         LogType: 'None',
//         Payload: `{ "message": "notification reminder", "sport": "nfl", "year": 2019, "season": "reg"}`
//     };
//         lambda.invoke(getGameWeekParams, function(err, data) {
//                 if (err) {
//                     console.log("getGameWeek err: ", err);
//                 } else {
//                     console.log('getGameWeek response: ', data.Payload);
//                     console.log({gameWeek: data.Payload})
//                     gameWeek = data.Payload.week;
//                 }
//             });
// })();

exports.handler = async (event, context, callback) => {
    console.log('Received event :', JSON.stringify(event, null, 2));
    const client = await mongo.connect(MONGO_URL)
    const db = client.db('pcsm');
    const collection = db.collection('games')
    
    //get current game week from getGameWeek 
    let gameWeekResponse = await lambda.invoke({
        FunctionName: 'getGameWeek', // the lambda function we are going to invoke
        InvocationType: 'RequestResponse',
        LogType: 'None',
        Payload: `{ "message": "notification reminder", "sport": "nfl", "year": 2022, "season": "reg"}`
    }).promise()
    const gameWeekResponseJSON = JSON.parse(gameWeekResponse.Payload);
    gameWeek = gameWeekResponseJSON.week;
    
    var gameObjectsArray = [];
    var queryPromises = [];
    // // https://nfl.cheapdatafeeds.com/api/json/scores/v1/football/nfl?month=09&year=2020&seasonType=Regular&api-key=fc0a9ea1a8e4738bb912beb77adcbe90
    function parseGames(games) {
        
        games.forEach((game, index) => {

            const { 
                id,
                date,
                season,
                status,
                competitions
            } = game
            
            const { displayClock, period, type } = status
            if (!competitions || !(competitions.length > 0)) {
                return;
            }
            const competition = competitions[0]
            if (!competition) {
                return;
            }
            const {competitors} = competition
            // console.log('competitors', competitors)
            if (!competitors || !(competitors.length > 0)) {
                return
            }
                let results = {}, homeTeam = {}, homeTeamCode, awayTeam = {}, awayTeamCode;
                competitors.forEach(competitor => {
                    // console.log('competitor', competitor)
                    if (!competitor.team) {
                        return;
                    }
                    if (competitor.homeAway === 'home') {
                        homeTeamCode = competitor.team.abbreviation !== 'WSH' && competitor.team.abbreviation !== "JAX" ? competitor.team.abbreviation : competitor.team.abbreviation === 'WSH' ? 'WAS' : competitor.team.abbreviation === 'JAX' ? 'JAC' : null
                        if (!homeTeamCode) {
                            return;
                        }
                        homeTeam.score = parseInt(competitor.score)
                //         console.log('homeTeam.linescores', competitor.linescores)
                        if (competitor.linescores && competitor.linescores.length > 0) {
                            homeTeam.periods = {};
                            competitor.linescores.forEach((linescore, index) => {
                                homeTeam.periods[`q${index+1}`] = linescore.value
                            })
                        }
                    } else {
                        awayTeamCode = competitor.team.abbreviation !== 'WSH' && competitor.team.abbreviation !== "JAX" ? competitor.team.abbreviation : competitor.team.abbreviation === 'WSH' ? 'WAS' : competitor.team.abbreviation === 'JAX' ? 'JAC' : null
                        if (!awayTeamCode) {
                            return;
                        }
                        awayTeam.score = parseInt(competitor.score)
                        if (competitor.linescores && competitor.linescores.length > 0) {
                            awayTeam.periods = {};
                            competitor.linescores.forEach((linescore, index) => {
                                awayTeam.periods[`q${index+1}`] = linescore.value
                            })
                        }
                    }
                })
    //         // console.log('new Date(new Date(startDate).getTime() + (4*60*60*1000)):', new Date(new Date(startDate).getTime() + (4*60*60*1000)))
            let gameObj = {
                espnID: id,
                startDateTime: date,
                sport: "nfl",
                year: parseInt(season.year) ? parseInt(season.year) : 2020,
                season: season.type === 1 ? 'pre' : (season.type === 3 ? 'post' : 'reg'),
                status: status,
                homeTeam: { code: homeTeamCode},
                awayTeam: { code: awayTeamCode}
            };
            // status type 1 = scheduled - no update needed
            if (type !== 1) {
                gameObj.results = {
                    awayTeam,
                    homeTeam,
                    total: (homeTeam.score + awayTeam.score),
                    spread: (awayTeam.score - homeTeam.score),
                    period: status.period,
                    clock: status.displayClock
                };
                if (parseInt(status.type) === 2) {
                    gameObj.status = "inProgress";
                } else if (parseInt(status.type) === 3) {
                    gameObj.status = "final"
                } else {
                    gameObj.status = "scheduled";
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

    const today = Date.now()
    //
    const URL = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?lang=en&region=us&calendartype=blacklist&limit=100&showAirings=true&dates=2022&seasontype=2&week=${gameWeek ? gameWeek : 11}`
    const options = {
        Method: 'GET'
    };
    gameObjectsArray = [];
    try {
        const response = await axios.get(URL, {})
            if (!response) {
                context.done(null, { status: 200, message: 'No URL response'});
            }
            console.log('response', response.data)
            const scoresJSON = response.data;

            if (scoresJSON && scoresJSON.events && scoresJSON.events.length > 0) {
                // console.log('scoresJSON: ', scoresJSON.games[0])
                let games = scoresJSON.events;
                parseGames(games);
                console.log('gameObjectsArray.length', gameObjectsArray.length)
                if (gameObjectsArray.length > 0) {
                    // console.log('gameObjectsArray.length > 0', gameObjectsArray.length > 0)
                        let gameIndex = 0;
                        for (game of gameObjectsArray) {
                            // const game = gameObjectsArray[gameIndex];
                            const filter = {"awayTeam.code": game.awayTeam.code, "homeTeam.code": game.homeTeam.code, year: game.year, season: game.season }
                            // console.log('filter', filter)
                            try {
                                let mongoGame = await collection.findOne(filter)
                                // console.log('mongoGame', mongoGame)
                                if (!mongoGame) {
                                    console.log('missing game: ', filter)
                                }
                                const { gameId, year, season, sport } = mongoGame
                                const mongoGameWeek = mongoGame.gameWeek
                                let update = {
                                    $set: {
                                        "status": game.status,
                                        "results.clock": game.results.clock,
                                        "results.period": game.results.period,
                                        "results.awayTeam.score": game.results.awayTeam.score,
                                        "results.awayTeam.periods": game.results.awayTeam.periods,
                                        "results.homeTeam.score": game.results.homeTeam.score,
                                        "results.homeTeam.periods": game.results.homeTeam.periods,
                                        "results.total": (game.results.homeTeam.score + game.results.awayTeam.score),
                                        "results.spread": (game.results.awayTeam.score - game.results.homeTeam.score)
                                    }
                                };
                                // console.log({payload});
                                // console.log('adding new game');
                                if (game.status === "inProgess" || game.status === "final") {
                                    queryPromises.push(collection.updateOne({ gameId: gameId }, update));
                                    if (game.status === "final") {
                                        params = {
                                            Message: "Game " + gameId + " updated", 
                                            Subject: "Game Updated",
                                            TopicArn: "arn:aws:sns:us-west-2:198282214908:gameUpdated",
                                            MessageAttributes: { 
                                                gameId: {
                                                    DataType: "Number",
                                                    StringValue: gameId.toString()
                                                },
                                                gameWeek: {
                                                    DataType: "Number",
                                                    StringValue: mongoGameWeek.toString()
                                                },
                                                year: {
                                                    DataType: "Number",
                                                    StringValue: year.toString()
                                                },
                                                sport: {
                                                    DataType: "String",
                                                    StringValue: sport
                                                }
                                            }
                                        }
                                        sns.publish(params, function(err, response) {
                                            if (err) {
                                                context.done("SNS error: " + err, null);
                                            }
                                            console.log("SNS Publish complete: ", response);
                                        })
                                    }
                                }
                            } catch (mongoGameError) {
                                console.log('mongoGameError', mongoGameError)
                            }
                            gameIndex++;
                            if (gameIndex === (gameObjectsArray.length -1)) {
                                console.log('done');
                                
                            // console.log('queryPromises.length:', queryPromises.length)

                                Promise.all(queryPromises)
                                    .then(response => { console.log(`Promise response: ${JSON.stringify(response)}`);  context.done(null, { message: `Response: ${queryPromises.length} updated; ${games.length} total games`}) })
                                    .catch(reject => { console.log(`Promise reject: ${reject}`); context.done(null, { message: `Reject: ${queryPromises.length} updated; ${games.length} total games`})})
                                
                            }
                        
                            // console.log({missingItem: payload.Item})
                            if (gameIndex === (gameObjectsArray.length -1)) {
                                // console.log('queryPromises.length:', queryPromises.length)

                                Promise.all(queryPromises)
                                    .then(response => { console.log(`Promise response: ${JSON.stringify(response)}`);  context.done(null, { message: `Response: ${queryPromises.length} updated; ${games.length} total games`}) })
                                    .catch(reject => { console.log(`Promise reject: ${reject}`); context.done(null, { message: `Reject: ${queryPromises.length} updated; ${games.length} total games`})})
                                
                            }
                        }
                } else {
                    context.done(null, { status: 200, message: 'No games returned'});
                }
            } else {
                context.done(null, { status: 200, message: 'No games returned'});
            }
    } catch(rpError) {
            console.log('rpError', rpError)
            context.fail({ rpError: JSON.stringify(rpError) }, null)
    }

}