'use strict'

const mongo = require("mongodb").MongoClient,
{config} = require('./config');

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

function evaluateMoneyline(awayTeam, homeTeam, odds) {
    if (awayTeam.score > homeTeam.score) {
        return "away";
    } else {
        return "home";
    }
}

function evaluateSpread(awayTeam, homeTeam, odds) {
    if (awayTeam.score + odds.spread > homeTeam.score) {
        return "away";
    } else if (awayTeam.score + odds.spread < homeTeam.score) {
        return "home";
    } else {
        return "push";
    }
}

function evaluateTotal(awayTeam, homeTeam, odds) {
    if (awayTeam.score + homeTeam.score > odds.total) {
        return "over";
    } else if (awayTeam.score + homeTeam.score < odds.total) {
        return "under";
    } else {
        return "push";
    }
}

function evaluateNet(odds, currency) {
    if (odds < 1) {
        // multiply odds by result
        // any negative odds mean the amount you need to bet to win 100
        // so -174 means 174 to win 100
        // therefore 100/174 = resulting value / your wager
        return Math.round((((100/odds) * -1) * currency) + currency)
    } else {
        return Math.round((currency * (odds/100)) + currency);
    }
}

exports.handler = async function (event, context, callback) {
    console.log(JSON.stringify(`Event: event`))
    try {
        const client = await mongo.connect(MONGO_URL);
        let predictionML, actualML, predictionSpread, actualSpread, predictionTotal, actualTotal;
        const { gameId } = event
        
        /* Expected data
            gameId,
            year,
            sport,
            gameWeek,
            season,
            awatTeam: { score },
            homeTeam: { score }

            compare score to Prediction
            if awayTeam.score > homeTeam.score:
                moneyline = awayteam
            else 
                moneyline = hometeam

            if awayTeam.score + odds.spread > homeTeam.score:
                spread = awayteam
            else
                spread = hometeam

            if awayTeam.score + homeTeam.score > odds.total:
                total = over
            else
                total = under
        */

        const db = client.db("pcsm");
        const wagersCollection = db.collection("wagers");
        const gamesCollection = db.collection("games");

        const game = await gamesCollection.findOne({ gameId: event.gameId });
        if (!game) {
            console.log(`Game ${gameId} not found!`)
            context.fail('Game not found!')
        }
        const wagers = await wagersCollection.find({ gameId: event.gameId }).toArray();

        if (!wagers || wagers.length === 0) {
            console.log(`No wagers found for game ${gameId}`)
            context.done('', 'No wagers found')
        }
        let wagerUpdates = [];
        wagers.forEach(wagerObj => {

            console.log('wagerObj', wagerObj, wagerObj._id);
            const { prediction, wager } = wagerObj;
            let result = 0, net = 0;
            if (wager.wagerType === "moneyline") {
                predictionML = evaluateMoneyline(prediction.awayTeam, prediction.homeTeam, prediction.odds);
                actualML = evaluateMoneyline(game.awayTeam, game.homeTeam, prediction.odds);
                if (predictionML === "push") {
                    result = 0;
                    net = wager.currency;
                } else if (predictionML === actualML) {
                    result = 1
                    evaluateNet(wager.odds, wager.currency)
                } else {
                    result = -1
                    net = 0;
                }
                wagerUpdates.push({updateOne: { filter: {_id: wagerObj._id }, update: {$set: { result, net }}}})
            }
            if (wager.wagerType === "spread") {
                predictionSpread = evaluateSpread(prediction.awayTeam, prediction.homeTeam, prediction.odds);
                actualSpread = evaluateSpread(game.awayTeam, game.homeTeam, prediction.odds);
                if (predictionSpread === "push") {
                    result = 0
                    net = wager.currency;
                } else if (predictionSpread === actualSpread) {
                    result = 1
                    evaluateNet(wager.odds, wager.currency)
                } else {
                    result = -1
                    net = wager.currency * -1;
                }
            }
            if (wager.wagerType === "total") {
                predictionTotal = evaluateTotal(prediction.awayTeam, prediction.homeTeam, prediction.odds);
                actualTotal = evaluateTotal(game.awayTeam, game.homeTeam, prediction.odds);
                if (predictionTotal === "push") {
                    result = 0
                    net = wager.currency;
                } else if (predictionTotal === actualTotal) {
                    result = 1
                    evaluateNet(wager.odds, wager.currency)
                } else {
                    result = -1
                    net = wager.currency * -1;
                }
            }
            
        });
        
        wagersCollection.bulkWrite(wagerUpdates);
        context.succeed(`Success! ${wagerUpdates.length} wagers updated!`)
    } catch (err) {
        console.error(err);
        context.fail(err);
    }
}