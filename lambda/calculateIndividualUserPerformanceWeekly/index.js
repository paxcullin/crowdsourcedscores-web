'use strict';

var assert = require("assert"),
    mongo = require("mongodb").MongoClient,
    {config} = require('config');
    const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda"); // ES Modules import
    const AWSConfig = { region: "us-west-2" };
    const lambda = new LambdaClient({region: 'us-west-2'});

    const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

exports.handler = async (event, context, callback) => {
    try {
        var updateOverall = {};
        var queryPromises = [];
        async function callCalculateIndividualCrowdPerformanceOverall(results, sport, year, season, gameWeek) {

            // end results.forEach aggregate result
            let filteredResults = results.filter((result) => {
                return (result._id.gameWeek === event.gameWeek && result._id.season === event.season)
            })
            
            filteredResults = filteredResults.sort((a, b) => {
                let returnValue = (a.predictionScore > b.predictionScore) ? -1 : 1;
                return returnValue
            })
            // console.log({ filteredResults })
            filteredResults.forEach(result => {
                let starsWagered = result.atsStarsWagered + result.totalStarsWagered;
                let starsNet = result.atsStarsNet + result.totalStarsNet;
                let user = { 
                    username: result._id.userId,
                    preferred_username: result._id.preferred_username ? result._id.preferred_username : '',
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
                    wagers: {
                        wagered: result.currencyWagered,
                        net: result.currencyNet,
                        roi: parseFloat((((result.currencyNet-result.currencyWagered) / result.currencyWagered)*100).toFixed(2))
                    },
                    predictionScore: result.predictionScore,
                    totalPredictions: result.totalPredictions
                }
                weeklyUserArray.push(user)
            })
            console.log({ weeklyUserArray: weeklyUserArray.length })
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
                console.log({ leaderboardCriteria, leaderboardUpdate })
                // console.log({filteredResults: JSON.stringify(filteredResults)});
                // console.log('weeklyUserArray', leaderboardCriteria, weeklyUserArray)
                queryPromises.push(db.collection('leaderboards').updateOne(leaderboardCriteria, leaderboardUpdate, { upsert: true }))
            }
            //console.log({queryPromises})
            let queryPromisesResult = await Promise.all(queryPromises);
                console.log('callCalculateIndividualCrowdPerformanceOverall called')
                var calculateIndividualUserPerformanceOverallParams = {
                    FunctionName: 'calculateIndividualUserPerformanceOverall', // the lambda function we are going to invoke
                    InvocationType: 'Event',
                    LogType: 'None',
                    Payload: `{ "message": "calculateIndividualUserPerformanceOverall completed", "sport": "${sport}", "year": ${year}, "season": "${season}", "gameWeek": ${gameWeek}}`
                };

                const lambdaParams = {
                    FunctionName: 'getGameWeek', // the lambda function we are going to invoke
                    InvocationType: 'RequestResponse',
                    LogType: 'None',
                    Payload: `{ "message": "notification reminder", "sport": "nfl", "year": 2023, "season": "reg"}`
                }

                const command = new InvokeCommand(calculateIndividualUserPerformanceOverallParams, function(err, data) {
                    console.log('err', err);
                    console.log('data', data);
                    if (err) {
                        return context.fail('addToGroupError', err);
                    } else {
                        return context.done(null, results.length + "Users updated");
                    }
                })
                
                const { Payload, LogResult } = await lambda.send(command);
                console.log('Payload', Payload);
                console.log('LogResult', LogResult);
                context.done(null, results.length + "Users updated");
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
        const client = await mongo.connect(MONGO_URL);
        const db = client.db('pcsm');
        
        const extendedProfile = db.collection('profileExtended');
        var matchOpts = {
                year: year
        }
        if (event.gameWeek) {
            matchOpts.gameWeek = event.gameWeek
        }
        if (event.sport) {
            matchOpts.sport = event.sport
        }
        if (event.season) {
            matchOpts.season = event.season
        }
        // if (event.userId) {
        //     matchOpts = {
        //         $match: {
        //             year: year,
        //             userId: event.userId
        //         }
        //     }
        // }
        
        var aggOpts = [
            {
                $match: {
                    ...matchOpts,
                    results: { $exists: true }
                }
            },
            {
                $group: {
                    _id: {userId: "$userId", sport: "$sport", gameWeek: "$gameWeek", season: "$season", preferred_username: "$preferred_username"},
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
        
        var wagerAggOpts = [
            {
                $match: {
                    ...matchOpts,
                
                    result: { $exists: true }
                }
            },
            {
                $group: {
                    _id: {userId: "$userId", sport: "$sport", gameWeek: "$gameWeek", season: "$season", preferred_username: "$preferred_username"},
                    currencyWagered: {$sum: "$wager.currency"},
                    currencyNet: {$sum: "$net"},
                    wagersCorrect: {$sum: "$result"},
                    totalWagers: {$sum: 1}
                }
            }
        ]
        // console.log('aggOpts, wagerAggOpts:', aggOpts, wagerAggOpts);
        const results = await db.collection(predictionsCollection).aggregate(aggOpts).toArray();
        const currencyResults = await db.collection('wagers').aggregate(wagerAggOpts).toArray();
        // console.log('currencyResults', JSON.stringify(currencyResults))
        var resultsArrayLength = results.length;
        var updateObjectWeeklyKey = '';
        var weeklyUserArray = [];
        
    // console.log('results, currencyResults: ', results.length, currencyResults.length);
    results.map((result) => {
        // console.log('result', result);
        currencyResults.forEach((currencyResult) => {
            // console.log('currencyResult', currencyResult)
            // console.log('currencyResult._id.userId, result._id.userId, currencyResult._id.gameWeek, result._id.gameWeek, currencyResult._id.season, result._id.season, currencyResult._id.sport, result._id.sport', currencyResult._id.userId, result._id.userId, currencyResult._id.gameWeek, result._id.gameWeek, currencyResult._id.season, result._id.season, currencyResult._id.sport, result._id.sport);
            if (currencyResult._id.userId === result._id.userId && currencyResult._id.gameWeek === result._id.gameWeek && currencyResult._id.season === result._id.season && currencyResult._id.sport === result._id.sport) {
                result.currencyWagered = currencyResult.currencyWagered;
                result.currencyNet = currencyResult.currencyNet;
                result.totalWagers = currencyResult.totalWagers;
                result.totalCorrect = currencyResult.wagersCorrect;
            }
            return result
        })
    });
    console.log('results.length', results.length)
    // results.forEach(async (result) => {
    let bulkWriteOperations = [];
    for (const resultNumber in results) {
        console.log('resultNumber:', resultNumber)
        const result = results[resultNumber];
        console.log('result:', result, resultsArrayLength)
        var criteria = {
            username: result._id.userId,
            [`results.${event.sport}.${year}.${result._id.season}.weekly`]: {
                $elemMatch: { gameWeek: result._id.gameWeek } 
            }
            
        }
        let starsWagered = result.atsStarsWagered + result.totalStarsWagered;
        let starsNet = result.atsStarsNet + result.totalStarsNet;
        var update = {
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
                    wagered: starsWagered,
                    net: starsNet,
                    roi: starsWagered > 0 ? starsNet/starsWagered : 0
                },
                [`results.${event.sport}.${year}.${result._id.season}.weekly.$.totalPredictions`]: result.totalPredictions,
                [`results.${event.sport}.${year}.${result._id.season}.weekly.$.currencyWagered`]: result.currencyWagered,
                [`results.${event.sport}.${year}.${result._id.season}.weekly.$.currencyNet`]: result.currencyNet,
                [`results.${event.sport}.${year}.${result._id.season}.weekly.$.currencyROI`]: parseFloat(((result.currencyNet - result.currencyWagered) / result.currencyWagered)*100).toFixed(2),
                [`results.${event.sport}.${year}.${result._id.season}.weekly.$.totalWagers`]: result.totalWagers
        }
        console.log('update 211', criteria, update)
        const updateResponse = await extendedProfile.updateOne(criteria, {
            $set: update
        })
        console.log('updateResponse', updateResponse.acknowledged, updateResponse.modifiedCount);
        // var respObj = JSON.parse(updateResponse)
                // console.log( { respObj })
                if (updateResponse.acknowledged === true && updateResponse.modifiedCount === 1) {
                    
                    console.log('updateResponse 217 ', updateResponse, resultsArrayLength);
                    // signifies that the user's weekly results were updated
                    resultsArrayLength--;
                    if (resultsArrayLength === 0) {
                        callCalculateIndividualCrowdPerformanceOverall(results, event.sport, year, event.gameWeek)
                    }
                } else if (updateResponse.acknowledged === true && updateResponse.modifiedCount === 0) {
                    // signifies that the user's weekly results were not updated
                    console.log('updateResponse 225 ', updateResponse);
                    var pushCriteria = {
                        username: result._id.userId
                        
                    }
                    if (event.username)  {
                        pushCriteria = {
                            username: event.username
                        }
                    }
                    // {updateOne: {filter: criteria, update: update}}
                    var pullUpdate = {updateOne: {filter: pushCriteria, update: {
                        $pull: {
                            [`results.${event.sport}.${year}.${result._id.season}.weekly`]: { gameWeek: result._id.gameWeek }
                        }
                    }}}
                    var pushUpdate = {updateOne: {filter: pushCriteria, update: {
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
                                    wagered: starsWagered,
                                    net: starsNet,
                                    roi: starsWagered > 0 ? starsNet/starsWagered : 0
                                },
                                totalPredictions: result.totalPredictions,
                                currencyWagered: result.currencyWagered,
                                currencyNet: result.currencyNet,
                                currencyROI: parseFloat(((result.currencyNet - result.currencyWagered) / result.currencyWagered)*100).toFixed(2),
                                totalWagers: result.totalWagers
                            }
                        }
                    }}}

                    //console.log(`pushUpdate: ${JSON.stringify(pushUpdate)}`)
                    console.log('pushCriteria, pushUpdate: ', pushCriteria, pushUpdate)
                    const pushUpdateResult = await extendedProfile.bulkWrite([pullUpdate, pushUpdate])
                    // const pushUpdateResult = await extendedProfile.updateOne(pushCriteria, pushUpdate)
                    console.log("pushUpdateResult.result: ", pushUpdateResult)
                    
                    if (pushUpdateResult.modifiedCount === 1) {
                        //console.log("pushCriteria:", pushCriteria, " updated")
                        console.log(318, { resultsArrayLength });
                        resultsArrayLength--;
                        if (resultsArrayLength === 0) {
                            callCalculateIndividualCrowdPerformanceOverall(results, event.sport, year, event.season, event.gameWeek)
                        }
                    } else {
                        //console.log("no push update for ", result._id.userId)
                        console.log(324, { resultsArrayLength });
                        resultsArrayLength--;
                        if (resultsArrayLength === 0) {
                            callCalculateIndividualCrowdPerformanceOverall(results, event.sport, year, event.season, event.gameWeek)
                        }
                    }
                } else {
                    //console.log({ respObj } )
                    console.log(331, { resultsArrayLength });
                    resultsArrayLength--;
                    if (resultsArrayLength === 0) {
                        callCalculateIndividualCrowdPerformanceOverall(results, event.sport, year, event.season, event.gameWeek)
                    }
                }
            }
    //end aggregate predictions function
        // if (resultsArrayLength === 0) {
        //     console.log('queryPromises', JSON.stringify(queryPromises))
        //     let leaderboardUpdate = await Promise.all(queryPromises);
        //     console.log('leaderboardUpdate', leaderboardUpdate)
        //     context.done(null, results.length + " Users updated");
        // }
    } catch (err) {
        console.log('err', err, err.errorMessage);
        return context.fail({err: JSON.stringify(err)}, null);
    }
};