'use strict';

var assert = require("assert"),
    mongo = require("mongodb").MongoClient,
    {config} = require('./config');
    

    const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

exports.handler = (event, context, callback) => {
        
    var record = ""
    if (event.Records) {
        record = event.Records[0];
    }
    var eventGameId, eventGameWeek, eventSport, eventSeason, eventYear;
    var gamesCollection = 'games';
    var predictionsCollection = 'predictions';
    var gameQuery = {year:2018, results: {$exists: true}}
    var predictionQuery = { year: 2018, predictionScore: { $exists: false } };
    if (record.Sns.MessageAttributes.userId) {
        predictionQuery.userId = record.Sns.MessageAttributes.userId;
    }
    
    if (record != "") {
        eventGameId = parseInt(record.Sns.MessageAttributes.gameId.Value);
        eventGameWeek = parseInt(record.Sns.MessageAttributes.gameWeek.Value);
        eventSport = record.Sns.MessageAttributes.sport.Value;
        eventSeason = record.Sns.MessageAttributes.season.Value;
        eventYear = parseInt(record.Sns.MessageAttributes.year.Value);
        if (eventSport === 'ncaaf') {
            gamesCollection = 'games-ncaaf';
            predictionsCollection = 'predictions-ncaaf';
        } else if (eventSport === 'ncaam') {
            gamesCollection = 'games-ncaam'
            predictionsCollection = 'predictions-ncaam'
        }
        gameQuery = {year:eventYear, sport: eventSport, gameWeek: eventGameWeek, results: {$exists: true}}
    }
        var updateOverall = {};
        var queryPromises = [];
        
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
        const { season, sport } = event 
        mongo.connect(MONGO_URL, function (err, client) {
            if (err) {
                console.log(err);
                return context.fail(err, null);
            }
            const db = client.db('pcsm');
            const groups = db.collection('groups');
            var matchOpts = {
                $match: {
                    year: eventYear,
                    season: eventSeason,
                    gameWeek: eventGameWeek,
                    results: { $exists: true },
                }
            }
            if (event.groupId) {
                matchOpts = {
                    $match: {
                        year: eventYear,
                        season: eventSeason,
                        gameWeek: eventGameWeek,
                        results: { $exists: true }
                    }
                }
            }
            
                var aggOpts = [
                    {
                        "$unwind": "$groups"
                    },
                    matchOpts,
                    {
                        $group: {
                            _id: {userId: "$userId", preferred_username: "$preferred_username", gameWeek: "$gameWeek", season: "$season", groupId: '$groups.groupId'},
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
                console.log(`aggOpts`, aggOpts)
                db.collection(predictionsCollection).aggregate(aggOpts).toArray(function (err, results) {
                    console.log(`results`, results.length)
                    if (!results || results.length === 0) {
                        return { message: 'no results'}
                    }
                    var resultsArrayLength = results.length;
                    var updateObjectWeeklyKey = '';
                    
                    assert.equal(err, null);
                    if (err) {
                        console.log(err);
                        return context.fail(err, null);
                    }
                    
                    // get groups
                    groups.find({ year: eventYear, season: eventSeason, sport: eventSport}).toArray((err, groups) => {
                        if (err) {
                            context.done(err, null)
                        }
                        if (groups.length === 0) {
                            console.log('no groups found')
                            context.done(null, { status: 200, message: 'No groups found'})
                        }
                        
                        let groupsLength = groups.length
                        console.log('groups.length: ', groups.length);
                        groups.forEach(group => {
                            const { groupId } = group
                            let filteredResults = [];
                            let weeklyUserArray = [];
                            filteredResults = results.filter((result) => {
                                return (result._id.groupId === groupId)
                            })
                            
                            filteredResults = filteredResults.sort((a, b) => {
                                return (a.predictionScore > b.predictionScore) ? -1 : 1;
                            })
                            console.log(filteredResults.length)
                            let resultsLength = filteredResults.length;
                            filteredResults.forEach((result, index) => {
                                // console.log(`result`, result)
                                let starsWagered = result.atsStarsWagered + result.totalStarsWagered;
                                let starsNet = result.atsStarsNet + result.totalStarsNet;
                                let user = { 
                                    username: result._id.userId,
                                    preferred_username: result._id.preferred_username,
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
                                weeklyUserArray.push(user)
                                resultsLength--;
                            })
                            console.log({ weeklyUserArray: weeklyUserArray })
                            if (weeklyUserArray.length > 0 && resultsLength === 0) {
                                let groupCriteria = {
                                  year: eventYear,
                                  sport: eventSport,
                                  season: eventSeason,
                                  groupId: groupId
                                }
                                let leaderboardUpdate = {
                                    $set: {
                                        [`leaderboard.weekly.${eventGameWeek}`]: {
                                            users: weeklyUserArray
                                        }
                                    }
                                }
                                // console.log({ leaderboardCriteria, leaderboardUpdate })
                                // console.log({filteredResults: JSON.stringify(filteredResults)});
                                queryPromises.push(db.collection('groups').updateOne(groupCriteria, leaderboardUpdate, { upsert: true }))
                                
                            }
                            if (groupsLength === 0) {
                                Promise.all(queryPromises)
                                .then(resolve => {
                                    console.log('group weekly leaderboards updated; resolve: ', resolve);
                                    context.done(null, { status: 200, message: 'group weekly leaderboards updated'})
                                })
                                .catch(reject => {
                                    console.log('group weekly leaderboards updated; reject: ', reject); 
                                    context.done(null, { status: 500, message: 'group weekly leaderboards FAIL'})
                                })
                            }
                        }); // end group foreach
                    });
                }); //end aggregate predictions function
              
        }); 
    }