'use strict';

var assert = require("assert"),
    mongo = require("mongodb").MongoClient,
    {config} = require('config');


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


exports.handler = (event, context) => {
    
    
    console.log('Received event:', JSON.stringify(event, null, 2));
    const messageAttributes = event.Records[0].Sns.MessageAttributes;
    let year = 2019,
        sport = "nfl",
        gameId = null,
        gameWeek = 1,
        season = 'reg';
    Object.keys(messageAttributes).forEach(attributeKey => {
        if (attributeKey === "gameId") {
            gameId = parseInt(messageAttributes[attributeKey].Value)
            return
        }
        if (attributeKey === "year") {
            year = parseInt(messageAttributes[attributeKey].Value)
            return
        }
        if (attributeKey === "sport") {
            sport = messageAttributes[attributeKey].Value
            return
        }
        if (attributeKey === "gameWeek") {
            gameWeek = parseInt(messageAttributes[attributeKey].Value)
            return
        }
        if (attributeKey === "season") {
            season = messageAttributes[attributeKey].Value
            return
        }
    })
    console.log(`${year},
        ${sport},
        ${gameId},
        ${gameWeek},
        ${season}`)
    mongo.connect(MONGO_URL, function (err, dBase) {
        // console.log(dBase)
        const db = dBase.db('pcsm')

        assert.equal(null, err);

        if (err) {
            return context.done("connect error: " + err, null);
        }
        db.collection('groups').find({year: 2020, public: { $ne: null }},{_id:false}).toArray(function(err, groups) {
            var groupsLength = groups.length;
            if (err) {
                console.log("err: ", err)
                context.done("groups err: ", groups, null)
            }
            
            /* unwind - each prediction in the predictions collection is attached to all groups associated to the user
                unwinding creates an individual prediction with only one group ID
                Match the current group ID
                Get a prediction for each game ID
            */
            var predictionsUpdated = 0
            groups.forEach((group) => {
                // create users array to match predictions
                let usersArray = [];
                group.users.forEach(user => usersArray.push(user.preferred_username))
                console.log('usersArray', usersArray)
                let aggOpts = [
                    {
                        $match: {
                            "preferred_username": {"$in": usersArray},
                            "year": 2020,
                            "season": "post"
                        }
                    },
                    {
                        $group: {
                            _id: {gameId: "$gameId", year: "$year", season: "$season", gameWeek: "$gameWeek"},
                            awayAvg: {$avg: "$awayTeam.score"},
                            homeAvg: {$avg: "$homeTeam.score"},
                            totalAvg: {$avg: "$total"},
                            spreadAvg: {$avg: "$spread"}
                        }
                    }
                    
                ]
                
                console.log("aggOpts: ", aggOpts)
                db.collection('predictions').aggregate(aggOpts).toArray(function (err, results) {
                    console.log('results.length', results.length)
                    if (err) {
                        console.log(err)
                        assert.equal(err, null);
                        return context.fail("aggregate err: " + err, null);
                    }
                    
        
                    var queryPromises = [];
                    var resultsLength = results.length;
                    if (results.length === 0) {
                        groupsLength--;
                    }
                    results.sort(function(a,b) {
                        if (a.gameId > b.gameId) { return 1 };
                        if (a.gameId < b.gameId) { return -1 };
                        return 0;
                    })
                    results.forEach((result) => {
                        console.log("groupId, result: ", group.groupId, result)
                        // criteria updated to update crowd predictions only when games are in the future
                        //console.log("dateMidnight.toISOString():",dateMidnight.toISOString());
                        var criteria = {
                            groupId: group.groupId,
                            year: group.year,
                            sport: group.sport,
                            groupName: group.groupName,
                            predictions: {
                                $elemMatch: { gameId: result._id.gameId } 
                            }
                        };
                        //console.log({criteria: JSON.stringify(criteria)})
                        // ,
                        //     predictions: { $elemMatch: { gameId: result._id.gameId, year: result._id.year } }
                        //console.log("criteria: ", criteria)
                        var awayAvg = Math.round10(result.awayAvg, -2)
                        var homeAvg = Math.round10(result.homeAvg, -2)
                        var totalAvg = Math.round10(result.totalAvg, -2)
                        var spreadAvg = Math.round10(result.spreadAvg, -2)
                        var crowdResult = {};
                        const updateObject = {
                                [`predictions.$.gameId`]: result._id.gameId,
                                [`predictions.$.year`]: result._id.year,
                                [`predictions.$.season`]: result._id.season,
                                [`predictions.$.gameWeek`]: result._id.gameWeek,
                                [`predictions.$.awayTeam`]: { score: awayAvg },
                                [`predictions.$.homeTeam`]: { score: homeAvg },
                                [`predictions.$.total`]: totalAvg,
                                [`predictions.$.spread`]: spreadAvg
                            }
                        //var predictionIndex = group.predictions.findIndex(o => o.gameId === result._id.gameId);
                        var update = {
                            $set: updateObject
                        }
                        db.collection('groups').updateOne(criteria, update)
                        .then(response => {
                            let respObj = JSON.parse(response)
                            console.log({"respObj.result.n": respObj.result.n, "respObj.result.nModified":respObj.result.nModified })
                            if (respObj.result.n === 1 && respObj.result.nModified === 1) { // result updated
                                resultsLength--;
                                // console.log({resultsLength})
                                if (resultsLength === 0) {
                                    groupsLength--;
                                    console.log("groupsLength: ", groupsLength)
                                    if (groupsLength === 0) {
                                        context.done(null, groups.length + " groups updated")
                                    }
                                }
                            } else if (respObj.n === 0 && respObj.nModified === 0) { // no result found, adding
                                criteria = {
                                    groupId: group.groupId,
                                    year: group.year,
                                    sport: group.sport,
                                    groupName: group.groupName
                                };
                                update = {
                                    $push: {
                                        predictions: {
                                            gameId: result._id.gameId,
                                            year: result._id.year,
                                            season: result._id.season,
                                            gameWeek: result._id.gameWeek,
                                            awayTeam: { score: awayAvg },
                                            homeTeam: { score: homeAvg },
                                            total: totalAvg,
                                            spread: spreadAvg
                                        }
                                    }
                                }
                                db.collection('groups').updateOne(criteria, update)
                                .then(response => {
                                    resultsLength--;
                                    // console.log({199: resultsLength})
                                    if (resultsLength === 0) {
                                        groupsLength--;
                                        console.log("groupsLength: ", groupsLength)
                                        if (groupsLength === 0) {
                                            context.done(null, groups.length + " groups updated")
                                        }
                                    }
                                })
                                .catch(reject => {
                                    console.log({pushReject: JSON.stringify(reject)})
                                    resultsLength--;
                                    // console.log({211: resultsLength})
                                    if (resultsLength === 0) {
                                        groupsLength--;
                                        console.log("groupsLength: ", groupsLength)
                                        if (groupsLength === 0) {
                                            context.done(null, groups.length + " groups updated")
                                        }
                                    }
                                })
                                
                            } else { // no change
                                resultsLength--;
                                // console.log({256: resultsLength})
                                if (resultsLength === 0) {
                                    groupsLength--;
                                    console.log("groupsLength: ", groupsLength)
                                    if (groupsLength === 0) {
                                        context.done(null, groups.length + " groups updated")
                                    }
                                }
                            }
                        })
                        .catch(setReject => {
                            console.log(`setReject: ${setReject}`)
                            console.log({resultsLength})
                            resultsLength--;
                            if (resultsLength === 0) {
                                groupsLength--;
                                console.log("groupsLength: ", groupsLength)
                                if (groupsLength === 0) {
                                    context.done(null, groups.length + " groups updated")
                                }
                            }
                        })
                        
                            
                                    // var pushUpdate = {
                                    //     $push: {
                                    //         predictions: {
                                    //             gameId: result._id.gameId,
                                    //             year: result._id.year,
                                    //             gameWeek: result._id.gameWeek,
                                    //             awayTeam: { score: awayAvg},
                                    //             homeTeam: { score: homeAvg},
                                    //             total: totalAvg,
                                    //             spread: spreadAvg
                                    //         }
                                    //     }
                                    // }
                        
                        //queryPromises.push()
                        // .then(function (updateResult) {
                        //     var updateRespObj = JSON.parse(updateResult);
                        //     console.log('updateResult: ', updateResult.result);
                        //     // if (updateRespObj.nModified === 1) {
                        //     //     predictionsUpdated++;
                        //     //     var message = `{ groupId: ${group.groupId}, gameId: ${result._id.gameId}, year: ${result._id.year}, awayAvg: ${awayAvg}, homeAvg: ${homeAvg}, totalAvg: ${totalAvg}, spreadAvg: ${spreadAvg}, predictionsUpdated: ${predictionsUpdated} }`
                        //     //     console.log("predictionUpdated! ", message)
                        //     //     //console.log('Updated crowd predictions', message);
                        //     //     resultsLength--;
                        //     //     console.log('resultsLength: ', resultsLength)
                        //     //     if (resultsLength === 0) {
                        //     //         groupsLength--;
                        //     //         console.log("groupsLength: ", groupsLength)
                        //     //         if (groupsLength === 0) {
                        //     //             context.done(null, groups.length + " groups updated")
                        //     //         }
                        //     //     }
                        //     //     return Promise.resolve(updateResult);
                        //     // } else {
                                    
                        //     // }
                        //     var pushCriteria = {
                        //                 groupId: group.groupId,
                        //                 year: group.year,
                        //                 sport: group.sport
                        //             };
                            
                        //             var pushUpdate = {
                        //                 $push: {
                        //                     predictions: {
                        //                         gameId: result._id.gameId,
                        //                         year: result._id.year,
                        //                         gameWeek: result._id.gameWeek,
                        //                         awayTeam: { score: awayAvg},
                        //                         homeTeam: { score: homeAvg},
                        //                         total: totalAvg,
                        //                         spread: spreadAvg
                        //                     }
                        //                 }
                        //             }
                        //             db.coll('groups').update(pushCriteria, pushUpdate)
                        //             .then(function(updateResult2) {
                        //                 console.log("prediction added! ", updateResult2.result);
                                        
                        //                 resultsLength--;
                        //                 console.log('resultsLength: ', resultsLength)
                        //                 if (resultsLength === 0) {
                        //                     groupsLength--;
                        //                     console.log("groupsLength: ", groupsLength)
                        //                     if (groupsLength === 0) {
                        //                         context.done(null, groups.length + " groups updated")
                        //                     }
                        //                 }
                        //                 return Promise.resolve(updateResult2);
                        //             });
                        // });
                        //console.log("queryPromises: ", queryPromises.length, " for group ", group.groupName)
                                
                        //queryPromises.push(Promise.resolve(queryPromise));
                    }); // ends _.each aggregate result
                        // Promise.all(queryPromises).then(function(response) {
                        //     // var message = `{ gameId: ${result._id}, year: ${_.year}, awayAvg: ${awayAvg}, homeAvg: ${homeAvg}, totalAvg: ${totalAvg}, spreadAvg: ${spreadAvg} }`
                        //     return context.done(null, "groups updated: ", response);
                        // });
                }); // close aggregate results function
                
            }); // close _.each group function
        }); // close _.each group
    });
};
