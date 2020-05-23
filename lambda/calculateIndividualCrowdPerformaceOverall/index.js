'use strict';

var assert = require("assert"),
    _ = require("lodash"),
    Promise = require("bluebird"),
    mongo = Promise.promisifyAll(require("mongodb"));

const MONGO_URL = 'mongodb://pcsm-user:*dZ2HaWN@ds011775.mlab.com:11775/pcsm';

function calculatePercentage(totalCorrect, totalPushes, totalGames) {
    var percentage = totalCorrect / (totalGames - totalPushes);
    return percentage;
}

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
        const { sport, year, season } = event;
    mongo.connect(MONGO_URL, function (err, db) {
        if (err) {
            console.log(err);
            return context.fail(err, null);
        }
        var updateOverall = {};
        var query = {"year":year, sport: sport};
        // if (event.groupId) {
        //     query = event;
        // }
        
        db.collection('groups').find(query).toArray(function (err, groups) {
            assert.equal(err, null);
            if (err) {
                console.log(err);
                return context.fail(err, null);
            }
            let groupsLength = groups.length;
            
            var queryPromises = [];
            groups.forEach((group, index) => {
                console.log({index, groupsLength})
                //console.log("group: ", group)
                // var aggOpts = [
                //     {
                //         $unwind: "$predictions"
                //     },
                //     {
                //         $group: {
                //             _id: { groupId: "$groupId", sport: "$sport", year: "$preditions.year"}, /*, gameId: "$predictions.gameId" */
                //             suCorrect: {$sum: "$predictions.results.winner"},
                //             /* suPushes: {$sum: "$predictions.results.winner"},*/
                //             atsCorrect: {$sum: "$predictions.results.spread"},
                //             /*atsCorrectPushes: {$sum: "$predictions.results.spread.push"},*/
                //             totalCorrect: {$sum: "$predictions.results.total"}/*,*/
                //             /*totalPushes: {$sum: "$predictions.results.total.push"},
                //             totalGames: {$sum: "$weekly.crowd.totalGames"}*/
                //         }
                //     }
                // ];
                // console.log("aggOpts: ", aggOpts);
                if (group.results && group.results[sport] && group.results[sport][year] && group.results[sport][year][season] && group.results[sport][year][season].weekly.length > 0) {
                    let weeklyResults = group.results[sport][year][season].weekly;
                    weeklyResults.sort(function(a,b) {
                        if (a.gameWeek > b.gameWeek) return 1;
                        if (a.gameWeek < b. gameWeek) return -1;
                        return 0;
                    });
                    var overallWeeklyWinnersCorrect = 0;
                    var overallWeeklyWinnersPush = 0;
                    var overallWeeklySpreadCorrect = 0;
                    var overallWeeklySpreadPush = 0;
                    var overallWeeklyTotalCorrect = 0;
                    var overallWeeklyTotalPush = 0;
                    var overallPredictionScore = 0;
                    var overallTotalPredictions = 0;
                    var gameWeek = 0;
                    var groupResultsReset = false;
                    
                    weeklyResults.forEach(function(item) {
                        if (item.gameWeek > 0) {
                            overallWeeklyWinnersCorrect += item.winner.correct;
                            overallWeeklyWinnersPush += item.winner.push;
                            overallWeeklySpreadCorrect += item.spread.correct;
                            overallWeeklySpreadPush += item.spread.push;
                            overallWeeklyTotalCorrect += item.total.correct;
                            overallWeeklyTotalPush += item.total.push;
                            overallPredictionScore += item.predictionScore;
                            overallTotalPredictions += item.totalPredictions;
                        }
                    });
                    
                    var overallUpdate = {
                        $set : {
                            [`results.${sport}.${year}.${season}.overall`]: {
                                winner: {
                                    correct: overallWeeklyWinnersCorrect,
                                    push: overallWeeklyWinnersPush
                                },
                                spread: {
                                    correct: overallWeeklySpreadCorrect,
                                    push: overallWeeklySpreadPush
                                },
                                total: {
                                    correct: overallWeeklyTotalCorrect,
                                    push: overallWeeklyTotalPush
                                },
                                predictionScore: overallPredictionScore,
                                totalPredictions: overallTotalPredictions
                            },
                            [`results.overall`]: {
                                winner: {
                                    correct: overallWeeklyWinnersCorrect,
                                    push: overallWeeklyWinnersPush
                                },
                                spread: {
                                    correct: overallWeeklySpreadCorrect,
                                    push: overallWeeklySpreadPush
                                },
                                total: {
                                    correct: overallWeeklyTotalCorrect,
                                    push: overallWeeklyTotalPush
                                },
                                predictionScore: overallPredictionScore,
                                totalPredictions: overallTotalPredictions
                            }
                        }
                    }
                    
                    
                    console.log("group before update: ", group)
                    queryPromises.push(db.collection('groups').updateOne({groupId: group.groupId, year: group.year, sport: group.sport }, overallUpdate));
                    // .then(function(updateGroupResults) {
                    //     console.log("updateGroupResults: ", updateGroupResults.result)
                    //     context.done(null, JSON.parse(updateGroupResults))
                    //     console.log("predictionResults: ", predictionResults);
                    //     _.each(predictionResults, function (result) {
                    //         console.log("result: ", result);
                            
                    //         // var correctPercentage = calculatePercentage(result.suOverallCorrect, result.suOverallPushes, overallWeek.totalOverallGames);
                    //         // var atsPercentage = calculatePercentage(overallWeek.atsOverallCorrect, overallWeek.atsOverallPushes, overallWeek.totalOverallGames);
                    //         // var totalPercentage = calculatePercentage(overallWeek.totalOverallCorrect, overallWeek.totalOverallPushes, overallWeek.totalOverallGames);
                            
                    //         // updateOverall = {
                    //         //     $set: {
                    //         //         overall: {
                    //         //             crowd: {
                    //         //                 winner: {
                    //         //                     correct: overallWeek.suOverallCorrect,
                    //         //                     push: overallWeek.suOverallPushes,
                    //         //                     percentage: correctPercentage
                    //         //                 },
                    //         //                 spread: {
                    //         //                     correct: overallWeek.atsOverallCorrect,
                    //         //                     push: overallWeek.atsOverallPushes,
                    //         //                     percentage: atsPercentage
                    //         //                 },
                    //         //                 total: {
                    //         //                     correct: overallWeek.totalOverallCorrect,
                    //         //                     push: overallWeek.totalOverallPushes,
                    //         //                     percentage: totalPercentage
                    //         //                 },
                    //         //                 totalGames: overallWeek.totalOverallGames
                    //         //             }
                    //         //         }
                    //         //     }
                    //         // };
                            
                    //         // var criteria = {"year":2017, "gameWeek": week.gameWeek}
                            
                    //         // var queryPromise = db.collection('leaderboards').updateAsync(criteria, updateOverall)
                    //         //     .then(function (updateResult) {
                    //         //         var message = `{ update: ${JSON.stringify(updateOverall)} }`
                    //         //         console.log('Updated leaderboards', message);
                    //         //         return Promise.resolve(updateResult);
                    //         //     });
                    //         // queryPromises.push(Promise.resolve(queryPromise));
                    //         context.done(null, null)
                    //     });
            
                    //     Promise.all(queryPromises).then(function() {
                    //         return context.done();
                    //     });
                    
                    // })
                    // .catch(function(reject) {
                    //     context.done("update group reject: " + reject, null)
                    // });
                }
                if (index === groupsLength - 1) {
                    console.log('queryPromises: ', queryPromises)
                    Promise.all(queryPromises).then(function(promisesResponse) {
                        return context.done(null, promisesResponse);
                    });
                }
            });
            
            
        })
    });
};