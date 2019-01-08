'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert");

const MONGO_URL = 'mongodb://pcsm-user:*dZ2HaWN@ds011775.mlab.com:11775/pcsm';

console.log('Loading function');

exports.handler = (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    mongo.connect(MONGO_URL, function (err, db) {
        assert.equal(null, err);
        if (err) {
            context.done(err, null);
        }
        console.log("Connected succesfully to mongodb");
//"results":1, 
        var collection = db.collection('games');
        collection.find({"year": parseInt(event.year), "gameWeek": parseInt(event.gameWeek)}, {sort: {"startDateTime": 1 }}).toArray(function (err, gamesArray) {
            assert.equal(err, null);
            if (err) {
                context.fail(err, null);
            }
            
            //check for games that have results
            function checkResultsExist(game) {
                //console.log("game being checked: ", game);
                if (game.results) return game
            }
            
            //check for games that do not have results
            function checkResultsDoNotExist(game) {
                //console.log("game being checked: ", game);
                if (!game.results) return game
            }
            var gamesToPlay = gamesArray.filter(checkResultsDoNotExist);
            var gamesPlayed = gamesArray.filter(checkResultsExist);
            
            var games = [];
            games = gamesToPlay.concat(gamesPlayed);
            // for (var g in games) {
            //     games[g].userAuthenticated = false;
            // }
            console.log("games: ", games);
            db.collection('predictions').find({
                "year": parseInt(event.year),
                "gameWeek": parseInt(event.gameWeek),
                "userId": event.userId
            }, {_id: false}).toArray(function (err, predictions) {
                assert.equal(err, null);
                if (err) {
                    context.fail(err, null);
                }
                
                var predictionsSubmitted = 0;
                games.map(function(game) {
                    //console.log('game: ', JSON.stringify(game));
                    if (game.crowd && game.results) {
                        if (game.crowd.results) {
                        //console.log('game.crowd.results: ', game.crowd.results);
                        } else {
                        //console.log('game.results: ', game.results);
                        //console.log('game.crowd: ', game.crowd);
                        }
                    }

                    var gamePredictionFilter = predictions.filter(function(prediction) {
                        //console.log('prediction: ', JSON.stringify(prediction))
                        return prediction.gameId === game.gameId
                    });

                    if(gamePredictionFilter.length > 0) {
                        //console.log('gamePredictionFilter: ', gamePredictionFilter);
                        var gamePrediction = gamePredictionFilter[0];
                        var prediction = {
                            awayTeam: {
                                score: gamePrediction.awayTeam.score
                            },
                            homeTeam: {
                                score: gamePrediction.homeTeam.score
                            },
                            total: gamePrediction.total,
                            spread: gamePrediction.spread,
                            results: gamePrediction.results
                        };
                        game.prediction = prediction;
                        game.predictionSubmitted = true;
                        predictionsSubmitted++;
                    } else {
                        game.predictionSubmitted = false;
                    }
                    if (event.userId) {
                        game.userAuthenticated = true;
                    }
                    if (event.sport === 'ncaaf' && event.collegeBowlPremium === "1") {
                        game.collegeBowlPremium = 1;
                    }

                });
                
                // sorting to bring games without prediction above predicted

                function compareObject(obj1, obj2){
                    if(obj1.predictionSubmitted > obj2.predictionSubmitted)
                        return 1;
                    if(obj2.predictionSubmitted > obj1.predictionSubmitted)
                        return - 1;
                
                    // obj1.RemindingTimestamp == obj2.RemindingTimestamp
                
                    if(obj1.gameId > obj2.gameId)
                        return -1;
                    if(obj2.gameId > obj1.gameId)
                        return 1;
                
                    return 0;
                }
                
                games.sort(compareObject);

                context.done(null, {games: games, predictionsSubmitted: predictionsSubmitted});
            });
        });
    });
};
