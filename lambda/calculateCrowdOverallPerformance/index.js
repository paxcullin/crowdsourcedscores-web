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
    mongo.connect(MONGO_URL, function (err, db) {
        if (err) {
            console.log(err);
            return context.fail(err, null);
        }
        var updateOverall = {};
        db.collection('leaderboards').find({"year":2017}).toArray(function (err, weeks) {
            assert.equal(err, null);
            if (err) {
                console.log(err);
                return context.fail(err, null);
            }
            
            var queryPromises = [];
            _.each(weeks, function (week) {
                console.log("week.gameWeek: ", week.gameWeek);
                var aggOptsOverall = [
                    {
                        $match: {
                            year: 2017,
                            gameWeek: { $lte: week.gameWeek }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            suOverallCorrect: {$sum: "$weekly.crowd.winner.correct"},
                            suOverallPushes: {$sum: "$weekly.crowd.winner.push"},
                            atsOverallCorrect: {$sum: "$weekly.crowd.spread.correct"},
                            atsOverallPushes: {$sum: "$weekly.crowd.spread.push"},
                            totalOverallCorrect: {$sum: "$weekly.crowd.total.correct"},
                            totalOverallPushes: {$sum: "$weekly.crowd.total.push"},
                            totalOverallGames: {$sum: "$weekly.crowd.totalGames"}
                        }
                    }
                ];
                var queryPromises = [];
                db.collection('leaderboards').aggregate(aggOptsOverall).toArray(function(err, overallWeeks) {
                    if (err) {
                        console.log(err);
                        return context.fail(err, null);
                    }
                    _.each(overallWeeks, function (overallWeek) {
                        
                        var correctPercentage = calculatePercentage(overallWeek.suOverallCorrect, overallWeek.suOverallPushes, overallWeek.totalOverallGames);
                        var atsPercentage = calculatePercentage(overallWeek.atsOverallCorrect, overallWeek.atsOverallPushes, overallWeek.totalOverallGames);
                        var totalPercentage = calculatePercentage(overallWeek.totalOverallCorrect, overallWeek.totalOverallPushes, overallWeek.totalOverallGames);
                        
                        updateOverall = {
                            $set: {
                                overall: {
                                    crowd: {
                                        winner: {
                                            correct: overallWeek.suOverallCorrect,
                                            push: overallWeek.suOverallPushes,
                                            percentage: correctPercentage
                                        },
                                        spread: {
                                            correct: overallWeek.atsOverallCorrect,
                                            push: overallWeek.atsOverallPushes,
                                            percentage: atsPercentage
                                        },
                                        total: {
                                            correct: overallWeek.totalOverallCorrect,
                                            push: overallWeek.totalOverallPushes,
                                            percentage: totalPercentage
                                        },
                                        totalGames: overallWeek.totalOverallGames
                                    }
                                }
                            }
                        };
                        
                        var criteria = {"year":2017, "gameWeek": week.gameWeek}
                        
                        var queryPromise = db.collection('leaderboards').updateAsync(criteria, updateOverall)
                            .then(function (updateResult) {
                                var message = `{ update: ${JSON.stringify(updateOverall)} }`
                                console.log('Updated leaderboards', message);
                                return Promise.resolve(updateResult);
                            });
                        queryPromises.push(Promise.resolve(queryPromise));
                    });
        
                    Promise.all(queryPromises).then(function() {
                        return context.done();
                    });
                });
            });
            
        });
    });
};