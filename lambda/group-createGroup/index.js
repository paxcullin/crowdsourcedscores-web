'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    {config} = require('config');

    const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

// console.log('Loading function');

exports.handler = (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    mongo.connect(MONGO_URL, function (err, client) {
        const db = client.db('pcsm');
        const { sport, year, season, owner, groupName, password, picture } = event
        const groupPublic = event.public;
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
        groupInfo.users = [groupInfo.owner];
        groupInfo.results = {
            [sport]: {
                [year]: {
                    [season ? season : 'reg']: {
                        overall: {
                            predictionScore: 0
                        }
                    }
                }
            }
        }
        //var existingObjQuery = {owner: groupInfo.username, groupName: groupInfo.groupName, sport: groupInfo.sport, year: groupInfo.year, users: [{"username": groupInfo.owner}]};
        collection.find({groupId: {$gt: 0}, year: groupInfo.year, sport: groupInfo.sport}, {_id: false}).toArray(function(err, groups) {
            console.log("groups: ", groups);
            var message = "";
            if (err) {
                context.done(err, null);
            }
            
            // check for max number of owned groups first
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
            //Get the highest group ID, and increment by 1
                var maxGroupId = Math.max.apply(Math, groups.map(function(o) { return o.groupId; }));
                groupInfo.groupId = maxGroupId + 1;
            groupInfo.totalPredictionScore = 0;
            console.log('groupInfo: ', groupInfo)
            collection.findOne({year: groupInfo.year, sport: groupInfo.sport, groupName: groupInfo.groupName})
            .then(group => {
                console.log({group: group});
                if (group === null) {
                    collection.insertOne(groupInfo, {upsert: false})
                    .then(function (dbRes) {
                            var respObj = JSON.parse(dbRes);
                            console.log("respObj: ", respObj);
                            
                            //console.log("groupInfo: ", groupInfo)
            
                            assert.equal(respObj.ok, 1);
                            
                            extendedProfileCollection.updateOne({"username": event.owner.username}, {$push: {"groups": {"sport": groupInfo.sport, "year": groupInfo.year, "groupId": groupInfo.groupId,"groupName":groupInfo.groupName}}}, {upsert: true})
                            .then(function(response) {
                                console.log("update user response: ", response.result)
                                result.message = "Group Created";
                                result.succeeded = true;
                                result.groupInfo = groupInfo;
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
                } else {
                    context.done(null, {message: 'A group with that name already exists.', succeeded: false})
                }
            })
            .catch(findGroupError => context.done(null, {message: 'An unknown error occurred. Please try again later.', succeeded: false}))
        });
    });
};