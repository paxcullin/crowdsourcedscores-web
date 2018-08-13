// var profileParams = {};
//     profileParams.userId = GetURLParameter('userId');

// Unauthenticated getGroup Details


var userProfileInfo = function () {
    var cognitoUser = userPool.getCurrentUser();
    cognitoUser.getSession(function (err, session) {
        if (err) {
            //window.location = '/';
            console.log("getSession err = ", JSON.stringify(err))
        }
        console.log("session = ", session)
        idToken = session.getIdToken();
        //console.log("idToken: ", idToken)
        var userProfileDetails = idToken.payload;
        // for (var d in userProfileDetails) {
        //     $("#profileDetails").append("<strong>" + d + "</strong>: " + userProfileDetails[d] + "<br>")
        // }
        $("#name").text(userProfileDetails.given_name + " " + userProfileDetails.family_name);
        $("#profileEmail").val(userProfileDetails.email);
        return userProfileDetails;
    });
};

function updateProfile () {
    console.log("update button clicked")
    var attributeList = [];
    var attribute = {
        Name : 'preferred_username',
        Value : $("#preferred_username").val()
    };
    var attribute = new AmazonCognitoIdentity.CognitoUserAttribute(attribute);
    attributeList.push(attribute);

    
    console.log("attributeList: ", attributeList);
    cognitoUser.updateAttributes(attributeList, function(err, result) {
        if (err) {
            alert(err);
            return;
        }
        console.log('call result: ' + result);
    });
};



// for (i = 0; i < result.length; i++) {
//     $("#profileDetails").append(result[i])
//     console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
// }
