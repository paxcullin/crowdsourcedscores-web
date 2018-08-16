// var profileParams = {};
//     profileParams.userId = GetURLParameter('userId');

// Unauthenticated getGroup Details


function addUserProfileAttributes(userProfileDetails2) {
    console.log("userProfileDetails2: ", userProfileDetails2)
    var attributeNames = [];
    for (var i=0;i < userProfileDetails2.length; i++) {
        attributeNames.push(userProfileDetails2[i].Name)
    }

    console.log("userProfileDetails2[attributeNames.indexOf(\"preferred_username\")]: ", userProfileDetails2[attributeNames.indexOf("preferred_username")])
    $("#preferred_username").val(userProfileDetails2[attributeNames.indexOf("preferred_username")].Value);
    $("#profileName").text(userProfileDetails2[attributeNames.indexOf("preferred_username")].Value + ' ');
    $("#name").val(userProfileDetails2[attributeNames.indexOf("given_name")].Value + ' ' + userProfileDetails2[attributeNames.indexOf("family_name")].Value);
    $("#profileEmail").val(userProfileDetails2[attributeNames.indexOf("email")].Value);
    return userProfileDetails;
}

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
        var userProfileDetails2 = cognitoUser.getUserAttributes(function(err, result){
            if (result) { addUserProfileAttributes(result);}
        });
        // console.log("userProfileDetails: ", userProfileDetails)

    });
};

function updateProfile () {
    
    //console.log("useToken cognitoUser = ", cognitoUser);
    cognitoUser.getSession(function (err, session) {
        if (err) {
            //window.location = '/';
            console.log("getSession err = ", JSON.stringify(err))
        }
        console.log("session = ", session)
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
                console.log(JSON.stringify(err));
                if (err.code === "AliasExistsException") {
                    $("#updateErrorText").text("Someone already has that username. Please select another one.")
                }
                return;
            }
            console.log('call result: ' + result);
        });
    });
};
