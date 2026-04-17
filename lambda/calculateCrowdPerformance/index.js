'use strict';

const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda"); // ES Modules import

const assert = require("assert"),
    mongo = require("mongodb"),
    {config} = require('config'),
    lambda = new LambdaClient({region: 'us-west-2'});

    const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

console.log('Loading function');
function getWinnerLoser(game, gamePrediction) {
    var gameWinner, predictionWinner;
    game.crowd.results.predictionScore = 0;
    // get winner of each game
    if (game.results.awayTeam.score > game.results.homeTeam.score) {
        gameWinner = game.awayTeam.code;
    } else if (game.results.awayTeam.score < game.results.homeTeam.score) {
        gameWinner = game.homeTeam.code;
    } else {
        gameWinner = "N/A";
    }
    
    //get predicted winner of each game
    if (gamePrediction.awayTeam.score > gamePrediction.homeTeam.score) {
        predictionWinner = game.awayTeam.code;
    } else if (gamePrediction.awayTeam.score < gamePrediction.homeTeam.score) {
        predictionWinner = game.homeTeam.code;
    } else {
        predictionWinner = "N/A";
    }

    //Match gameWinner to predictionWinner and update prediction with results
    if (gameWinner === predictionWinner) {
        //console.log("winner! - correct straight up pick")
        game.crowd.results.winner = {
            correct: 1,
            push: 0
        };
        game.crowd.results.predictionScore += 2;
    } else if (gameWinner === "N/A") {
        // add push for a tie
        game.crowd.results.winner = {
            correct: 0,
            push: 1
        };
    } else {
        //console.log("sad trombone - incorrect straight up pick")
        game.crowd.results.winner = {
            correct: 0,
            push: 0
        };
    }
    
    if (gamePrediction.awayTeam.score === game.results.awayTeam.score) {
        game.crowd.results.predictionScore += 1;
    }
    if (gamePrediction.homeTeam.score === game.results.homeTeam.score) {
        game.crowd.results.predictionScore += 1;
    }
    
    return game;
    
}
function getSpread(game, gameOdds, gamePrediction) {
    var favorite, underdog, spreadResult;
    
    //predicted underdog
    if (((game.results.awayTeam.score - game.results.homeTeam.score) > gameOdds.spread) && ((gamePrediction.awayTeam.score - gamePrediction.homeTeam.score) > gameOdds.spread)) {
        //console.log("winner! - correct spread pick")
        game.crowd.results.spread = {
            correct: 1,
            push: 0
        };
        game.crowd.results.predictionScore += 2;
    } else if (((game.results.awayTeam.score - game.results.homeTeam.score) < gameOdds.spread) && ((gamePrediction.awayTeam.score - gamePrediction.homeTeam.score) < gameOdds.spread)) {
    //predicted favorite
        //console.log("winner! - correct spread pick")
        game.crowd.results.spread = {
            correct: 1,
            push: 0
        };
        game.crowd.results.predictionScore += 2;
    } else if ((game.results.awayTeam.score - game.results.homeTeam.score) === gameOdds.spread) {
        game.crowd.results.spread = {
            correct: 0,
            push: 1
        };
    } else {
        //console.log("sad trombone - incorrect spread pick")
        game.crowd.results.spread = {
            correct: 0,
            push: 0
        };
    }
    if (game.results.spread === gamePrediction.spread) {
        game.crowd.results.predictionScore += 1;
    }
    
    return game;
}
function getTotalResult(game, gameOdds, gamePrediction) {
    var favorite, underdog, spreadResult;
    
    //predicted over
    if ((game.results.total > gameOdds.total) && (gamePrediction.total > gameOdds.total)) {
        game.crowd.results.total = {
            correct: 1,
            push: 0
        };
        game.crowd.results.predictionScore += 2;
    } else if ((game.results.total < gameOdds.total) && (gamePrediction.total < gameOdds.total)) {
    //predicted under
        //console.log("totalWinner! - under");
        game.crowd.results.total = {
            correct: 1,
            push: 0
        };
        game.crowd.results.predictionScore += 2;
    } else if (game.results.total === gameOdds.total) {
        game.crowd.results.total = {
            correct: 0,
            push: 1
        };
    } else {
        //console.log("sad trombone - incorrect total pick")
        game.crowd.results.total = {
            correct: 0,
            push: 0
        };
    }
    if (game.results.total === gamePrediction.total) {
        game.crowd.results.predictionScore += 1;
    }
    
    return game;
}


exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    try {
        const client = await mongo.connect(MONGO_URL);
        const db = client.db('pcsm');
        
        let gamesCollection = 'games',
            predictionsCollection = 'predictions',
            gameId = parseInt(event.Records[0].Sns.MessageAttributes.gameId.Value),
            gameWeek = parseInt(event.Records[0].Sns.MessageAttributes.gameWeek.Value),
            year = parseInt(event.Records[0].Sns.MessageAttributes.year.Value),
            sport = event.Records[0].Sns.MessageAttributes.sport.Value,
            season = event.Records[0].Sns.MessageAttributes.season.Value
        
        if (sport === 'ncaaf') {
            gamesCollection = 'games-ncaaf';
            predictionsCollection = 'predictions-ncaaf';
        } else if (sport === 'ncaam') {
            gamesCollection = 'games-ncaam';
            predictionsCollection = 'predictions-ncaam'
        }
        
        var gamesQuery = {
            "year": year,
            "gameWeek": { $gt: 0 },
            "season": season,
            "sport": sport,
            results: {$exists: true}
        }
        if (gameId > 0) {
            gamesQuery = {
                "year": year,
                "gameWeek": gameWeek,
                "gameId": gameId,
                results: {$exists: true}
            }
        }
            
        var winnersCorrect = 0;
        var totalCorrect = 0;
        var collection = db.collection(gamesCollection);
        const games = await collection.find(gamesQuery, {_id: false}).toArray();
            
            

        var queryPromises = [];
        games.forEach((game) => {
            var gamePrediction = game.crowd;

            if(game.results && gamePrediction && Date.parse(game.startDateTime) < Date.now()) {
                    game.crowd.results = {};
                    
                    var straightUpResults = getWinnerLoser(game, gamePrediction);
                    var spreadResult = getSpread(game, game.odds,gamePrediction);
                    var totalResult = getTotalResult(game, game.odds,gamePrediction);
                    var criteria = {gameId: game.gameId, year: game.year};
                        var queryPromise = db.collection(gamesCollection).update(criteria, game, {upsert: true})
                            .then(function (updateResult) {
                                var message = `{ gameId: ${game.gameId}, year: ${game.year}, crowd.result.winner: ${game.crowd.results.winner}, crowd.result.winner: ${game.crowd.results.spread}, crowd.result.winner: ${game.crowd.results.total}) }`
                                //console.log('Updated crowd predictions', message);
                                return Promise.resolve(updateResult);
                            });
                        queryPromises.push(Promise.resolve(queryPromise));
        
                    
            } else {
                console.log("No matched prediction");
            }

        });
        const updateCrowd = await Promise.all(queryPromises)
        console.log('updateCrowd', updateCrowd);
        
                
        var calculateCrowdOverallPerformanceParams = new InvokeCommand({
            FunctionName: 'calculateLeaders', // the lambda function we are going to invoke
            InvocationType: 'Event',
            LogType: 'None',
            Payload: `{ "message": "calculateCrowdPerformance completed", "sport": "${sport}", "year": ${year}, "season": "${season}", "gameWeek": ${gameWeek}}`
        }, function(err, data) {
            if (err) {
            console.log("calculateLeaders err: ", err);
            } else {
            console.log('calculateLeaders response: ', data.Payload);
            
            context.done(null, games);
            }
        });
            
        const lambdainvoke2 = lambda.send(calculateCrowdOverallPerformanceParams)

    } catch (calculateCrowdError) {
        console.log('calculateCrowdError', calculateCrowdError);
        context.done(calculateCrowdError, null);
    }
};
