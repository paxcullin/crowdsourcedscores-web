var AWS = require('aws-sdk');
  var cognitoidentityserviceprovider = AWS.CognitoIdentityServiceProvider;
  var client = new cognitoidentityserviceprovider({ apiVersion: '2016-04-19', region: 'us-west-2' });

exports.handler = (event, context, callback) => {
    console.log('Received event:', event);
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
    var updatedProfile = function updateAttributes(params) {
        client.adminUpdateUserAttributes(params, function(err, data) {
              if (data) {
                  console.log("data: ", data);
                  callback(null, event);
              }
              if (err) {
                  console.log(err, err.stack); // an error occurred
                  params = updateParams(params);
                  updateAttributes(params);
                  callback(null, event);
                  
              }
        }); 
    };
    updatedProfile(params);
};