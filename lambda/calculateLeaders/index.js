'use strict';

var assert = require("assert"),
    mongo = require("mongodb"),
    {config} = require('./config');
    
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda"); // ES Modules import
const lambda = new LambdaClient(AWSConfig);

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

exports.handler = async (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const { sport, year, season, gameWeek } = event;
    const collectionObject = {
        nfl: 'games',
        ncaaf: 'games-ncaaf',
        ncaam: 'games-ncaam',
        nba: 'games-nba'
    }
    if (!sport || !year || !season || gameWeek == null) {
        return {status: 200, succeeded: false, message: "Event incomplete", event}
    }
    try {
    
        const client = await mongo.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

        const db = client.db('pcsm')

            var aggOpts = [
                {
                    $match: {
                        year: year,
                        gameWeek: {$gte: 0},
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
                return {succeeded: false, message: "No collection found"};
            };
            
            const results = await db.collection(collectionObject[sport]).aggregate(aggOpts).toArray();
                

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

                const promiseResults = await Promise.all(queryPromises);
                    
                var lambdaParams = {
                    FunctionName: 'calculateCrowdOverallPerformance', // the lambda function we are going to invoke
                    InvocationType: 'Event',
                    LogType: 'None',
                    Payload: `{ "message": "calculateLeaders completed", "sport": "${sport}", "year": ${year}, "season": "${season}", "gameWeek": ${gameWeek} }`
                };

                    const command = new InvokeCommand(lambdaParams, function(err, data) {
                        console.log('err', err);
                        console.log('data', data);
                        if (err) {
                        context.fail('addToGroupError', err);
                        } else {
                        context.succeed('Lambda_B said '+ data.Payload);
                        }
                    })
                
                    const lambdaresponse = await lambda.send(command)
                    return {status: 200, succeeded: true, message: "Promises fulfilled"};
                
        } catch (err) {
            console.log(err)
            return {status: 500, succeeded: false, message: "Error occurred", error: err};
        }
};