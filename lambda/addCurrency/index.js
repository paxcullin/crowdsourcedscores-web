'use strict'

var mongo = require("mongodb").MongoClient,
    assert = require("assert");
const {config} = require("./config");

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;
    
exports.handler = async (event, context, callback) => {
    console.log(`Event: ${JSON.stringify(event)}`)
    const { username , currencyAmount, currencyMultiplier, currencySource, wagerId } = event
    /* 
    Need to account for multiple currency sources
    Daily Login reward
    Wager win/push
    -- currency multiplier is te odds of the wager
    */
    if (!username) {
        console.log('No user ID provided')
        context.fail({status: 500, message: 'No user ID provided'})
    }
    if (!currencyAmount || !currencyMultiplier || !currencySource) {
        console.log(`No currency amount ${currencyAmount} or multiplier ${currencyMultiplier} or currency source ${currencySource} provided`)
        context.fail({status: 500, message: `No currency amount ${currencyAmount} or multiplier ${currencyMultiplier} or currency source ${currencySource} provided`})
    }
    if (currencySource === "wager" && !wagerId) {
        console.log(`No wagerId provided for this wager`)
        context.fail({status: 500, message: `No currency amount ${currencyAmount} or multiplier ${currencyMultiplier} or currency source ${currencySource} provided`})
    }
    try {
        const client = await mongo.connect(MONGO_URL);
        const session = client.startSession();
        session.startTransaction();
        const db = client.db('pcsm');
        const collection = db.collection('profileExtended');
        // let profile = await collection.findOne({ username: username }, { session });
        // console.log('profile', profile);
        let pushUpdate = {
            currencyAmount: currencyAmount * currencyMultiplier,
            currencyMultiplier: currencyMultiplier,
            source: currencySource,
            date: new Date(),
            type: 1
        }
        if (wagerId) {
            pushUpdate.wagerId = wagerId
        }
        let profileUpdate = await collection.updateOne({ username: username }, 
            { "$inc": { "currency": currencyAmount * currencyMultiplier },
            "$push": {
                "currencyHistory.history": pushUpdate
            }}
            , {"$project": { "currency": 1, "username": 1 }, new: true, session})
        if (profileUpdate.modifiedCount === 0) {
            console.log('No profile updated')
            session.abortTransaction();
            session.endSession();
            context.fail({status: 500, message: `No profile updated`})
        }
        if (profileUpdate.modifiedCount > 1) {
            console.log('More than one profile updated')
            session.abortTransaction();
            session.endSession();
            context.fail({status: 500, message: `More than one profile updated`})
        }
        if (profileUpdate.modifiedCount === 1) {
            console.log('Profile updated')
            if (currencySource.type === 'wager') {
                console.log(`Wager source ${currencySource._id}`)
                let wagerUpdate = await db.collection('wagers').updateOne({ _id: `ObjectId(${currencySource._id})`, userId: username }, {$set: {paid: true}}, {session})
                console.log('wagerUpdate', wagerUpdate)
                if (wagerUpdate.modifiedCount === 0) {
                    console.log('No wager updated')
                    session.abortTransaction();
                    session.endSession();
                    context.fail({status: 500, message: `No wager updated`})
                }
                if (wagerUpdate.modifiedCount > 1) {
                    console.log('More than one wager updated')
                    session.abortTransaction();
                    session.endSession();
                    context.fail({status: 500, message: `More than one wager updated`})
                }
                if (wagerUpdate.modifiedCount === 1) {
                    console.log('Wager updated')
                    session.commitTransaction();
                    session.endSession();
                    context.done(null, { status: 200, message: `The balance of ${username} was updated successfully. ${currencyAmount * currencyMultiplier}. Wager ${currencySource._id} updated successfully.`, currencyAmount})
                }
            }

            session.commitTransaction();

            let profile = await collection.findOne({ username }, { session });
            console.log('profile', profile)
            session.endSession();
            context.done(null, { status: 200, message: `The balance of ${username} was updated successfully. ${currencyAmount * currencyMultiplier}`, currency: profile.currency, currencyHistory: profile.currencyHistory.history.sort((a,b) => new Date(b.date) - new Date(a.date)) })
        }
    } catch (addCurrencyError) {
        console.log('addCurrencyError', addCurrencyError)
        context.fail({status: 500, message: `Error: ${JSON.stringify(addCurrencyError)}`})
    }
}