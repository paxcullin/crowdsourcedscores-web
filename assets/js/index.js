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
        var rowClass = "";
        if ((i%2) !== 0) {
            rowClass = ' class="alt-tr"'
        }
        groupDivHTML += '<tr' + rowClass + '>' + groupHTML + '</tr>';
        if (i === allGroupsInformation.length - 1) {
            groupDivHTML += "</tbody></table>";
        }
        rank += 1;
    }
    $("#allGroups").html(groupDivHTML);
}


$(".predictionScoreColumn").on(['mouseover', 'mouseout'],function () {
    //getting the next element
    $content = $(this).find('.userScoreDetails');
    //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
    $content.slideToggle(500, function () {
        //execute this after slideToggle is done
        //change text of header based on visibility of content div
        $header.text(function () {
            //change text based on condition
            //return $content.is(":visible") ? "" : "";
        });
    });
});

function buildWeeklyTable(weeklyUsersInformation, gameWeek) {
    var weeklyRank = 1;
    var weeklyUsersArray = [];
    var weeklyDivHTML = "<table class=\"rwd-table\"><thead><tr><th class=\"rank\"><span class=\"full abbrev\">Rank</span></th><th class=\"entryowner\"><span class=\"full\">Username</span></th><th class=\"Record\"><span class=\"full\">Record</span></th><th class=\"total\"><span class=\"full\">Score</span></th></tr></thead><tbody>";
    if (weeklyUsersInformation.length === 0) {
        weeklyDivHTML += '<tr><td colspan="4">No results for the week. Stay tuned!</td></tbody></table>';
    } else {
        console.log('buildWeeklyTable weeklyUsersInformation: ', weeklyUsersInformation)
        for (var i=0; i < weeklyUsersInformation.length; i++) {
            // set up user array to filter out users with no score for the week
            
            var userObject = weeklyUsersInformation[i];
            if (userObject.results.weekly) {
                var usersHTML = "";
                var userWeeklyResults = userObject.results.weekly;
                usersHTML = '<td data-th="Rank">' + weeklyRank + '</td>';
                if (userInformation.cognitoUser && userObject.username !== userInformation.cognitoUser.username) {
                    usersHTML += '<td data-th="Username"><a href="/?compareUsername=' + userObject.username + '">' + userObject.preferred_username + '</a></td>';
                } else {
                    usersHTML += '<td data-th="Username"><a href="/profile.html"><strong>' + userObject.preferred_username + '</strong></a></td>';
                }
                usersHTML += "<td data-th=\"Record\">"
                    + "S/U: " + userWeeklyResults.winner.correct + "<br>"
                    + "ATS: " + userWeeklyResults.spread.correct + "<br>"
                    + "O/U: " + userWeeklyResults.total.correct + "</td>"
                    + "<td data-th=\"Score\">" + userWeeklyResults.predictionScore + "</td>"
                            
                var rowClass = "";
                if ((i%2) === 0) {
                    rowClass = ' alt-tr'
                }
                weeklyDivHTML += '<tr class="' + rowClass + '">' + usersHTML + '</tr>';
                if (i === weeklyUsersInformation.length - 1) {
                    weeklyDivHTML += "</tbody></table>";
                }
                weeklyRank += 1;
            }
        }
    } // ends if-else for no results yet

    $("#weeklyUsers").html(weeklyDivHTML);

}

