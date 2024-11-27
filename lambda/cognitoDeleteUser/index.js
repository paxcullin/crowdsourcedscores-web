const mongo = require("mongodb").MongoClient;
const MONGO_URL = 'mongodb://${username}:${password}@ds011775.mlab.com:11775/pcsm';
const { CognitoIdentityProviderClient, AdminDeleteUserCommand } = require("@aws-sdk/client-cognito-identity-provider"); // ES Modules import
// const { CognitoIdentityProviderClient, AdminDeleteUserCommand } = require("@aws-sdk/client-cognito-identity-provider"); // CommonJS import
const client = new CognitoIdentityProviderClient({region: 'us-west-2'});

//var provider = new client.AWSCognitoIdentityProviderClient();
//provider.adminDeleteUser(req); 

var cognitoData = {
    UserPoolId: 'us-west-2_zym3aCbQ3',     // Insert your user pool id
    ClientId: '2n15lhk845sucm0k4fejjqcbev' // Insert your app client id
};

//now you can call adminDeleteUser on the client object    

exports.handler = async (event, context, callback) => {
    // TODO implement
    // client.adminDeleteUser({Username: event.username, UserPoolId: 'us-west-2_zym3aCbQ3'}, function(err, data) {

        const command = new AdminDeleteUserCommand({Username: event.username, UserPoolId: 'us-west-2_zym3aCbQ3'});
        try {
            const response = await client.send(command);
            console.log(response);           // successful response
            const dbResponse = await mongo.connect(MONGO_URL);
            let db = dbResponse.db('pcsm');
            let coll = db.collection('profileExtended');
            const deleteResponse = await coll.findOneAndDelete({ username: event.username })
            return context.done(null, "success");
        } catch (err) {

            console.log(err, err.stack); // an error occurred
            return context.done(err, null);
        }
    
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