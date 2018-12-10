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
        var queryPromises = [];
        var extendedProfile = db.collection('profileExtended');
        var query = {}
        if (event.username) query = { username: event.username }
        extendedProfile.find(query).toArray(function (err, users) {
            
            var usersArrayLength = users.length;
            assert.equal(err, null);
            if (err) {
                console.log(err);
                return context.fail(err, null);
            }
            
            _.each(users, function (user) {
                
                var update = {};
                var overallWeeklyWinnersCorrect = 0;
                var overallWeeklyWinnersPush = 0;
                var overallWeeklySpreadCorrect = 0;
                var overallWeeklySpreadPush = 0;
                var overallWeeklyTotalCorrect = 0;
                var overallWeeklyTotalPush = 0;
                var overallPredictionScore = 0;
                var overallTotalPredictions = 0;
                
                if (user.results && user.results.weekly && user.results.weekly.length > 0) {
                    user.results.weekly.forEach(function(item, index) {
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
                }
                
  

                    var overallSUPercentage = calculatePercentage(overallWeeklyWinnersCorrect, 0, overallTotalPredictions);
                    var overallATSPercentage = calculatePercentage(overallWeeklySpreadCorrect, overallWeeklySpreadPush, overallTotalPredictions);
                    var overallOUPercentage = calculatePercentage(overallWeeklyTotalCorrect, overallWeeklyTotalPush, overallTotalPredictions);
                    
                   
                update = {
                    $set: {
                        "results.overall": {
                            winner: {
                                correct: overallWeeklyWinnersCorrect,
                                push: overallWeeklyWinnersPush,
                                percentage: overallSUPercentage
                            },
                            spread: {
                                correct: overallWeeklySpreadCorrect,
                                push: overallWeeklySpreadPush,
                                percentage: overallATSPercentage
                            },
                            total: {
                                correct: overallWeeklyTotalCorrect,
                                push: overallWeeklyTotalPush,
                                percentage: overallOUPercentage
                            },
                            predictionScore: overallPredictionScore,
                            totalPredictions: overallTotalPredictions
                        }
                    }
                }
                    
                //console.log("aggOpts: ", aggOpts);
                queryPromises.push(extendedProfile.updateOne({username: user.username}, update));
                usersArrayLength--;
                if (usersArrayLength === 0) {
                    Promise.all(queryPromises)
                    .then((response) => {
                        if (err) {
                            context.done("agg err: ", err);
                        }
                            console.log("results: ", JSON.stringify(response));
                            context.done(null, users.length + " users updated")
                    }) // end update .then
                    .catch((reject) => {
                        console.log("updateReject: ", reject)
                        context.done(reject, null);
                    }); // end update .catch
                }
            }); // end _.each loop
                
                
        }); // end extendProfile.find function
            
    }); // end Mongo Connect
};