function buildUsersTable(allUsersInformation, sport) {

    console.log("allUsersInformation: ", allUsersInformation)
    var usersDivHTML = "<table class=\"rwd-table\"><thead><tr><th class=\"rank\"><span class=\"full abbrev\">Rank</span></th><th class=\"entryowner\"><span class=\"full\">Username</span></th><th class=\"Record\"><span class=\"full\">Record</span></th><th class=\"total\"><span class=\"full\">Score</span></th></tr></thead><tbody>";
    var rank = 1;
        if (sport === 'ncaaf') {
            allUsersInformation.sort(function(a,b) {
                if (a.results.ncaaf[2018] && a.results.ncaaf[2018].overall && b.results.ncaaf[2018] && b.results.ncaaf[2018].overall) {
                    if (a.results.ncaaf[2018].overall.predictionScore > b.results.ncaaf[2018].overall.predictionScore) return -1
                    if (a.results.ncaaf[2018].overall.predictionScore < b.results.ncaaf[2018].overall.predictionScore) return 1
                } else {
                    return 1
                }
            })
        }
        for (var i=0; i < allUsersInformation.length; i++) {
            
            var usersHTML = "";
            var userObject = allUsersInformation[i].results;
            if (sport === 'ncaaf') {
                userObject = allUsersInformation[i].results.ncaaf[2018]
                if (!userObject) continue;
            }
            usersHTML = '<td data-th="Rank">' + rank + '</td>';
            if (userInformation.cognitoUser && userObject.username !== userInformation.cognitoUser.username) {
                usersHTML += '<td data-th="Username"><a href="/?compareUsername=' + allUsersInformation[i].username + '">' + allUsersInformation[i].preferred_username + '</a></td>';
            } else {
                usersHTML += '<td data-th="Username"><a href="/profile.html"><strong>' + allUsersInformation[i].preferred_username + '</strong></a></td>';
            }
            if (userObject.overall) {
                var userCorrect = userObject.overall.winner.correct + userObject.overall.spread.correct + userObject.overall.total.correct;
                var userIncorrect = ((userObject.overall.totalPredictions * 3) - (userObject.overall.spread.push + userObject.overall.total.push)) - userCorrect;
                usersHTML += "<td data-th=\"Record\">" + userCorrect + "-" + userIncorrect + "</td><td data-th=\"Score\">" + userObject.overall.predictionScore
                            + "<div class='leaderboard userScoreDetails'>"
                            + "S/U: " + userObject.overall.winner.correct + "<br>"
                            + "ATS: " + userObject.overall.spread.correct + "<br>"
                            + "O/U: " + userObject.overall.total.correct
                            + "</div></td>";
            } else {
                usersHTML += "<td data-th=\"Score\">0</td>";
            }
            var rowClass = "";
            if ((i%2) === 0) {
                rowClass = ' alt-tr'
            }
            usersDivHTML += '<tr class="userScoreRow' + rowClass + '">' + usersHTML + '</tr>';
            if (i === allUsersInformation.length - 1) {
                usersDivHTML += "</tbody></table>";
            }
            rank += 1;
        }
    $("#allUsers").html(usersDivHTML);

    
    $('.userScoreRow').mouseenter(function(e) {
        e.preventDefault();
        $content = $(this).find('.userScoreDetails');
        //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
        $content.slideToggle(500, function () {
            //execute this after slideToggle is done
            //change text of header based on visibility of content div
        });
    })
    .mouseleave(function(e) {
        e.preventDefault();
        $content = $(this).find('.userScoreDetails');
        //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
        $content.slideToggle(500, function () {
            //execute this after slideToggle is done
            //change text of header based on visibility of content div
        });
    });
}

function getAllGroups(limit, callback) {
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
            if (callback) {
                callback(allGroupsInformation)
            } else {
                buildGroupsTable(allGroupsInformation);
            }
            return allGroupsInformation;
        })
        if (token !== null) {
            $("#createCrowdButtonDiv").html("<button type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#crowdModal\" id=\"createCrowd\">Create a Crowd</button>");
        } else {
            console.log("token: ", token);
        }
    })
}

