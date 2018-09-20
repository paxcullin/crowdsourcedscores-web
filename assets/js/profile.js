// var profileParams = {};
//     profileParams.userId = GetURLParameter('userId');

// Unauthenticated getGroup Details


function addUserProfileAttributes(userProfileDetails2) {
    var attributesObject = {};
    if (userInformation.attributes === null) {
        console.log("addAttributes UserInformation: ", userInformation)
        for (var i=0;i < userProfileDetails2.length; i++) {
            attributesObject[userProfileDetails2[i].Name] = userProfileDetails2[i].Value;
        }
    } else {
        attributesObject = userInformation.attributes;
    }

    if (attributesObject.preferred_username) {
        $("#preferred_username").val(attributesObject.preferred_username);
    } else {
        $("#preferred_username").val(attributesObject["cognito:username"]);
    }
    $("#profileName").text(attributesObject.preferred_username + ' ');
    $("#name").val(attributesObject.given_name + ' ' + attributesObject.family_name);
    $("#profileEmail").val(attributesObject.email);
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
            return idToken;
        })
};


var extendedProfile = function() {
    useToken(function(token) {
        var getOptions = {
            method: "GET",
            headers: {
                "Authorization": token
            }
        }
        get("https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/extendedprofile", getOptions)
        .then(function(extProfileResponse) {
            return extProfileResponse.json()
        })
        .then(function(extProfileResponseJSON) {
            //check for previous results
                if (extProfileResponseJSON && extProfileResponseJSON.resultsNFL) {

                    var userResults = extProfileResponseJSON.results.weekly;
                    var resultsHTML = "";
                    var resultsDivHTML = "";
                    console.log("userResults: ", userResults)
                    //var resultsDivHTML = "<table class=\"rwd-table\"><thead><tr><th class=\"winners\"><span class=\"full abbrev\">Winners</span></th><th class=\"spread\"><span class=\"full\">Spread</span></th><th class=\"total\"><span class=\"full\">Total</span></th><th class=\"totalPredictionScore\"><span class=\"full\">Prediction Score</span></th></tr></thead><tbody>";
                    var rank = 1;
                    userResults.forEach(function(item, index) {
                        var weeklyResults = item;
                        //console.log("weeklyResults: ", weeklyResults)
                        if (weeklyResults.gameWeek > 0) {
                            var rowClass = '';
                            if ((index % 2) === 0) rowClass = ' class="alt-tr"'
                            resultsHTML += '<tr' + rowClass + '>';
                            resultsHTML += "<td data-th=\"Week\">" + weeklyResults.gameWeek + "</td>";
                            resultsHTML += "<td data-th=\"Winners\">" + weeklyResults.winner.correct + "</td>";
                            resultsHTML += "<td data-th=\"Spread\">" + weeklyResults.spread.correct + "</td>";
                            resultsHTML += "<td data-th=\"Total\">" + weeklyResults.total.correct + "</td>";
                            resultsHTML += "<td data-th=\"Score\">" + weeklyResults.predictionScore + "</td>";
                            resultsHTML += "</tr>";
                        }
                        if (index === (userResults.length - 1)) {
                            resultsDivHTML = "<table class=\"rwd-table\"><thead><tr><th class=\"gameWeek\"><span class=\"full abbrev\">Week</span></th><th class=\"Winners\"><span class=\"full abbrev\">Winners</span></th><th class=\"Spread\"><span class=\"full\">Spread</span></th><th class=\"Total\"><span class=\"full\">Total</span></th><th class=\"Score\"><span class=\"full\">Prediction Score</span></th></tr></thead><tbody>";
                            resultsDivHTML += resultsHTML + "</tbody></table>";
                            $("#predictionDetails").html(resultsDivHTML);
                        }
                    });
                } else {
                    $("#predictionDetails").html("<a href=\"/\" style=\"color: #B22438;\">Make your predictions</a> and come back here to see your results!");
                }

                //build out groups table in the same way as the Index page
                if (extProfileResponseJSON && extProfileResponseJSON.groups) {
                    buildGroupsTable(extProfileResponseJSON.groups);
                } else {
                    $("#allGroups").html("<a href=\"crowd.html\" style=\"color: #B22438;\">Create or join a crowd today to compete against other Crowd members!</a>");
                }

        })
    })
}

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
        var usernameAttribute = {
            Name : 'preferred_username',
            Value : $("#preferred_username").val()
        };
        var usernameAttribute = new AmazonCognitoIdentity.CognitoUserAttribute(usernameAttribute);
        attributeList.push(usernameAttribute);

        var emailAttribute = {
            Name : 'email',
            Value : $("#profileEmail").val()
        };
        var emailAttribute = new AmazonCognitoIdentity.CognitoUserAttribute(emailAttribute);
        attributeList.push(emailAttribute);

        var optInBoolean = $("#reminderOptin").is(":checked");
        var optInInteger = 0
        if (optInBoolean) {
            optInInteger = 1;
        }
        var optInAttribute = {
            Name : 'custom:reminderMailOptIn',
            Value : optInInteger + ""
        };
        var optInAttribute = new AmazonCognitoIdentity.CognitoUserAttribute(optInAttribute);
        attributeList.push(optInAttribute);


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
