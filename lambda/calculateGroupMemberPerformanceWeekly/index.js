'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert");
    
    const AWS = require('aws-sdk');
    const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });

const MONGO_URL = 'mongodb://${username}:${password}@ds011775.mlab.com:11775/pcsm';

// console.log('Loading function');
function getWinnerLoser(game, gamePrediction) {
    gamePrediction.results.winner = {};
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
        predictionWinner = game.awayTeam.code;
    } else if (gamePrediction.awayTeam.score < gamePrediction.homeTeam.score) {
        predictionWinner = game.homeTeam.code;
    } else if (gamePrediction.awayTeam.score === gamePrediction.homeTeam.score) {
        predictionWinner = "N/A";
    }

    //console.log("gameWinner: ", gameWinner, " predictionWinner: ", predictionWinner);

    //Match gameWinner to predictionWinner and update prediction with results
    if (gameWinner === predictionWinner) {
        // console.log("winner! - correct straight up pick")
        gamePrediction.results.winner.correct = 1;
        gamePrediction.results.winner.push = 0;
        gamePrediction.predictionScore += 2;
    } else {
        // console.log("sad trombone - incorrect straight up pick")
        gamePrediction.results.winner.correct = 0;
        gamePrediction.results.winner.push = 0;
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
    gamePrediction.results.spread = {};
    var gameSpread = game.results.awayTeam.score - game.results.homeTeam.score;
    var predictedSpread = gamePrediction.awayTeam.score - gamePrediction.homeTeam.score;
    
    //predicted underdog
    if (((gameSpread) > gameOdds.spread) && ((predictedSpread) > gameOdds.spread)) {
        // console.log("winner! - correct spread pick")
        gamePrediction.results.spread.correct = 1;
        gamePrediction.results.spread.push = 0;
        gamePrediction.predictionScore += 2;
    } else if (((gameSpread) < gameOdds.spread) && ((predictedSpread) < gameOdds.spread)) {
    //predicted favorite
        // console.log("winner! - correct spread pick")
        gamePrediction.results.spread.correct = 1;
        gamePrediction.results.spread.push = 0
        gamePrediction.predictionScore += 2;
    } else if (gameSpread === gameOdds.spread) {
        // console.log("push - everyone wins!")
        gamePrediction.results.spread.correct = 0;
        gamePrediction.results.spread.push = 1;
    } else {
        // console.log("sad trombone - incorrect spread pick")
        gamePrediction.results.spread.correct = 0;
        gamePrediction.results.spread.push = 0;
    }
    if (gameSpread === predictedSpread) {
        gamePrediction.predictionScore += 1;
    }
    return gamePrediction;
}
function getTotalResult(game, gameOdds, gamePrediction) {
    gamePrediction.results.total = {};
    //predicted over
    if (game.results.total === gameOdds.total) {
        // console.log("push - everyone wins!")
        gamePrediction.results.total.correct = 0;
        gamePrediction.results.total.push = 1;
    } else if ((game.results.total > gameOdds.total) && (gamePrediction.total > gameOdds.total)) {
        gamePrediction.results.total.correct = 1;
        gamePrediction.results.total.push = 0;
        gamePrediction.predictionScore += 2;
    } else if ((game.results.total < gameOdds.total) && (gamePrediction.total < gameOdds.total)) {
    //predicted under
        // console.log("totalWinner! - under");
        gamePrediction.results.total.correct = 1;
        gamePrediction.results.total.push = 0;
        gamePrediction.predictionScore += 2;
    } else {
        // console.log("sad trombone - incorrect total pick")
        gamePrediction.results.total.correct = 0;
        gamePrediction.results.total.push = 0;
    }
    if (game.results.total === gamePrediction.total) {
        gamePrediction.predictionScore += 1;
    }
    return gamePrediction;
}

