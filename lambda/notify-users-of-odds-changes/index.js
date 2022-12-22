const AWS = require('aws-sdk');
const mongo = require('mongodb').MongoClient, 
    assert = require('assert'),
    { Expo } = require('expo-server-sdk'),
    {config} = require('./config'),
    lambda = new AWS.Lambda(),
    MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

// Create a new Expo SDK client
let expo = new Expo();

// get all users who have opted in to be notified of odds changes
// loop through each user
// get their predictions for that do not have results
// get games for the given week
// compare their prediction odds against the latest odds
// If there is a difference in odds, add each game to an array
// If the array length is greater than 0, add the user and the message to list of notifications
// 

exports.handler = async (event, context, callback) => {
    try {
        console.log(JSON.stringify(`Event: ${event}`))
        
        // Mongo connection
        const client = await mongo.connect(MONGO_URL)
        const db = client.db('pcsm')
        const profileCollection = db.collection('profileExtended')
        const predictionsCollection = db.collection('predictions')
        const gamesCollection = db.collection('games')

        const optedInUsers = await profileCollection.find({ notifyOddsChange: true }).toArray()
        let userMessages =[];
        for (user of optedInUsers) {
            console.log('user', user)
            let gamesWithOddsChanged = [];
            const predictions = await predictionsCollection.find({userId: user.username, results: {$exists: false}}).toArray();
            console.log('predictions', predictions)
            for (prediction of predictions) {
                console.log('prediction', prediction.gameId, prediction.odds)
                const game = await gamesCollection.findOne({ gameId: prediction.gameId, status: "scheduled" });
                console.log('game', game)
                if (game && prediction.odds && game.odds) {
                    // check only for games that haven't started
                    const predictionSpread = prediction.odds.spread,
                        predictionTotal = prediction.odds.total;
                    const { odds, awayTeam, homeTeam } = game
                    const gameSpread = game.odds.spread,
                        gameTotal = game.odds.total;
                    let update = "";
                    let spacer = "";
                    if (predictionSpread !== gameSpread || predictionTotal !== gameTotal) {
                        const gameUpdate = {
                            title: `${awayTeam.shortName}-${homeTeam.shortName}`
                        }
                        if (predictionSpread !== gameSpread) {
                            update += `(Spread: ${gameSpread})`
                        }
                        if (predictionTotal !== gameTotal){
                            if (predictionSpread !== gameSpread) {
                                spacer = " "
                            }
                            update += `${spacer}(Total: ${gameTotal}) `
                        }
                        gameUpdate.update = update;
                        gamesWithOddsChanged.push(gameUpdate)
                    }
                } else {
                    console.log('no game found for gameId ', prediction.gameId, predictions.odds)
                }
            }
            if (gamesWithOddsChanged.length > 0) {
                let message = "Odds have changed for you! Come back and check the following games: "
                gamesWithOddsChanged.forEach((game) => {
                    message += `${game.title} ${game.update}`
                })
                const pushToken = user.expoToken;
                if (!Expo.isExpoPushToken(pushToken)) {
                    console.error(`Push token ${pushToken} is not a valid Expo push token`);
                    continue;
                }
                userMessages.push({
                    to: pushToken,
                    sound: 'default',
                    body: message,
                    data: { withSome: 'data' },
                })
            }
        }
        if (userMessages.length === 0) {
            context.done(null, "no messages sent")
        }
        let chunks = expo.chunkPushNotifications(userMessages);
        let tickets = [];
        // (async () => {
        // Send the chunks to the Expo push notification service. There are
        // different strategies you could use. A simple one is to send one chunk at a
        // time, which nicely spreads the load out over time:
        
            for (let i=0; i < chunks.length; i++) {
                let chunk = chunks[i];
                try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                console.log({chunk: JSON.stringify(chunk)})
                console.log(ticketChunk);
                tickets.push(...ticketChunk);
                // NOTE: If a ticket contains an error code in ticket.details.error, you
                // must handle it appropriately. The error codes are listed in the Expo
                // documentation:
                // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
                } catch (error) {
                console.log(error);
                }
            }
        //})();



        // Later, after the Expo push notification service has delivered the
        // notifications to Apple or Google (usually quickly, but allow the the service
        // up to 30 minutes when under load), a "receipt" for each notification is
        // created. The receipts will be available for at least a day; stale receipts
        // are deleted.
        //
        // The ID of each receipt is sent back in the response "ticket" for each
        // notification. In summary, sending a notification produces a ticket, which
        // contains a receipt ID you later use to get the receipt.
        //
        // The receipts may contain error codes to which you must respond. In
        // particular, Apple or Google may block apps that continue to send
        // notifications to devices that have blocked notifications or have uninstalled
        // your app. Expo does not control this policy and sends back the feedback from
        // Apple and Google so you can handle it appropriately.
        let receiptIds = [];
        for (let ticket of tickets) {
        // NOTE: Not all tickets have IDs; for example, tickets for notifications
        // that could not be enqueued will have error information and no receipt ID.
            if (ticket.id) {
                receiptIds.push(ticket.id);
            }
        }

        let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
        //(async () => {
        // Like sending notifications, there are different strategies you could use
        // to retrieve batches of receipts from the Expo service.
        console.log({receiptIdChunks: JSON.stringify(receiptIdChunks)})
        for (let chunk of receiptIdChunks) {
            try {
            let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
            console.log(receipts);
            if (receipts.typeof !== "Array") receipts = [receipts]

            // The receipts specify whether Apple or Google successfully received the
            // notification and information about an error, if one occurred.
            for (let receipt of receipts) {
                if (receipt.status === 'ok') {
                continue;
                } else if (receipt.status === 'error') {
                console.error(`There was an error sending a notification: ${receipt.message}`);
                if (receipt.details && receipt.details.error) {
                    // The error codes are listed in the Expo documentation:
                    // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
                    // You must handle the errors appropriately.
                    console.error(`The error code is ${receipt.details.error}`);
                }
                }
                context.done(null, `Messages sent to ${optedInUsers.length} users`)
            }
            } catch (error) {
            console.error(error);
            }
        }
    } catch(dataError) {
            console.log({dataError})
            context.fail(dataError, null)
    }

}
