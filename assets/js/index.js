function buildGroupsTable(allGroupsInformation) {

    console.log("allGroupsInformation: ", allGroupsInformation)
    var groupDivHTML = "<table class=\"rwd-table\"><thead><tr><th class=\"rank\"><span class=\"full abbrev\">Rank</span></th><th class=\"entryowner\"><span class=\"full\">Group</span></th><th class=\"total\"><span class=\"full\">Score</span></th></tr></thead><tbody>";
    var rank = 1;
    for (var i=0; i < allGroupsInformation.length; i++) {
        groupHTML = "";
        var groupObject = allGroupsInformation[i];
        console.log("groupObject: ", groupObject)
        groupHTML = "<td data-th=\"Rank\">" + rank + "</td>";
        groupHTML += "<td data-th=\"Group\"><a href=\"/crowd.html?sport=" + groupObject.sport + "&year=" + groupObject.year + "&groupId=" + groupObject.groupId + "\">" + groupObject.groupName + "</a></td>";
        groupHTML += "<td data-th=\"score\">" + groupObject.totalPredictionScore + "</td>";
        groupDivHTML += "<tr>" + groupHTML + "</tr>";
        if (i === allGroupsInformation.length - 1) {
            groupDivHTML += "</tbody></table>";
        }
        rank += 1;
    }
    $("#allGroups").html(groupDivHTML);
}

function getAllGroups() {
    useToken(function(token) {
        var getAllGroupsOptions = {
            method: "GET"
        }
        var getAllGroupsURL = "https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/nfl/2018/anon";
        
        if (token !== null) {
            getAllGroupsOptions = {
                method: "GET",
                headers: {
                    Authorization: token
                }
            }
            getAllGroupsURL = "https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/nfl/2018/";
        }

        get(getAllGroupsURL, getAllGroupsOptions)
        .then(function(getAllGroupsResponse) {
            return getAllGroupsResponse.json();
        })
        .catch(function(getAllGroupsReject) {
            console.log(getAllGroupsReject);
            return;
        })
        .then(function(allGroupsInformation) {
            buildGroupsTable(allGroupsInformation);
            return allGroupsInformation;
        })
    })
}

// Index Page Progress Bar jQuery

// Prediction Submitted
function updateProgressBar(predictionNumber, totalGames) {
    //console.log("predictionNumber: ", predictionNumber, ", totalGames: ", totalGames)
    var progressValue = Math.round((predictionNumber / totalGames) * 100);
    $('#progress-bar').val(Math.round(progressValue));  
    $('.percent').html(progressValue + "% Complete");
    userInformation.predictionsSubmitted++;
};// complete click


function toggleCrowdPassword () {
    console.log("checkbox checked: ", $(this).is(':checked'));
    $("#crowdPasswordDiv").toggleClass("hidden");
}

function createCrowd() {
    useToken(function(token) {
        var public = true;
        if ($("#crowdPublic").is(":checked")) {
            public = false;
        }
        var crowdParams = "{\"crowdName\": \"" + $("#crowdName").val() + "\", \"public\": " + public + ", \"sport\": \"nfl\", \"year\": 2018 }";
        console.log("crowdParams: ", crowdParams)
        if ($("crowdPassword").val() !== null) {
            crowdParams.crowdPassword = $("crowdPassword").val()
        }
        var createCrowdOptions = {
            method: "POST",
            headers: {
                Authorization: token,
                'Content-type': 'application/json'
            },
            body: crowdParams
        }
        get("https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/create", createCrowdOptions)
        .then(function(response) {
            return response.json();
        })
        .catch(function(reject) {
            console.log("reject: ", reject);
        })
        .then(function(createCrowdJSON) {
            console.log(JSON.stringify(createCrowdJSON))
            if (createCrowdJSON.succeeded === true) {
                setTimeout(function() {$("#createCrowdResults").text(createCrowdJSON.message + '!');window.location = '/crowd.html?groupId=' + createCrowdJSON.crowdInfo.groupId + '&sport=' + createCrowdJSON.crowdInfo.sport + '&year=' + createCrowdJSON.crowdInfo.year;}, 2000);
            } else {
                $("#createCrowdResults").text(createCrowdJSON.message)
            }
        })
    })
}