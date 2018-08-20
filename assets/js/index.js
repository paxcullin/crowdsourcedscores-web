function buildGroupsTable(allGroupsInformation) {

    console.log("allGroupsInformation: ", allGroupsInformation)
    var groupDivHTML = "<table class=\"rwd-table\"><thead><tr><th class=\"rank\"><span class=\"full abbrev\">Rank</span></th><th class=\"entryowner\"><span class=\"full\">Group</span></th><th class=\"total\"><span class=\"full\">Score</span></th></tr></thead><tbody>";
    var rank = 1;
    for (var i=0; i < allGroupsInformation.length; i++) {
        groupHTML = "";
        var groupObject = allGroupsInformation[i];
        console.log("groupObject: ", groupObject)
        groupHTML = "<td data-th=\"Rank\">" + rank + "</td>";
        groupHTML += "<td data-th=\"Group\"><a href=\"/group.html?sport=" + groupObject.sport + "&year=" + groupObject.year + "&groupId=" + groupObject.groupId + "\">" + groupObject.groupName + "</a></td>";
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