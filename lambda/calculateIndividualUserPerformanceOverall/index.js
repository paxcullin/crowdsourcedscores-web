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
        
        // set defaults
        var sport = event.sport ? event.sport : 'nfl';
        var year = event.year ? event.year : 2018;
        var season = event.season ? event.season : 'reg';
        var gameWeekMatch = { $gt: 0, $lte: event.gameWeek };
        var predictionsCollection = 'predictions';
        var query = {}
        
        
        if (event.username) query = { username: event.username }
        if (sport === 'ncaaf') {
            sport = 'ncaaf'
            predictionsCollection = 'predictions-ncaaf'
        } else if (sport === 'ncaam') {
            sport = 'ncaam'
            predictionsCollection = 'predictions-ncaam'
            year = 2019;
            gameWeekMatch = { $gt: 12 };
        }
        
            var aggOpts = [
                {
                    $match: {
                        year: year,
                        results: { $exists: true },
                        gameWeek: gameWeekMatch,
                        season: season
                    }
                },
                {
                    $group: {
                        _id: {userId: "$userId", year: "$year", season: "$season"},
                        suCorrect: {$sum: "$results.winner.correct"},
                        suPush: {$sum: "$results.winner.push"},
                        suBullseyes: {$sum: "$results.winner.bullseyes"},
                        atsCorrect: {$sum: "$results.spread.correct"},
                        atsPush: {$sum: "$results.spread.push"},
                        atsBullseyes: {$sum: "$results.spread.bullseyes"},
                        atsStarsWagered: {$sum: "$results.spread.stars.wagered"},
                        atsStarsNet: {$sum: "$results.spread.stars.net"},
                        totalCorrect: {$sum: "$results.total.correct"},
                        totalPush: {$sum: "$results.total.push"},
                        totalBullseyes: {$sum: "$results.total.bullseyes"},
                        totalStarsWagered: {$sum: "$results.total.stars.wagered"},
                        totalStarsNet: {$sum: "$results.total.stars.net"},
                        predictionScore: {$sum: "$predictionScore"},
                        totalPredictions: {$sum: 1}
                    }
                }
            ]
        db.collection(predictionsCollection).aggregate(aggOpts).toArray(function (err, resultsArray) {
            console.log('resultsArray.length: ', resultsArray.length)
            var resultsLength = resultsArray.length;
            if (err) {
                context.done(err, null)
            }
            _.each(resultsArray, function(result) {
                if (result._id.userId === 'cmaronchick') {
                    console.log('result: ', result)
                }
                result.overallSUPercentage = calculatePercentage(result.suCorrect, 0, result.totalPredictions);
                result.overallATSPercentage = calculatePercentage(result.atsCorrect, result.atsPush, result.totalPredictions);
                result.overallOUPercentage = calculatePercentage(result.totalCorrect, result.totalPush, result.totalPredictions);
                
                var season = 'reg';
                if (sport === 'ncaam') season = 'post'
                if (result._id.season) { season = result._id.season };
                
                let starsWagered = result.atsStarsWagered + result.totalStarsWagered;
                let starsNet = result.atsStarsNet + result.totalStarsNet;
                var resultsObj = {};
                var resultsObjKey = `results.${sport}.${result._id.year}.${season}.overall`;
                if (season === 'reg' && sport !== 'ncaam') {
                    resultsObjKey = "results.overall";
                }
                //console.log('resultsObjKey: ', resultsObjKey)
                resultsObj[resultsObjKey] = {
                            winner: {
                                correct: result.suCorrect,
                                bullseyes: result.suBullseyes,
                                percentage: result.overallSUPercentage
                            },
                            spread: {
                                correct: result.atsCorrect,
                                push: result.atsPush,
                                bullseyes: result.atsBullseyes,
                                percentage: result.overallATSPercentage,
                                stars: {
                                    wagered: result.atsStarsWagered,
                                    net: result.atsStarsNet
                                }
                            },
                            total: {
                                correct: result.totalCorrect,
                                push: result.totalPush,
                                bullseyes: result.totalBullseyes,
                                percentage: result.overallOUPercentage,
                                stars: {
                                    wagered: result.totalStarsWagered,
                                    net: result.totalStarsNet,
                                }
                            },
                            predictionScore: result.predictionScore,
                            stars: {
                                wagered: starsWagered,
                                net: starsNet,
                                roi: starsNet/starsWagered
                            },
                            totalPredictions: result.totalPredictions
                        }
                //console.log('result._id.userId: ', result._id.userId)
                queryPromises.push(extendedProfile.update({username: result._id.userId}, { $set: resultsObj }))
                resultsLength--;
            })
            if (resultsLength === 0) {
                let overallUserArray = [];
                let filteredResults = resultsArray.sort((a, b) => {
                    let returnValue = (a.predictionScore > b.predictionScore) ? -1 : 1;
                    return returnValue
                })
                //console.log({ filteredResults })
                filteredResults.forEach(result => {
                    let starsWagered = result.atsStarsWagered + result.totalStarsWagered;
                    let starsNet = result.atsStarsNet + result.totalStarsNet;
                    let user = { 
                        username: result._id.userId,
                        winner: {
                            correct: result.suCorrect,
                            push: result.suPush,
                            bullseyes: result.suBullseyes
                        },
                        spread: {
                            correct: result.atsCorrect,
                            push: result.atsPush,
                            bullseyes: result.atsBullseyes
                        },
                        total: {
                            correct: result.totalCorrect,
                            push: result.totalPush,
                            bullseyes: result.totalBullseyes
                        },
                        stars: {
                            wagered: starsWagered,
                            net: starsNet,
                            roi: starsNet/starsWagered
                        },
                        predictionScore: result.predictionScore,
                        totalPredictions: result.totalPredictions
                    }
                    overallUserArray.push(user)
                })
                console.log({ overallUserArray: JSON.stringify(overallUserArray)})
                let leaderboardCriteria = {
                  year: event.year,
                  gameWeek: event.gameWeek,
                  season: season
                }
                let leaderboardUpdate = {
                    $set: {
                        "overall.users": overallUserArray
                    }
                }
                console.log({ leaderboardCriteria, leaderboardUpdate })
                //console.log({filteredResults: JSON.stringify(filteredResults)});
                queryPromises.push(db.collection('leaderboards').update(leaderboardCriteria, leaderboardUpdate, { upsert: true }))
                Promise.all(queryPromises)
                .then((promiseResult) => {
                    //db.collection('leaderboards').update({ })
                    context.done(null, queryPromises.length + ' users updated')
                })
                .catch(promiseError => context.done(promiseError, null))
            }
        })
        // extendedProfile.find(query).toArray(function (err, users) {
            
        //     var usersArrayLength = users.length;
        //     assert.equal(err, null);
        //     if (err) {
        //         console.log(err);
        //         return context.fail(err, null);
        //     }
            
        //     _.each(users, function (user) {
                
        //         var update = {};
        //         var overallWeeklyWinnersCorrect = 0;
        //         var overallWeeklyWinnersPush = 0;
        //         var overallWeeklySpreadCorrect = 0;
        //         var overallWeeklySpreadPush = 0;
        //         var overallWeeklyTotalCorrect = 0;
        //         var overallWeeklyTotalPush = 0;
        //         var overallPredictionScore = 0;
        //         var overallTotalPredictions = 0;
        //         if (event.sport !== 'ncaaf') {
        //             if (user.results && user.results.weekly && user.results.weekly.length > 0) {
        //                 user.results.weekly.forEach(function(item, index) {
        //                     if (item.gameWeek > 0) {
        //                         overallWeeklyWinnersCorrect += item.winner.correct;
        //                         overallWeeklyWinnersPush += item.winner.push;
        //                         overallWeeklySpreadCorrect += item.spread.correct;
        //                         overallWeeklySpreadPush += item.spread.push;
        //                         overallWeeklyTotalCorrect += item.total.correct;
        //                         overallWeeklyTotalPush += item.total.push;
        //                         overallPredictionScore += item.predictionScore;
        //                         overallTotalPredictions += item.totalPredictions;
        //                     }
        //                 });
        //             }
                    
      
    
        //                 var overallSUPercentage = calculatePercentage(overallWeeklyWinnersCorrect, 0, overallTotalPredictions);
        //                 var overallATSPercentage = calculatePercentage(overallWeeklySpreadCorrect, overallWeeklySpreadPush, overallTotalPredictions);
        //                 var overallOUPercentage = calculatePercentage(overallWeeklyTotalCorrect, overallWeeklyTotalPush, overallTotalPredictions);
                        
                       
        //             update = {
        //                 $set: {
        //                     "results.overall": {
        //                         winner: {
        //                             correct: overallWeeklyWinnersCorrect,
        //                             push: overallWeeklyWinnersPush,
        //                             percentage: overallSUPercentage
        //                         },
        //                         spread: {
        //                             correct: overallWeeklySpreadCorrect,
        //                             push: overallWeeklySpreadPush,
        //                             percentage: overallATSPercentage
        //                         },
        //                         total: {
        //                             correct: overallWeeklyTotalCorrect,
        //                             push: overallWeeklyTotalPush,
        //                             percentage: overallOUPercentage
        //                         },
        //                         predictionScore: overallPredictionScore,
        //                         totalPredictions: overallTotalPredictions
        //                     }
        //                 }
        //             }
        //         } else {
        //             if (user.results && user.results.ncaaf && user.results.ncaaf[2018].weekly && user.results.ncaaf[2018].weekly.length > 0) {
        //                 user.results.ncaaf[2018].weekly.forEach(function(item, index) {
        //                     if (item.gameWeek > 0) {
        //                         overallWeeklyWinnersCorrect += item.winner.correct;
        //                         overallWeeklyWinnersPush += item.winner.push;
        //                         overallWeeklySpreadCorrect += item.spread.correct;
        //                         overallWeeklySpreadPush += item.spread.push;
        //                         overallWeeklyTotalCorrect += item.total.correct;
        //                         overallWeeklyTotalPush += item.total.push;
        //                         overallPredictionScore += item.predictionScore;
        //                         overallTotalPredictions += item.totalPredictions;
        //                     }
        //                 });
        //             }
                    
      
    
        //                 var overallSUPercentage = calculatePercentage(overallWeeklyWinnersCorrect, 0, overallTotalPredictions);
        //                 var overallATSPercentage = calculatePercentage(overallWeeklySpreadCorrect, overallWeeklySpreadPush, overallTotalPredictions);
        //                 var overallOUPercentage = calculatePercentage(overallWeeklyTotalCorrect, overallWeeklyTotalPush, overallTotalPredictions);
                        
                       
        //             update = {
        //                 $set: {
        //                     "results.ncaaf.2018.overall": {
        //                         winner: {
        //                             correct: overallWeeklyWinnersCorrect,
        //                             push: overallWeeklyWinnersPush,
        //                             percentage: overallSUPercentage
        //                         },
        //                         spread: {
        //                             correct: overallWeeklySpreadCorrect,
        //                             push: overallWeeklySpreadPush,
        //                             percentage: overallATSPercentage
        //                         },
        //                         total: {
        //                             correct: overallWeeklyTotalCorrect,
        //                             push: overallWeeklyTotalPush,
        //                             percentage: overallOUPercentage
        //                         },
        //                         predictionScore: overallPredictionScore,
        //                         totalPredictions: overallTotalPredictions
        //                     }
        //                 }
        //             }
        //         }
                    
        //         //console.log("aggOpts: ", aggOpts);
        //         queryPromises.push(extendedProfile.updateOne({username: user.username}, update));
        //         usersArrayLength--;
        //         if (usersArrayLength === 0) {
        //             Promise.all(queryPromises)
        //             .then((response) => {
        //                 if (err) {
        //                     context.done("agg err: ", err);
        //                 }
        //                     console.log("results: ", JSON.stringify(response));
        //                     context.done(null, users.length + " users updated")
        //             }) // end update .then
        //             .catch((reject) => {
        //                 console.log("updateReject: ", reject)
        //                 context.done(reject, null);
        //             }); // end update .catch
        //         }
        //     }); // end _.each loop
                
                
        // }); // end extendProfile.find function
            
    }); // end Mongo Connect
};