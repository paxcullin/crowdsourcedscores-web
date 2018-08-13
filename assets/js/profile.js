var profileParams = {};
    profileParams.userId = GetURLParameter('userId');

// Unauthenticated getGroup Details
var cognitoUser = cognitoUser.getCurrentUser();

if (cognitoUser) {
    cognitoUser.getUserAttributes(function(err, result) {
        if (err) {
            alert(err);
            return;
        }
        for (i = 0; i < result.length; i++) {
            $("#profileDetails").append(result[i])
            console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
        }
    });
}
