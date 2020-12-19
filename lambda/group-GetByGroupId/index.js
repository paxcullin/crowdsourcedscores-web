'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert"),
    {config} = require('config'),
    aws = require('aws-sdk');

var cognitoserviceprovider = new aws.CognitoIdentityServiceProvider();
const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

// console.log('Loading function');

exports.handler = (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const { userId, year, sport, groupId } = event;
    const season = event.season ? event.season : 'reg'
    const gameWeek = parseInt(event.week)
    mongo.connect(MONGO_URL, (err, db) => {
        assert.equal(null, err);
        if(err) {
            console.log('not connected')
            context.done(err, null);
        }
        let dbName = db.db('pcsm');
        var collection = dbName.collection('groups');
        var extendedProfile = dbName.collection('profileExtended');
        // get group by even, sport, and year - return one group
        collection.findOne({"groupId":parseInt(event.groupId), "sport": event.sport, "year": parseInt(event.year)}, {_id: false })
        .then((group) => {
            var username = event.userId;
            if (!group) {
                context.done(null, {message: 'Group Not Found'});
            }
            console.log(group);
            group.memberOf = false;
            
            
            //check for user in a private gorup - reject if user is not a member
            
            for (var un in group.users) {
                if (username === group.users[un].username) {
                    group.memberOf = true;
                    group.memberIndex = parseInt(un);
                }
            }
                
            if (group.public === false && group.memberOf === false) {
                group = {
                    groupId: group.groupId,
                    groupName: group.groupName,
                    owner: group.owner,
                    memberOf: false,
                    public: false
                }
                context.done(null, group);
            }
            var usersArrayLength = group.users.length;
            group.users.map((user) => {
                var query = { username: user.username }
                
            
                let cognitoUserArray = cognitoserviceprovider.listUsers({
                  UserPoolId: 'us-west-2_zym3aCbQ3', /* required */
                  AttributesToGet: [
                    'email',
                    'preferred_username'
                    /* more items */
                  ],
                  Filter: 'username = "' + user.username + '"'
                }, (err, cognitoUsersArray) => {
                    console.log('cognitoUsersArray: ', cognitoUsersArray)
                    if (err) return;
                    if (cognitoUsersArray && cognitoUsersArray.Users && cognitoUsersArray.Users.length > 0) {
                        console.log(JSON.stringify(cognitoUsersArray))
                        let cognitoUser = cognitoUsersArray.Users[0]
                        cognitoUser.Attributes.forEach(attribute => {
                            (attribute.Name === 'preferred_username') ? user.preferred_username = attribute.Value : null
                        })
                        console.log({user})
                        const querySportYear = `results.${event.sport}.${event.year}`
                        query[querySportYear] = { $exists: true };
                        console.log(`query: ${JSON.stringify(query)}`)
                        extendedProfile.findOne(query,{results: true})
                        .then(function(userProfile) {
                            if (!userProfile) {
                                console.log(`no results for ${user.username}`);
                                user.results = { weekly: [], overall: { predictionScore: 0}};
                            } else {
                                var userProfileArray = (userProfile.results && userProfile.results[sport] && userProfile.results[sport][year] && userProfile.results[sport][year][season]) ? userProfile.results[sport][year][season] : null;
                                console.log("userProfileArray: ", userProfileArray)
                                if (userProfileArray && userProfileArray.weekly && userProfileArray.weekly.length > 0) {
                                    userProfileArray.weekly.sort(function(a,b) {
                                        if (a.gameWeek > b.gameWeek) return 1;
                                        if (a.gameWeek < b.gameWeek) return -1;
                                    });
                                    var weeklyResultsArray = userProfileArray.weekly.filter(function(weeklyResult) {
                                        //console.log("weeklyResult: ", weeklyResult)
                                        return weeklyResult.gameWeek > 0;
                                    });
                                    userProfileArray.weekly = weeklyResultsArray;
                                console.log("userProfileArray.weekly: ", userProfileArray.weekly)
                                }
                                user.results = userProfileArray ? userProfileArray : { weekly: [], overall: { predictionScore: 0}};
                                console.log("updated user: ", user)
                            }
                            console.log('usersArrayLength: ', usersArrayLength)
                            usersArrayLength--;
                            if (usersArrayLength === 0) {
                                console.log("group: ", JSON.stringify(group.users))
                                
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
                    }
                })
                
            })
        })
        .catch(function(reject) {
            var message = reject;
            context.done(reject, null);
        });
    });
};
