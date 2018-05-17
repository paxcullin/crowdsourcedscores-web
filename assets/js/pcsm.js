var lock = null;

lock = new Auth0Lock('DGGRh6nxG2FfQlDorkqHLRQVqMAaC3uI', 'pcsm.auth0.com', {
    auth: {
        params: {scope: 'openid email'} //Details: https:///scopes
    }
});

var userProfile;

lock.on("authenticated", function (authResult) {
    lock.getProfile(authResult.idToken, function (error, profile) {
        if (error) {
            // Handle error
            return;
        }

        console.log(authResult.id_token);
        localStorage.setItem('id_token', authResult.idToken);
        setUserProfile(profile);
    });
});

var getUserProfile = function (callback) {
    var id_token = localStorage.getItem('id_token');

    if (id_token) {
        lock.getProfile(id_token, function (err, profile) {
            if (err) {
                return callback('There was an error getting the profile: ' + err.message);
            }

            return callback(null, profile);
        });
    }
};

var setUserProfile = function (profile) {
    // Display user information
    $('.logo').children('img').attr('src', profile.picture);
    $('.brand').text(profile.name);

};
