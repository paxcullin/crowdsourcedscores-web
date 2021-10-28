'use strict';

var assert = require("assert"),
    mongo = require("mongodb").MongoClient,                                                                                              
    {config} = require("config");
    
    const AWS = require('aws-sdk');
    const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });
    
    const MONGO_URL = `mongodb+srv://${config.config.username}:${config.config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

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

exports.handler = (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    mongo.connect(MONGO_URL, function (err, client) {
        assert.equal(null, err);

        if (err) {
            return context.done(err, null);
        }
        
        const db = client.db('pcsm');
        
        var matchOpts = {
            $match: {
                year: 2018
            }
        };
        var predictionsCollection = 'predictions';
        var gamesCollection = 'games';
        
        const messageRecord = event.Records[0].Sns;
        const gameAttributes = messageRecord.MessageAttributes;
        const year = parseInt(gameAttributes.year.Value);
        const gameId = parseInt(gameAttributes.gameId.Value);
        const gameWeek = parseInt(gameAttributes.gameWeek.Value);
        var matchOpts = {
          $match: {
            year: year,
            gameId: gameId,
            gameWeek: gameWeek
          }
        }
        var groupOpts = {
                $group: {
                    _id: "$gameId",
                    awayAvg: {$avg: "$awayTeam.score"},
                    homeAvg: {$avg: "$homeTeam.score"},
                    totalAvg: {$avg: "$total"},
                    spreadAvg: {$avg: "$spread"}
                }
            }
        if (parseInt(gameAttributes.gameId.Value) === 267) {
            groupOpts = {
                $group: {
                    _id: "$gameId",
                    awayAvg: {$avg: "$awayTeam.score"},
                    homeAvg: {$avg: "$homeTeam.score"},
                    totalAvg: {$avg: "$total"},
                    spreadAvg: {$avg: "$spread"},
                    awayQ1: {$avg: "$awayTeam.periods.q1"},
                    awayQ2: {$avg: "$awayTeam.periods.q2"},
                    awayQ3: {$avg: "$awayTeam.periods.q3"},
                    awayQ4: {$avg: "$awayTeam.periods.q4"},
                    homeQ1: {$avg: "$homeTeam.periods.q1"},
                    homeQ2: {$avg: "$homeTeam.periods.q2"},
                    homeQ3: {$avg: "$homeTeam.periods.q3"},
                    homeQ4: {$avg: "$homeTeam.periods.q4"}
                }
            }
        }
        
        
        if (gameAttributes.sport.Value === 'ncaaf') {
          predictionsCollection = 'predictions-ncaaf';
          gamesCollection = 'games-ncaaf';
        } else if (gameAttributes.sport.Value === 'ncaam') {
          predictionsCollection = 'predictions-ncaam'
          gamesCollection = 'games-ncaam'
        }
        
        var aggOpts = [
            matchOpts,
            groupOpts
        ]
        
        //Get Today's Date to set criteria
        var startDate = new Date(); // this is the starting date that looks like ISODate("2014-10-03T04:00:00.188Z")

        startDate.setSeconds(0);
        startDate.setHours(0);
        startDate.setMinutes(0);
        
        var dateMidnight = new Date(startDate);
        dateMidnight.setHours(23);
        dateMidnight.setMinutes(59);
        dateMidnight.setSeconds(59);
        
        console.log('aggOpts: ', aggOpts)
        db.collection(predictionsCollection).aggregate(aggOpts).toArray(function (err, results) {
            assert.equal(err, null);
            if (err) {
                console.log(err)
                return context.fail(err, null);
            }
            console.log('results.length: ', results.length);
            if (results.length === 0) {
              context.done(null, `No results found for ${matchOpts}`)
            }
            var queryPromises = [];
            results.forEach((result) => {
                console.log('result: ', result)
                // criteria updated to update crowd predictions only when games are in the future
                //console.log("dateMidnight.toISOString():",dateMidnight.toISOString());
                var criteria = {gameId: result._id, year: year,results: {$exists: false}};
                
                var awayAvg = Math.round10(result.awayAvg, -2)
                var homeAvg = Math.round10(result.homeAvg, -2)
                var totalAvg = Math.round10(result.totalAvg, -2)
                var spreadAvg = Math.round10(result.spreadAvg, -2)
                var crowdResult = {};
                var update = {
                    $set: {
                        crowd: {
                            awayTeam: { score: awayAvg},
                            homeTeam: { score: homeAvg},
                            total: totalAvg,
                            spread: spreadAvg
                        }
                    }
                }
                if (result._id === 267) {
                  update = {
                    $set: {
                      crowd: {
                          awayTeam: { 
                            score: awayAvg,
                            periods: {
                              q1: result.awayQ1,
                              q2: result.awayQ2,
                              q3: result.awayQ3,
                              q4: result.awayQ4
                            }
                          },
                          homeTeam: { 
                            score: homeAvg,
                            periods: {
                              q1: result.homeQ1,
                              q2: result.homeQ2,
                              q3: result.homeQ3,
                              q4: result.homeQ4
                            }
                          },
                          total: totalAvg,
                          spread: spreadAvg
                      }
                    }
                  }
                }
                //console.log("criteria:", criteria)
                var queryPromise = db.collection(gamesCollection).updateOne(criteria, update)
                    .then(function (updateResult) {
                        var message = `{ gameId: ${result._id}, awayAvg: ${awayAvg}, homeAvg: ${homeAvg}, totalAvg: ${totalAvg}, spreadAvg: ${spreadAvg} }`
                        console.log('Updated crowd predictions', message);
                        return Promise.resolve(updateResult);
                    });
                queryPromises.push(queryPromise);
            });
            
            Promise.all(queryPromises).then(function() {
   
              console.log("calling aggregate group params")
                  var aggregateGroupParams = {
                      FunctionName: 'aggregateGroupPredictions', // the lambda function we are going to invoke
                      InvocationType: 'Event',
                      LogType: 'None',
                      Payload: '{ "sport": "' + gameAttributes.sport.Value + '", "year": 2018}'
                    };
                  // 
                lambda.invoke(aggregateGroupParams, function(err, data) {
                  if (err) {
                    console.log("aggregateGroupPredictions err: ", err);
                  } else {
                    console.log('aggregateGroupPredictions response: ', data.Payload);
                  }
                })
                return context.done(null, "promises completed");
            });
        });
    });
};