// get all groups
// for each group, aggregate predictions for each user where:
//  group id is present in the prediction groups
// username is present in the group's users
// group by user name and gameweek
// write to userResults.weekly
exports.handler = (event, context) => {
    
    
    mongo.connect(MONGO_URL, function (err, db) {
        assert.equal(null, err);
        if(err) {
            context.done(err, null);
        }

        //updates each prediction with results
        function updatePrediction(existingObjQuery, updatedGroup) {
            db.collection('groups').update(existingObjQuery, updatedGroup, {upsert: true}, function (err, dbRes) {
                    var respObj = JSON.parse(dbRes);
                    // console.log("updated group response: ", respObj)
                        var result = {
                            message: '',
                            succeeded: true
                        };
    
                    assert.equal(err, null);
                    assert.equal(respObj.ok, 1);
    
                    if (err) {
                        result.message = err;
                        result.succeeded = false;
                        // console.log("update error: ", err)
                        return context.fail(JSON.stringify(result));
                    }
    
                    result.data = updatedGroup;
                    result.message = 'Results saved';
                    // console.log("result: ", result);
                    return context.done(null, result);
                });
        }


        var winnersCorrect = 0;
        var totalCorrect = 0;
        var predictionScore = 0;
        var collection = db.collection('games');
        console.log({year:year, season: season, gameWeek: gameWeek, gameId: gameId})
        let criteria = {year:year, season: season, results: {$exists: true}}
        if (gameWeek) {
            criteria.gameWeek = gameWeek
        }
        if (gameId) {
            criteria.gameId = gameId
        }
        collection.find(criteria, {_id: false}).toArray(function(err, games) {
            assert.equal(err, null);
            if(err) {
                context.done(err, null);
            }
            games.sort(function(a,b) {
                if (a.gameId > b.gameId) return 1
                if (a.gameId < b.gameId) return -1
            })
            // Get Groups
            db.collection('groups').find({year:2019, sport: sport }).toArray(function (err, groups) {
                // console.log("predictions.length: ", predictions);
                assert.equal(err, null);
                if (err) {
                    context.fail(err, null);
                }
                if (!groups || groups.length === 0) {
                    context.done(null, { message: 'FAIL', message: 'No groups found'})
                }
                var queryPromises = [];
                var groupsLength = groups.length;
                groups.forEach(function(groupInfo, index) {
                    
                    //console.log("groupInfo.predictions: ", groupInfo.predictions)
                    //console.log("groupInfo.predictions.length: ", groupInfo.predictions.length)
                    if (groupInfo.predictions && groupInfo.predictions.length > 0) {
                        groupInfo.predictions.forEach(function(item, index) {
                            
                            //console.log("item: ", item);
                            var prediction = item;
                            var gamePredictionFilter = games.filter(function(game) {
                                return game.gameId === prediction.gameId && game.year === prediction.year && game.results
                            });
                            var game = gamePredictionFilter[0];
                            
                            // console.log("game: ", game);
                            // console.log("game.results:", game.results);
                            // console.log("game.startDateTime: ", game.startDateTime);
                            if(game && Date.parse(game.startDateTime) < Date.now()) {
                                    
                                    //console.log("gamePrediction: ",gamePrediction);
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
                                    prediction.predictionScore = 0;
                                    prediction.results = {}
                                    var straightUpResults = getWinnerLoser(game, prediction);
                                    var spreadResult = getSpread(game, game.odds, prediction);
                                    var totalResult = getTotalResult(game, game.odds, prediction);
                                    
                                    var criteria = {
                                        groupId: groupInfo.groupId,
                                        year: groupInfo.year,
                                        sport: groupInfo.sport,
                                        predictions: { $elemMatch: { gameId: prediction.gameId, year: prediction.year } }
                                    };
                                    console.log({criteria: JSON.stringify(criteria)})
                                    //var existingObjQuery = {groupId: groupInfo.groupId, sport: groupInfo.sport, year: groupInfo.year};
                                    //var gameIndex = groupInfo.predictions.findIndex(o => o.gameId === prediction.gameId);
                                    
                                    //groupInfo.predictions[gameIndex] = prediction;
                                    var update = {
                                        $set: {
                                            "predictions.$.results": {
                                                winner: prediction.results.winner,
                                                spread: prediction.results.spread,
                                                total: prediction.results.total,
                                                predictionScore: prediction.predictionScore
                                            }
                                        }
                                    }
                                    //console.log("gamePrediction: " + JSON.stringify(prediction));
                                    //console.log("groupInfo.predictions: ", groupInfo.predictions)
                                    
                                    //update prediction with results for userId and gameId combo
                                    //console.log("update: ", JSON.stringify(update))
                                    //updatePrediction(criteria, update);
                                    queryPromises.push(db.collection('groups').updateOne(criteria, update));
                    
                            } else {
                                // console.log("No matched prediction");
                            }
                        })
                            
                    } else {
                        //console.log("no predictions for ", groupInfo.groupName)
                    }
                    console.log({index, groupsLength: groups.length})
                    if (index === (groups.length - 1)) {
                        console.log({queryPromises: Promise.all(queryPromises)})
                        Promise.all(queryPromises)
                        .then((response) => {
                            console.log({promiseResponse: response})
                        // var message = `{ gameId: ${result._id}, year: ${_.year}, awayAvg: ${awayAvg}, homeAvg: ${homeAvg}, totalAvg: ${totalAvg}, spreadAvg: ${spreadAvg} }`
                            var calculateIndividualCrowdPerformanceParams = {
                                  FunctionName: 'calculateIndividualCrowdPerformance', // the lambda function we are going to invoke
                                  InvocationType: 'Event',
                                  LogType: 'None',
                                  Payload: `{ "message": "calculateGroupPerformance completed", "sport": "${sport}", "year": ${year}, "season": "${season}", "gameId": ${gameId}, "gameWeek": ${gameWeek}}`
                                };
                              // 
                            lambda.invoke(calculateIndividualCrowdPerformanceParams, function(err, data) {
                             if (err) {
                                console.log("calculateIndividualCrowdPerformance err: ", err);
                                context.done(err, null);
                              } else {
                                console.log('calculateIndividualCrowdPerformance response: ', data.Payload);
                                
                                context.done(null, "groups updated: ", response);
                              }
                            });
                        }).catch(promiseRejection => {
                            console.log({promiseRejection})
                            context.fail(promiseRejection, null)
                        });
                    }
                });
                
                
                //context.done(null, groups);
                
            });
            
        });
    });
};
