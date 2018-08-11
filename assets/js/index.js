function getAllGroups() {
    useToken(function(token) {
        var getAllGroupsOptions = {
            method: "GET"
        }
        var getAllGroupsURL = "https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/anon";
        
        if (token !== null) {
            getAllGroupsOptions = {
                method: "GET",
                headers: {
                    Authorization: token
                }
            }
            getAllGroupsURL = "https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group";
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
            var groupHTML = "";
            $("#allGroups").append("<div class=\"row\"><div class=\"col-xs-1\">Rank</div><div class=\"col-xs-1\">Group Name</div><div class=\"col-xs-1\">Score</div>");
            for (var i; i < allGroupsInformation.length; i++) {
                groupHTML = "";
                var groupObject = allGroupsInformation[i];
                $("#allGroups").append("<div class=\"row\">");
                groupHTML = "<div class=\"col-xs-1\">" + i + "</div>";
                groupHTML += "<div class=\"col-xs-1\">" + groupObject.groupName + "</div>";
                groupHTML += "<div class=\"col-xs-1\">" + groupObject.totalPredictionScore + "</div>";
                $("#allGroups").append(groupHTML + "</div>");
            }
            $("#allGroups").append("</div>");
        })
    })
}