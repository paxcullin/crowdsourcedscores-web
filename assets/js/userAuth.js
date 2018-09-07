var userInformation = cognitoUser || {};

function GetURLParameter(sParam) {
    //var sPageURL = window.location.hash.substring(1);
    var sPageURL = window.location.href;
    var sURLVariables = sPageURL.split('?');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            if (sParameterName[1].indexOf("#") > -1) {
                var code = sParameterName[1].split('#');
                return code[0];
            }
            return sParameterName[1];
        }
    }
}
var decoded = {};
var idToken = "";
function processToken() {
    idToken = GetURLParameter('id_token');
    if (!idToken) {
        console.log('No id_token present');
        return;
    }
    decoded = jwt_decode(idToken);
    console.log(decoded);
    return decoded;
}

// Setting location for the page

var windowRedirect = window.location.protocol + "//" + window.location.hostname;
if (window.location.pathname !== "/") {
    windowRedirect += window.location.pathname;
}
// if (window.location.search && window.location.search.length > 0) {
//     windowRedirect += window.location.search;
// }

function getQueryStringValue (key) {  
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
}  

function showLoginButton() {
    $("#loginButtons").html("<button type=\"button\" class=\"btn btn-primary\" onclick=\"ga('send','event','login','loginClicked');window.location=('https://crowdsourcedscores.auth.us-west-2.amazoncognito.com/login?response_type=code&client_id=2n15lhk845sucm0k4fejjqcbev&redirect_uri=" + encodeURIComponent(windowRedirect) + "')\">Login/Sign Up</button>");
    //$("#loginButtons").html("<button type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#loginModal\">Login/Signup</button>");
            
}

function showLogoutButton() {

    $("#loginButtons").html("<button id=\"logoutButton\" onclick=\"console.log('logout clicked');logout()\" class=\"btn btn-primary\">Log Out</button>");
}



// GET cognitoUser Information at the top
//var tokenFromURL = processToken();
// Pool ID and Client ID sourced from AWS

