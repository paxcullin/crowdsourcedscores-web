'use strict';


var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    {config} = require('config'),
    AWS = require('aws-sdk'),
    lambda = new AWS.Lambda();

    const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

// console.log('Loading function');

exports.handler = (event, context) => {
    // console.log('Received event:', JSON.stringify(event, null, 2));

    mongo.connect(MONGO_URL, function (err, client) {
        assert.equal(null, err);
        if(err) {
            context.done(err, null);
        }
        const db = client.db('pcsm');

        var collection = db.collection('groups');
        var extendedProfileCollection = db.collection('profileExtended');
        var requestedGroup = collection.findOne({"sport": event.sport, "year": parseInt(event.year), "groupId": parseInt(event.groupId)}, {_id: false})
        .then(function(group) {
            
            if (!group) {
                return context.done(null, "No group returned");
            }
            
            // Password Check
            // Ensure only users with group passwords can join a group
            
            if (group && group.public === false && group.password !== event.groupPassword) {
                return context.done(null, {succeeded: false, message: "Incorrect group password entered"});
            }
            
            // End Password Check
            
            var requestedGroupUsernameArray = group.users;
            var usernamesArray = [];
            
            //create the array of usernames
            for (var i=0; i < requestedGroupUsernameArray.length;i++) {
                usernamesArray.push(requestedGroupUsernameArray[i].username);
            }
            
            //check for requesting user's username in the usernames array
            //
            //if username doesn't exist, add it
            const addedUserObject = {"username": event.username, "userFullName": event.firstName + " " + event.lastName,"preferred_username": event.preferred_username};
            var updatedGroupUserArray = group.users;
            updatedGroupUserArray.push(addedUserObject)
            if (usernamesArray.indexOf(event.username) === -1) {
                collection.findOneAndUpdate({"sport": group.sport, "year": group.year, "groupId": group.groupId},{$push: {"users": addedUserObject} }, {upsert: true, returnNewDocument: true})
                .then(function(updatedGroupResponse) {
                    //console.log("update group response: ", updatedGroupResponse)
                    
                    // NEED TO ADD THIS TO A SEPARATE LAMBDA FUNCTION
                    extendedProfileCollection.updateOne({"username": event.username}, {$push: {"groups": {"sport": group.sport, "year": group.year, "groupId": group.groupId,"groupName":group.groupName}}}, {upsert: true})
                    .then(function(response) {
                        //console.log("update user response: ", response)
                        
                        //console.log("calling joinGroup")
                        var lambdaParams = {
                            FunctionName: 'addPredictionsToGroups', // the lambda function we are going to invoke
                            InvocationType: 'Event',
                            LogType: 'None',
                            Payload: '{ "username": "' + event.username + '", "groupName": "' + group.groupName + '", "sport": "nfl", "year": "' + group.year + '", "groupId": ' + group.groupId + '}'
                          };
                        
                          lambda.invoke(lambdaParams, function(err, data) {
                            if (err) {
                              console.log("group-joinGroup call err: ", err);
                            } else {
                              console.log("addPredictionsToGroups call data: ", data);
                              context.done(null, {status: "SUCCESS", message: "User added successfully!", groupName: group.groupName, updatedUserList: updatedGroupUserArray});
                              //context.done(null, group)
                            }
                        })
                    
                    })
                    .catch(function(reject) {
                        console.log("update user reject: ", reject)
                        context.done(reject, null)
                    })
                })
                .catch(function(reject) {console.log("update Reject: ", reject); context.done(reject, null)})
                
                
            } else {
                var message = "User is already a member of this group."
                context.done(null, {status: "FAIL", message: message, groupName: group.groupName, updatedUserList: requestedGroupUsernameArray});
            }
            //console.log("groups returned:", groups);
        })
        .catch(function(reject) {
            console.log("rejection: ", reject)
        })
    });
};
