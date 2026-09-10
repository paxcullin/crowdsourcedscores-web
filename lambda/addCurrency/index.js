'use strict'

var mongo = require("mongodb").MongoClient,
    assert = require("assert");
const {config} = require("./config");

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;
    
exports.handler = async (event, context, callback) => {
    console.log(`Event: ${JSON.stringify(event)}`)
    const username = event.username
        || event.userId
        || (event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.claims && event.requestContext.authorizer.claims['cognito:username'])

    if (!username) {
        console.log('No user ID provided')
        throw new Error(JSON.stringify({status: 500, message: 'No user ID provided'}))
    }

    const sourceFromEvent = event.currencySource || event.source
    const currencySource = sourceFromEvent || (event.rewardAmount !== undefined ? 'ad' : 'wagers')

    try {
        const client = await mongo.connect(MONGO_URL);
        const db = client.db('pcsm');
        const wagerCollection = db.collection('wagers');
        const profileCollection = db.collection('profileExtended');

        if (currencySource === 'ad') {
            const rewardAmount = Number(event.rewardAmount !== undefined ? event.rewardAmount : event.currencyAmount)
            if (!Number.isFinite(rewardAmount) || rewardAmount <= 0) {
                client.close();
                return { status: 400, message: `Invalid reward amount: ${event.rewardAmount}` }
            }

            const pushUpdate = {
                currencyAmount: rewardAmount,
                currencyMultiplier: 1,
                source: 'ad',
                date: new Date(),
                type: 1
            }

            const profileUpdate = await profileCollection.updateOne(
                { username: username },
                {
                    "$inc": { "currency": rewardAmount },
                    "$push": {
                        "currencyHistory.history": pushUpdate
                    }
                }
            )

            if (profileUpdate.modifiedCount !== 1) {
                client.close();
                return { status: 500, message: `Profile update failed for ${username}` }
            }

            const profile = await profileCollection.findOne({ username });
            client.close();
            return {
                status: 200,
                message: `Ad reward added for ${username}. ${rewardAmount}`,
                currency: profile ? profile.currency : undefined,
                currencyHistory: profile ? profile.currencyHistory : undefined
            }
        }

        const wagers = await wagerCollection.find({
            userId: username,
            result: { $in: [0, 1] },
            $or: [
                { paid: { $exists: false } },
                { paid: false }
            ]
        }).toArray();

        if (!wagers || wagers.length === 0) {
            console.log(`No settled wagers found for ${username}`)
            client.close();
            return { status: 200, message: `No settled wagers found for ${username}`, currency: 0, currencyHistory: [] }
        }

        const wagerSummary = wagers.reduce((summary, wager) => {
            const wagerAmount = Number(wager.currency || 0)
            const netAmount = Number(wager.net || 0)

            summary.currencyChange += wagerAmount + netAmount
            summary.wagerCount += 1
            summary.wagerIds.push(wager._id)
            return summary
        }, {
            currencyChange: 0,
            wagerCount: 0,
            wagerIds: []
        })

        console.log('wagerSummary', wagerSummary)

        const pushUpdate = {
            currencyAmount: wagerSummary.currencyChange,
            currencyMultiplier: 1,
            source: 'wagers',
            date: new Date(),
            type: 1,
            wagerCount: wagerSummary.wagerCount,
            wagerIds: wagerSummary.wagerIds
        }

        const profileUpdate = await profileCollection.updateOne({ username: username }, 
            { "$inc": { "currency": wagerSummary.currencyChange },
            "$push": {
                "currencyHistory.history": pushUpdate
            }}
        )

        if (profileUpdate.modifiedCount === 0) {
            console.log('No profile updated')
            return {status: 500, message: `No profile updated`}
        }
        if (profileUpdate.modifiedCount > 1) {
            console.log('More than one profile updated')
            return {status: 500, message: `More than one profile updated`}
        }
        if (profileUpdate.modifiedCount === 1) {
            console.log('Profile updated')
            await wagerCollection.updateMany(
                { _id: { $in: wagerSummary.wagerIds } },
                { $set: { paid: true, paidDate: new Date() } }
            )
            const profile = await profileCollection.findOne({ username });
            console.log('profile', profile)
            client.close();
            return { status: 200, message: `The balance of ${username} was updated successfully. ${wagerSummary.currencyChange}`, currency: profile.currency, currencyHistory: profile.currencyHistory }
        }
    } catch (addCurrencyError) {
        console.log('addCurrencyError', addCurrencyError)
        return {status: 500, message: `Error: ${JSON.stringify(addCurrencyError)}`}
    }
}