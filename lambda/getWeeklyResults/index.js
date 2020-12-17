'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert");

    const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

console.log('Loading function');

function formatPercentage(number) {
    var percentFormatted = Math.floor(number * 100);
    return percentFormatted;
}

exports.handler = (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const { year, season, sport, week } = event;
    

    mongo.connect(MONGO_URL, (err, client) => {
        assert.equal(null, err);
        if (err) {
            context.done(err, null);
        }
        console.log("Connected succesfully to mongodb");
        const db = client.db('pcsm');
        var collection = db.collection('leaderboards');
        var weeklyResultsArray = [
            ['Week', 'S/U', 'ATS', 'O/U', 'Total Games']];
        var overallResultsArray = [
            ['Week', 'S/U', 'ATS', 'O/U']];
        var resultsObject = {
            weekly: {},
            overall: {}
        }
        let query = {"year": parseInt(year), "season": season, "gameWeek": {$lte: parseInt(week)}, "season": season};
        query.season = event.season ? event.season : null;
        query.sport = event.sport ? event.sport : null;
        collection.find(query, {_id: false},{sort: {"gameWeek": 1}}).toArray(function (err, weeklyResults) {
            assert.equal(err, null);
            if (err) {
                context.fail(err, null);
            }
            //setting variable for what to push into the array.
            var weeklyResultsRecord = {};
            var overallResultsRecord = {};
            var overallResultObject = {};
            weeklyResults.forEach(function(weeklyResult) {
                var weeklyResultsArrayObject = [];
                var overallResultsArrayObject = [];
                var weeklyResultObj = {};
                
                if (weeklyResult.weekly && weeklyResult.weekly.crowd) {
                    weeklyResultsArrayObject.push(weeklyResult.gameWeek);
                    weeklyResultsArrayObject.push(weeklyResult.weekly.crowd.winner.correct);
                    weeklyResultsArrayObject.push(weeklyResult.weekly.crowd.spread.correct);
                    weeklyResultsArrayObject.push(weeklyResult.weekly.crowd.total.correct);
                    weeklyResultsArrayObject.push(weeklyResult.weekly.crowd.totalGames);
                    weeklyResultsArray.push(weeklyResultsArrayObject);
                    var weeklySUIncorrect = weeklyResult.weekly.crowd.totalGames - weeklyResult.weekly.crowd.winner.correct;
                    var weeklyATSIncorrect = weeklyResult.weekly.crowd.totalGames - weeklyResult.weekly.crowd.spread.push - weeklyResult.weekly.crowd.spread.correct;
                    var weeklyTotalIncorrect = weeklyResult.weekly.crowd.totalGames - weeklyResult.weekly.crowd.total.push - weeklyResult.weekly.crowd.total.correct;
                    var weeklyResultObj = {
                        gameWeek: weeklyResult.gameWeek,
                        winner: {
                            correct: weeklyResult.weekly.crowd.winner.correct,
                            incorrect: weeklySUIncorrect
                        },
                        spread: {
                            correct: weeklyResult.weekly.crowd.spread.correct,
                            incorrect: weeklyATSIncorrect,
                            push: weeklyResult.weekly.crowd.spread.push
                        },
                        total: {
                            correct: weeklyResult.weekly.crowd.total.correct,
                            incorrect: weeklyTotalIncorrect,
                            push: weeklyResult.weekly.crowd.total.push
                        },
                        predictionScore: weeklyResult.weekly.crowd.predictionScore
                        
                    }
                    if (weeklyResultObj.gameWeek === week) {
                        weeklyResultsRecord = weeklyResultObj;
                    }
                
                    overallResultsArrayObject.push(weeklyResult.gameWeek);
                    overallResultsArrayObject.push(formatPercentage(weeklyResult.overall.crowd.winner.percentage));
                    overallResultsArrayObject.push(formatPercentage(weeklyResult.overall.crowd.spread.percentage));
                    overallResultsArrayObject.push(formatPercentage(weeklyResult.overall.crowd.total.percentage));
                    overallResultsArray.push(overallResultsArrayObject);
                    var overallSUIncorrect = weeklyResult.overall.crowd.totalGames - weeklyResult.overall.crowd.winner.correct;
                    var overallATSIncorrect = weeklyResult.overall.crowd.totalGames - weeklyResult.overall.crowd.spread.push - weeklyResult.overall.crowd.spread.correct;
                    var overallTotalIncorrect = weeklyResult.overall.crowd.totalGames - weeklyResult.overall.crowd.total.push - weeklyResult.overall.crowd.total.correct;
                    overallResultObject = {
                        gameWeek: weeklyResult.gameWeek,
                        winner: {
                            correct: weeklyResult.overall.crowd.winner.correct,
                            incorrect: overallSUIncorrect
                        },
                        spread: {
                            correct: weeklyResult.overall.crowd.spread.correct,
                            incorrect: overallATSIncorrect,
                            push: weeklyResult.overall.crowd.spread.push
                        },
                        total: {
                            correct: weeklyResult.overall.crowd.total.correct,
                            incorrect: overallTotalIncorrect,
                            push: weeklyResult.overall.crowd.total.push
                        },
                        predictionScore: weeklyResult.overall.crowd.predictionScore,
                        totalGames: weeklyResult.overall.crowd.totalGames
                    }
                }
            });

            
            resultsObject.weekly = weeklyResultsArray;
            resultsObject.overall = overallResultsArray;
            resultsObject.weeklyRecord = weeklyResultsRecord;
            resultsObject.overallRecord = overallResultObject;
            
            console.log("resultsObject: ", JSON.stringify(resultsObject));
            return context.done(null, resultsObject);
        });
    });
};
