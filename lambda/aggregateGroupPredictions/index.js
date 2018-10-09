'use strict';

var assert = require("assert"),
    _ = require("lodash"),
    Promise = require("bluebird"),
    mongo = Promise.promisifyAll(require("mongodb"));

const MONGO_URL = 'mongodb://pcsm-user:*dZ2HaWN@ds011775.mlab.com:11775/pcsm';

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

    mongo.connect(MONGO_URL, function (err, db) {
        
        assert.equal(null, err);

        if (err) {
            return context.done("connect error: " + err, null);
        }
        db.collection('groups').find({year: 2018},{_id:false}).toArray(function(err, groups) {
            var groupsLength = groups.length;
            if (err) {
                console.log("err: ", err);
                context.done("groups err: ", groups, null);
            }
            
            var predictionsUpdated = 0;
            _.each(groups, function(group) {
                
                var aggOpts = [
                    {
                        $unwind: "$groups"
                    },
                    {
                        $match: { 
                            "groups.groupId": group.groupId
                        }
                    },
                    {
                        $group: {
                            _id: {groupId: "$groups.groupId", gameId: "$gameId", year: "$year", gameWeek: "$gameWeek"},
                            awayAvg: {$avg: "$awayTeam.score"},
                            homeAvg: {$avg: "$homeTeam.score"},
                            totalAvg: {$avg: "$total"},
                            spreadAvg: {$avg: "$spread"}
                        }
                    }
                    
                ];
                //Get Today's Date to set criteria
                var startDate = new Date(); // this is the starting date that looks like ISODate("2014-10-03T04:00:00.188Z")
        
                startDate.setSeconds(0);
                startDate.setHours(0);
                startDate.setMinutes(0);
                
                var dateMidnight = new Date(startDate);
                dateMidnight.setHours(23);
                dateMidnight.setMinutes(59);
                dateMidnight.setSeconds(59);
                //console.log("aggOpts: ", aggOpts)
                db.collection('predictions').aggregate(aggOpts).toArray(function (err, results) {
                    
                    assert.equal(err, null);
                    if (err) {
                        console.log(err);
                        return context.fail("aggregate err: " + err, null);
                    }
                    
        
                    var queryPromises = [];
                    var resultsLength = results.length;
                    if (results.length === 0) {
                        groupsLength--;
                    }
                    results.sort(function(a,b) {
                        if (a.gameId > b.gameId) { return 1; }
                        if (a.gameId < b.gameId) { return -1; }
                        return 0;
                    })
                    _.each(results, function (result) {
                        //console.log("result: ", result)
                        // criteria updated to update crowd predictions only when games are in the future
                        //console.log("dateMidnight.toISOString():",dateMidnight.toISOString());
                        var criteria = {
                            groupId: group.groupId,
                            year: group.year,
                            sport: group.sport
                        };
                        // ,
                        //     predictions: { $elemMatch: { gameId: result._id.gameId, year: result._id.year } }
                        //console.log("criteria: ", criteria)
                        var awayAvg = Math.round10(result.awayAvg, -2)
                        var homeAvg = Math.round10(result.homeAvg, -2)
                        var totalAvg = Math.round10(result.totalAvg, -2)
                        var spreadAvg = Math.round10(result.spreadAvg, -2)
                        var crowdResult = {};
                        //var predictionIndex = group.predictions.findIndex(o => o.gameId === result._id.gameId);
                        var update = {
                            $pull: {
                                    predictions: {
                                        gameId: result._id.gameId,
                                        year: result._id.year,
                                        gameWeek: result._id.gameWeek
                                    }
                            }
                        }
                        // ,
                        //                 "predictions.$.awayTeam": { score: awayAvg},
                        //                 "predictions.$.homeTeam": { score: homeAvg},
                        //                 "predictions.$.total": totalAvg,
                        //                 "predictions.$.spread": spreadAvg
                        
                        //var queryPromise = 
                        db.collection('groups').update(criteria, update)
                        .then(function (updateResult) {
                            var updateRespObj = JSON.parse(updateResult);
                            console.log('updateResult: ', updateResult.result);
                            // if (updateRespObj.nModified === 1) {
                            //     predictionsUpdated++;
                            //     var message = `{ groupId: ${group.groupId}, gameId: ${result._id.gameId}, year: ${result._id.year}, awayAvg: ${awayAvg}, homeAvg: ${homeAvg}, totalAvg: ${totalAvg}, spreadAvg: ${spreadAvg}, predictionsUpdated: ${predictionsUpdated} }`
                            //     console.log("predictionUpdated! ", message)
                            //     //console.log('Updated crowd predictions', message);
                            //     resultsLength--;
                            //     console.log('resultsLength: ', resultsLength)
                            //     if (resultsLength === 0) {
                            //         groupsLength--;
                            //         console.log("groupsLength: ", groupsLength)
                            //         if (groupsLength === 0) {
                            //             context.done(null, groups.length + " groups updated")
                            //         }
                            //     }
                            //     return Promise.resolve(updateResult);
                            // } else {
                                    
                            // }
                            var pushCriteria = {
                                        groupId: group.groupId,
                                        year: group.year,
                                        sport: group.sport
                                    };
                            
                                    var pushUpdate = {
                                        $push: {
                                            predictions: {
                                                gameId: result._id.gameId,
                                                year: result._id.year,
                                                gameWeek: result._id.gameWeek,
                                                awayTeam: { score: awayAvg},
                                                homeTeam: { score: homeAvg},
                                                total: totalAvg,
                                                spread: spreadAvg
                                            }
                                        }
                                    }
                                    db.collection('groups').update(pushCriteria, pushUpdate)
                                    .then(function(updateResult2) {
                                        console.log("prediction added! ", updateResult2.result);
                                        
                                        resultsLength--;
                                        console.log('resultsLength: ', resultsLength)
                                        if (resultsLength === 0) {
                                            groupsLength--;
                                            console.log("groupsLength: ", groupsLength)
                                            if (groupsLength === 0) {
                                                context.done(null, groups.length + " groups updated")
                                            }
                                        }
                                        return Promise.resolve(updateResult2);
                                    });
                        });
                            
                                
                        //queryPromises.push(Promise.resolve(queryPromise));
                    }); // ends _.each aggregate result
                            console.log("queryPromises: ", queryPromises.length, " for group ", group.groupName)
                        // Promise.all(queryPromises).then(function(response) {
                        //     // var message = `{ gameId: ${result._id}, year: ${_.year}, awayAvg: ${awayAvg}, homeAvg: ${homeAvg}, totalAvg: ${totalAvg}, spreadAvg: ${spreadAvg} }`
                        //     return context.done(null, "groups updated: ", response);
                        // });
                }); // close aggregate results function
                
            }); // close _.each group function
        }); // close _.each group
    });
};
