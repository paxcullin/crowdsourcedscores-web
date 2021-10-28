'use strict';

var assert = require("assert"),
    mongo = require("mongodb"),
    {config} = require('./config');
    
const AWS = require('aws-sdk');    
const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

(function() {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
})();

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const { sport, year, season, gameWeek } = event;
    const collectionObject = {
        nfl: 'games',
        ncaaf: 'games-ncaaf',
        ncaam: 'games-ncaam'
    }
    if (!sport || !year || !season || !gameWeek) {
        context.fail({succeeded: false, message: "Event incomplete", event})
    }
    
    mongo.connect(MONGO_URL, function (err, client) {

        assert.equal(null, err);

        if (err) {
            return context.done(err, null);
        }

        const db = client.db('pcsm')

        var aggOpts = [
            {
                $match: {
                    year: year,
                    gameWeek: {$gt: 0},
                    season: season,
                    sport: sport,
                    results: { $exists: true }
                }
            },
            {
                $group: {
                    _id: { gameWeek: "$gameWeek", sport: "$sport", year: "$year", season: "$season" },
                    suCorrect: {$sum: "$crowd.results.winner.correct"},
                    suPush: {$sum: "$crowd.results.winner.push"},
                    atsCorrect: {$sum: "$crowd.results.spread.correct"},
                    atsPush: {$sum: "$crowd.results.spread.push"},
                    totalCorrect: {$sum: "$crowd.results.total.correct"},
                    totalPush: {$sum: "$crowd.results.total.push"},
                    predictionScore: {$sum: "$crowd.results.predictionScore"},
                    totalGames: {$sum: 1}
                }
            }
        ]
        if (!collectionObject[sport]) {
            context.done(null, {succeeded: false, message: "No collection found"})
        };
        
        db.collection(collectionObject[sport]).aggregate(aggOpts).toArray(function (err, results) {
            
            assert.equal(err, null);
            if (err) {
                console.log(err)
                return context.fail(err, null);
            }

            var queryPromises = [];
            results.forEach((result) => {
                console.log("result: ", result);
                // criteria updated to update crowd predictions only when games are in the future
                //console.log("dateMidnight.toISOString():",dateMidnight.toISOString());
                const { gameWeek, year, season, sport }  = result._id;
                var suPercentage = result.suCorrect / (result.totalGames - result.suPush);
                var atsPercentage = result.atsCorrect / (result.totalGames - result.atsPush);
                var totalPercentage = result.totalCorrect / (result.totalGames - result.totalPush);
                
                var criteria = {year: year,gameWeek: gameWeek, season: season, sport: sport};
                
                var update = {
                    $set: {
                        [`weekly.crowd`]: {
                            winner: {
                                correct: result.suCorrect,
                                push: result.suPush,
                                percentage: suPercentage
                            },
                            spread: {
                                correct: result.atsCorrect,
                                push: result.atsPush,
                                percentage: atsPercentage
                            },
                            total: { 
                                correct: result.totalCorrect,
                                push: result.totalPush,
                                percentage: totalPercentage
                            },
                            predictionScore: result.predictionScore,
                            totalGames: result.totalGames
                        }
                    }
                };
                console.log("criteria: ", criteria,"; update: ", JSON.stringify(update, null, 2));
                var queryPromise = db.collection('leaderboards').updateOne(criteria, update, {upsert: true})
                    .then(function (updateResult) {
                        var message = `{ gameWeek: ${result._id}, crowd.winner: ${result.suCorrect}, crowd.spread: ${result.atsCorrect}, crowd.total: ${result.totalCorrect}, crowd.totalGames: ${result.totalGames} }`;
                        console.log('Updated crowd predictions', message);
                        return Promise.resolve(updateResult);
                    });
                queryPromises.push(Promise.resolve(queryPromise));
            });

            Promise.all(queryPromises).then(function() {
                
                            var lambdaParams = {
                                FunctionName: 'calculateCrowdOverallPerformance', // the lambda function we are going to invoke
                                InvocationType: 'Event',
                                LogType: 'None',
                                Payload: `{ "message": "calculateLeaders completed", "sport": "${sport}", "year": ${year}, "season": "${season}", "gameWeek": ${gameWeek} }`
                              };
                            
                              lambda.invoke(lambdaParams, function(err, data) {
                                if (err) {
                                  console.log("group-joinGroup call err: ", err);
                                } else {
                                  console.log("group-joinGroup call data: ", data);
                                  return context.done(null, "Promises fulfilled");
                                }
                              })
            });
        });
    
    });
};