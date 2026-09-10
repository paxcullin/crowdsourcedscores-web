const  mongo = require("mongodb").MongoClient,
        assert = require("assert");

const { CognitoIdentityProviderClient, AdminDeleteUserCommand } = require("@aws-sdk/client-cognito-identity-provider");
const cognitoClient = new CognitoIdentityProviderClient({ region: 'us-west-2' });
const {config} = require('./config');

const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;


//var provider = new client.AWSCognitoIdentityProviderClient();
//provider.adminDeleteUser(req); 

var cognitoData = {
    UserPoolId: 'us-west-2_zym3aCbQ3',     // Insert your user pool id
    ClientId: '2n15lhk845sucm0k4fejjqcbev' // Insert your app client id
};

//now you can call adminDeleteUser on the client object    

exports.handler = async (event, context, callback) => {
    console.log('event :>> ', event);
    // TODO implement
    try {
        const deleteCognitoResponse = await cognitoClient.send(new AdminDeleteUserCommand({Username: event.username, UserPoolId: 'us-west-2_zym3aCbQ3'}));
            console.log(deleteCognitoResponse);           // successful response
            const dbResponse = await mongo.connect(MONGO_URL);
                let db = dbResponse.db('pcsm');
                let coll = db.collection('profileExtended');
            const deleteResponse = await coll.findOneAndDelete({ username: event.username });
                console.log({deleteResponse});
                return {
                    status: 200,
                    message: JSON.stringify({ success: "User deleted successfully", deleteResponse })
                };
            
    } catch(deleteUserError) {
        console.log({deleteUserError});
        return {
            status: 500,
            message: JSON.stringify({ error: "Failed to delete user", details: deleteUserError })
        }
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