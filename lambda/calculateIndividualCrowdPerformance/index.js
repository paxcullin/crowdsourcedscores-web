'use strict';

var assert = require("assert"),
    mongo = require("mongodb"),
    {config} = require('./config');

    const AWS = require('aws-sdk');
    const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });

    const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

function calculatePercentage(totalCorrect, totalPushes, totalGames) {
    var percentage = totalCorrect / (totalGames - totalPushes);
    return percentage;
}

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const sport = event.sport,
        year = event.year,
        season = event.season,
        week = event.week;
    mongo.connect(MONGO_URL, function (err, dbClient) {
        const db = dbClient.db('pcsm');
        if (err) {
            console.log(err);
            return context.fail(err, null);
        }
        var updateOverall = {};
        var queryPromises = [];
        var groupsCollection = db.collection('groups');
        //var predictionCollection = db.collection()
        groupsCollection.find({"year":2020, sport: sport}).toArray(function (err, groups) {
            
            var groupsLength = groups.length;
            assert.equal(err, null);
            if (err) {
                console.log(err);
                return context.fail(err, null);
            }
            
            groups.forEach((group) => {
                
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
                            _id: { groupId: "$groupId", gameWeek: "$predictions.gameWeek", "season": "$predictions.season" }, /*, gameId: "$predictions.gameId" */
                            suCorrect: {$sum: "$predictions.results.winner.correct"},
                            suPush: {$sum: "$predictions.results.winner.push"},
                            atsCorrect: {$sum: "$predictions.results.spread.correct"},
                            atsPush: {$sum: "$predictions.results.spread.push"},
                            totalCorrect: {$sum: "$predictions.results.total.correct"},
                            totalPush: {$sum: "$predictions.results.total.push"},
                            predictionScore: {$sum: "$predictions.results.predictionScore"},
                            totalPredictions: {$sum: 1}
                        }
                    }
                ];
                
                    
                //console.log("aggOpts: ", aggOpts);
                groupsCollection.aggregate(aggOpts).toArray(function (err, results) {
                    if (err) {
                        context.done("agg err: ", err);
                    }
                    console.log("results: ", results.length);
                    if (resultsArrayLength === 0) {
                        groupsLength--;
                    }
                    let seasonResults = results.filter(result => result._id.season === season)
                    var resultsArrayLength = seasonResults.length;
                    console.log({results: seasonResults.length});
                    seasonResults.forEach((result) => {
                        
                        console.log("result: ", JSON.stringify(result));
                        var criteria = {
                            groupId: result._id.groupId,
                            sport: group.sport,
                            year: group.year,
                            [`results.${sport}.${year}.${season}.weekly`]: {
                                $elemMatch: { gameWeek: result._id.gameWeek }
                            }
                        };
                        
                        var update = {
                            $set: {
                                [`results.${sport}.${year}.${season}.weekly.$`]: {
                                    gameWeek: result._id.gameWeek,
                                    season: season,
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
                        var arrayFilter = {
                            arrayFilters: [ { "element.gameWeek": result._id.gameWeek } ]
                        }
                        
                        // console.log("criteria: ", criteria);
                        // console.log("update: ", update);
                        groupsCollection.updateOne(criteria, update)
                        .then(function (updateResult) {
                            var respObj = JSON.parse(updateResult)
                            //console.log("updateResult: ", respObj)
                            
                            var message = `{ update: ${JSON.stringify(updateResult)} }`
                            //console.log("updateResult.nModified: ", respObj.nModified)
                            if (respObj && respObj.nModified === 1) {
                                message = updateResult.nModified;
                                resultsArrayLength--;
                                console.log({resultsArrayLength})
                                if (resultsArrayLength === 0) {
                                    groupsLength--;
                                    if (groupsLength === 0) {
                                        
                                      var calculateIndividualCrowdPerformanceOverallParams = {
                                          FunctionName: 'calculateIndividualCrowdPerformaceOverall', // the lambda function we are going to invoke
                                          InvocationType: 'Event',
                                          LogType: 'None',
                                          Payload: `{ "message": "calculateIndividualCrowdPerformance completed", "sport": "${sport}", "season": "${season}", "year": ${year}}`
                                        };
                                      // 
                                        lambda.invoke(calculateIndividualCrowdPerformanceOverallParams, function(err, data) {
                                          if (err) {
                                            console.log("calculateIndividualCrowdPerformanceOverall err: ", err);
                                          } else {
                                            console.log('calculateIndividualCrowdPerformanceOverall response: ', data.Payload);
                                            
                                            
                                                return context.done(null, "Crowds updated");
                                          }
                                        })
                                    }
                                }
                                
                            } else if (respObj.n === 0 && respObj.nModified === 0) {
                                
                                var addToSetCriteria = {
                                    groupId: result._id.groupId,
                                    sport: group.sport,
                                    year: group.year
                                }
                                
                                var addToSetUpdate = {
                                    $push: {
                                        [`results.${sport}.${year}.${season}.weekly`]: {
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
                            
                                groupsCollection.updateOne(addToSetCriteria, addToSetUpdate)
                                .then(function(addToSetResponse) {
                                    //var respObj = JSON.parse(addToSetResponse)
                                    console.log("addToSet Reponse: ", addToSetResponse);
                                    
                                            //console.log("result updated: ", respObj.nModified);
                                            resultsArrayLength--;
                                            // console.log({resultsArrayLength});
                                            if (resultsArrayLength === 0) {
                                                groupsLength--;
                                                if (groupsLength === 0) {
                                        
                                      var calculateIndividualCrowdPerformanceOverallParams = {
                                          FunctionName: 'calculateIndividualCrowdPerformaceOverall', // the lambda function we are going to invoke
                                          InvocationType: 'Event',
                                          LogType: 'None',
                                          Payload: `{ "message": "calculateIndividualCrowdPerformance completed", "sport": "${sport}", "season": "${season}", "year": ${year}}`
                                        };
                                      // 
                                        lambda.invoke(calculateIndividualCrowdPerformanceOverallParams, function(err, data) {
                                          if (err) {
                                            console.log("calculateIndividualCrowdPerformanceOverall err: ", err);
                                          } else {
                                            console.log('calculateIndividualCrowdPerformanceOverall response: ', data.Payload);
                                            
                                            
                                                return context.done(null, "Crowds updated");
                                          }
                                        })
                                                }
                                            }
                                            return Promise.resolve(updateResult);
                                })
                                .catch(function(addToSetReject) {
                                    console.log("addToSetReject: ", addToSetReject)
                                });// close addToSet function
                            } else {
                                console.log("no update required for ", group.groupName, " gameWeek ", result._id.gameWeek);
                                resultsArrayLength--;
                                // console.log({resultsArrayLength})
                                if (resultsArrayLength === 0) {
                                    groupsLength--;
                                    if (groupsLength === 0) {
                                      // 
                                      var calculateIndividualCrowdPerformanceOverallParams = {
                                          FunctionName: 'calculateIndividualCrowdPerformaceOverall', // the lambda function we are going to invoke
                                          InvocationType: 'Event',
                                          LogType: 'None',
                                          Payload: `{ "message": "calculateIndividualCrowdPerformance completed", "sport": "${sport}", "season": "${season}", "year": ${year}}`
                                        };
                                        lambda.invoke(calculateIndividualCrowdPerformanceOverallParams, function(err, data) {
                                          if (err) {
                                            console.log("calculateIndividualCrowdPerformanceOverall err: ", err);
                                          } else {
                                            console.log('calculateIndividualCrowdPerformanceOverall response: ', data.Payload);
                                            
                                            
                                                return context.done(null, "Crowds updated");
                                          }
                                        })
                                    }
                                }
                                
                            }
                        })
                        .catch(function(reject) {
                            console.log("reject: ", reject)
                        });
                    }); // close _.each result loop
                }); // close aggregate function
            }); // end _.each
            
        })
    });
};