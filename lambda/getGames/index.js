'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    {username, password} = require('./config');
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda"); // ES Modules import
const AWSConfig = { region: "us-west-2" };
const lambda = new LambdaClient(AWSConfig);


const MONGO_URL = `mongodb+srv://${username}:${password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


//`mongodb://${username}:${password}@ds011775.mlab.com:11775/pcsm`;

console.log('Loading function');

exports.handler = async (event, context) => {
    try {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const { userId, preferred_username, sport, gameWeek, year, compareUsername } = event; 
    const client = await mongo.connect(MONGO_URL);
    const db = client.db('pcsm');

    console.log("Connected succesfully to mongodb");
    var gamesCollectionName = 'games';
    var season = event.season ? event.season : 'reg';
    var gamesProjection = {
        _id: 0,
        "odds.history": 0
    }
    var predictionsCollectionName = 'predictions';
    
    if (sport === 'ncaaf') {
        gamesCollectionName = 'games-ncaaf';
        predictionsCollectionName = 'predictions-ncaaf';
    } else if (sport === 'ncaam' || sport === 'ncaab') {
        gamesCollectionName = 'games-ncaab';
        predictionsCollectionName = 'predictions-ncaam';
    } else {
        sport = 'nfl';
    }
    const collection = db.collection(gamesCollectionName);
    const predictionsCollection = db.collection(predictionsCollectionName);
    var comparePredictions = false;
    
    var gamesQuery = {
            "year": parseInt(year),
            "gameWeek": parseInt(gameWeek),
            "season": season,
            "sport": sport
    }
    if (sport === "ncaaf") {
        gamesQuery = {
            "year": parseInt(year),
            "gameWeek": parseInt(gameWeek),
            "season": season,
            "sport": sport
        }
    }
    // "$or": [
    //     {'homeTeam.rank': {$gt: 0}},
    //     {'awayTeam.rank': {$gt: 0}}
    // ]
    if (sport === 'ncaam' || sport === 'ncaab') {
        var lambdaParams = {
            FunctionName: 'getGameWeek', // the lambda function we are going to invoke
            InvocationType: 'RequestResponse',
            LogType: 'Tail',
            Payload: '{ "sport": "ncaam" }'
            };
        try {
            const command = new InvokeCommand(lambdaParams, function(err, data) {
                console.log('err', err);
                console.log('data', data);
                if (err) {
                context.fail('addToGroupError', err);
                } else {
                return data.Payload
                }
            })
            const { Payload, LogResult } = await lambda.send(command);
            const decoded = new TextDecoder("utf-8").decode(Payload);
            let parsed;
            try {
                parsed = JSON.parse(decoded);
            } catch {
                parsed = decoded; // If not JSON, return raw string
            }
            const weekIndex = gameWeek ? gameWeek : (typeof parsed.week === 'number'
                ? parsed.week
                : parseInt(parsed.week, 10));
            console.log('weekIndex, JSON.stringify(parsed.weeks) :>> ', weekIndex, JSON.stringify(parsed.weeks));
            let weekInfo = parsed.weeks && parsed.weeks[weekIndex-1];
            if (!weekInfo && parsed.weeks) {
                weekInfo = parsed.weeks.find((week) => {
                    const weekName = week && week.weekName;
                    return String(weekName) === String(weekIndex)
                        || String(weekName) === String(weekIndex + 1)
                        || String(weekName) === String(event.gameWeek);
                });
            }

            if (weekInfo && weekInfo.start && weekInfo.end) {
                const startDate = new Date(weekInfo.start);
                const endDate = new Date(weekInfo.end);
                gamesQuery = {
                    "year": parseInt(event.year),
                    "season": season,
                    "sport": "ncaab",
                    "startDateTime": { 
                        "$gte": startDate,
                        "$lte": endDate
                    }
                }
            } else {
                console.log('Missing NCAAM week range for query', {
                    parsedWeek: parsed.week,
                    eventWeek: event.gameWeek,
                    weeks: parsed.weeks && parsed.weeks.length
                });
            }
        } catch (err) {
            console.log('getGameWeek err: ', err)
        }
    }
    if (event.compareUsername) {
        comparePredictions = true;
        gamesQuery.results= { $exists: true };
    }
    console.log('gamesQuery: ', gamesCollectionName, gamesQuery)
    const gamesArray = await collection.find(gamesQuery, {sort: {"startDateTime": 1 }, projection: {"odds.history": 0, _id: 0}}).toArray()
        console.log('gamesArray.length: ', gamesArray.length)
        if (gamesArray.length > 0) {
            console.log('gamesArray.first: ', {
                gameId: gamesArray[0].gameId,
                startDateTime: gamesArray[0].startDateTime,
                sport: gamesArray[0].sport,
                season: gamesArray[0].season,
                year: gamesArray[0].year
            });
        }
        
        //check for games that have results
        function checkResultsExist(game) {
            //console.log("game being checked: ", game);
            if (game.results) return game
        }
        
        //check for games that do not have results
        function checkResultsDoNotExist(game) {
            //console.log("game being checked: ", game);
            if (!game.results) return game
        }
        var gamesToPlay = gamesArray.filter(checkResultsDoNotExist);
        var gamesPlayed = gamesArray.filter(checkResultsExist);
        
        var games = [];
        games = gamesToPlay.concat(gamesPlayed);
        var preferred_usernames = []
        if (preferred_username) {
            preferred_usernames.push(preferred_username);
        }
        var predictionsQuery = { 
            "year": parseInt(event.year),
            "season": season,
            "gameWeek": parseInt(event.gameWeek),
            "preferred_username": { $in: preferred_usernames}
        }
        if (sport === "ncaam" || sport === "ncaab") {
            predictionsQuery.gameWeek = { $gt: -1 };
        }
        games.map((game) => {
                if (game.weather) {
                    let gameWeather = {...game.weather}
                    gameWeather.temp = Math.round((game.weather.temp * 1.8) - 459.67)
                    game.weather = gameWeather
                    // console.log({weather: game.weather.temp})
                }
                game.matchup = `${game.awayTeam.code}-${game.homeTeam.code}`
        })
        
        // if (sport === 'ncaam' || sport === 'ncaab') {
        //     predictionsQuery = {
        //         "year": parseInt(year),
        //         "gameWeek": { $gt: 12 },
        //         "preferred_username": { $in: preferred_usernames}
        //     }
        // }
        if (event.compareUsername) {
            preferred_usernames.push(event.compareUsername);
            comparePredictions = true;
            predictionsQuery.results = { $exists: true }
        }
        if (!preferred_username) {
            console.log('No username');
            console.log('games', games);
            context.done(null, {games})
        }
        console.log("predictionsCollectionName: ", predictionsCollectionName)
        console.log("predictionsQuery: ", predictionsQuery)
        console.log('games: ', games)
        const predictions = await predictionsCollection.find(predictionsQuery, {_id: false}).toArray();
            console.log('predictions: ', predictions.length);
            
            var predictionsSubmitted = 0;
            let predictionsSubmittedStars = 0;
            let gameResults = 0;
            // predictions.forEach((prediction) => {
            //     //console.log('prediction: ', prediction)
            // })
            games.map(function(game) {
                //console.log('game.gameId: ', game.gameId)
                var gamePredictionFilter = predictions.filter(function(prediction) {
                    return prediction.gameId === game.gameId
                });
                (game.results) ? gameResults++ : null
                //console.log('gamePredictionFilter: ', gamePredictionFilter.length)
                if(gamePredictionFilter.length > 0) {
                    var gamePrediction = {};
                    if (gamePredictionFilter[0].userId === event.userId) {
                        gamePrediction = gamePredictionFilter[0];
                    } else if (gamePredictionFilter[1] && gamePredictionFilter[1].userId === event.userId) {
                        gamePrediction = gamePredictionFilter[1];
                    }
                    //console.log("gamePrediction: ", gamePrediction)
                    //if (gamePrediction) {
                    var gamePredictionCompare = {};
                    var prediction = {
                        awayTeam: {
                            score: gamePrediction.awayTeam.score
                        },
                        homeTeam: {
                            score: gamePrediction.homeTeam.score
                        },
                        total: gamePrediction.total,
                        spread: gamePrediction.spread,
                        results: gamePrediction.results,
                        odds: gamePrediction.odds,
                        predictionScore: gamePrediction.predictionScore
                    };
                    if (gamePrediction.stars) {
                        prediction.stars = {
                            spread: gamePrediction.stars.spread,
                            total: gamePrediction.stars.total
                        }
                        if (gamePrediction.stars.spread > 0 || gamePrediction.stars.total > 0) {
                            predictionsSubmittedStars++;
                        }
                    }
                    if (gamePrediction.awayTeam.periods) {
                        prediction.awayTeam.periods = gamePrediction.awayTeam.periods;
                    }
                    if (gamePrediction.homeTeam.periods) {
                        prediction.homeTeam.periods = gamePrediction.homeTeam.periods;
                    }
                    game.prediction = prediction;
                    game.predictionSubmitted = true;
                    predictionsSubmitted++;
                    if (gamePredictionFilter.length > 1) {
                        if (gamePredictionFilter[1].userId === event.compareUsername) {
                            gamePredictionCompare = gamePredictionFilter[1];
                        } else {
                            gamePredictionCompare = gamePredictionFilter[0];
                        }
                        var comparePrediction = {
                            awayTeam: {
                                score: ""
                            },
                            homeTeam: {
                                score: ""
                            },
                            total: "",
                            spread: ""
                        }
                        if (game.status !== "notStarted") {
                            comparePrediction = {
                                preferred_username: gamePredictionCompare.preferred_username,
                                awayTeam: {
                                    score: gamePredictionCompare.awayTeam.score
                                },
                                homeTeam: {
                                    score: gamePredictionCompare.homeTeam.score
                                },
                                total: gamePredictionCompare.total,
                                spread: gamePredictionCompare.spread,
                                results: gamePredictionCompare.results,
                                predictionScore: gamePredictionCompare.predictionScore
                            };
                        }
                        game.comparePrediction = comparePrediction;
                    }
                } else {
                    game.predictionSubmitted = false;
                    if (!game.results) {
                        game.crowd = {
                            awayTeam: {
                                score: ''
                            },
                            homeTeam: {
                                score: ''
                            },
                            total: '',
                            spread: ''
                        };
                    }
                }
                if (event.userId) {
                    game.userAuthenticated = true;
                    if (event.sport === 'ncaaf') {
                        //adding premium college user detail to game
                        //in order to present crowd data to the crowd
                        if (event.collegeBowlPremium === '1') {
                            game.collegeBowlPremium = true;
                        } else {
                            game.collegeBowlPremium = false;
                        }
                    }
                }
                if (event.sport === 'ncaaf' && parseInt(event.collegeBowlPremium) !== 1 && !game.results) {
                    game.crowd = false
                }
            });
            
            // sorting to bring games without prediction above predicted

            // function compareObject(obj1, obj2){
            //     if(obj1.predictionSubmitted > obj2.predictionSubmitted)
            //         return 1;
            //     if(obj2.predictionSubmitted > obj1.predictionSubmitted)
            //         return - 1;
            
            //     // obj1.predictionSubmitted == obj2.predictionSubmitted
            
            //     if(obj1.startDateTime > obj2.startDateTime)
            //         return 1;
            //     if(obj2.startDateTime > obj1.startDateTime)
            //         return -1;
                    
            //         // obj1.startDateTime == obj2.startDateTime
            
            //     if(obj1.gameId > obj2.gameId)
            //         return -1;
            //     if(obj2.gameId > obj1.gameId)
            //         return 1;
            
            //     return 0;
            // }
            
            // games.sort(compareObject);
            console.log('games: ', games)

            context.done(null, {games, predictionsSubmitted, predictionsSubmittedStars, gameResults, comparePredictions});
    } catch (err) {
        console.log('getGames err: ', err)
        context.fail({ status: 500, message: err})
    }
};
