'use strict';

var mongo = require("mongodb").MongoClient,
    assert = require("assert");
    
    var AWS = require('aws-sdk');
    var cognitoidentityserviceprovider = AWS.CognitoIdentityServiceProvider;
    var client = new cognitoidentityserviceprovider({ apiVersion: '2016-04-19', region: 'us-west-2' });

const MONGO_URL = 'mongodb://pcsm-user:*dZ2HaWN@ds011775.mlab.com:11775/pcsm';

// console.log('Loading function');

exports.handler = (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    mongo.connect(MONGO_URL, function (err, db) {
        assert.equal(null, err);
        if(err) {
            context.done(err, null);
        }

        var limit = 100;
        if (event.limit && event.limit != "") {
            limit = parseInt(event.limit);
        }

        var collection = db.collection('profileExtended');
        collection.find({}, {_id: false, username: 1, results: 1}, {sort: {"results.overall.predictionScore": -1}, limit: limit}).toArray(function(err, extendedProfiles) {
            var extendedProfilesArrayLength = extendedProfiles.length;
            extendedProfiles.map(function(extendedProfile) {
                if (event.gameWeek) {
                    var weeklyResultsArray = extendedProfile.results.weekly.filter(function(result) {
                        return result.gameWeek === parseInt(event.gameWeek)
                    });
                    extendedProfile.results.weekly = weeklyResultsArray;
                }
                console.log('extendedProfile.results.weekly: ', extendedProfile.results.weekly);
                if(extendedProfile.username) {
                    var userData = {
                        UserPoolId: 'us-west-2_zym3aCbQ3', /* required */
                        Username: extendedProfile.username /* required */
                    }
                    client.getUser(userData, function(err, userData) {
                        if (err) {
                            context.done(err, null);
                        }
                        //console.log("userCognitoData: ", userData);
                        userData.UserAttributes.forEach(function(item) {
                            if (item.Name === "preferred_username") extendedProfile.preferred_username = item.Value
                        })
                        if (!extendedProfile.results) {
                            extendedProfile.results = {
                                weekly: [],
                                overall: {
                                    predictionScore: 0
                                }
                            }
                        }
                        extendedProfilesArrayLength--;
                        if (extendedProfilesArrayLength === 0) {
                            extendedProfiles.sort(function(a,b) {
                                if (a.results && a.results.overall && b.results && b.results.overall) {
                                    if (a.results.overall.predictionScore > b.results.overall.predictionScore) return -1
                                    if (a.results.overall.predictionScore < b.results.overall.predictionScore) return 1
                                } else {
                                    return 1
                                }
                            })
                            console.log('extendedProfiles: ', extendedProfiles)
                            context.done(null, extendedProfiles)
                        }
                    });
                    
                    assert.equal(err, null);
                    if(err) {
                        context.done(err, null);
                    }
                } else {
                        extendedProfilesArrayLength--;
                    console.log("no username: ", event)
                }
            })
            
        })
    });
};
