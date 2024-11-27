'use strict'

const mongo = require("mongodb").MongoClient,
{config} = require('./config');

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

function evaluateMoneyline(awayTeam, homeTeam, odds) {
    // console.log('awayTeam, homeTeam', awayTeam, homeTeam)
    if (awayTeam.score > homeTeam.score) {
        return "away";
    } else {
        return "home";
    }
}

function evaluateSpread(awayTeam, homeTeam, odds) {
    console.log('awayTeam, homeTeam, odds', awayTeam, homeTeam, odds);
    // odds.spread > 0 = away is favored
    // odds = +3; Away 24, Home 17 + 3 (20) <-- Away
    if (odds.spread > 0) {
        // odds = +3; Away 24, Home 17 + 3 (20) <-- Away
        if (awayTeam.score > homeTeam.score + odds.spread) {
            return "away";
        // odds = +3; Away 24, Home 22 + 3 (25) <-- 5
        } else  if (awayTeam.score < homeTeam.score + odds.spread) {
            return "home";
        } else  if (awayTeam.score === homeTeam.score + odds.spread) {
            return "push";
        }
    } else if (odds.spread < 0) {
        if (awayTeam.score < homeTeam.score + odds.spread) {
            return "home";
        } else if (awayTeam.score > homeTeam.score + odds.spread) {
            return "away";
        } else if (awayTeam.score === homeTeam.score  + odds.spread) {
            return "push";
        }
    }
    // if ((odds.spread > 0 && awayTeam.score + odds.spread > homeTeam.score) || (odds.spread < 0 && awayTeam.score > homeTeam.score + odds.spread)) {
    //     return "away";
    // } else if ((odds.spread > 0 && awayTeam.score + odds.spread < homeTeam.score) || (odds.spread < 0 && awayTeam.score < homeTeam.score + odds.spread)) {
    //     return "home";
    // } else {
    //     return "push";
    // }
}

function evaluateTotal(awayTeam, homeTeam, total) {
    // console.log('awayTeam, homeTeam, odds', awayTeam, homeTeam, odds)
    if (awayTeam.score + homeTeam.score > total) {
        return "over";
    } else if (awayTeam.score + homeTeam.score < total) {
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
    console.log('Event:', JSON.stringify(event))
    try {
        const client = await mongo.connect(MONGO_URL);
        let predictionML, actualML, predictionSpread, actualSpread, predictionTotal, actualTotal;
        const { gameId, sport } = event.Records[0].Sns.MessageAttributes;
        const sportValue = sport.Value;
        const gameIdValue = parseInt(gameId.Value)

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
        let gamesCollection = db.collection("games");
        if (sportValue === "ncaaf") {
            gamesCollection = db.collection("games-ncaaf");
        }

        const game = await gamesCollection.findOne({ gameId:gameIdValue, results: { $exists: true } });
        if (!game) {
            console.log(`Game ${gameIdValue} not found!`)
            context.fail('Game not found!')
        }
        const wagers = await wagersCollection.find({ gameId: gameIdValue }).toArray();

        if (!wagers || wagers.length === 0) {
            console.log(`No wagers found for game ${gameIdValue}`)
            return {message: 'No wagers found'}
        }
        console.log('processing wagers');
        let wagerUpdates = [];
        let wagerIds = [];
        let profileUpdates = [];
        // calculate wager results
        wagers.forEach(wagerObj => {

            const { prediction, wager, _id } = wagerObj;
            let result = 0, net = 0;
            if (wager.wagerType === "moneyline") {
                predictionML = evaluateMoneyline(prediction.awayTeam, prediction.homeTeam, prediction.odds);
                actualML = evaluateMoneyline(game.results.awayTeam, game.results.homeTeam, prediction.odds);
                // console.log('predictionML, actualML', predictionML, actualML)
                if (actualML === "push") {
                    result = 0;
                    net = wager.currency;
                } else if (predictionML === actualML) {
                    result = 1
                    net = evaluateNet(wager.odds, wager.currency)
                } else {
                    result = -1
                    net = 0;
                }
            }
            if (wager.wagerType === "spread") {
                predictionSpread = evaluateSpread(prediction.awayTeam, prediction.homeTeam, prediction.odds);
                actualSpread = evaluateSpread(game.results.awayTeam, game.results.homeTeam, prediction.odds);
                console.log('predictionSpread, actualSpread: ', predictionSpread, actualSpread)
                if (actualSpread === "push") {
                    result = 0
                    net = wager.currency;
                } else if (predictionSpread === actualSpread) {
                    result = 1
                    net = evaluateNet(wager.odds, wager.currency)
                } else {
                    result = -1
                    net = 0;
                }
            }
            if (wager.wagerType === "total") {
                predictionTotal = evaluateTotal(prediction.awayTeam, prediction.homeTeam, wager.spreadTotal ? wager.spreadTotal : prediction.odds ? prediction.odds.total : game.odds.total);
                actualTotal = evaluateTotal(game.results.awayTeam, game.results.homeTeam, wager.spreadTotal ? wager.spreadTotal : prediction.odds ? prediction.odds.total : game.odds.total);
                console.log('predictionTotal, actualTotal: ', predictionTotal, actualTotal)
                if (actualTotal === "push") {
                    result = 0
                    net = wager.currency;
                } else if (predictionTotal === actualTotal) {
                    result = 1
                    net = evaluateNet(wager.odds, wager.currency)
                } else {
                    result = -1
                    net = 0;
                }
            }
            wagerIds.push(_id);
            // console.log('wagerUpdate', JSON.stringify({updateOne: { filter: { username: wagerObj.userId, "wagers.history.gameId": wagerObj.gameId, "wagers.history.wagerType": wager.wagerType }, update: {$set: {"wagers.history.$.net": net, "wagers.history.$.result": result}}}}))
            wagerUpdates.push({updateOne: { filter: {_id: wagerObj._id }, update: {$set: { result, net }}}})
            profileUpdates.push({updateOne: { filter: { username: wagerObj.userId, "wagers.history.$.gameId": wagerObj.gameId, "wagers.history.$.wagerType": wager.wagerType }, update: {$set: {"wagers.history.$.net": net, "wagers.history.$.result": result}}}})

        });
        if (wagerUpdates.length === 0) {
            return {message: 'No messages to update'}
        }
        let wagerUpdatesResult = await wagersCollection.bulkWrite(wagerUpdates);
        console.log('wagerUpdatesResult', wagerUpdatesResult.modifiedCount);
        // update profile
        console.log('profileUpdates', JSON.stringify(profileUpdates))
        const profileCollection = db.collection("profileExtended");
        let profileUpdatesResult = await profileCollection.bulkWrite(profileUpdates);
        console.log('profileUpdatesResult', profileUpdatesResult.modifiedCount);
        console.log(`Success! ${wagerUpdates.length} wagers updated!`)
        return { message: `Success! ${wagerUpdates.length} wagers updated!`}
    } catch (err) {
        console.log('err', err)
        console.error(err);
        context.fail(err);
    }
}