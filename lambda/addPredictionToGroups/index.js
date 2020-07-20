'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    validate = require("jsonschema").validate;
const AWS = require('aws-sdk');    
const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });

const MONGO_URL = 'mongodb://${username}:${password}@ds011775.mlab.com:11775/pcsm';
const requestSchema = {
    "type": "object",
    "properties": {
        "gameId": {"type": "string"},
        "year": {"type": "string"},
        "awayTeam": {
            "type": "object",
            "properties": {
                "code": {"type": "string"},
                "fullName": {"type": "string"},
                "shortName": {"type": "string"},
                "score": {"type": "integer", "minimum": 0, "maximum": 50}
            },
            "required": ["code", "fullName", "shortName", "score"]
        },
        "homeTeam": {
            "type": "object",
            "properties": {
                "code": {"type": "string"},
                "fullName": {"type": "string"},
                "shortName": {"type": "string"},
                "score": {"type": "integer", "minimum": 0, "maximum": 50}
            },
            "required": ["code", "fullName", "shortName", "score"]
        }
    },
    "required": ["gameId", "awayTeam", "homeTeam"]
};

// console.log('Loading function');

/* Sample prediction request
 {
 "year": "2017",
 "gameId": "1",
 "gameWeek": "1",
 "awayTeam": {
 "code": "CAR",
 "fullName": "Carolina Panthers",
 "shortName": "Carolina",
 "score": 20
 },
 "homeTeam": {
 "code": "DEN",
 "fullName": "Denver Broncos",
 "shortName": "Denver",
 "score": 17
 }
 }
 */

exports.handler = (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    var result = {
        message: '',
        succeeded: true
    };

    var prediction = event;
    var validateRequest = validate(prediction, requestSchema);
    if (validateRequest.errors && validateRequest.errors.length > 0) {
        result.message = 'Invalid request error(s)';
        result.errors = [];
        result.succeeded = false;
        for (var i = 0; i < validateRequest.errors.length; i++) {
            result.errors.push(validateRequest.errors[i]);
        }
        return context.fail(JSON.stringify(result));
    }

    var diff = prediction.awayTeam.score - prediction.homeTeam.score;
    // prediction.spread = diff < 0 ? -1 * (diff) : diff;
    prediction.spread = prediction.awayTeam.score - prediction.homeTeam.score;
    prediction.total = prediction.awayTeam.score + prediction.homeTeam.score;
    prediction.submitted = new Date().toISOString();
    prediction.year = "2018";

    mongo.connect(MONGO_URL, function (err, db) {
        assert.equal(null, err);

        if (err) {
            return context.done(err, null);
        }

        // first make sure the prediction is not too late
        // deadline is 1hr prior to kickoff
        const msHour = 3600000;
        
        var lambdaParams = {
            FunctionName: 'group-joinGroup', // the lambda function we are going to invoke
            InvocationType: 'RequestResponse',
            LogType: 'Tail',
            Payload: '{ "username": "' + event.userId + '", "sport": "nfl", "year": "' + prediction.year + '", "groupId": 0}'
          };
        
          lambda.invoke(lambdaParams, function(err, data) {
            if (err) {
              context.fail(err);
            } else {
              context.succeed('Lambda_B said '+ data.Payload);
            }
          })

        db.collection('games').findOne({"gameId": prediction.gameId, "year": prediction.year, "gameWeek": prediction.gameWeek}, {_id: false}, function (err, game) {
            assert.equal(err, null);
            if (err) {
                context.fail(err, null);
            }
            
            var now = new Date();
            var kickoff = Date.parse(game.startDateTime);
            var cutoff = kickoff - msHour;

            // console.log("now: " + now);
            // console.log("kickoff: " + new Date(game.startDateTime));
            // console.log("cutoff: " + new Date(cutoff));

            if (now > cutoff) {
                result.message = "The cutoff for predicting this game has passed.";
                result.succeeded = false;
                return context.done(JSON.stringify(result));
            }

            var existingObjQuery = {userId: prediction.userId, gameId: prediction.gameId, year: prediction.year};

            // update existing if prediction exists for userId and gameId combo
            // else treat as new prediction and add to collection
            db.collection('predictions').update(existingObjQuery, prediction, {upsert: true}, function (err, dbRes) {
                var respObj = JSON.parse(dbRes);

                assert.equal(err, null);
                assert.equal(respObj.ok, 1);

                if (err) {
                    result.message = err;
                    result.succeeded = false;
                    return context.fail(JSON.stringify(result));
                }

                result.data = prediction;
                result.message = 'Prediction saved';

                return context.done(null, result);
            });
        });
    });
};
