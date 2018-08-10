var groupParams = {};
    groupParams.groupId = GetURLParameter('groupId');
    groupParams.sport = GetURLParameter('sport');
    groupParams.year = GetURLParameter('year');


// Set Handlebars parameters

var template = $('#group-template').html();
var templateScript = Handlebars.compile(template);


// Unauthenticated getGroup Details
var getGroupOptions = {
    method: "GET"
}
var getGroupURL = "https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/" + groupParams.sport + "/" + groupParams.year + "/" + groupParams.groupId + "/anon"


function getGroupInfo() {
    useToken(function(token) {
        if (token !== null) {
            getGroupURL = "https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/" + groupParams.sport + "/" + groupParams.year + "/" + groupParams.groupId;
            getGroupOptions = {
                method: "GET",
                headers: {
                    Authorization: token
                }
            }
            console.log("getGroupOptions: ", getGroupOptions)
        }
        get(getGroupURL, getGroupOptions)
        .then(function(groupInfoResponse) {
            console.log("groupInfoResponse: ", groupInfoResponse)
            return groupInfoResponse.json();
        })
        .catch(function(groupInfoReject) {
            console.log("groupInfoReject: ", JSON.stringify(groupInfoReject));
            return groupInfoReject;
        })
        .then(function(groupInfoDetails) {
            console.log("get group response: ", groupInfoDetails);

            $("#games-loading-icon").css("display","none")
            if (groupInfoDetails.memberOf === false) {
                var groupPasswordHTML = "";
                if (groupInfoDetails.public === false) {
                    groupPasswordHTML = "<h5>Group Password</h5><input class=\"form-control\" type=\"text\" id=\"groupPassword\">";

                }
                $("#joinGroupButtonDiv").html(groupPasswordHTML + "<button class=\"btn btn-info\" id=\"joinGroupButton\">Join " + groupInfoDetails.groupName + "</button>");
            } else {
                if (groupInfoDetails.groupId !== 0) {
                    $("#joinGroupButtonDiv").html("<button class=\"btn btn-info\" id=\"leaveGroupButton\">Leave " + groupInfoDetails.groupName + "</button>");
                }
            }

            $("#groupTitle").text(groupInfoDetails.groupName);
            var groupMembers = {groupMembers: groupInfoDetails.usernames};
            var html = templateScript(groupMembers);
            $('#group').html(html);
            return groupInfoDetails;
        })
    });
}

// user clicks the Join Group Button - Call the Join Group API

$("#joinGroupButtonDiv").on("click","#joinGroupButton",function() {
    useToken(function(token) {

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

        console.log("joinGroupOptions: ", joinGroupOptions)

        get("https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/" + groupParams.sport + "/" + groupParams.year + "/" + groupParams.groupId, joinGroupOptions)
        .then(function(joinGroupResponse) {
            console.log(joinGroupResponse)
            
            $('#group').html("Updating ...");
            
            return joinGroupResponse.json();
        })
        .then(function(joinGroupResult) {

            console.log("result: ", joinGroupResult);
            
            //Reload Group Members after successful addition
            var groupMembers = {groupMembers: joinGroupResult.updatedUserList};
            var html = templateScript(groupMembers);
            $('#group').html(html);
            $("#joinGroupButtonDiv").html("<button class=\"btn btn-info\" id=\"leaveGroupButton\">Leave " + groupInfo.groupName + "</button>");
            
        })
    })
});

// user clicks the Join Group Button - Call the Join Group API

$("#joinGroupButtonDiv").on("click","#leaveGroupButton",function() {
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
            
            $('#group').html("Updating ...");
            
            return leaveGroupResponse.json();
        })
        .then(function(leaveGroupResult) {

            console.log("result: ", leaveGroupResult);
            
            //Reload Group Members after successful addition
            getGroupInfo();
            
        })
    })
});