

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
    // $("#loginButtons").html("<button type=\"button\" class=\"btn btn-primary\" onclick=\"ga('send','event','login','loginClicked');window.location=('https://crowdsourcedscores.auth.us-west-2.amazoncognito.com/login?response_type=code&client_id=2n15lhk845sucm0k4fejjqcbev&redirect_uri=" + encodeURIComponent(windowRedirect) + "')\">Login/Sign Up</button>");
    $("#loginButtons").html("<button type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#loginModal\">Login/Signup</button>");
            
}

function showLogoutButton() {

    $("#loginButtons").html("<button id=\"logoutButton\" onclick=\"console.log('logout clicked');logout()\" class=\"btn btn-primary\">Log Out</button>");
}



// GET cognitoUser Information at the top
//var tokenFromURL = processToken();
// Pool ID and Client ID sourced from AWS

var id_token = null;



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
            if (tokenResponse) {
            console.log("tokenResponse: ", tokenResponse);
            var decodedToken = jwt_decode(tokenResponse.id_token);
            var CognitoIdToken = new AmazonCognitoIdentity.CognitoIdToken({ IdToken: tokenResponse.id_token });
            var CognitoAccessToken = new AmazonCognitoIdentity.CognitoAccessToken({ AccessToken: tokenResponse.access_token });
            var CognitoRefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({ RefreshToken: tokenResponse.refresh_token });
            console.log('Tokens: ', { CognitoIdToken, CognitoAccessToken, CognitoRefreshToken })
            var CognitoUserSession = new AmazonCognitoIdentity.CognitoUserSession({ IdToken: CognitoIdToken, AccessToken: CognitoAccessToken, RefreshToken: CognitoRefreshToken })
            ga('send','event','login','successful');
            showLogoutButton();

            
            const userData = {
                Username: CognitoUserSession.idToken.payload.email,
                Pool: userPool
            };
            cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
            cognitoUser.setSignInUserSession(CognitoUserSession);
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
        }
    })
}






    var useToken = function (callback) {
        // console.log("useToken id_token: ", id_token)
        if (!id_token) {
            var cognitoUser = userPool.getCurrentUser();
            if (cognitoUser) {
                cognitoUser.getSession(function (err, session) {
                    if (err) {
                        //window.location = '/';
                        console.log("getSession err = ", JSON.stringify(err))
                    }
                    token = session.getIdToken().getJwtToken();
                    //console.log(decoded);
                    id_token = token;
                    callback(token);
                });
            } else {
                callback(false);
            }
        } else {
            var decodedToken = jwt_decode(id_token);
            if (decodedToken.exp && ((decodedToken.exp * 1000) > Date.now())) {
                callback(id_token);
            } else {
                var cognitoUser = userPool.getCurrentUser();
                if (cognitoUser) {
                    console.log('cognitoUser: ', cognitoUser)
                    cognitoUser.getSession(function (err, session) {

                        if (err) {
                            //window.location = '/';
                            console.log("getSession err = ", JSON.stringify(err))
                            return false;
                        }
                        token = session.getIdToken().getJwtToken();
                        console.log('session token: ', token);
                        id_token = token;
                        callback(token);
                    });
                }
            }
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

$("#loginButton").click(function() {
    $("#loginModal").modal('show',{
        fadeDuration: 100
    });
});

        function logout () {
            if (!cognitoUser) return { message: 'Sorry, an error occured. Please refresh the page and try again.'}
            ga('send','event','login','logout');
            cognitoUser.signOut();
            showLoginButton();
            window.location = '/';
            return true;
        };
var cognitoUser = userPool.getCurrentUser();
var attributeList = [];

var dataEmail = {
    Name : 'email',
    Value : 'email@mydomain.com'
};

var dataUsername = {
    Name : 'preferred_username',
    Value : 'email@mydomain.com'
};
var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
var attributeUsername = new AmazonCognitoIdentity.CognitoUserAttribute(dataUsername);
// document.getElementById('loginUser').addEventListener('click', function () {
//   userPool.signUp(document.getElementById('username').value, document.getElementById('password').value,
//     attributeList, null,
//     function (err, result) {
//         if (err) {
//             alert(JSON.stringify(err));
//             return;
//         }
//         document.getElementById('signupUserResults').innerHTML = "Results: " + JSON.stringify(
//           result.user, null, 2);
//         cognitoUser = result.user;
//         console.log(cognitoUser);
//     });
// });


function login() {
    console.log('login clicked')
    var username = $('#username').val();
    var authenticationData = {
        Username: username,
        Password: $('#password').val()
    };

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    var userData = {
        Username: username,
        Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    console.log('authentication details: ', authenticationDetails)
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function () {
            $("#loginModal").modal("hide");
            showLogoutButton();
            getGameWeek(setGameWeek)
        },
        onFailure: function (err) {
            console.log(JSON.stringify(err))
            alert(JSON.stringify(err));
            if (err.code === "NotAuthorizedException") {
                console.log('resending code')
                CognitoUser.resendConfirmationCode(userData)
                .then(function(result) {
                    console.log(`Resend result ${result}`)
                    showConfirmUI()
                })
                .catch(function(err) {
                    console.log(`Resend error: ${err}`)
                })
                
                //var tempUser = getUser();
                //console.log(`tempUser = ${tempUser}`)
            }
        }
    });
}





// Commenting out and will remove once login flow is confirmed

// document.getElementById('signUpUser').addEventListener('click', function() {
//     console.log('clicked');
//     var attributeList = [];
    
//     var dataEmail = {
//             Name : 'email',
//             Value : $('#newEmail').val()
//         };

//     var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
//     attributeList.push(attributeEmail);
    
//     var dataFirst = {
//             Name : 'given_name',
//             Value : $('#firstName').val()
//         };

//     var attributeFirst = new AmazonCognitoIdentity.CognitoUserAttribute(dataFirst);
//     attributeList.push(dataFirst);

//     var dataLast = {
//             Name : 'family_name',
//             Value : $('#lastName').val()
//         };

//     var attributeFirst = new AmazonCognitoIdentity.CognitoUserAttribute(dataLast);
//     attributeList.push(dataLast);

//     // var dataUsername = {
//     //         Name : 'username',
//     //         Value : document.getElementById('newUsername').value()
//     //     };

//     // var attributeFirst = new AmazonCognitoIdentity.CognitoUserAttribute(dataUsername);
//     // attributeList.push(dataUsername);

//     // var dataPassword = {
//     //         Name : 'password',
//     //         Value : document.getElementById('newPassword').value()
//     //     };

//     // var attributeFirst = new AmazonCognitoIdentity.CognitoUserAttribute(dataPassword);
//     // attributeList.push(dataPassword);

//     var cognitoUser;

//     userPool.signUp($('#newUsername').val(), $('#newPassword').val(), attributeList, null, function(err, result) {
//         if (err) {
//             alert(err);
//             return;
//         }
//         cognitoUser = result.user;

//         console.log('user name is ' + cognitoUser.getUsername());
//         showConfirmUI(cognitoUser);
//     });
// });

function showConfirmUI(cognitoUser) {
    $("#loginRegistrationColumn").html("<h1>Welcome " + cognitoUser.getUsername() + "!</h1><p>We have sent a confirmation code to the email address that you provided.</p><div><label for=\"confirmUserCode\">Enter your confirmation code:</label><input type=\"number\" id=\"confirmUserCode\"><button class=\"btn btn-primary btn-sm\" id=\"confirmUser\" onclick=\"confirmUser('" + cognitoUser.getUsername() + "')\">Confirm</button><br><a href=\"#\" id=\"resendCode\" onclick=\"resetVerificationPIN('" + cognitoUser.getUsername() + "')\">Resend Confirmation Code</a></div>")
}


function confirmUser(username) {

    var userData = {
        Username: username,
        Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
    cognitoUser.confirmRegistration($('#confirmUserCode').val(), true, function (err, results) {
        if (err) {
            alert(err);
        } else {
            window.location = '/';
        }
    });
};


function resetVerificationPIN(username){
    const p = new Promise((res, rej)=>{
    
    var userData = {
        Username: username,
        Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.resendConfirmationCode(function(err, result) {
        if (err) {
            rej(err)
            return
        }
            res()
        })
    });
};

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function showForgotPasswordUI() {
    $("#loginRegistrationColumn").html("<div>Please provide your e-mail address and, if it exists in our system, we will send you a link to reset your password.<br><label for=\"forgotPasswordEmail\">Enter your e-mail address:</label><input type=\"email\" id=\"forgotPasswordEmail\"><button class=\"btn btn-primary btn-sm\" id=\"forgotPasswordButton\" onclick=\"forgotPassword()\">Reset Password</button><br></div>")
}


function forgotPassword() { 

    var forgotPasswordEmail = $('#forgotPasswordEmail').val()
    var userData = {
        Username: forgotPasswordEmail,
        Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.forgotPassword({
        onSuccess: function (result) {
            console.log('call result: ' + result);
            $("#loginRegistrationColumn").html("<div>Enter the confirmation code sent to the e-mail address you provided and your new password.<br><label for=\"forgotPasswordConfirmationCode\">Confirmation Code:</label><input type=\"number\" id=\"forgotPasswordConfirmationCode\"><br><label for=\"forgotPasswordNewPassword\">New Password</label><input type=\"password\" id=\"forgotPasswordNewPassword\"><button class=\"btn btn-primary btn-sm\" id=\"changePasswordButton\" onclick=\"inputVerificationCode('" + forgotPasswordEmail + "')\">Reset Password</button><br></div>")
        },
        onFailure: function(err) {
            console.log(JSON.stringify(err));
        }
    });


    // cognitoUser.confirmRegistration($("#confirmUserCode").val(), true, function(err, result) {
    //         if (err) {
    //             alert(JSON.stringify(err));
    //             return;
    //         }
    //         alert("result: ", JSON.stringify(result));
    //     });
};

function inputVerificationCode(userEmail) {
    var userData = {
        Username: userEmail,
        Pool: userPool
    }
var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    var verificationCode = $('#forgotPasswordConfirmationCode').val();
    var newPassword = $('#forgotPasswordNewPassword').val();
    
    cognitoUser.confirmPassword(verificationCode, newPassword, {
        onFailure(err) {
            console.log(err);
        },
        onSuccess() {
            $("#loginRegistrationColumn").html("<form role=\"form\" class=\"form-horizontal\"><div class=\"form-group\"><fieldset>E-mail: <input type=\"text\" id=\"email\" placeholder=\"Enter your e-mail address\"><br><br>Password: <input type=\"password\" id=\"password\" placeholder=\"Enter password\"><br><a href=\"#\" onClick=\"showForgotPasswordUI()\">Forgot Password?</a><br><ul id=\"loginUserResults\"></ul><div class=\"fb-login-button\" data-show-faces=\"false\" data-width=\"200\" data-max-rows=\"1\"></div></fieldset></div></form><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button><button type=\"button\" class=\"btn btn-primary\" id=\"loginUser\" onclick=\"login()\">Login</button><br></div>");
        }
    });
}

console.log("userInformation: ", userInformation)

