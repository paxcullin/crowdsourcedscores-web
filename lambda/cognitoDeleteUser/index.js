const aws = require('aws-sdk'),
        CognitoIdentityServiceProvider = aws.CognitoIdentityServiceProvider,
        client = new CognitoIdentityServiceProvider({ apiVersion: '2016-04-19', region: 'us-west-2' }),
        mongo = require("mongodb").MongoClient,
        assert = require("assert");
const MONGO_URL = 'mongodb://${username}:${password}@ds011775.mlab.com:11775/pcsm';

//var provider = new client.AWSCognitoIdentityProviderClient();
//provider.adminDeleteUser(req); 

var cognitoData = {
    UserPoolId: 'us-west-2_zym3aCbQ3',     // Insert your user pool id
    ClientId: '2n15lhk845sucm0k4fejjqcbev' // Insert your app client id
};

//now you can call adminDeleteUser on the client object    

exports.handler = (event, context, callback) => {
    // TODO implement
    client.adminDeleteUser({Username: event.username, UserPoolId: 'us-west-2_zym3aCbQ3'}, function(err, data) {
      if (err) {
          console.log(err, err.stack); // an error occurred
          context.done(err, null);
      } else {
          console.log(data);           // successful response
          mongo.connect(MONGO_URL, (err, dbResponse) => {
              if (err) {
                context.done(null, "success");
              }
              let db = dbResponse.db('pcsm');
              let coll = db.collection('profileExtended');
              coll.findOneAndDelete({ username: event.username })
              .then(deleteResponse => {
                  console.log({deleteResponse});
                  context.done(null, "success");
              })
              .catch(deleteError => {
                  console.log({deleteError});
                  context.done(null, 'error')
              })
          })
      }
    })
    
//     client.adminUpdateUserAttributes({
//   "UserAttributes": [ 
//       { 
//          "Name": "custom:collegeBowlPremium",
//          "Value": "1"
//       }
//   ],
//   "Username": event.username,
//     "UserPoolId": 'us-west-2_zym3aCbQ3'}, function(err, data) {
//       if (err) {
//           console.log(err, err.stack); // an error occurred
//           context.done(err, null);
//       } else {
//           console.log(data);           // successful response
//           context.done(null, "success");
//       }
//     })
    
    
};