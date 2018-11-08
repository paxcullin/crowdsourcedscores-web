'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert");

const MONGO_URL = 'mongodb://pcsm-user:*dZ2HaWN@ds011775.mlab.com:11775/pcsm';

// console.log('Loading function');

exports.handler = (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    mongo.connect(MONGO_URL, function (err, db) {
        assert.equal(null, err);
        if(err) {
            context.done(err, null);
        }

        var collection = db.collection('profileExtended');
        collection.findOne({"username":event.username}, {groups: 1})
        .then(function(extendedProfile) {
            var groupsArray = [];
            if (!extendedProfile.groups || extendedProfile.groups.length === 0) {
                console.log('no groups to update');
                context.done(null, { status: 'ok' })
            }
            extendedProfile.groups.forEach((group) => {
                groupsArray.push(group.groupId);
            });
            
            console.log('groupsArray: ', groupsArray)
            var groupsQuery = {
                groupId: {
                    $in: groupsArray
                }
            }
            var groupsCollection = db.collection('groups');
            var queryPromises = [];
            groupsCollection.find(groupsQuery, {groupId: 1}).toArray((err, groups) => {
                if (err) {
                    context.done(err, null);
                }
                console.log('groups: ', groups);
                groups.forEach((group, index) => {
                    var update = { $set: 
                        { "users.$[elem].preferred_username" : event.preferred_username }
                    }
                    var arrayFilters = {
                        arrayFilters: [ { "elem.username": event.username } ]
                    }
                    console.log('arrayFilters: ', arrayFilters)
                    groupsCollection.updateOne({ groupId: 11 }, 
                        update, 
                        arrayFilters
                        )
                        .then(groupUpdate => {
                            console.log(groupUpdate)
                            context.done(null, extendedProfile);
                            })
                        .catch(updateError => {
                            console.log(updateError)
                            context.done(updateError, null);
                            });
                    //queryPromises.push(groupsCollection.findOneAndModify()
                })
            })
        })
        .catch(function(reject) {console.log("reject: ", reject)});
    });
};