function getAllUsers(limit, gameWeek, sport, callback) {
    useToken(function(token) {
        var allUsersQuery = "";
        if (limit || gameWeek || sport) {
            allUsersQuery = "?";
        }
        if (limit) {
            allUsersQuery += "limit=" + limit;
        }
        if (!sport) {
            sport = "nfl";
        }
        if (sport) {
            if (allUsersQuery.length > 1) {
                allUsersQuery += "&";
            }
            allUsersQuery += "sport=" + sport
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
            //console.log("getAllUsersResponse.json(): ", getAllUsersResponse.json())
            return getAllUsersResponse.json();
        })
        .catch(function(getAllUsersReject) {
            console.log(getAllUsersReject);
            return getAllUsersReject;
        })
        .then(function(allUsersInformation) {
            //console.log("allUsersInformation: ", allUsersInformation)
            if (callback) {
                callback(allUsersInformation)
            } else {
                buildUsersTable(allUsersInformation, sport);
                return allUsersInformation;
            }
        });
    })
}


function getWeeklyUsers(limit, gameWeek, callback) {
    if (!gameWeek) {
        console.log('No gameWeek submitted')
    }
    useToken(function(token) {
        var weeklyUsersQuery = (limit || gameWeek) ? "?" : ""
        weeklyUsersQuery += (limit) ? "limit=" + limit : ""

        var getWeeklyUsersOptions = {
            method: "GET"
        }
        var getWeeklyUsersURL = `https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/nfl/2018/${gameWeek}/leaderboards/weekly/anon${weeklyUsersQuery}`;
        
        if (token !== false) {
            getWeeklyUsersOptions = {
                method: "GET",
                headers: {
                    Authorization: token
                }
            }
            getWeeklyUsersURL = `https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/nfl/2018/${gameWeek}/leaderboards/weekly/${weeklyUsersQuery}`;
        }

        get(getWeeklyUsersURL, getWeeklyUsersOptions)
        .then(function(getWeeklyUsersResponse) {
            //console.log("getAllUsersResponse.json(): ", getAllUsersResponse.json())
            return getWeeklyUsersResponse.json();
        })
        .catch(function(getWeeklyUsersReject) {
            console.log(getWeeklyUsersReject);
            return getWeeklyUsersReject;
        })
        .then(function(weeklyUsersInformation) {
            //console.log("allUsersInformation: ", allUsersInformation)
            if (callback) {
                callback(weeklyUsersInformation)
            } else {
                buildWeeklyTable(weeklyUsersInformation);
                return weeklyUsersInformation;
            }
        });
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
        var crowdParams = "{\"crowdName\": \"" + $("#crowdName").val() + "\", \"public\": " + public + ", \"sport\": \"" + gameWeekData.sport + "\", \"year\": 2018 }";
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
    $("#dropdown span").text($(this).text());
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
    if (nowDateTimeDate < cutoff) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('debug', function (the_string) {
    console.log(the_string, ": ", the_string);
});

function openLeaderboard(evt, leaderboardName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(leaderboardName).style.display = "block";
    evt.currentTarget.className += " active";
}


function runningPoolTotalChart() {
    // hide chart after its built on first load
    get('/assets/js/collegePoolTotal.json')
    .then((data) => {
        return data.json()
    })
    .then((dataJSON) => {
        console.log('dataJSON: ', dataJSON)
        $('#winningsTotal').html('<h2>Current Winnings: $' + dataJSON.poolTotal + '</h2>')
        var chartData = google.visualization.arrayToDataTable(dataJSON.history);
    
        var options = {
            title: 'Running Winnings Total',
            hAxis: {title: 'Date',  titleTextStyle: {color: '#333'}},
            seriesType: 'line',
            series: {2: {type: 'line', lineDashStyle: [2, 2, 20, 2, 20, 2]}},
            chartArea: {width: '100%', height: 320},
            colors: ['#B42135', '#000'],
            legend: {position: 'bottom'},
            explorer: {
                    axis: 'horizontal',
                    keepInBounds: true,
                    maxZoomIn: 4.0
            }
        };

        var chart = new google.visualization.LineChart(document.getElementById('winningsChart'));
        chart.draw(chartData, options);

    })
    
}