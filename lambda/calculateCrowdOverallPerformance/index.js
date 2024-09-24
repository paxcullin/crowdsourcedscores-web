'use strict';

var assert = require("assert"),
    _ = require("lodash"),
    Promise = require("bluebird"),
    mongo = Promise.promisifyAll(require("mongodb")),
    {config} = require("./config");

const MONGO_URL = `mongodb://${config.username}:${config.password}@ds011775.mlab.com:11775/pcsm`;

function calculatePercentage(totalCorrect, totalPushes, totalGames) {
    var percentage = totalCorrect / (totalGames - totalPushes);
    return percentage;
}



exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const { sport, year, season, gameWeek } = event;
    if (!sport || !year || !season || !gameWeek) {
        context.fail({succeeded: false, message: "Event incomplete", event})
    }
    mongo.connect(MONGO_URL, function (err, db) {
        if (err) {
            console.log(err);
            return context.fail(err, null);
        }
        var updateOverall = {};
        let collection = db.collection('leaderboards')
        collection.findOne({"sport": sport, "year":year, "season": season, "gameWeek": gameWeek})
        .then((week) => {
            console.log({week: JSON.stringify(week)})
            
            var queryPromises = [];
            var aggOptsOverall = [
                {
                    $match: {
                        year: 2019,
                        gameWeek: { $lte: gameWeek },
                        season: season,
                        sport: sport
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
                        overallPredictionScore: {$sum: "$weekly.crowd.predictionScore"},
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
                            [`overall.crowd`]: {
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
                                predictionScore: overallWeek.overallPredictionScore,
                                totalGames: overallWeek.totalOverallGames
                            }
                        }
                    };
                    
                    var criteria = {"year": week.year, "gameWeek": week.gameWeek, "season": week.season, "sport": week.sport}
                    
                    var queryPromise = db.collection('leaderboards').updateAsync(criteria, updateOverall)
                        .then(function (updateResult) {
                            var message = `{ update: ${JSON.stringify(updateOverall)} }`
                            console.log('Updated leaderboards', message);
                            return Promise.resolve(updateResult);
                        });
                    queryPromises.push(Promise.resolve(queryPromise));
                });
    
                Promise.all(queryPromises).then(function() {
                    return context.done(null, "Leaderboards updated successfully");
                });
            });
            
        });
    });
};