var  mongo = require("mongodb").MongoClient,
assert = require("assert"),
AWS = require('aws-sdk'),
{config} = require('./config');

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

const lambda = new AWS.Lambda()

const teamsMap = {
    UAB: "UAB",
    "M-OH": "MOH",
    BAY: 'BAY',
    AFA: 'AF',
    UTSA: "UTSA",
    TROY: "TRY",
    ORST: "ORS",
    FLA: "FLA",
    WSU: "WST",
    FRES: "FRE",
    RICE: "RICE",
    USM: "USM",
    SMU: "SMU",
    BYU: "BYU",
    UNT: "NTX",
    BOIS: "BOISE",
    MRSH: "MSH",
    CONN: "UCONN",
    EMU: "EMC",
    SJSU: "SJS",
    TOL: "TOL",
    LIB: "LIB",
    WKU: "WKY",
    USA: "SAB",
    UL: "ULL",
    HOU: "HOU",
    WAKE: "WF",
    MIZ: "MIZ",
    MTSU: "MTS",
    SDSU: "SDSU",
    NMSU: "NMS",
    BGSU: "BGN",
    GASO: "GSO",
    BUF: "BUF",
    MEM: "MEM",
    USU: "UTS",
    CCU: "CC",
    ECU: "ECU",
    WISC: "WIS",
    OKST: "OKS",
    UCF: "UCF",
    DUKE: "DUK",
    KU: "KAN",
    ARK: "ARK",
    ORE: "ORE",
    UNC: "NC",
    TTU: "TT",
    MISS: "MIS",
    SYR: "SYR",
    MINN: "MIN",
    OU: "OKL",
    FSU: "FSU",
    TEX: "TEX",
    WASH: "WAS",
    MD: "MAR",
    NCST: "NCST",
    PITT: "PIT",
    UCLA: "UCLA",
    ND: "ND",
    SC: "SC",
    OHIO: "OHI",
    WYO: "WYO",
    TENN: "TEN",
    CLEM: "CLE",
    ALA: "BAMA",
    KSU: "KST",
    IOWA: "IOW",
    UK: "KEN",
    TCU: "TCU",
    MICH: "MICH",
    OSU: "OSU",
    UGA: "UGA",
    MSST: "MSST",
    ILL: "ILL",
    TULN: "TUL",
    USC: "USC",
    LSU: "LSU",
    PUR: "PUR",
    PSU: "PSU",
    UTAH: "UTH",

}

