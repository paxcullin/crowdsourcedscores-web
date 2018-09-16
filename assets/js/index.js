Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
        
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});

function buildGroupsTable(allGroupsInformation) {

   //console.log("allGroupsInformation: ", allGroupsInformation)
    var groupDivHTML = "<table class=\"rwd-table\"><thead><tr><th class=\"rank\"><span class=\"full abbrev\">Rank</span></th><th class=\"entryowner\"><span class=\"full\">Group</span></th><th class=\"total\"><span class=\"full\">Score</span></th></tr></thead><tbody>";
    var rank = 1;
    for (var i=0; i < allGroupsInformation.length; i++) {
        groupHTML = "";
        var groupObject = allGroupsInformation[i];
        var predictionScore = 0;
        if (groupObject.results && groupObject.results.overall) predictionScore = groupObject.results.overall.predictionScore;
        groupHTML = "<td data-th=\"Rank\">" + rank + "</td>";
        groupHTML += "<td data-th=\"Group\"><a href=\"/crowd.html?sport=" + groupObject.sport + "&year=" + groupObject.year + "&groupId=" + groupObject.groupId + "\">" + groupObject.groupName + "</a></td>";

        if (groupObject.results && groupObject.results.overall) {
            groupHTML += "<td data-th=\"Score\">" + groupObject.results.overall.predictionScore + "</td>";
        } else {
            groupHTML += "<td data-th=\"Score\">0</td>";
        }
        groupDivHTML += "<tr>" + groupHTML + "</tr>";
        if (i === allGroupsInformation.length - 1) {
            groupDivHTML += "</tbody></table>";
        }
        rank += 1;
    }
    $("#allGroups").html(groupDivHTML);
}

function buildUsersTable(allUsersInformation) {

    //console.log("allGroupsInformation: ", allUsersInformation)
    var usersDivHTML = "<table class=\"rwd-table\"><thead><tr><th class=\"rank\"><span class=\"full abbrev\">Rank</span></th><th class=\"entryowner\"><span class=\"full\">Username</span></th><th class=\"total\"><span class=\"full\">Score</span></th></tr></thead><tbody>";
    var rank = 1;
    for (var i=0; i < allUsersInformation.length; i++) {
        usersHTML = "";
        var userObject = allUsersInformation[i];
        usersHTML = "<td data-th=\"Rank\">" + rank + "</td>";
        if (userInformation.cognitoUser && userObject.username !== userInformation.cognitoUser.username) {
            usersHTML += "<td data-th=\"Username\"><a href=\"/?compareUsername=" + userObject.username + "\">" + userObject.preferred_username + "</a></td>";
        } else {
            usersHTML += "<td data-th=\"Username\"><strong>" + userObject.preferred_username + "</strong></td>";
        }
        if (userObject.results && userObject.results.overall) {
            usersHTML += "<td data-th=\"Score\">" + userObject.results.overall.predictionScore + "</td>";
        } else {
            usersHTML += "<td data-th=\"Score\">0</td>";
        }
        usersDivHTML += "<tr>" + usersHTML + "</tr>";
        if (i === allUsersInformation.length - 1) {
            usersDivHTML += "</tbody></table>";
        }
        rank += 1;
    }
    $("#allUsers").html(usersDivHTML);
}

