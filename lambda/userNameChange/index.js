'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    {config} = require('./config');

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

// console.log('Loading function');

exports.handler = (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    mongo.connect(MONGO_URL, function (err, dbClient) {
        assert.equal(null, err);
        if(err) {
            context.done(err, null);
        }
        const db = dbClient.db('pcsm');
        console.log('db version: ', db)
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
                        { "users.$[element].preferred_username" : event.preferred_username }
                    }
                    var arrayFilters = {
                        arrayFilters: [ { "element.username": 'cmaronchick-hotmail' } ]
                    }
                    console.log('arrayFilters: ', arrayFilters)
                    groupsCollection.update({ groupId:11 },
                        { $set: { "users.$[elem1].preferred_username": 'cmaronchick-hotmail2'} },
                        { arrayFilters: [ {"elem1.username":'cmaronchick-hotmail'} ] }
                        )
                        .then(groupUpdate => {
                            console.log(groupUpdate)
                            context.done(null, extendedProfile);
                            })
                        .catch(updateError => {
                            console.log('updateError: ', updateError)
                            context.done(updateError, null);
                            });
                    //queryPromises.push(groupsCollection.findOneAndModify()
                })
            })
            var leaderboardsCollection = db.collection('leaderboards');
            leaderboardsCollection.find(groupsQuery, {groupId: 1}).toArray((err, groups) => {
                if (err) {
                    context.done(err, null);
                }
                console.log('groups: ', groups);
                groups.forEach((group, index) => {
                    var update = { $set: 
                        { "users.$[element].preferred_username" : event.preferred_username }
                    }
                    var arrayFilters = {
                        arrayFilters: [ { "element.username": 'cmaronchick-hotmail' } ]
                    }
                    console.log('arrayFilters: ', arrayFilters)
                    groupsCollection.update({ groupId:11 },
                        { $set: { "users.$[elem1].preferred_username": 'cmaronchick-hotmail2'} },
                        { arrayFilters: [ {"elem1.username":'cmaronchick-hotmail'} ] }
                        )
                        .then(groupUpdate => {
                            console.log(groupUpdate)
                            context.done(null, extendedProfile);
                            })
                        .catch(updateError => {
                            console.log('updateError: ', updateError)
                            context.done(updateError, null);
                            });
                    //queryPromises.push(groupsCollection.findOneAndModify()
                })
            })
        })
        .catch(function(reject) {console.log("reject: ", reject)});
    });
};
