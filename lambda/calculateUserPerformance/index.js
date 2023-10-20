'use strict';

const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda"); // ES Modules import

var assert = require("assert"),
    mongo = require("mongodb").MongoClient,
    {config} = require('config'),
    lambda = new LambdaClient({region: 'us-west-2'});
    

    const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

function calculatePercentage(totalCorrect, totalPushes, totalGames) {
    var percentage = totalCorrect / (totalGames - totalPushes);
    return percentage;
}

// console.log('Loading function');
function getWinnerLoser(game, gamePrediction) {
    var gameWinner, predictionWinner;
    // get winner of each game
    if (game.results.awayTeam.score > game.results.homeTeam.score) {
        gameWinner = game.awayTeam.code;
    } else if (game.results.awayTeam.score < game.results.homeTeam.score) {
        gameWinner = game.homeTeam.code;
    } else {
        gameWinner = "N/A";
    }
    
    //get predicted winner of each game
    if (gamePrediction.awayTeam.score > gamePrediction.homeTeam.score) {
        predictionWinner = gamePrediction.awayTeam.code;
    } else if (gamePrediction.awayTeam.score < gamePrediction.homeTeam.score) {
        predictionWinner = gamePrediction.homeTeam.code;
    } else {
        predictionWinner = "N/A";
    }

    //Match gameWinner to predictionWinner and update prediction with results
    if (gameWinner === predictionWinner) {
        // console.log("winner! - correct straight up pick")
        gamePrediction.results = {
            winner: {
                correct: 1,
                push: 0,
                bullseyes: 0
            }
        };
        gamePrediction.predictionScore += 2;
    } else {
        // console.log("sad trombone - incorrect straight up pick")
        gamePrediction.results = {
            winner: {
                correct: 0,
                push: 0,
                bullseyes: 0
            }
        };
    }
    if (gamePrediction.awayTeam.score === game.results.awayTeam.score) {
        gamePrediction.predictionScore += 1;
        gamePrediction.results.winner.bullseyes += 1;
    }
    if (gamePrediction.homeTeam.score === game.results.homeTeam.score) {
        gamePrediction.predictionScore += 1;
        gamePrediction.results.winner.bullseyes += 1;
    }
    //gamePrediction.predictionScore = predictionScore;
    
    if (game.results.homeTeam.periods && gamePrediction.homeTeam.periods) {
        const homeTeamKeys = Object.keys(gamePrediction.homeTeam.periods);
        console.log('homeTeamKeys: ', homeTeamKeys)
        homeTeamKeys.forEach((key, index) => {
            if (gamePrediction.homeTeam.periods[key] === game.results.homeTeam.periods[key]) {
                gamePrediction.predictionScore += 1;
            }
        })
    }
    if (game.results.awayTeam.periods && gamePrediction.awayTeam.periods) {
        const awayTeamKeys = Object.keys(gamePrediction.awayTeam.periods);
        console.log('awayTeamKeys: ', awayTeamKeys)
        awayTeamKeys.forEach((key, index) => {
            if (gamePrediction.awayTeam.periods[key] === game.results.awayTeam.periods[key]) {
                gamePrediction.predictionScore += 1;
            }
        })
    }
    
    return gamePrediction;
    
}
function getSpread(game, gameOdds, gamePrediction) {
    var gameSpread = game.results.awayTeam.score - game.results.homeTeam.score;
    var predictedSpread = gamePrediction.awayTeam.score - gamePrediction.homeTeam.score;
    var spread = {
        correct: 0,
        push: 0,
        bullseyes: 0,
        stars: {
            wagered: 0,
            net: 0
        }
    }
    
    //predicted underdog
    if (((gameSpread) > gameOdds.spread) && ((predictedSpread) > gameOdds.spread)) {
        // console.log("winner! - correct spread pick")
        spread = {
            correct: 1,
            push: 0,
            bullseyes: 0,
            stars: {
                wagered: gamePrediction.stars ? gamePrediction.stars.spread : 0,
                net: gamePrediction.stars ? gamePrediction.stars.spread : 0
            }
        };
        gamePrediction.predictionScore += 2;
    } else if (((gameSpread) < gameOdds.spread) && ((predictedSpread) < gameOdds.spread)) {
    //predicted favorite
        // console.log("winner! - correct spread pick")
        spread = {
            correct: 1,
            push: 0,
            bullseyes: 0,
            stars: {
                wagered: gamePrediction.stars ? gamePrediction.stars.spread : 0,
                net: gamePrediction.stars ? gamePrediction.stars.spread : 0
            }
        };
        gamePrediction.predictionScore += 2;
    } else if (gameSpread === gameOdds.spread) {
        // console.log("spread push")
        spread = {
            correct: 0,
            push: 1,
            bullseyes: 0,
            stars: {
                wagered: gamePrediction.stars ? gamePrediction.stars.spread : 0,
                net: 0
            }
        };
    } else {
        // console.log("sad trombone - incorrect spread pick")
        spread = {
            correct: 0,
            push: 0,
            bullseyes: 0,
            stars: {
                wagered: gamePrediction.stars ? gamePrediction.stars.spread : 0,
                net: gamePrediction.stars ? (gamePrediction.stars.spread * -1) : 0
            }
        };
    }
    gamePrediction.results.spread = spread;
    if (gameSpread === predictedSpread) {
        gamePrediction.predictionScore += 1;
        gamePrediction.results.spread.bullseyes = 1;
    }
    return gamePrediction;
}
function getTotalResult(game, gameOdds, gamePrediction) {
    var total = {
        correct: 0,
        push: 0,
        bullseyes: 0,
        stars: {
            wagered: 0,
            net: 0
        }
    };
    //predicted over
    if ((game.results.total > gameOdds.total) && (gamePrediction.total > gameOdds.total)) {
        total = {
            correct: 1,
            push: 0,
            bullseyes: 0,
            stars: {
                wagered: gamePrediction.stars ? gamePrediction.stars.total : 0,
                net: gamePrediction.stars ? gamePrediction.stars.total : 0
            }   
        };
        gamePrediction.predictionScore += 2;
    } else if ((game.results.total < gameOdds.total) && (gamePrediction.total < gameOdds.total)) {
    //predicted under
        // console.log("totalWinner! - under");
        total = {
            correct: 1,
            push: 0,
            bullseyes: 0,
            stars: {
                wagered: gamePrediction.stars ? gamePrediction.stars.total : 0,
                net: gamePrediction.stars ? gamePrediction.stars.total : 0
            }
        };
        gamePrediction.predictionScore += 2;
    } else if (game.results.total === gameOdds.total) {
        // console.log("push on total")
        total = {
            correct: 0,
            push: 1,
            bullseyes: 0,
            stars: {
                wagered: gamePrediction.stars ? gamePrediction.stars.total : 0,
                net: 0
            }
        };
    } else {
        // console.log("incorrect total pick")
        total = {
            correct: 0,
            push: 0,
            bullseyes: 0,
            stars: {
                wagered: gamePrediction.stars ? gamePrediction.stars.total : 0,
                net: gamePrediction.stars ? (gamePrediction.stars.total * -1) : 0
            }
        };
    }
    gamePrediction.results.total = total;
    if (game.results.total === gamePrediction.total) {
        gamePrediction.predictionScore += 1;
        gamePrediction.results.total.bullseyes = 1;
    }
    console.log({total})
    return gamePrediction;
}


exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    try {
        var record = ""
        if (event.Records) {
            record = event.Records[0];
        }
        var eventGameId, eventGameWeek, eventSport, eventSeason, eventYear;
        var gamesCollection = 'games';
        var predictionsCollection = 'predictions';
        var gameQuery = {year:2018, results: {$exists: true}}
        var predictionQuery = { year: 2018, predictionScore: { $exists: false } };
        if (record.Sns.MessageAttributes.userId) {
            predictionQuery.userId = record.Sns.MessageAttributes.userId;
        }
        
        if (record != "") {
            eventGameId = parseInt(record.Sns.MessageAttributes.gameId.Value);
            eventGameWeek = parseInt(record.Sns.MessageAttributes.gameWeek.Value);
            eventSport = record.Sns.MessageAttributes.sport.Value;
            eventSeason = record.Sns.MessageAttributes.season.Value;
            eventYear = parseInt(record.Sns.MessageAttributes.year.Value);
            if (eventSport === 'ncaaf') {
                gamesCollection = 'games-ncaaf';
                predictionsCollection = 'predictions-ncaaf';
            } else if (eventSport === 'ncaam') {
                gamesCollection = 'games-ncaam'
                predictionsCollection = 'predictions-ncaam'
            }
            gameQuery = {year:eventYear, sport: eventSport, gameId: eventGameId, gameWeek: eventGameWeek, results: {$exists: true}}
        }
        //console.log("gameQuery: ", gameQuery)

        const client = await mongo.connect(MONGO_URL);

        const db = client.db('pcsm');

        //updates each prediction with results
        function updatePrediction(existingObjQuery, gamePrediction) {
            db.collection(predictionsCollection).update(existingObjQuery,
                gamePrediction, {upsert: true},
                function (err, dbRes) {
                    var respObj = JSON.parse(dbRes);
                        var result = {
                            message: '',
                            succeeded: true
                        };
    
                    assert.equal(err, null);
                    assert.equal(respObj.ok, 1);
    
                    if (err) {
                        result.message = err;
                        result.succeeded = false;
                        return context.fail(JSON.stringify(result));
                    }
    
                    result.data = gamePrediction;
                    result.message = 'Results saved';
                    console.log("result: ", result);
                    //return context.done(null, result);
                });
        }


        var winnersCorrect = 0;
        var totalCorrect = 0;
        var predictionScore = 0;
        var collection = db.collection(gamesCollection);
        var queryPromises = [];
        const games = await collection.find(gameQuery, {_id: false}).toArray();
        
        games.forEach(async function(game, gameIndex) {
            //console.log("game: ", game)
            predictionQuery = {
                year:game.year,
                sport: game.sport,
                gameId: game.gameId,
                gameWeek: game.gameWeek
            }
            //, predictionScore: {$exists: false}
            //console.log("predictionQuery: ", predictionQuery)
            //console.log('predictionsCollection: ', predictionsCollection)
            const predictions = await db.collection(predictionsCollection).find(predictionQuery, {_id: false}).toArray()
            var predictionsArray = predictions.length;
            if (predictions.length === 0) {
                console.log("No predictions found for this predictionQuery: " + JSON.stringify(predictionQuery))
                context.done(null, {message: "No predictions found for this predictionQuery"})
            }
            //console.log("predictions.length: ", predictions);
            
            predictions.forEach(function(gamePrediction, predictionIndex) {
                console.log("predictionIndex: ", predictionIndex)

                // var gamePredictionFilter = predictions.filter(function(prediction) {
                //     return game.gameId === prediction.gameId && game.year === prediction.year && game.results
                // });
                
                //console.log("gamePredictionFilter: ", gamePredictionFilter);
                // console.log("game.results:", game.results);
                // console.log("game.startDateTime: ", game.startDateTime);
                // if(gamePredictionFilter.length > 0 && game.results && Date.parse(game.startDateTime) < Date.now()) {
                //     for (var i=0;i < gamePredictionFilter.length; i++) {
                //         var gamePrediction = gamePredictionFilter[i];
                        
                        // console.log("gamePrediction: ",gamePrediction);
                        // var gameResultsObj = {};
                        // var gameSpreadResult, gameTotalOU;
                        // gameResultsObj = getWinnerLoser(game.awayTeam.code, game.homeTeam.code, game.results);
                        // //console.log("gameResultsObj: ", gameResultsObj);
                        // var predictionResultsObj = {};
                        // var predictionResultsScores = {
                        //     awayTeam: {
                        //         score: gamePrediction.awayTeam.score
                        //     },
                        //     homeTeam: {
                        //         score: gamePrediction.homeTeam.score
                        //     }
                        // };
                        
                        // predictionResultsObj = getWinnerLoser(gamePrediction.awayTeam.code, gamePrediction.homeTeam.code, predictionResultsScores)
                gamePrediction.predictionScore = 0;
                const { odds } = gamePrediction && gamePrediction.odds ? gamePrediction : game
                console.log({ odds, gamePrediction: gamePrediction && gamePrediction.odds ? gamePrediction.odds : null, gameOdds: game.odds });
                var straightUpResults = getWinnerLoser(game, gamePrediction);
                var spreadResult = getSpread(game, odds,gamePrediction);
                var totalResult = getTotalResult(game, odds,gamePrediction);
                var existingObjQuery = {userId: gamePrediction.userId, gameId: gamePrediction.gameId, year: gamePrediction.year, gameWeek: gamePrediction.gameWeek};
                console.log("existingObjQuery: " + JSON.stringify(existingObjQuery));
                //update prediction with results for userId and gameId combo
                queryPromises.push(db.collection(predictionsCollection).update(existingObjQuery,
                    gamePrediction, {upsert: true}));
            });
            console.log("gameIndex: ", gameIndex)
            if (games.length !== 1 && (gameIndex+1) === games.length) {
                var calculateIndividualUserPerformanceWeeklyParams = new InvokeCommand({
                    FunctionName: 'calculateIndividualUserPerformanceWeekly', // the lambda function we are going to invoke
                    InvocationType: 'Event',
                    LogType: 'None',
                    Payload: `{ "message": "calculateUserPerformance completed", "sport": "${eventSport}", "gameWeek": ${eventGameWeek}, "season": ${eventSeason}, "year": ${eventYear} }`
                }, function(err, data) {
                    if (err) {
                        console.log("calculateIndividualUserPerformanceWeekly err: ", err);
                    } else {
                        console.log('calculateIndividualUserPerformanceWeekly2 response: ', data.Payload);
                        
                        
                        context.done(null, games);
                    }
                    });
                const lambdainvoke = await lambda.send(calculateIndividualUserPerformanceWeeklyParams)
            }
        });
    } catch (err) {
        console.log('error: ', err);
        context.fail({message: err}, null);
    }
};
