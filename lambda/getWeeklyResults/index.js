'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert");

const MONGO_URL = 'mongodb://pcsm-user:*dZ2HaWN@ds011775.mlab.com:11775/pcsm';

console.log('Loading function');

function formatPercentage(number) {
    var percentFormatted = Math.floor(number * 100);
    return percentFormatted;
}

exports.handler = (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    mongo.connect(MONGO_URL, function (err, db) {
        assert.equal(null, err);
        if (err) {
            context.done(err, null);
        }
        console.log("Connected succesfully to mongodb");

        var collection = db.collection('leaderboards');
        var weeklyResultsArray = [
            ['Week', 'S/U', 'ATS', 'O/U', 'Total Games']];
        var overallResultsArray = [
            ['Week', 'S/U', 'ATS', 'O/U']];
        var resultsObject = {
            weekly: {},
            overall: {}
        }
        collection.find({"year": parseInt(event.params.path.year), "gameWeek": {$lte: parseInt(event.params.path.week)}}, {_id: false},{sort: {"gameWeek": 1}}).toArray(function (err, weeklyResults) {
            assert.equal(err, null);
            if (err) {
                context.fail(err, null);
            }
            //setting variable for what to push into the array.
            for (var i=0; i < weeklyResults.length; i++) {
                var weeklyResultsArrayObject = [];
                var overallResultsArrayObject = [];
                if (weeklyResults[i].weekly) {
                    weeklyResultsArrayObject.push(weeklyResults[i].gameWeek);
                    weeklyResultsArrayObject.push(weeklyResults[i].weekly.crowd.winner.correct);
                    weeklyResultsArrayObject.push(weeklyResults[i].weekly.crowd.spread.correct);
                    weeklyResultsArrayObject.push(weeklyResults[i].weekly.crowd.total.correct);
                    weeklyResultsArrayObject.push(weeklyResults[i].weekly.crowd.totalGames);
                    weeklyResultsArray.push(weeklyResultsArrayObject);
                
                    overallResultsArrayObject.push(weeklyResults[i].gameWeek);
                    overallResultsArrayObject.push(formatPercentage(weeklyResults[i].overall.crowd.winner.percentage));
                    overallResultsArrayObject.push(formatPercentage(weeklyResults[i].overall.crowd.spread.percentage));
                    overallResultsArrayObject.push(formatPercentage(weeklyResults[i].overall.crowd.total.percentage));
                    overallResultsArray.push(overallResultsArrayObject);
                }
            }

            
            resultsObject.weekly = weeklyResultsArray;
            resultsObject.overall = overallResultsArray;
            console.log("resultsObject: ", JSON.stringify(resultsObject));
            return context.done(null, resultsObject);
        });
    });
};