function getAllGroups(limit) {
    useToken(function(token) {
        var allGroupsQuery = "";
        if (limit) {
            allGroupsQuery = "?limit=" + limit;
        }
        var getAllGroupsOptions = {
            method: "GET"
        }
        var getAllGroupsURL = "https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/nfl/2018/anon" + allGroupsQuery;
        
        if (token !== false) {
            getAllGroupsOptions = {
                method: "GET",
                headers: {
                    Authorization: token
                }
            }
            getAllGroupsURL = "https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/nfl/2018/" + allGroupsQuery;
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
        if (token !== null) {
            $("#createCrowdButtonDiv").html("<button type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#crowdModal\" id=\"createCrowd\">Create a Crowd</button>");
        } else {
            console.log("token: ", token);
        }
    })
}

function getAllUsers(limit) {
    useToken(function(token) {
        var allUsersQuery = "";
        if (limit) {
            allUsersQuery = "?limit=" + limit;
        }
        var getAllUsersOptions = {
            method: "GET"
        }
        var getAllUsersURL = "https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/extendedprofile/getallusers/anon" + allUsersQuery;
        
        if (token !== false) {
            getAllUsersOptions = {
                method: "GET",
                headers: {
                    Authorization: token
                }
            }
            getAllUsersURL = "https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/extendedprofile/getallusers" + allUsersQuery;
        }

        get(getAllUsersURL, getAllUsersOptions)
        .then(function(getAllUsersResponse) {
            return getAllUsersResponse.json();
        })
        .catch(function(getAllUsersReject) {
            console.log(getAllUsersReject);
            return;
        })
        .then(function(allUsersInformation) {
            buildUsersTable(allUsersInformation);
            return allUsersInformation;
        })
    })
}
// Index Page Progress Bar jQuery

// Prediction Submitted
function updateProgressBar(predictionNumber, totalGames) {
    //console.log("predictionNumber: ", predictionNumber, ", totalGames: ", totalGames)
    var progressValue = Math.round((predictionNumber / totalGames) * 100);
    $('#progress-bar').attr('aria-valuenow', progressValue);
    $('.progress-bar').width(progressValue + '%');
    //$('#progress-bar').val(Math.round(progressValue)); 
    $('.percent').html(progressValue + "% Complete");
    userInformation.predictionsSubmitted++;
};// complete click


function toggleCrowdPassword () {
    console.log("checkbox checked: ", $(this).is(':checked'));
    $("#crowdPasswordDiv").toggleClass("hidden");
}

function createCrowd() {
    var $this = $("#createCrowdButton");
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

$("#dropdown").on("click", function(e){
    e.preventDefault();
    
    if($(this).hasClass("open")) {
      $(this).removeClass("open");
      $(this).children("ul").slideDown("fast");
    } else {
      $(this).addClass("open");
      $(this).children("ul").slideUp("fast");
    }
  });

$("#dropdown li a").on("click", function() {
    console.log("$(this).text(): ", $(this).text())
    $("#dropdown").text($(this).text());
});


  // Collapse prediction functionality

    $(".toggle-accordion").on("click", function() {
        var accordionId = $(this).attr("accordion-id"),
        numPanelOpen = $(accordionId + ' .collapse.in').length;
        
        $(this).toggleClass("active");

        if (numPanelOpen == 0) {
        openAllPanels(accordionId);
        } else {
        closeAllPanels(accordionId);
        }
    })

    openAllPanels = function(aId) {
        console.log("setAllPanelOpen");
        $(aId + ' .panel-collapse:not(".in")').collapse('show');
    }
    closeAllPanels = function(aId) {
        console.log("setAllPanelclose");
        $(aId + ' .panel-collapse.in').collapse('hide');
    }

// Collapse prediction functionality

// Retrieve other user's predictions

function getOtherUserPredictions(otherUsername) {
    useToken(function(token) {
        
        var getOtherUserPredictionsOptions = {
            method: "GET",
            headers: {
                Authorization: token
            }
        }
        get("https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/extendedProfile/predictions?username=" + otherUsername, getOtherUserPredictionsOptions)
        .then(function(response) {
            return response.json();
        })
        .catch(function(reject) {
            console.log("reject: ", reject);
        })
        .then(function(otherUserPredictionOptionsJSON) {
            console.log(JSON.stringify(otherUserPredictionOptionsJSON))
            
            $("#games").text(otherUserPredictionOptionsJSON + '!');
            
            
        })
    })
}

var otherUsername = GetURLParameter('username');


Handlebars.registerHelper('grouped_each', function(every, context, options) {
    var out = "", subcontext = [], i;
    if (context && context.length > 0) {
        for (i = 0; i < context.length; i++) {
            if (i > 0 && i % every === 0) {
                out += options.fn(subcontext);
                subcontext = [];
            }
            subcontext.push(context[i]);
        }
        out += options.fn(subcontext);
    }
    return out;
});

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

Handlebars.registerHelper('dateCheck', function (startDateTime, options) {

    var now = new Date();
    var nowDateTimeDate = Date.parse(now);
    var startDateTimeDate = Date.parse(startDateTime);
    var cutoff = startDateTimeDate - 300000;
    if (now < cutoff) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('debug', function (the_string) {
    console.log(the_string, ": ", the_string);
});