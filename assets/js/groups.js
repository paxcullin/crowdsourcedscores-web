function GetAllURLParameters(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};



var groupParams = {};
    groupParams.groupId = GetAllURLParameters('groupId');
    groupParams.sport = GetAllURLParameters('sport');
    groupParams.year = GetAllURLParameters('year');


// Set Handlebars parameters

var template = $('#group-template').html();
var templateScript = Handlebars.compile(template);


// Unauthenticated getGroup Details
var getGroupOptions = {
    method: "GET"
}
var getGroupURL = "https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/" + groupParams.sport + "/" + groupParams.year + "/" + groupParams.groupId + "/anon"

var groupInfoObject = {};
function getGroupInfo() {
    useToken(function(token) {
        if (token) {
            getGroupURL = "https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/" + groupParams.sport + "/" + groupParams.year + "/" + groupParams.groupId;
            getGroupOptions = {
                method: "GET",
                headers: {
                    Authorization: token
                }
            }
        }
        get(getGroupURL, getGroupOptions)
        .then(function(groupInfoResponse) {
            return groupInfoResponse.json();
        })
        .catch(function(groupInfoReject) {
            console.log("groupInfoReject: ", JSON.stringify(groupInfoReject));
            return groupInfoReject;
        })
        .then(function(groupInfoDetails) {
            groupParams.groupName = groupInfoDetails.groupName;
            $("#games-loading-icon").css("display","none")
            if (groupInfoDetails.memberOf === false) {
                var groupPasswordHTML = "";
                if (groupInfoDetails.public === false) {
                    groupPasswordHTML = "<h5>Group Password</h5><input class=\"form-control\" type=\"text\" id=\"groupPassword\">";

                }
                if (token) {
                    $("#joinGroupButtonDiv").html(groupPasswordHTML + "<button class=\"btn btn-info\" id=\"joinGroupButton\" data-loading-text=\"<i class='fa fa-circle-o-notch fa-spin'></i> Joining Group\">Join " + groupInfoDetails.groupName + "</button>");
                } else {
                    $("#joinGroupButtonDiv").html("<button type=\"button\" class=\"btn btn-info\" onclick=\"ga('send','event','login','loginClicked');window.location=('https://crowdsourcedscores.auth.us-west-2.amazoncognito.com/login?response_type=code&amp;client_id=2n15lhk845sucm0k4fejjqcbev&amp;redirect_uri=https://crowdsourcedscores.com/')\">Log in to Join</button>");
                }
            } else {
                if (groupInfoDetails.groupId !== 0) {
                    if (groupInfoDetails.owner.username === userInformation.cognitoUser.username) {
                        $("#joinGroupButtonDiv").html("<button type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#editCrowdModal\" id=\"editCrowd\">Edit Crowd Info</button>");
                        $("crowdNameInput").val(groupInfoDetails.groupName);
                    } else {
                        $("#joinGroupButtonDiv").html("<button class=\"btn btn-info\" id=\"leaveGroupButton\" data-loading-text=\"<i class='fa fa-circle-o-notch fa-spin'></i> Leaving Group\">Leave " + groupInfoDetails.groupName + "</button>");
                    }
                }
            }

            $("#groupTitle").text(groupInfoDetails.groupName);
            var groupDetailsHTML = "<span class=\"owner\"><strong>Owner:</strong> " + groupInfoDetails.owner.preferred_username + "</span><br>";
            $("#groupDetails").html(groupDetailsHTML);
            if (groupInfoDetails.users && groupInfoDetails.users.length > 0) {
                var groupMembers = {groupMembers: groupInfoDetails.users};
                var html = templateScript(groupMembers);
                $('#group').html(html);
            }
            groupInfoObject = groupInfoDetails;
            return groupInfoDetails;
        })
    });
}

// user clicks the Join Group Button - Call the Join Group API

