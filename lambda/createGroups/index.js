'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert");

const MONGO_URL = 'mongodb://${username}:${password}@ds011775.mlab.com:11775/pcsm';

// console.log('Loading function');

exports.handler = (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    mongo.connect(MONGO_URL, function (err, db) {
        
        assert.equal(null, err);
        if(err) {
            context.done(err, null);
        }
        
        var result = {
            message: '',
            succeeded: true
        };

        var collection = db.collection('groups');
        var extendedProfileCollection = db.collection('profileExtended');
        var groupInfo = event;
        groupInfo.users = [groupInfo.owner]
        var existingObjQuery = {owner: groupInfo.username, groupName: groupInfo.crowdName, sport: groupInfo.sport, year: groupInfo.year, users: [{"username": groupInfo.owner}]};
        collection.find({groupId: {$gt: 0}}, {_id: false}).toArray(function(err, groups) {
            console.log("groups: ", groups);
            var message = "";
            if (err) {
                context.done(err, null);
            }
            var ownerGroups = 0;
            for (var i=0; i < groups.length; i++) {
                if (groups[i].owner.username === groupInfo.username) {
                    ownerGroups++;
                }
            }
            if (ownerGroups.length === 3) {
                message = "You cannot create more than 3 groups."
                context.done(null, {message: message, succeeded: false});
            }
            var maxGroupId = Math.max.apply(Math, groups.map(function(o) { return o.groupId; }));
            
            groupInfo.groupId = maxGroupId + 1;
            groupInfo.totalPredictionScore = 0;
            collection.insertOne(groupInfo, {upsert: false})
            .then(function (dbRes) {
                    var respObj = JSON.parse(dbRes);
                    //console.log("respObj: ", respObj);
                    
                    //console.log("groupInfo: ", groupInfo)
    
                    assert.equal(respObj.ok, 1);
                    
                    extendedProfileCollection.updateOne({"username": event.username}, {$push: {"groups": {"sport": groupInfo.sport, "year": groupInfo.year, "groupId": groupInfo.groupId,"groupName":groupInfo.groupName}}}, {upsert: true})
                    .then(function(response) {
                        console.log("update user response: ", response.result)
                        result.message = "Group Created";
                        result.succeeded = true;
                        result.crowdInfo = {
                            groupName: groupInfo.crowdName,
                            sport: groupInfo.sport,
                            year: groupInfo.year,
                            groupId: groupInfo.groupId,
                            totalPredictionScore: groupInfo.totalPredictionScore
                        };
                        context.done(null, result);
                    })
            })
            .catch(function(err) {
                 //assert.equal(err, null);
                 var createCrowd = {};
                if(err) {
                    var error = JSON.stringify(err)
                    console.log(error)
                    if (err.message.indexOf("E11000") > -1) {
                        createCrowd.message = "A group with that name already exists.";
                        createCrowd.succeeded = false;
                        
                        context.done(null, createCrowd);
                    }
                    console.log("err: ", err)
                    context.done(err, null);
                }
            })
        });
    });
};