const generateRandomString = function(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
// const sns = new AWS.SNS();

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
    const collection = db.collection('games-ncaaf')
    
    //get current game week from getGameWeek 
    // let gameWeekResponse = await lambda.invoke({
    //     FunctionName: 'getGameWeek', // the lambda function we are going to invoke
    //     InvocationType: 'RequestResponse',
    //     LogType: 'None',
    //     Payload: `{ "message": "notification reminder", "sport": "nfl", "year": 2022, "season": "reg"}`
    // }).promise()
    // const gameWeekResponseJSON = JSON.parse(gameWeekResponse.Payload);
    // gameWeek = gameWeekResponseJSON.week;
    
    var gameObjectsArray = [];
    var queryPromises = [];
    // // https://nfl.cheapdatafeeds.com/api/json/scores/v1/football/nfl?month=09&year=2020&seasonType=Regular&api-key=fc0a9ea1a8e4738bb912beb77adcbe90
    function parseGames(games) {
        
        games.forEach((game, index) => {

            const { 
                id,
                date,
                status,
                competitions,
                watchListen,
                lnescrs
            } = game
            
            // if (!competitions || !(competitions.length > 0)) {
            //     return;
            // }
            // const competition = competitions[0]
            // if (!competition) {
            //     return;
            // }
            const {competitors} = game
            // console.log('competitors', competitors)
            if (!competitors || !(competitors.length > 0)) {
                return
            }
                let results = {}, homeTeam = {}, homeTeamCode, awayTeam = {}, awayTeamCode;
                competitors.forEach(competitor => {
                    // console.log('competitor', competitor)
                    if (competitor.isHome === true) {
                        // homeTeamCode = competitor.abbrev !== 'WSH' && competitor.abbrev !== "JAX" ? competitor.abbrev : competitor.abbrev === 'WSH' ? 'WAS' : competitor.abbrev === 'JAX' ? 'JAC' : null
                        homeTeamCode = teamsMap[competitor.abbrev] ? teamsMap[competitor.abbrev] : competitor.abbrev
                        if (!homeTeamCode) {
                            return;
                        }
                        homeTeam.score = parseInt(competitor.score)
                //         console.log('homeTeam.linescores', competitor.linescores)
                    } else {
                        // awayTeamCode = competitor.abbrev !== 'WSH' && competitor.abbrev !== "JAX" ? competitor.abbrev : competitor.abbrev === 'WSH' ? 'WAS' : competitor.abbrev === 'JAX' ? 'JAC' : null
                        awayTeamCode = teamsMap[competitor.abbrev] ? teamsMap[competitor.abbrev] : competitor.abbrev
                        if (!awayTeamCode) {
                            return;
                        }
                        awayTeam.score = parseInt(competitor.score)
                    }
                })
                if (lnescrs && lnescrs.awy && lnescrs.hme) {
                    homeTeam.periods = {};
                    awayTeam.periods = {};
                    lnescrs.hme.forEach((homeQScore, index) => {
                            homeTeam.periods[`q${index+1}`] = homeQScore
                    })
                    lnescrs.awy.forEach((awayQScore, index) => {
                        awayTeam.periods[`q${index+1}`] = awayQScore
                    })
                }
                
    //         // console.log('new Date(new Date(startDate).getTime() + (4*60*60*1000)):', new Date(new Date(startDate).getTime() + (4*60*60*1000)))
            const season = watchListen && watchListen.lg ? {
                year: watchListen.lg.season.year,
                type: watchListen.lg.season.type.type
            } : {
                year: 2022,
                type: 3
            }
            let gameObj = {
                espnID: id,
                startDateTime: date,
                sport: "ncaaf",
                year: season.year ? season.year : 2022,
                season: season.type === 1 ? 'pre' : (season.type === 3 ? 'post' : 'reg'),
                homeTeam: { code: homeTeamCode},
                awayTeam: { code: awayTeamCode}
            };
            // status type 1 = scheduled - no update needed
            const statusId = parseInt(status.id)
            if (statusId !== 1) {
                gameObj.results = {
                    awayTeam,
                    homeTeam,
                    total: (homeTeam.score + awayTeam.score),
                    spread: (awayTeam.score - homeTeam.score),
                    detail: status.detail
                };
                // console.log('status', statusId)
                if (statusId === 2) {
                    gameObj.status = "inProgress";
                } else if (statusId === 3) {
                    gameObj.status = "final"
                } else {
                    gameObj.status = "scheduled";
                } 
                gameObjectsArray.push(gameObj);
            }
            // console.log({gameObj});
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
    const URL = `https://www.espn.com/college-football/scoreboard/_/week/1/year/2022/seasontype/3?_xhr=pageContent`
    const options = {
        Method: 'GET'
    };
    gameObjectsArray = [];
    try {
        const response = await axios.get(URL, {})
            if (!response) {
                context.done(null, { status: 200, message: 'No URL response'});
            }
            // console.log('response', response.data)
            const scoresJSON = response.data;

            if (scoresJSON && scoresJSON.scoreboard && scoresJSON.scoreboard.evts && scoresJSON.scoreboard.evts.length > 0) {
                // console.log('scoresJSON: ', scoresJSON.games[0])
                let games = scoresJSON.scoreboard.evts;
                // console.log('games', games)
                parseGames(games);
                console.log('gameObjectsArray.length', gameObjectsArray.length)
                if (gameObjectsArray.length > 0) {
                    // console.log('gameObjectsArray.length > 0', gameObjectsArray.length > 0)
                        let gameIndex = 0;
                        for (game of gameObjectsArray) {
                            // const game = gameObjectsArray[gameIndex];
                            // find game and update if the status, clock, and period are not equal to the up-to-date values
                            const filter = {"awayTeam.code": game.awayTeam.code, "homeTeam.code": game.homeTeam.code, year: game.year, season: game.season}
                            // console.log('filter', filter)
                            try {
                                let mongoGame = await collection.findOne(filter)
                                // console.log('mongoGame', mongoGame)
                                if (!mongoGame) {
                                    console.log('missing game: ', filter);
                                    continue;
                                }
                                console.log('found game: ', filter)
                                console.log('game', game)
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
                                // only updating if the game has changed from what's in Mongo
                                // if mongogame doesn't have results
                                if ((game.status === "inProgress" || game.status === "final") && ((game.status !== mongoGame.status || (game.results && !mongoGame.results)) || (game.results && mongoGame.results && (game.results.spread !== mongoGame.results.spread)))) {
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
                                                },
                                                season: {
                                                    DataType: "String",
                                                    StringValue: season
                                                }
                                            }
                                        }
                                        // sns.publish(params, function(err, response) {
                                        //     if (err) {
                                        //         context.done("SNS error: " + err, null);
                                        //     }
                                        //     console.log("SNS Publish complete: ", response);
                                        // })
                                    }
                                } 
                                // for troubleshooting when the games aren't updating
                                // else {
                                //     if (game.results && mongoGame.results) {
                                //         console.log('mongoGame.awayTeam.code, mongoGame.homeTeam.code, ', mongoGame.awayTeam.code, mongoGame.homeTeam.code, mongoGame.gameId, game.status, mongoGame.status, game.results.period, mongoGame.results.period, game.results.clock, mongoGame.results.clock,' unchanged')
                                //     }
                                // }
                            } catch (mongoGameError) {
                                console.log('mongoGameError', mongoGameError)
                            }
                            gameIndex++;
                            if (gameIndex === (gameObjectsArray.length -1)) {
                                // console.log('done');
                                
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
                console.log('no events data')
                context.done(null, { status: 200, message: 'No games returned'});
            }
    } catch(rpError) {
            console.log('rpError', rpError)
            context.fail({ rpError: JSON.stringify(rpError) }, null)
    }

}