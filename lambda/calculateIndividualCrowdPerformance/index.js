'use strict';

var assert = require("assert"),
    _ = require("lodash"),
    Promise = require("bluebird"),
    mongo = Promise.promisifyAll(require("mongodb"));

const MONGO_URL = 'mongodb://${username}:${password}@ds011775.mlab.com:11775/pcsm';

function calculatePercentage(totalCorrect, totalPushes, totalGames) {
    var percentage = totalCorrect / (totalGames - totalPushes);
    return percentage;
}

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    mongo.connect(MONGO_URL, function (err, db) {
        if (err) {
            console.log(err);
            return context.fail(err, null);
        }
        var updateOverall = {};
        var queryPromises = [];
        db.collection('groups').find({"year":2018}).toArray(function (err, groups) {
            
            var groupsLength = groups.length;
            assert.equal(err, null);
            if (err) {
                console.log(err);
                return context.fail(err, null);
            }
            
            _.each(groups, function (group) {
                
                var aggOpts = [
                    {
                        $unwind: "$predictions"
                    },
                    {
                        $match: {
                            "groupId": group.groupId
                        }
                    },
                    {
                        $group: {
                            _id: { groupId: "$groupId", gameWeek: "$predictions.gameWeek" }, /*, gameId: "$predictions.gameId" */
                            suCorrect: {$sum: "$predictions.results.winner.correct"},
                            suPush: {$sum: "$predictions.results.winner.push"},
                            atsCorrect: {$sum: "$predictions.results.spread.correct"},
                            atsPush: {$sum: "$predictions.results.spread.push"},
                            totalCorrect: {$sum: "$predictions.results.total.correct"},
                            totalPush: {$sum: "$predictions.results.total.push"},
                            predictionScore: {$sum: "$predictions.results.predictionScore"}
                            /*totalGames: {$sum: "$weekly.crowd.totalGames"}*/
                        }
                    }
                ];
                
                    
                //console.log("aggOpts: ", aggOpts);
                db.collection('groups').aggregate(aggOpts).toArray(function (err, results) {
                    if (err) {
                        context.done("agg err: ", err);
                    }
                    console.log("results: ", JSON.stringify(results));
                    var resultsArrayLength = results.length;
                    if (resultsArrayLength === 0) {
                        groupsLength--;
                    }
                    _.each(results, function(result) {
                        
                        var criteria = {
                            groupId: result._id.groupId,
                            sport: group.sport,
                            year: group.year,
                            "results.weekly": {
                                $elemMatch: { gameWeek: result._id.gameWeek } 
                            }
                        };
                        
                        var update = {
                            $set: {
                                "results.weekly.$.gameWeek": result._id.gameWeek,
                                "results.weekly.$.winner": {
                                        correct: result.suCorrect,
                                        push: result.suPush
                                    },
                                "results.weekly.$.spread": {
                                        correct: result.atsCorrect,
                                        push: result.atsPush
                                    },
                                "results.weekly.$.total": {
                                        correct: result.totalCorrect,
                                        push: result.totalPush
                                    },
                                "results.weekly.$.predictionScore": result.predictionScore
                            }
                        }
                        
                        console.log("criteria: ", criteria);
                        console.log("update: ", update);
                        db.collection('groups').updateOne(criteria, update, {upsert: true})
                            .then(function (updateResult) {
                                var updateResponse = JSON.stringify(updateResult)
                                var message = `{ update: ${JSON.stringify(updateResult)} }`
                                if (updateResult.update && updateResult.update.nModified) {
                                    message = updateResult.update.nModified
                                }
                                    
                                    console.log("result updated: ", updateResult.result.nModified);
                                    resultsArrayLength--;
                                    console.log("resultsArrayLength: ", resultsArrayLength)
                                    if (resultsArrayLength === 0) {
                                        groupsLength--;
                                        if (groupsLength === 0) {
                                            context.done(null, groups.length + "groups updated")
                                        }
                                    }
                                    return Promise.resolve(updateResult);
                            })
                            .catch(function(reject) {
                                console.log("reject: ", reject)
                                    var pushCriteria = {
                                        groupId: result._id.groupId,
                                        sport: group.sport,
                                        year: group.year
                                    };
                                    var pushUpdate = {
                                        $push: {
                                            "results.weekly": {
                                                gameWeek: result._id.gameWeek,
                                                winner: {
                                                    correct: result.suCorrect,
                                                    push: result.suPush
                                                },
                                                spread: {
                                                    correct: result.atsCorrect,
                                                    push: result.atsPush
                                                },
                                                total: {
                                                    correct: result.totalCorrect,
                                                    push: result.totalPush
                                                },
                                                predictionScore: result.predictionScore
                                            }
                                        }
                                    }
                                    db.collection('groups').updateOne(pushCriteria, pushUpdate)
                                    .then(function(updateResult2) {
                                        console.log("result added!")
                                        resultsArrayLength--;
                                        console.log("resultsArrayLength: ", updateResult2)
                                        if (resultsArrayLength === 0) {
                                            groupsLength--;
                                            if (groupsLength === 0) {
                                                context.done(null, groups.length + "groups updated")
                                            }
                                        }
                                        return Promise.resolve(updateResult2);
                                    })
                                    .catch(function(updateReject2) {
                                        console.log("updateReject2: ", updateReject2)
                                    });
                            });
                        // queryPromises.push(Promise.resolve(queryPromise));
                        // console.log("queryPromises: ", queryPromises)
                    });
                    if (resultsArrayLength === 0) {
                        groupsLength--;
                        //console.log("groupsLength: ", groupsLength)
                    }
                    // Promise.all(queryPromises).then(function(response) {
                    //     // var message = `{ gameId: ${result._id}, year: ${_.year}, awayAvg: ${awayAvg}, homeAvg: ${homeAvg}, totalAvg: ${totalAvg}, spreadAvg: ${spreadAvg} }`
                    //     //return context.done(null, "groups updated: ", response);
                    //     console.log("groups updated: ", queryPromises);
                    //     return context.done(null, "group updated");
                        
                    // })
                    
                });
                // if (group.predictions && group.predictions.length > 0) {
                //     group.predictions.sort(function(a,b) {
                //         if (a.gameWeek > b.gameWeek) return 1;
                //         if (a.gameWeek < b. gameWeek) return -1;
                //         return 0;
                //     })
                //     var gameWeek = 0;
                //     var groupResultsReset = false;
                //     for (var i=0; i < group.predictions.length; i++) {
                //         var currentPrediction = group.predictions[i];
                        
                //         if (groupResultsReset === false) {
                //             group.results = {
                //                 weekly: [],
                //                 overall: {
                //                     winner: {
                //                         correct: 0,
                //                         push: 0,
                //                         percentage: 0
                //                     },
                //                     spread: {
                //                         correct: 0,
                //                         push: 0,
                //                         percentage: 0
                //                     },
                //                     total: {
                //                         correct: 0,
                //                         push: 0,
                //                         percentage: 0
                //                     },
                //                     predictionScore: 0
                //                 }
                //             };
                //             groupResultsReset = true;
                //         }
                        
                //         var gameWeekIndex = 0;
                //             if (group.results.weekly.length > 0) {
                //                 for (var gw = 0; gw < group.results.weekly.length; gw ++) {
                //                     if (currentPrediction.gameWeek === group.results.weekly[gw].gameWeek) {
                //                         gameWeekIndex = gw;
                //                         //return;
                //                     }
                //                 }
                //             }
                //         if (!group.results.weekly[gameWeekIndex] || !group.results.weekly[gameWeekIndex].gameIds) {
                //             group.results.weekly[gameWeekIndex] = { 
                //                 gameWeek: currentPrediction.gameWeek,
                //                 winner: {
                //                     correct: 0,
                //                     push: 0,
                //                     percentage: 0
                //                 },
                //                 spread: {
                //                     correct: 0,
                //                     push: 0,
                //                     percentage: 0
                //                 },
                //                 total: {
                //                     correct: 0,
                //                     push: 0,
                //                     percentage: 0
                //                 },
                //                 predictionScore: 0,
                //                 gameIds: []
                //             }
                //         }
                //         console.log("group.results.weekly[gameWeekIndex]: ", group.results.weekly[gameWeekIndex])
                        
                //         if (currentPrediction.results && group.results.weekly[gameWeekIndex].gameIds.indexOf(currentPrediction.gameId) === -1) {
                            
                //             console.log("group.results.weekly[gameWeekIndex].gameIds: ", group.results.weekly[gameWeekIndex].gameIds);
                            
                            
                //             console.log("gameWeekIndex: ", gameWeekIndex)
                //             var currentWeekResults = group.results.weekly[gameWeekIndex];
                //             console.log("currentWeekResults:", currentWeekResults, " currentPrediction: ", currentPrediction);
                //             // if (!currentWeekResults) {
                //             //     group.results.weekly[gameWeekIndex]
                //             // }
                //                 group.results.weekly[gameWeekIndex].winner.correct += currentPrediction.results.winner.correct;
                //                 group.results.weekly[gameWeekIndex].winner.push += currentPrediction.results.winner.push;
                //                 group.results.weekly[gameWeekIndex].spread.correct += currentPrediction.results.spread.correct;
                //                 group.results.weekly[gameWeekIndex].spread.push += currentPrediction.results.spread.push;
                //                 group.results.weekly[gameWeekIndex].total.correct += currentPrediction.results.total.correct;
                //                 group.results.weekly[gameWeekIndex].total.push += currentPrediction.results.total.push;
                //                 group.results.weekly[gameWeekIndex].predictionScore += currentPrediction.predictionScore;
                //                 if (!group.results.weekly[gameWeekIndex].gameIds) { group.results.weekly[gameWeekIndex].gameIds = []; }
                //                 group.results.weekly[gameWeekIndex].gameIds.push(currentPrediction.gameId);
                //         }
                //     }
                //     console.log("group.results: ", group.results);
                    
                //     var queryPromises = [];
                //     db.collection('groups').updateOne({groupId: group.groupId, year: group.year, sport: group.sport }, group)
                //     .then(function(updateGroupResults) {
                //         console.log("updateGroupResults: ", updateGroupResults)
                //         context.done(null, updateGroupResults)
                //     //     console.log("predictionResults: ", predictionResults);
                //     //     _.each(predictionResults, function (result) {
                //     //         console.log("result: ", result);
                            
                //     //         // var correctPercentage = calculatePercentage(result.suOverallCorrect, result.suOverallPushes, overallWeek.totalOverallGames);
                //     //         // var atsPercentage = calculatePercentage(overallWeek.atsOverallCorrect, overallWeek.atsOverallPushes, overallWeek.totalOverallGames);
                //     //         // var totalPercentage = calculatePercentage(overallWeek.totalOverallCorrect, overallWeek.totalOverallPushes, overallWeek.totalOverallGames);
                            
                //     //         // updateOverall = {
                //     //         //     $set: {
                //     //         //         overall: {
                //     //         //             crowd: {
                //     //         //                 winner: {
                //     //         //                     correct: overallWeek.suOverallCorrect,
                //     //         //                     push: overallWeek.suOverallPushes,
                //     //         //                     percentage: correctPercentage
                //     //         //                 },
                //     //         //                 spread: {
                //     //         //                     correct: overallWeek.atsOverallCorrect,
                //     //         //                     push: overallWeek.atsOverallPushes,
                //     //         //                     percentage: atsPercentage
                //     //         //                 },
                //     //         //                 total: {
                //     //         //                     correct: overallWeek.totalOverallCorrect,
                //     //         //                     push: overallWeek.totalOverallPushes,
                //     //         //                     percentage: totalPercentage
                //     //         //                 },
                //     //         //                 totalGames: overallWeek.totalOverallGames
                //     //         //             }
                //     //         //         }
                //     //         //     }
                //     //         // };
                            
                //     //         // var criteria = {"year":2017, "gameWeek": week.gameWeek}
                            
                //     //         // var queryPromise = db.collection('leaderboards').updateAsync(criteria, updateOverall)
                //     //         //     .then(function (updateResult) {
                //     //         //         var message = `{ update: ${JSON.stringify(updateOverall)} }`
                //     //         //         console.log('Updated leaderboards', message);
                //     //         //         return Promise.resolve(updateResult);
                //     //         //     });
                //     //         // queryPromises.push(Promise.resolve(queryPromise));
                //     //         context.done(null, null)
                //     //     });
            
                    
                //     })
                //     .catch(function(reject) {
                //         context.done("update group reject: " + reject, null)
                //     });
                // } else {
                //     console.log("No predictions for group " + group.groupName)
                // }
                
            }); // end _.each
            
        })
    });
};