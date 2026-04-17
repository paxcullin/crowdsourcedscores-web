'use strict'

var mongo = require("mongodb").MongoClient,
    assert = require("assert");
const {config} = require("./config");

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;
    
exports.handler = async (event, context, callback) => {
    console.log(`Event: ${JSON.stringify(event)}`)
    const { gameId, sport, year, season, gameWeek } = event
    if (!gameId || !sport || !year || !season || !gameWeek) {
        context.fail({status: 500, message: `Game Data is missing ${gameId, sport, year, season, gameWeek}`})
    }
    /* 
    Receive a gameId
    Aggregate results of the wagers and group by user ID
    */
    try {
        
        const client = await mongo.connect(MONGO_URL);
        const db = client.db('pcsm');   
        const wagerCollection = db.collection('wagers');
        const profileCollection = db.collection('profileExtended');
        let profileUpbates = []
        
        // "gameId": gameId,
        // "season": season,
        // "sport": sport,
        // "year": year,
        // "gameWeek": gameWeek,
        let aggOpts = [
            {
                $group: {
                    _id: {userId: "$userId", result: "$result"},
                    net: {$sum: "$net"},
                    currency: {$sum: "$wager.currency"}
                }
            }
            
        ]
        const wagersGroup = await wagerCollection.aggregate(aggOpts).toArray();
        if (!wagersGroup || wagersGroup.length === 0) {
            context.done({status: 200, message: `No wagers for this game ${gameId}.`})
        }
        console.log('wagersGroup', wagersGroup);
        
        let userProfileIds = []
        let userProfileUpdates = {};
        wagersGroup.forEach(wager => {
            let userId = wager._id.userId
            userProfileIds.push(wager._id.userId)
            if (userProfileUpdates[userId] && userProfileUpdates[userId].currencyChange) {
                userProfileUpdates[userId].currencyChange += wager.net
            } else {
                userProfileUpdates[userId] = {
                    currencyChange: wager.net
                }
            }
        })
        console.log('userProfileIds', userProfileIds);
        // let userProfiles = await profileCollection.find({username: {$in: userProfileIds}}).toArray()
        // userProfiles.forEach(profile => {
        //     console.log('profile', profile.currencyHistory);
        //     let currencyAdds = 0
        //     if (profile.currencyHistory?.history && profile.currencyHistory.history.length > 0) {
        //         profile.currencyHistory.history.forEach(ch => {
        //             currencyAdds += ch.amount
        //         })
        //     }
        //     userProfileUpdates[profile.username].currencyChange += currencyAdds
        // })
        console.log('userProfileUpdates', userProfileUpdates);
        let updateWriteOperations = []
        for (const up in userProfileUpdates) {
            console.log('up', up)
            updateWriteOperations.push({updateOne: { filter: {username: up}, update: {$inc: {currency: userProfileUpdates[up].currencyChange}}}})
        }
        // console.log('updateWriteOperations', JSON.stringify(updateWriteOperations));
        let updateWriteResult = await profileCollection.bulkWrite(updateWriteOperations)
        console.log('updateWriteResult', updateWriteResult);
        context.done(null, {status: 200, wagersGroup});
        
        // context.done(null, { status: 200, message: `The balance of ${userId} was updated successfully. ${currencyAmount * currencyMultiplier}`})
    } catch (updateCurrencyError) {
        console.log('updateCurrencyError', updateCurrencyError)
        context.fail({status: 500, message: `Error: ${JSON.stringify(updateCurrencyError)}`})
    }
}