const AWS = require('aws-sdk'),
  cognitoidentityserviceprovider = AWS.CognitoIdentityServiceProvider,
  client = new cognitoidentityserviceprovider({ apiVersion: '2016-04-19', region: 'us-west-2' }),
  mongo = require("mongodb").MongoClient,
  assert = require("assert"),
  MONGO_URL = 'mongodb://pcsm-user:*dZ2HaWN@ds011775.mlab.com:11775/pcsm';


exports.handler = function (event, context, callback) {
    console.log('Received event:', event);
    console.log({context: JSON.stringify(context)});
    console.log({callback: JSON.stringify(callback)});
    if (event.request.userAttributes.preferred_username) {
      console.log("preferred_username is already set as ", event.preferred_username)
        callback(null, event)
    }
    var userDetails = event.request.userAttributes;
    var usernameIncrement = 1;
    var preferred_username = event.userName;
    if (event.userName.indexOf("Facebook") > -1) {
      preferred_username = userDetails.given_name + '' + userDetails.family_name;
    }
    console.log("preferred_username after Facebook check: ", preferred_username)
    
    var params = {
      UserAttributes: [ /* required */
        {
          Name: 'preferred_username', /* required */
          Value: preferred_username
        },
        /* more items */
      ],
      UserPoolId: event.userPoolId, /* required */
      Username: event.userName /* required */
    };
    
    function updateParams(params) {
        preferred_username = preferred_username + '' + usernameIncrement;
        usernameIncrement++;
        params = {
          UserAttributes: [ /* required */
            {
              Name: 'preferred_username', /* required */
              Value: preferred_username
            },
            /* more items */
          ],
          UserPoolId: event.userPoolId, /* required */
          Username: event.userName /* required */
        };
    }

    
    console.log("params: ", params)
    var updatedProfile = (params) => {
        client.adminUpdateUserAttributes(params, function(err, data) {
              if (data) {
                  console.log("data: ", data);
                  
                    console.log({params: JSON.stringify(params)})
                    let username = params.Username;
                    let preferred_username = params.UserAttributes[0].Value
                    
                      mongo.connect(MONGO_URL, (err, dbResponse) => {
                          if (err) {
                            callback(null, event);
                          }
                          let db = dbResponse.db('pcsm');
                          let coll = db.collection('profileExtended');
                          coll.insertOne({ username: username, preferred_username: preferred_username })
                          .then(insertResponse => {
                              console.log({insertResponse: JSON.stringify(insertResponse)})
                              callback(null, event);
                              context.done(null, event);
                              context.callbackWaitsForEmptyEventLoop = false;
                              return context;
                              //return callback.functionName
                          })
                          .catch(insertError => {
                              console.log({insertError});
                              context.callbackWaitsForEmptyEventLoop = false;
                              callback(null, event);
                              context.done(null, event);
                              return true;
                              //return callback.functionName
                          })
                          .catch(callbackError => {
                              context.done(null, event);
                              return;
                          })
                      })
              }
              if (err) {
                  console.log(err, err.stack); // an error occurred
                  params = updateParams(params);
                  updatedProfile(params);
                  
              }
        }); 
    };
    updatedProfile(params);
};