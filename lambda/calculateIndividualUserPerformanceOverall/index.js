'use strict';

var assert = require("assert"),
    {config} = require('config'),
    mongo = require("mongodb").MongoClient;

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

function calculatePercentage(totalCorrect, totalPushes, totalGames) {
    var percentage = totalCorrect / (totalGames - totalPushes);
    return percentage;
}

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    try {
        const client = await mongo.connect(MONGO_URL);
        const db = client.db('pcsm');
        var updateOverall = {};
        var queryPromises = [];
        var extendedProfile = db.collection('profileExtended');
        
        // set defaults
        let { sport, year, season } = event;
        const periodField = sport === 'nba' ? 'gameDate' : 'gameWeek';
        const periodValue = event[periodField];
        var periodMatch = periodField === 'gameWeek' ? { $gt: 0, $lte: event.gameWeek } : { $lte: String(periodValue || '') };
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
                periodMatch = { $gt: 12 };
            } else if (sport === 'nba') {
                sport = 'nba'
                predictionsCollection = 'predictions-nba'
                if (!periodValue) {
                    periodMatch = { $exists: true };
                }
            }

        var matchOpts = {
            year: year
        }
        if (event.sport) {
            matchOpts.sport = sport
        }
        if (event.season) {
            matchOpts.season = season
        }
            
                var aggOpts = [
                    {
                        $match: {
                            ...matchOpts,
                            results: { $exists: true },
                            [periodField]: periodMatch
                        }
                    },
                    {
                        $group: {
                            //_id: {userId: "$userId", year: "$year", season: "$season"},
                            _id: {userId: "$userId", sport: "$sport", [periodField]: `$${periodField}`, season: "$season", preferred_username: "$preferred_username"},
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
                            result: { $exists: true },
                            [periodField]: periodMatch
                        }
                    },
                    {
                        $group: {
                            _id: {userId: "$userId", sport: "$sport", [periodField]: `$${periodField}`, season: "$season", preferred_username: "$preferred_username"},
                            currencyWagered: {$sum: "$wager.currency"},
                            currencyNet: {$sum: "$net"},
                            wagersCorrect: {$sum: "$result"},
                            totalWagers: {$sum: 1}
                        }
                    }
                ]
            const results = await db.collection(predictionsCollection).aggregate(aggOpts).toArray();
            const currencyResults = await db.collection('wagers').aggregate(wagerAggOpts).toArray();
                console.log('results.length: ', results.length, 'currencyResults.length: ', currencyResults.length);
                var resultsLength = results.length;
                results.map((result) => {
                    // console.log('result', result);
                    currencyResults.forEach((currencyResult) => {
                        // console.log('currencyResult', currencyResult)
                        // console.log('currencyResult._id.userId, result._id.userId, currencyResult._id.gameWeek, result._id.gameWeek, currencyResult._id.season, result._id.season, currencyResult._id.sport, result._id.sport', currencyResult._id.userId, result._id.userId, currencyResult._id.gameWeek, result._id.gameWeek, currencyResult._id.season, result._id.season, currencyResult._id.sport, result._id.sport);
                        if (currencyResult._id.userId === result._id.userId && currencyResult._id[periodField] === result._id[periodField] && currencyResult._id.season === result._id.season && currencyResult._id.sport === result._id.sport) {
                            result.currencyWagered = currencyResult.currencyWagered;
                            result.currencyNet = currencyResult.currencyNet;
                            result.totalWagers = currencyResult.totalWagers;
                            result.totalCorrect = currencyResult.wagersCorrect;
                        }
                        return result
                    })
                });
                results.forEach(result => {
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
                    // if (season === 'reg' && sport !== 'ncaam') {
                    //     resultsObjKey = "results.overall";
                    // }
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
                                totalPredictions: result.totalPredictions,
                                currencyWagered: result.currencyWagered,
                                currencyNet: result.currencyNet,
                                currencyROI: parseFloat(((result.currencyNet - result.currencyWagered) / result.currencyWagered)*100).toFixed(2),
                                totalWagers: result.totalWagers
                            }
                    //console.log('result._id.userId: ', result._id.userId)
                    queryPromises.push(extendedProfile.updateOne({username: result._id.userId}, { $set: resultsObj }))
                    resultsLength--;
                })
                if (resultsLength === 0) {
                    let overallUserArray = [];
                    let filteredResults = results.sort((a, b) => {
                        let returnValue = (a.predictionScore > b.predictionScore) ? -1 : 1;
                        return returnValue
                    })
                    //console.log({ filteredResults })
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
                            predictionScore: result.predictionScore,
                            totalPredictions: result.totalPredictions,
                            wagers: {
                                wagered: result.currencyWagered,
                                net: result.currencyNet,
                                roi: parseFloat((((result.currencyNet-result.currencyWagered) / result.currencyWagered)*100).toFixed(2))
                            }
                        }
                        overallUserArray.push(user)
                    })
                    console.log({ overallUserArray: JSON.stringify(overallUserArray)})
                    let leaderboardCriteria = {
                    year: event.year,
                    season: season,
                    sport: sport
                    }
                    if (periodValue !== undefined && periodValue !== null) {
                        leaderboardCriteria[periodField] = periodValue;
                    }
                    let leaderboardUpdate = {
                        $set: {
                            "overall.users": overallUserArray
                        }
                    }
                    console.log({ leaderboardCriteria, leaderboardUpdate })
                    //console.log({filteredResults: JSON.stringify(filteredResults)});
                    const updateResponse = await db.collection('leaderboards').updateOne(leaderboardCriteria, leaderboardUpdate, { upsert: true });
                    console.log('updateResponse', updateResponse)
                        //db.collection('leaderboards').update({ })
                    return {
                        message: queryPromises.length + ' users updated'
                    }
                    
                }
                
    } catch (error) {
        console.log(error);
        return { status: 500, message: 'Error calculating individual user performance overall', error: error };
    }
};