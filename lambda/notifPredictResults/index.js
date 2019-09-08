'use strict'
const { Expo } = require('expo-server-sdk');

/*

This function:
1. getCognitoUsers - Retrieves all users who both allowed notifications and opted in for results notifications
2. Retrieves the results for each user from the predictions collection
3. Sends a summary of the results for each user

*/


// Create a new Expo SDK client
let expo = new Expo();

'use strict'
const AWS = require('aws-sdk'),
    Promise = require('bluebird'),
    assert = require("assert"),
    cognitoserviceprovider = new AWS.CognitoIdentityServiceProvider(),
    cognitoParams = {
    UserPoolId: 'us-west-2_zym3aCbQ3', /* required */
    // AttributesToGet: [
    //     'email',
    //     'preferred_username',
    //     'custom:device_token',
    //     'custom:notifyPredictRemind',
    //     'custom:notifyPredictResult'
    //     /* more items */
    // ]
    },
    lambda = new AWS.Lambda();;
var optInUsers = [];

function getCognitoUsers(params) {
    console.log({params})
    return new Promise(function(resolve, reject) {
        cognitoserviceprovider.listUsers(params, (err, cognitoUsersArray) => {
            if (err) {
                reject()
            }
            //console.log(JSON.stringify(cognitoUsersArray))
            
            cognitoUsersArray.Users.forEach((user, index) => {
                //console.log({user})
                let deviceToken = false
                user.Attributes.forEach((attribute, index) => {
                    if (attribute.Name === 'custom:device_token' && attribute.Value) {
                        deviceToken = true
                    }
                    if (deviceToken && attribute.Name === 'custom:notifyPredictResult' && parseInt(attribute.Value) === 1) {
                        optInUsers.push(user)
                    }
                    
                })
            })
            if (cognitoUsersArray.PaginationToken) {
                params.PaginationToken = cognitoUsersArray.PaginationToken
                return getCognitoUsers(params);
            }
            resolve();
        
        })
    })
}


exports.handler = async (event, context, callback) => {
    console.log(JSON.stringify(`Event: ${event}`))
    
    var getGameWeekParams = {
        FunctionName: 'getGameWeek', // the lambda function we are going to invoke
        InvocationType: 'RequestResponse',
        LogType: 'None',
        Payload: `{ "message": "results notification", "sport": "nfl", "year": 2019, "season": "reg"}`
    };
    // const gameWeek = await lambda.invoke(getGameWeekParams, function(err, data) {
    //             if (err) {
    //                 console.log("getGameWeek err: ", err);
    //             } else {
    //                 console.log('getGameWeek response: ', data.Payload);
    //                 console.log({gameWeek: data.Payload})
    //                 return data.Payload
    //             }
    //         });
    //         console.log({gameWeek})
    let cognitoListUsersArray = await getCognitoUsers(cognitoParams)
    .then(async data => {
        //console.log({data})
        console.log({optInUsers: optInUsers.length})
        // Create the messages that you want to send to clents
        let somePushTokens = ['ExponentPushToken[VOI6eeBiU0Py2dXRoMO6gZ]']
        
        for (let user in optInUsers) {
            for (let attribute in user.Attributes) {
                (attribute.Name === 'custom:device_token') ? somePushTokens.push(attribute.Value) : null
            }
        }
        let messages = [];
        for (let pushToken of somePushTokens) {
            // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

            // Check that all your push tokens appear to be valid Expo push tokens
            if (!Expo.isExpoPushToken(pushToken)) {
                console.error(`Push token ${pushToken} is not a valid Expo push token`);
                continue;
            }

            // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
            messages.push({
                to: pushToken,
                sound: 'default',
                body: `There are 13 Week 1 games on the NFL schedule today. This is your friendly reminder to have your prediction and stakes completed before kickoff!`,
                data: { withSome: 'data' },
            })
        }

        // The Expo push notification service accepts batches of notifications so
        // that you don't need to send 1000 requests to send 1000 notifications. We
        // recommend you batch your notifications to reduce the number of requests
        // and to compress them (notifications with similar content will get
        // compressed).
        let chunks = expo.chunkPushNotifications(messages);
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
                context.done(null, "Messages sent")
            }
            } catch (error) {
            console.error(error);
            }
        }
        //})();
    })
    .catch(dataError => {
        console.log({dataError})
        context.fail(dataError, null)
        })
}
