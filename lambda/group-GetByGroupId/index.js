'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    aws = require('aws-sdk');

var cognitoserviceprovider = new aws.CognitoIdentityServiceProvider();

const MONGO_URL = 'mongodb://${username}:${password}@ds011775.mlab.com:11775/pcsm';

// console.log('Loading function');

exports.handler = async (event, context) => {
    var event = {
        year: 2018,
        sport: 'nfl',
        groupId: 4
    }
    console.log('Received event:', JSON.stringify(event, null, 2));

    mongo.connect(MONGO_URL, function (err, db) {
        assert.equal(null, err);
        if(err) {
            console.log('not connected')
            context.done(err, null);
        }
        let dbName = db.db('pcsm');
        var collection = dbName.collection('groups');
        var extendedProfile = dbName.collection('profileExtended');
        collection.findOne({"groupId":parseInt(event.groupId), "sport": event.sport, "year": parseInt(event.year)}, {_id: false })
        .then((group) => {
            var username = event.userId;
            if (!group) {
                context.done(null, {});
            }
            console.log(group);
            group.memberOf = false;
            
            cognitoserviceprovider.listUsers({
              UserPoolId: 'us-west-2_zym3aCbQ3', /* required */
              AttributesToGet: [
                'preferred_username',
                /* more items */
              ]
            }, (err, data) => {
                if (err) console.log({err})
                if (data) console.log({data})
            })
            
            //check for user in a private gorup - reject if user is not a member
            
            for (var un in group.users) {
                if (username === group.users[un].username) {
                    group.memberOf = true;
                    group.memberIndex = parseInt(un);
                }
            }
                
            if (group.public === false && group.memberOf === false) {
                group = {
                    groupName: group.groupName,
                    owner: group.owner,
                    memberOf: false,
                    public: false
                }
                context.done(null, group);
            }
            var usersArrayLength = group.users.length;
            group.users.map(function(user) {
                var query = { username: user.username }
                const querySportYear = `results.${event.sport}.${event.year}`
                query[querySportYear] = { $exists: true };
                console.log(`query: ${JSON.stringify(query)}`)
                extendedProfile.findOne(query,{results: true})
                .then(function(userProfile) {
                    if (!userProfile) {
                        console.log(`no results for ${user.username}`)
                    } else {
                        var userProfileArray = userProfile.results;
                        console.log("userProfileArray: ", userProfileArray)
                        if (userProfileArray && userProfileArray.weekly && userProfileArray.weekly.length > 0) {
                            userProfileArray.weekly.sort(function(a,b) {
                                if (a.gameWeek > b.gameWeek) return 1;
                                if (a.gameWeek < b.gameWeek) return -1;
                            });
                            var weeklyResultsArray = userProfileArray.weekly.filter(function(weeklyResult) {
                                console.log("weeklyResult: ", weeklyResult)
                                return weeklyResult.gameWeek > 0;
                            });
                            userProfileArray.weekly = weeklyResultsArray;
                        console.log("userProfileArray.weekly: ", userProfileArray.weekly)
                        }
                        user.results = userProfileArray;
                        console.log("updated user: ", user)
                    }
                    usersArrayLength--;
                    if (usersArrayLength === 0) {
                        console.log("group: ", group)
                        
                        group.users.sort(function(a,b) {
                            if (a.results && a.results.overall && b.results && b.results.overall) {
                                if (a.results.overall.predictionScore > b.results.overall.predictionScore) return -1;
                                if (a.results.overall.predictionScore < b.results.overall.predictionScore) return 1;
                            }
                            return 0;
                        })
                        context.done(null, group);
                    }
                })
                .catch(function(err) {
                    console.log("err: ", err)
                })
            })
        })
        .catch(function(reject) {
            var message = reject;
            context.done(reject, null);
        });
    });
//};
