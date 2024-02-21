'use strict'

var mongo = require("mongodb").MongoClient,
    assert = require("assert");
const {config} = require("./config");

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;
    
exports.handler = async (event, context, callback) => {
    console.log(`Event: ${JSON.stringify(event)}`)
    const { userId , currencyAmount, currencyMultiplier, currencySource, wagerId } = event
    /* 
    Need to account for multiple currency sources
    Daily Login reward
    Wager win/push
    -- currency multiplier is te odds of the wager
    */
    if (!userId) {
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

        let profileUpdate = await collection.updateOne({ username: userId }, 
            { $inc: { currency: currencyAmount * currencyMultiplier },
            $push: {
                "currencyHistory.history": pushUpdate
            }}
            , {session})
        console.log('profileUpdate', profileUpdate)
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
                let wagerUpdate = await db.collection('wagers').updateOne({ _id: ObjectId(currencySource._id), userId: userId }, {$set: {paid: true}}, {session})
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
                    context.done(null, { status: 200, message: `The balance of ${userId} was updated successfully. ${currencyAmount * currencyMultiplier}. Wager ${currencySource._id} updated successfully.`})
                }
            }
        }
        // context.done(null, { status: 200, message: `The balance of ${userId} was updated successfully. ${currencyAmount * currencyMultiplier}`})
    } catch (addCurrencyError) {
        console.log('addCurrencyError', addCurrencyError)
        context.fail({status: 500, message: `Error: ${JSON.stringify(addCurrencyError)}`})
    }
}