'use strict';

var assert = require("assert"),
    _ = require("lodash"),
    Promise = require("bluebird"),
    mongo = Promise.promisifyAll(require("mongodb"));
    const AWS = require('aws-sdk');
    const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });

const MONGO_URL = 'mongodb://${username}:${password}@ds011775.mlab.com:11775/pcsm';

exports.handler = (event, context, callback) => {
    var updateOverall = {};
    var queryPromises = [];
    function callCalculateIndividualCrowdPerformanceOverall(resultsLength, sport, year, season, gameWeek) {
        console.log({queryPromises})
        Promise.all(queryPromises).then((result) => {
            console.log('callCalculateIndividualCrowdPerformanceOverall called')
            var calculateIndividualUserPerformanceOverallParams = {
                FunctionName: 'calculateIndividualUserPerformanceOverall', // the lambda function we are going to invoke
                InvocationType: 'Event',
                LogType: 'None',
                Payload: `{ "message": "calculateIndividualUserPerformanceOverall completed", "sport": "${sport}", "year": ${year}, "season": "${season}", "gameWeek": ${gameWeek}}`
            };
            lambda.invoke(calculateIndividualUserPerformanceOverallParams, function(err, data) {
                if (err) {
                    console.log("calculateIndividualUserPerformanceOverall err: ", err);
                } else {
                    console.log('calculateIndividualUserPerformanceOverall response: ', data.Payload);
                    return context.done(null, resultsLength + "Users updated");
                }
            })
        })
    }
    
    function calculatePercentage(totalCorrect, totalPushes, totalGames) {
        var percentage = totalCorrect / (totalGames - totalPushes);
        return percentage;
    }
    console.log('Received event:', JSON.stringify(event, null, 2));
    var gamesCollection = 'games';
    var predictionsCollection = 'predictions';
    var year = event.year ? event.year : 2018;
    if (event.sport === 'ncaaf') {
        predictionsCollection = 'predictions-ncaaf';
    } else if (event.sport === 'ncaam') {
        predictionsCollection = 'predictions-ncaam';
        year = 2019;
    }
    mongo.connect(MONGO_URL, function (err, db) {
        if (err) {
            console.log(err);
            return context.fail(err, null);
        }
        const extendedProfile = db.collection('profileExtended');
        var matchOpts = {
            $match: {
                year: year
            }
        }
        if (event.userId) {
            matchOpts = {
                $match: {
                    year: year,
                    userId: event.userId
                }
            }
        }
        
            var aggOpts = [
                {
                    $match: {
                        year: year,
                        results: { $exists: true },
                        season: event.season
                    }
                },
                {
                    $group: {
                        _id: {userId: "$userId", gameWeek: "$gameWeek", season: "$season"},
                        suCorrect: {$sum: "$results.winner.correct"},
                        suPush: {$sum: "$results.winner.push"},
                        suBullseyes: {$sum: "$results.winner.bullseyes"},
                        atsCorrect: {$sum: "$results.spread.correct"},
                        atsPush: {$sum: "$results.spread.push"},
                        atsBullseyes: {$sum: "$results.spread.bullseyes"},
                        atsStarsWagered: {$sum: "$results.spread.stars.wagered"},
                        atsStarsNet: {$sum: "$results.spread.stars.Net"},
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
            db.collection(predictionsCollection).aggregate(aggOpts).toArray(function (err, results) {
                var resultsArrayLength = results.length;
                var updateObjectWeeklyKey = '';
                var weeklyUserArray = [];
                
                assert.equal(err, null);
                if (err) {
                    console.log(err);
                    return context.fail(err, null);
                }
                console.log({results})
                _.each(results, function (result) {
                    var criteria = {
                        username: result._id.userId,
                        "results.weekly": {
                            $elemMatch: { gameWeek: result._id.gameWeek } 
                        }
                        
                    }
                    var update = {
                        $set: {
                            [`results.${event.sport}.${year}.${result._id.season}.weekly.$.gameWeek`]: result._id.gameWeek,
                            [`results.${event.sport}.${year}.${result._id.season}.weekly.$.winner`]: {
                                correct: result.suCorrect,
                                push: result.suPush,
                                bullseyes: result.suBullseyes
                            },
                            [`results.${event.sport}.${year}.${result._id.season}.weekly.$.spread`]: {
                                correct: result.atsCorrect,
                                push: result.atsPush,
                                bullseyes: result.atsBullseyes,
                                stars: {
                                    wagered: result.atsStarsWagered,
                                    net: result.atsStarsNet
                                }
                            },
                            [`results.${event.sport}.${year}.${result._id.season}.weekly.$.total`]: {
                                correct: result.totalCorrect,
                                push: result.totalPush,
                                bullseyes: result.totalBullseyes,
                                stars: {
                                    wagered: result.totalStarsWagered,
                                    net: result.totalStarsNet
                                }
                            },
                            [`results.${event.sport}.${year}.${result._id.season}.weekly.$.predictionScore`]: result.predictionScore,
                            [`results.${event.sport}.${year}.${result._id.season}.weekly.$.stars`]: {
                                wagered: result.atsStarsWagered + result.totalStarsWagered,
                                net: result.atsStarsNet + result.totalStarsNet,
                                roi: (result.atsStarsNet + result.totalStarsNet)/(result.atsStarsWagered + result.totalStarsWagered)
                            },
                            [`results.${event.sport}.${year}.${result._id.season}.weekly.$.totalPredictions`]: result.totalPredictions
                        }
                    }
                    if (event.sport === 'ncaaf') {
                        
                        criteria = {
                            username: result._id.userId,
                            ["results.ncaaf.2018.weekly"]: {
                                $elemMatch: { gameWeek: result._id.gameWeek } 
                            }
                            
                        }
                        update = {
                            $set: {
                                "results.ncaaf.2018.weekly.$.gameWeek": result._id.gameWeek,
                                "results.ncaaf.2018.weekly.$.winner": {
                                    correct: result.suCorrect,
                                    push: result.suPush
                                },
                                "results.ncaaf.2018.weekly.$.spread": {
                                    correct: result.atsCorrect,
                                    push: result.atsPush
                                },
                                "results.ncaaf.2018.weekly.$.total": {
                                    correct: result.totalCorrect,
                                    push: result.totalPush
                                },
                                "results.ncaaf.2018.weekly.$.predictionScore": result.predictionScore,
                                "results.ncaaf.2018.weekly.$.totalPredictions": result.totalPredictions
                            }
                        }
                    } else if (event.sport === 'ncaam') {
                        criteria = {
                            username: result._id.userId
                        }
                        const criteriaWeekMatchKey = "results." + event.sport + "." + year + ".weekly"
                        criteria[criteriaWeekMatchKey] = {
                            $elemMatch: { gameWeek: result._id.gameWeek } 
                        }
                        var updateObject = {};
                        updateObjectWeeklyKey = `results.${event.sport}.${year}.weekly`;
                        
                        updateObject[updateObjectWeeklyKey + '.$.gameWeek'] = result._id.gameWeek;
                        updateObject[updateObjectWeeklyKey + '.$.winner'] = {
                                correct: result.suCorrect,
                                push: result.suPush
                            };
                        updateObject[updateObjectWeeklyKey + '.$.spread']= {
                                correct: result.atsCorrect,
                                push: result.atsPush
                            };
                        updateObject[updateObjectWeeklyKey + '.$.total'] = {
                                correct: result.totalCorrect,
                                push: result.totalPush
                            }
                        updateObject[updateObjectWeeklyKey + '.$.predictionScore'] = result.predictionScore,
                        updateObject[updateObjectWeeklyKey + '.$.totalPredictions'] = result.totalPredictions
                        update = {
                            $set: updateObject
                        }
                    }
                    // console.log('criteria: ', criteria)
                    // console.log("update: ", JSON.stringify(update))
                    
                    extendedProfile.updateOne(criteria, update)
                        .then(function(updateResponse) {
                            var respObj = JSON.parse(updateResponse)
                            console.log( { respObj })
                            if (respObj.n === 1 && respObj.nModified === 1) {
                                resultsArrayLength--;
                                if (resultsArrayLength === 0) {
                                    callCalculateIndividualCrowdPerformanceOverall(results.length, event.sport, year, event.gameWeek)
                                }
                            } else if (respObj.n === 0 && respObj.nModified === 0) {
                                var pushCriteria = {
                                    username: result._id.userId
                                    
                                }
                                if (event.username)  {
                                    pushCriteria = {
                                        username: event.username
                                        
                                    }
                                }
                                var pushUpdate = {
                                    $push: {
                                        [`results.${event.sport}.${year}.${result._id.season}.weekly`]: {
                                            gameWeek: result._id.gameWeek,
                                            winner: {
                                                correct: result.suCorrect,
                                                push: result.suPush,
                                                bullseyes: result.suBullseyes
                                            },
                                            spread: {
                                                correct: result.atsCorrect,
                                                push: result.atsPush,
                                                bullseyes: result.atsBullseyes,
                                                stars: {
                                                    wagered: result.atsStarsWagered,
                                                    net: result.atsStarsNet
                                                }
                                            },
                                            total: {
                                                correct: result.totalCorrect,
                                                push: result.totalPush,
                                                bullseyes: result.totalBullseyes,
                                                stars: {
                                                    wagered: result.totalStarsWagered,
                                                    net: result.totalStarsNet
                                                }
                                            },
                                            predictionScore: result.predictionScore,
                                            stars: {
                                                wagered: result.atsStarsWagered + result.totalStarsWagered,
                                                net: result.atsStarsNet + result.totalStarsNet,
                                                roi: (result.atsStarsNet + result.totalStarsNet)/(result.atsStarsWagered + result.totalStarsWagered)
                                            },
                                            totalPredictions: result.totalPredictions
                                        }
                                    }
                                }
                                if (event.sport === 'ncaaf') {
                                    pushUpdate = { 
                                        $push: {
                                            "results.ncaaf.2018.weekly": {
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
                                                predictionScore: result.predictionScore,
                                                totalPredictions: result.totalPredictions
                                            }
                                        }
                                    }
                                } else if (event.sport === 'ncaam') {
                                    updateObject = {};
                                    updateObject[updateObjectWeeklyKey] = {
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
                                        predictionScore: result.predictionScore,
                                        totalPredictions: result.totalPredictions
                                    }
                                    pushUpdate = { 
                                        $push: updateObject
                                    }
                                }
                                //console.log(`pushUpdate: ${JSON.stringify(pushUpdate)}`)
                                extendedProfile.updateOne(pushCriteria, pushUpdate)
                                .then(function(pushUpdateResult) {
                                    //console.log("pushUpdateResult.result: ", pushUpdateResult.result)
                                    var pushUpdateRespObj = JSON.parse(pushUpdateResult)
                                    if (pushUpdateRespObj.nModified === 1) {
                                        //console.log("pushCriteria:", pushCriteria, " updated")
                                        resultsArrayLength--;
                                        if (resultsArrayLength === 0) {
                                            callCalculateIndividualCrowdPerformanceOverall(results.length, event.sport, year, event.season, event.gameWeek)
                                        }
                                    } else {
                                        //console.log("no push update for ", result._id.userId)
                                        resultsArrayLength--;
                                        if (resultsArrayLength === 0) {
                                            callCalculateIndividualCrowdPerformanceOverall(results.length, event.sport, year, event.season, event.gameWeek)
                                        }
                                    }
                                })
                                .catch(function(pushUpdateReject) {
                                    console.log("pushUpdateReject: ", pushUpdateReject)
                                })
                            } else {
                                //console.log({ respObj } )
                                //console.log({ resultsArrayLength });
                                resultsArrayLength--;
                                if (resultsArrayLength === 0) {
                                    callCalculateIndividualCrowdPerformanceOverall(results.length, event.sport, year, event.season, event.gameWeek)
                                }
                            }
                            return update;
                        })
                        .catch(function(updateReject) {
                            console.log("updateReject: ", updateReject);
                        })
                        
                        
                }); // end _.each aggregate result
                    let filteredResults = results.filter((result) => {
                        return (result._id.gameWeek === event.gameWeek && result._id.season === event.season)
                    })
                    
                    filteredResults = filteredResults.sort((a, b) => {
                        let returnValue = (a.predictionScore > b.predictionScore) ? -1 : 1;
                        return returnValue
                    })
                    //console.log({ filteredResults })
                    filteredResults.forEach(result => {
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
                            predictionScore: result.predictionScore,
                            totalPredictions: result.totalPredictions
                        }
                        weeklyUserArray.push(user)
                    })
                    console.log({ weeklyUserArray })
                    if (weeklyUserArray.length > 0) {
                        let leaderboardCriteria = {
                          year: year,
                          sport: event.sport,
                          season: event.season,
                          gameWeek: event.gameWeek
                        }
                        let leaderboardUpdate = {
                            $set: {
                                "weekly.users": weeklyUserArray
                            }
                        }
                        // console.log({ leaderboardCriteria, leaderboardUpdate })
                        // console.log({filteredResults: JSON.stringify(filteredResults)});
                        queryPromises.push(db.collection('leaderboards').update(leaderboardCriteria, leaderboardUpdate, { upsert: true }))
                    }
            }); //end aggregate predictions function
                
        })
    };