$("#joinGroupButtonDiv").on("click","#joinGroupButton",function() {
    var $this = $(this);
    $this.button('loading');
    useToken(function(token) {
        var $this = $(this);
        $this.button('loading');
    

        // Acquire the password entered by the user in the group Password input (line 43)
        var groupPassword = $("#groupPassword").val();
        if (!groupPassword) {
            // Pass a blank password just in case
            groupPassword = "";
        }
        var joinGroupOptions = {
            method: "POST",
            headers: {
                Authorization: token,
                'Content-type': 'application/json'
            },
            body: "{\"groupPassword\": " + groupPassword + "}"
        };
        if (groupInfoObject.public === true) {
            joinGroupOptions = {
                method: "POST",
                headers: {
                    Authorization: token,
                    'Content-type': 'application/json'
                }
            };
        }


        get("https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/" + groupParams.sport + "/" + groupParams.year + "/" + groupParams.groupId, joinGroupOptions)
        .then(function(joinGroupResponse) {
            
            $('#group').html("Updating ...");
            
            return joinGroupResponse.json();
        })
        .then(function(joinGroupResult) {

            $this.button('reset');

            
            //Reload Group Members after successful addition
            if (joinGroupResult.updatedUserList) {
                
                $("#group").html(`<div id="games-loading-icon">
                <i class="fa fa-cog fa-spin fa-3x fa-fw"></i>
                <span class="sr-only">Loading...</span>
                </div>`);
                setTimeout(getGroupInfo(), 1500);

                $("#joinGroupButtonDiv").html("<button class=\"btn btn-info\" id=\"leaveGroupButton\">Leave " + joinGroupResult.groupName + "</button>");
            } else {
                $('#group').html("");
                $("#joinGroupButtonDiv").append("<br><span class=\"errorText\">" + joinGroupResult + "</span>");
                
            }
            
        })
    })
});

// user clicks the Join Group Button - Call the Join Group API

$("#joinGroupButtonDiv").on("click","#leaveGroupButton",function() {

    var $this = $(this);
    $this.button('loading');
    useToken(function(token) {

        var leaveGroupOptions = {
            method: "POST",
            headers: {
                Authorization: token,
            }
        };

        get("https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/" + groupParams.sport + "/" + groupParams.year + "/" + groupParams.groupId + "/leavegroup", leaveGroupOptions)
        .then(function(leaveGroupResponse) {
            console.log(leaveGroupResponse)
            
            $('#group').html("");
            
            return leaveGroupResponse.json();
        })
        .then(function(leaveGroupResult) {

            
            //Reload Group Members after successful addition
            getGroupInfo();
            // $("#joinGroupButtonDiv").html("<button class=\"btn btn-info\" id=\"joinGroupButton\">Join " + joinGroupResult.groupName + "</button>");
            // $this.button('reset');
        })
    })
});


function editCrowd() {
    var $this = $("#editCrowdButton");
    $this.button('loading');
    useToken(function(token) {
        var crowdParams = "{\"crowdName\": \"" + groupParams.groupName + "\", \"groupId\":" + groupParams.groupId + ", \"sport\": \"" + groupParams.sport + "\", \"year\": " + groupParams.year + ", \"newCrowdName\": \"" + $("#crowdNameInput").val() + "\" }";
        var editCrowdOptions = {
            method: "POST",
            headers: {
                Authorization: token,
                'Content-type': 'application/json'
            },
            body: crowdParams
        }
        get("https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group", editCrowdOptions)
        .then(function(response) {
            return response.json();
        })
        .catch(function(reject) {
            console.log("reject: ", reject);
        })
        .then(function(createCrowdJSON) {
            if (createCrowdJSON.succeeded === true) {
                setTimeout(function() {
                    $("#updateCrowdResults").text(createCrowdJSON.message + '!');
                    $this.button('reset');
                    $("#editCrowdModal").modal("hide");
                    $("#groupTitle").text(createCrowdJSON.crowdName)
                }, 1000)
                
                $("#updateCrowdResults").text('');
            } else {
                $("#updateCrowdResults").text('Sorry, something went wrong.');
            }
        })
    })
}


$("#inviteUsers").on("click",function() {

    var $this = $(this);
    $this.button('loading');
    useToken(function(token) {

        var emailAddresses = JSON.stringify($("#inviteEmails").val());

        var leaveGroupOptions = {
            method: "POST",
            headers: {
                Authorization: token,
            },
            body: emailAddresses
        };

        get("https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/" + groupParams.sport + "/" + groupParams.year + "/" + groupParams.groupId + "/leavegroup", leaveGroupOptions)
        .then(function(leaveGroupResponse) {
            
            $('#group').html("");
            
            return leaveGroupResponse.json();
        })
        .then(function(leaveGroupResult) {

            
            //Reload Group Members after successful addition
            getGroupInfo();
            
            $this.button('reset');
        })
    })
});