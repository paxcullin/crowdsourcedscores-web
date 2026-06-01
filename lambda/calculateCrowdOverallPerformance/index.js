'use strict';

var assert = require("assert"),
    mongo = require("mongodb"),
    {config} = require("./config");

const MONGO_URL = `mongodb://${config.username}:${config.password}@ds011775.mlab.com:11775/pcsm`;

function calculatePercentage(totalCorrect, totalPushes, totalGames) {
    var percentage = totalCorrect / (totalGames - totalPushes);
    return percentage;
}



exports.handler = async (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const { sport, year, season } = event;
    const periodField = sport === 'nba' ? 'gameDate' : 'gameWeek';
    const periodValue = event[periodField];
    if (!sport || !year || !season) {
        return context.fail({succeeded: false, message: "Event incomplete", event})
    }
    try {
        const mongoClient = mongo.MongoClient || mongo;
        const clientOrDb = await mongoClient.connect(MONGO_URL);
        const db = typeof clientOrDb.db === 'function' ? clientOrDb.db('pcsm') : clientOrDb;
        var updateOverall = {};
        let collection = db.collection('leaderboards')
        const weekCriteria = {"sport": sport, "year":year, "season": season};
        if (periodValue !== undefined && periodValue !== null) {
            weekCriteria[periodField] = periodValue;
        }
        const week = await collection.findOne(weekCriteria)
        if (!week) {
            return context.done(null, "No matching leaderboard period found");
        }
        console.log({week: JSON.stringify(week)})
        
        var aggOptsOverall = [
            {
                $match: {
                    year: year,
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
        if (periodValue !== undefined && periodValue !== null) {
            aggOptsOverall[0].$match[periodField] = periodField === 'gameWeek' ? { $lte: periodValue } : { $lte: String(periodValue) };
        } else {
            aggOptsOverall[0].$match[periodField] = { $exists: true };
        }

        const overallWeeks = await db.collection('leaderboards').aggregate(aggOptsOverall).toArray();
        var queryPromises = [];
        for (const overallWeek of overallWeeks) {
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
            
            var criteria = {"year": week.year, "season": week.season, "sport": week.sport, [periodField]: week[periodField]}
            
            var queryPromise = db.collection('leaderboards').updateOne(criteria, updateOverall)
                .then(function (updateResult) {
                    var message = `{ update: ${JSON.stringify(updateOverall)} }`
                    console.log('Updated leaderboards', message);
                    return updateResult;
                });
            queryPromises.push(queryPromise);
        }

        await Promise.all(queryPromises);
        return context.done(null, "Leaderboards updated successfully");
    } catch (err) {
        console.log(err);
        return context.fail(err, null);
    }
};