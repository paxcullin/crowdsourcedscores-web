'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    {config} = require('config');

    const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

// console.log('Loading function');

const sportsCollections = {
    nfl: {
        games: 'games',
        predictions: 'predictions'
    },
    ncaaf: {
        games: 'games-ncaaf',
        predictions: 'predictions-ncaaf'
    },
}

exports.handler = (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const { year, season, gameWeek, gameId, userId } = event;
    const sport = event.sport ? event.sport : 'nfl';
    
    mongo.connect(MONGO_URL, function (err, client) {
        assert.equal(null, err);
        if (err) {
            context.done(err, null);
        }
        const db = client.db('pcsm');
        let collectionsObj = sportsCollections[sport];
        if (!collectionsObj) {
            context.done({succeeded: false, message: "Something went wrong. Please try again later."}, null)
        }
        var gameObj = {};
        var collection = db.collection(collectionsObj.games);
        collection.findOne({"year": year, "gameWeek": gameWeek, "gameId": gameId}, {_id: false})
        .then((game) => {
            assert.equal(err, null);
            if (err) {
                context.fail(err, null);
            }

            console.log("game: ", game);
            if (!game) {
                context.done(null, null)
            }
            if (game.weather) {
                game.weather.temp = Math.round((game.weather.temp * 1.8) - 459.67);
            }
            //context.done(null, games);
            var predictionCollection = db.collection(collectionsObj.predictions);
            // define the fields to be returned 
            var predictionsResponseFields = {
                userId: 1,
                preferred_username: 1,
                "awayTeam.score": 1,
                "homeTeam.score": 1,
                spread: 1,
                total: 1,
                submitted: 1,
                predictionScore: 1,
                results: 1};
            predictionCollection.find({
                "year": game.year,
                "gameId": game.gameId,
                "sport": game.sport
            }, predictionsResponseFields).sort({submitted: 1}).toArray(function (err, predictions) {
                assert.equal(err, null);
                if (err) {
                    context.fail(err, null);
                }
                let anonymousGamePredictions = []
                predictions.forEach(prediction => {
                    anonymousGamePredictions.push(prediction._id)
                })
                game.predictions = (!game.results) ? anonymousGamePredictions : predictions;
                let userPrediction = predictions.filter(prediction => prediction.userId === event.userId)
                
                game.prediction = (event.userId && userPrediction && userPrediction.length > 0) ? userPrediction[0] : null;
                
                context.done(null, game);
            });
        })
        .catch((error) => context.done(error, null));
    });
};
