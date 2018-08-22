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
                $("#joinGroupButtonDiv").html(groupPasswordHTML + "<button class=\"btn btn-info\" id=\"joinGroupButton\" data-loading-text=\"<i class='fa fa-circle-o-notch fa-spin'></i> Joining Group\">Join " + groupInfoDetails.groupName + "</button>");
            } else {
                if (groupInfoDetails.groupId !== 0) {
                    $("#joinGroupButtonDiv").html("<button class=\"btn btn-info\" id=\"leaveGroupButton\" data-loading-text=\"<i class='fa fa-circle-o-notch fa-spin'></i> Leaving Group\">Leave " + groupInfoDetails.groupName + "</button>");
                }
            }

            $("#groupTitle").text(groupInfoDetails.groupName);
            var groupDetailsHTML = "<span class=\"owner\"><strong>Owner:</strong> " + groupInfoDetails.owner + "</span><br>";
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
    console.log("groupInfoDetails: ", groupInfoObject)
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

        console.log("joinGroupOptions: ", joinGroupOptions)

        get("https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/" + groupParams.sport + "/" + groupParams.year + "/" + groupParams.groupId, joinGroupOptions)
        .then(function(joinGroupResponse) {
            console.log(joinGroupResponse)
            
            $('#group').html("Updating ...");
            
            return joinGroupResponse.json();
        })
        .then(function(joinGroupResult) {

            $this.button('reset');

            console.log("result: ", joinGroupResult);
            
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

            console.log("result: ", leaveGroupResult);
            
            //Reload Group Members after successful addition
            getGroupInfo();
            
            $this.button('reset');
        })
    })
});