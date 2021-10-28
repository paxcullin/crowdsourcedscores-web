'use strict';

var mongo = require("mongodb").MongoClient,
    {config} = require('./config')
    assert = require("assert");

    const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

// console.log('Loading function');

exports.handler = (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    // catch All Users - A user cannot leave the all users group
    
    if (parseInt(event.groupId) === 0) {
        context.done(null, "User cannot leave the All Users Group");
    }
    
    mongo.connect(MONGO_URL, function (err, dbClient) {
        assert.equal(null, err);
        if(err) {
            context.done(err, null);
        }
        const db = dbClient.db('pcsm');
        

        var collection = db.collection('groups');
        var profileExtended = db.collection('profileExtended');
        collection.findOne({"groupId":parseInt(event.groupId), "sport":event.sport, "year":parseInt(event.year)}, {_id: false})
        .then(function(group) {
            var leavingUsername = event.userId;
            if (leavingUsername === group.owner) {
                context.done(null, "The owner of the group may not leave the group.");
            }
            var groupUsers = group.users;
            var userIndex = -1;
            for (var i=0; i<groupUsers.length; i++) {
                if (groupUsers[i].username === leavingUsername) { 
                    userIndex = i;
                }
            }
            console.log("userIndex: ", userIndex)
            if (userIndex !== -1) {
                groupUsers.splice(userIndex,1);
                collection.findOneAndUpdate({"sport": group.sport, "year": parseInt(group.year), "groupId": parseInt(group.groupId)},{$set: {"users": groupUsers} }, {returnNewDocument: true})
                .then(function(crowdResponse) {
                    console.log("User removed successfully!: ", groupUsers);
                    var message = "SUCCESS";
                    console.log('response: ', crowdResponse)
                return profileExtended.updateOne({username: event.userId},{$pull: {"groups": { "groupId": parseInt(event.groupId), "sport": event.sport, "year": parseInt(event.year) } }})
                })
                .then(function(userResponse) {
                        console.log("update user response: ", userResponse)
                        context.done(null, {"message": message, users: groupUsers});
                        
                })
                .catch(function(reject) {console.log("update Reject: ", reject); context.done(reject, null)});
            } else {
                var message = "user is not a member of this group"
                 context.done(null, message);
            }
        })
        .catch(function(reject) {
            
            assert.equal(reject, null);
            if(reject) {
                console.log("Reject: ", reject) ;
            }
                context.done(reject, null);
        })
    });
};
