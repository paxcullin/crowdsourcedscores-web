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
        if (token) {
            $("#createCrowdButtonDiv").html("<button type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#crowdModal\" id=\"createCrowd\">Create a Crowd</button>");
        }
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
    var $this = $(this);
    $this.button('loading');
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

// $( "#predictionScoreModal" ).dialog({
//     autoOpen: false,
//     show: {
//       effect: "blind",
//       duration: 1000
//     },
//     hide: {
//       effect: "explode",
//       duration: 1000
//     }
//   });

$('.predictionScore').on('click', function() {
    $("#predictionScoreModal").dialog("open");
})

    // Define the tour!
    var tour = {
        id: "hello-hopscotch",
        steps: [
            {
              title: "Thanks for joining the crowd!",
              content: "Let's walk you through how you can add your expertise to the crowd wisdom.",
              target: document.querySelectorAll('.predictionInput')[0],
              placement: "right"
            },
          {
            title: "Away Team Score",
            content: "How many points do you think the away team will score?",
            target: document.querySelectorAll('.predictionInput')[0],
            placement: "right"
          },
          {
            title: "Home Team Score",
            content: "How many points do you think the away team will score?",
            target: document.querySelectorAll('.predictionInput')[1],
            placement: "right"
          },
          {
            title: "Predict!",
            content: "That's it! Now click the predict button.",
            target: document.querySelectorAll('.prediction-btn')[0],
            placement: "right"
          },
          {
            title: "Nice! Keep It Up!",
            content: "You'll be able to see your progress in our progress bar.",
            target: document.querySelector('#progress-bar'),
            placement: "top"
          },
          {
            title: "Show Your Stuff",
            content: "Compete against others by join a group or creating your own and inviting your friends.",
            target: document.querySelector('#allGroupsHeader'),
            placement: "top"
          }
        ]
      };
  
      // Start the tour!
      //hopscotch.startTour(tour);