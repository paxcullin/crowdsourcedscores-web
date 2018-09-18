'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert");

const MONGO_URL = 'mongodb://pcsm-user:*dZ2HaWN@ds011775.mlab.com:11775/pcsm';

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
            winner: 1
        };
        gamePrediction.predictionScore += 2;
    } else {
        // console.log("sad trombone - incorrect straight up pick")
        gamePrediction.results = {
            winner: 0
        };
    }
    if (gamePrediction.awayTeam.score === game.results.awayTeam.score) {
        gamePrediction.predictionScore += 1;
    }
    if (gamePrediction.homeTeam.score === game.results.homeTeam.score) {
        gamePrediction.predictionScore += 1;
    }
    //gamePrediction.predictionScore = predictionScore;
    
    return gamePrediction;
    
}
function getSpread(game, gameOdds, gamePrediction) {
    var gameSpread = game.results.awayTeam.score - game.results.homeTeam.score;
    var predictedSpread = gamePrediction.awayTeam.score - gamePrediction.homeTeam.score;
    
    //predicted underdog
    if (((gameSpread) > gameOdds.spread) && ((predictedSpread) > gameOdds.spread)) {
        // console.log("winner! - correct spread pick")
        gamePrediction.results.spread = 1;
        gamePrediction.predictionScore += 2;
        
    } else if (((gameSpread) < gameOdds.spread) && ((predictedSpread) < gameOdds.spread)) {
    //predicted favorite
        // console.log("winner! - correct spread pick")
        gamePrediction.results.spread = 1;
        gamePrediction.predictionScore += 2;
    } else {
        // console.log("sad trombone - incorrect spread pick")
        gamePrediction.results.spread = 0;
    }
    if (gameSpread === predictedSpread) {
        gamePrediction.predictionScore += 1;
    }
    return gamePrediction;
}
function getTotalResult(game, gameOdds, gamePrediction) {
    
    //predicted over
    if ((game.results.total > gameOdds.total) && (gamePrediction.total > gameOdds.total)) {
        gamePrediction.results.total = 1;
        gamePrediction.predictionScore += 2;
    } else if ((game.results.total < gameOdds.total) && (gamePrediction.total < gameOdds.total)) {
    //predicted under
        // console.log("totalWinner! - under");
        gamePrediction.results.total = 1;
        gamePrediction.predictionScore += 2;
    } else {
        // console.log("sad trombone - incorrect total pick")
        gamePrediction.results.total = 0;
    }
    if (game.results.total === gamePrediction.total) {
        gamePrediction.predictionScore += 1;
    }
    return gamePrediction;
}


exports.handler = (event, context) => {
    // console.log('Received event:', JSON.stringify(event, null, 2));

    mongo.connect(MONGO_URL, function (err, db) {
        assert.equal(null, err);
        if(err) {
            context.done(err, null);
        }

        //updates each prediction with results
        function updatePrediction(existingObjQuery, gamePrediction) {
            db.collection('predictions').update(existingObjQuery, gamePrediction, {upsert: true}, function (err, dbRes) {
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
                    // console.log("result: ", result);
                    return context.done(null, result);
                });
        }


        var winnersCorrect = 0;
        var totalCorrect = 0;
        var predictionScore = 0;
        var collection = db.collection('games');
        collection.find({year:2018, results: {$exists: true}}, {_id: false}).toArray(function(err, games) {
            assert.equal(err, null);
            if(err) {
                context.done(err, null);
            }
            
            db.collection('predictions').find({year:2018, predictionScore: {$exists:false}}, {_id: false}).toArray(function (err, predictions) {
                // console.log("predictions.length: ", predictions);
                assert.equal(err, null);
                if (err) {
                    context.fail(err, null);
                }

                games.map(function(game) {

                    var gamePredictionFilter = predictions.filter(function(prediction) {
                        return game.gameId === prediction.gameId && game.year === prediction.year && game.results
                    });
                    
                    //console.log("gamePredictionFilter: ", gamePredictionFilter);
                    // console.log("game.results:", game.results);
                    // console.log("game.startDateTime: ", game.startDateTime);
                    if(gamePredictionFilter.length > 0 && game.results && Date.parse(game.startDateTime) < Date.now()) {
                        for (var i=0;i < gamePredictionFilter.length; i++) {
                            var gamePrediction = gamePredictionFilter[i];
                            
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
                            var straightUpResults = getWinnerLoser(game, gamePrediction);
                            var spreadResult = getSpread(game, game.odds,gamePrediction);
                            var totalResult = getTotalResult(game, game.odds,gamePrediction);
                            var existingObjQuery = {userId: gamePrediction.userId, gameId: gamePrediction.gameId, year: gamePrediction.year, gameWeek: gamePrediction.gameWeek};
                            //console.log("existingObjQuery: " + JSON.stringify(existingObjQuery));
                            //update prediction with results for userId and gameId combo
                            updatePrediction(existingObjQuery, gamePrediction);
                        }
                    } else {
                        // console.log("No matched prediction");
                    }

                });
                // console.log("winners: ", winnersCorrect);
                
                context.done(null, games);
            });
            
        });
    });
};
