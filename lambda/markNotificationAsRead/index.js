
var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    {config} = require('config')

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

exports.handler = async (event) => {
    console.log('Event received: ', JSON.stringify(event))
    const { notificationId, username, action } = event
    // TODO implement
    const client = await mongo.connect(MONGO_URL);
    const db = client.db("pcsm");
    const collection = db.collection("profileExtended");
        let filter = {
            username: username,
            "notifications.id": notificationId
        };
        try {
            const markAsReadResponse = await collection.updateOne(filter, {$set: {"notifications.$.read": true, "notifications.$.deleted": action === "delete" ? true : false}}, {upsert: false})
            console.log('markAsReadResponse', markAsReadResponse)
            return {statusCode: 200, body: JSON.stringify(markAsReadResponse)};
        } catch (markNotificationAsReadError) {
            console.log('markNotificationAsReadError: ', markNotificationAsReadError)
            return ({
                statusCode: 500,
                body: JSON.stringify(markNotificationAsReadError)
            })
        }
};
