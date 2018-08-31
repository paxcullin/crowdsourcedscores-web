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
            return context.done(err, null);
        }

        var aggOpts = [
            {
                $match: {
                    year: 2018
                }
            },
            {
                $group: {
                    _id: "$gameId",
                    awayAvg: {$avg: "$awayTeam.score"},
                    homeAvg: {$avg: "$homeTeam.score"},
                    totalAvg: {$avg: "$total"},
                    spreadAvg: {$avg: "$spread"}
                }
            }
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

        db.collection('predictions').aggregate(aggOpts).toArray(function (err, results) {
            assert.equal(err, null);
            if (err) {
                console.log(err)
                return context.fail(err, null);
            }

            var queryPromises = [];
            _.each(results, function (result) {
                
                // criteria updated to update crowd predictions only when games are in the future
                //console.log("dateMidnight.toISOString():",dateMidnight.toISOString());
                var criteria = {gameId: result._id, year: 2018,results: {$exists: false}};
                
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
                //console.log("criteria:", criteria)
                var queryPromise = db.collection('games').updateAsync(criteria, update)
                    .then(function (updateResult) {
                        var message = `{ gameId: ${result._id}, year: ${_.year}, awayAvg: ${awayAvg}, homeAvg: ${homeAvg}, totalAvg: ${totalAvg}, spreadAvg: ${spreadAvg} }`
                        console.log('Updated crowd predictions', message);
                        return Promise.resolve(updateResult);
                    });
                queryPromises.push(Promise.resolve(queryPromise));
            });

            Promise.all(queryPromises).then(function() {
                return context.done();
            });
        });
    });
};
