'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    {username, password} = require('./config');


const MongoClient = require('mongodb').MongoClient;
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
        _id: false
    }
    var predictionsCollectionName = 'predictions';
    
    if (event.sport === 'ncaaf') {
        gamesCollectionName = 'games-ncaaf';
        predictionsCollectionName = 'predictions-ncaaf';
    } else if (event.sport === 'ncaam') {
        gamesCollectionName = 'games-ncaam';
        predictionsCollectionName = 'predictions-ncaam';
    } else {
        event.sport = 'nfl';
    }
    const collection = db.collection(gamesCollectionName);
    const predictionsCollection = db.collection(predictionsCollectionName);
    var comparePredictions = false;
    
    var gamesQuery = {
            "year": parseInt(event.year),
            "gameWeek": parseInt(event.gameWeek),
            "season": season,
            "sport": event.sport
    }
    if (sport === "ncaaf") {
        gamesQuery = {
            "year": parseInt(event.year),
            "gameWeek": parseInt(event.gameWeek),
            "season": season,
            "sport": event.sport,
            "$or": [
                {'homeTeam.rank': {$gt: 0}},
                {'awayTeam.rank': {$gt: 0}}
            ]
        }
    }
    // need to come back and clean this up
    event.season ? gamesQuery.season = event.season : null;
    if (event.sport === 'ncaam') {
        gamesQuery = {
            "year": parseInt(event.year),
            "sport": event.sport,
            "gameWeek": { $gt: 12 },
            "status": { $ne: "n/a" }
        }
    }
    if (event.compareUsername) {
        comparePredictions = true;
        gamesQuery.results= { $exists: true };
    }
    //console.log('gamesQuery: ', gamesQuery)
    const gamesArray = await collection.find(gamesQuery, gamesProjection, {sort: {"startDateTime": 1 }}).toArray()
        console.log('gamesArray.length: ', gamesArray.length)
        
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
        var preferred_usernames = [preferred_username];
        var predictionsQuery = { 
            "year": parseInt(event.year),
            "season": season,
            "gameWeek": parseInt(event.gameWeek),
            "preferred_username": { $in: preferred_usernames}
        }
        games.map((game) => {
                if (game.weather) {
                    let gameWeather = {...game.weather}
                    gameWeather.temp = Math.round((game.weather.temp * 1.8) - 459.67)
                    game.weather = gameWeather
                    // console.log({weather: game.weather.temp})
                }
        })
        
        if (event.sport === 'ncaam') {
            predictionsQuery = {
                "year": parseInt(event.year),
                "gameWeek": { $gt: 12 },
                "preferred_usernames": { $in: preferred_usernames}
            }
        }
        if (event.compareUsername) {
            preferred_usernames.push(event.compareUsername);
            comparePredictions = true;
            predictionsQuery.results = { $exists: true }
        }
        if (!preferred_username) {
            console.log('No username')
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