var id_token = "";
var cognitoData = {
   UserPoolId: 'us-west-2_zym3aCbQ3',     // Insert your user pool id
   ClientId: '2n15lhk845sucm0k4fejjqcbev' // Insert your app client id
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(cognitoData);



//GET CURRENT USER FROM LOCAL STORAGE
function getUserAttributes () {
    cognitoUser.getSession(function (err, session) {
        if (err) {
            //window.location = '/';
            console.log("getSession err = ", JSON.stringify(err))
            return;
        }
        cognitoUser.getUserAttributes(function(err, attributes) {
            var attributesObject = {};
            if (err) { console.log("user attributes error: ", err); return; }
            for (var i=0; i < attributes.length; i++) {
                attributesObject[attributes[i].Name] = attributes[i].Value;
            }
            userInformation.attributes = attributesObject;
            $('#profileName').prepend("<span class=\"profileName\">" + userInformation.attributes.preferred_username + "</span>");
        })
    });
}

//update user attribute
function updateUserAttributes (attributes) {
    cognitoUser.getSession(function (err, session) {
        if (err) {
            //window.location = '/';
            console.log("getSession err = ", JSON.stringify(err))
            return;
        }
        cognitoUser.updateAttributes(attributes, function(err, attributesResponse) {
            if (err) { console.log("user attributes error: ", err); return; }
            // for (var i=0; i < attributesResponse.length; i++) {
            //     attributesObject[attributes[i].Name] = attributes[i].Value;
            // }
            //userInformation.attributes = attributesObject;
            //$('#profileName').prepend("<span class=\"profileName\">" + userInformation.attributes.preferred_username + "</span>");
            console.log("attributesResponse: ", attributesResponse)
        })
    })
}

var cognitoUser = userPool.getCurrentUser();
if (cognitoUser) {
    userInformation.cognitoUser = cognitoUser;
    userData = {
        Username : cognitoUser.username,
        Pool : userPool
    };
    id_token = cognitoUser.getSession(function (err, session) {
        if (err) {
            //window.location = '/';
            console.log("getSession err = ", JSON.stringify(err))
            return;
        }
        getUserAttributes();
        token = session.getIdToken().getJwtToken();
        id_token = token;
        return token;
    });
    showLogoutButton();
}

if (!cognitoUser && GetURLParameter('code')) {
    // var decodedToken = processToken();
    var getTokensOptions = {
        method: "POST",
        body: "client_id=" + cognitoData.ClientId + "&code=" + GetURLParameter('code') + "&grant_type=authorization_code&redirect_uri=" + encodeURI(windowRedirect),
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        }
    };

    console.log("getTokensOptions: ", getTokensOptions)
    var cognitoUser = get("https://crowdsourcedscores.auth.us-west-2.amazoncognito.com/oauth2/token", getTokensOptions)
    .then(function(response) {
        console.log("token response: ", response);
        if (response.status === 200) {
            return response.json();
        }
    }).catch(function(reject) {
        console.log("token reject: ", reject);
    })
    .then(function(tokenResponse) {
        console.log("tokenResponse: ", tokenResponse);
        var decodedToken = jwt_decode(tokenResponse.id_token);
        userData = {
            Username : decodedToken["cognito:username"],
            Pool : userPool
        }
        cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        localStorage.setItem('CognitoIdentityServiceProvider.' + cognitoData.ClientId + '.LastAuthUser', decodedToken["cognito:username"]);
        localStorage.setItem('CognitoIdentityServiceProvider.' + cognitoData.ClientId + '.' + decodedToken["cognito:username"] + '.idToken', tokenResponse.id_token);
        localStorage.setItem('CognitoIdentityServiceProvider.' + cognitoData.ClientId + '.' + decodedToken["cognito:username"] + '.accessToken', tokenResponse.access_token);
        localStorage.setItem('CognitoIdentityServiceProvider.' + cognitoData.ClientId + '.' + decodedToken["cognito:username"] + '.refreshToken', tokenResponse.refresh_token);
        
        showLogoutButton();

        userInformation.cognitoUser = cognitoUser;
        getUserAttributes();
        var token;
        if (tokenResponse && tokenResponse.id_token) {
            token = tokenResponse.id_token;
        } else {
            cognitoUser.getSession(function(err, session) {
                if (err) {
                    //window.location = '/';
                    console.log("getSession err = ", JSON.stringify(err))
                    return;
                }
                token = session.getIdToken().getJwtToken();
                console.log("second token: ", token)
            });
        }
        id_token = token;
        return id_token;
    })
}



   //var id_token = "";

    var cognitoData = {
        UserPoolId: 'us-west-2_zym3aCbQ3',     // Insert your user pool id
        ClientId: '2n15lhk845sucm0k4fejjqcbev' // Insert your app client id
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(cognitoData);


    var userData = {
        Username : '',
        Pool : userPool
    };


    var useToken = function (callback) {
        if (!id_token) {
            var cognitoUser = userPool.getCurrentUser();
            if (cognitoUser !== null) {
                console.log("useToken cognitoUser = ", cognitoUser);
                cognitoUser.getSession(function (err, session) {
                    if (err) {
                        //window.location = '/';
                        console.log("getSession err = ", JSON.stringify(err))
                    }
                    token = session.getIdToken().getJwtToken();
                    id_token = token;
                    callback(token);
                });
            } else {
                return callback(false);
            }
        } else {

            console.log("id_token exists: ", id_token);
            callback(id_token);
        }
    };

function get(url, options) {
    return fetch(url, options);
}

function logout () {
    ga('send','event','login','logout');
    var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
        cognitoUser.signOut();
        //window.location = '/';
    }
    showLoginButton();
    
};
// $("#logoutButton").click(logout());
// $("#btn_logout").click(logout());

console.log("userInformation: ", userInformation)