var aws = require('aws-sdk');
var ses = new aws.SES({
   accessKeyId: 'AKIAICCZI4SNT2JPJ6RQ',
   secretAccesskey: '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',
   region: 'us-west-2' 
});


exports.handler = function(event, context) {
    console.log("Incoming: ", event);
   // var output = querystring.parse(event);
    var emailAddresses = [];
    if (event.emailAddresses && event.emailAddresses.length > 0) {
        emailAddresses = event.emailAddresses.split(';');
    }
    
    var eParams = {
        Destination: {
            ToAddresses: ["hi@crowdsourcedscores.com"]
        },
        Message: {
            Body: {
                HTML: {
                    Data: `<h1>Crowd Wisdom Sports needs your expertise!</h1><br>
                            ${event.given_name} ${event.family_name} has invited you to join the crowd
                            <a href="https://crowdsourcedscores.com/crowd.html?groupId=${event.group.groupId}&sport=${event.group.sport}&year=${event.group.year}">${event.group.groupName}</a> and see who has the best prediction skills!<br>
                            Predict the score of each NFL game throughout the 17 week regular season to compete against other crowd members.<br>
                            Contribute to the crowd wisdom for ${event.group.groupName} and help it compete against other crowds.<br>
                            Each prediction The game is always free to play!<br>
                            <a href="https://crowdsourcedscores.com/crowd.html?groupId=${event.group.groupId}&sport=${event.group.sport}&year=${event.group.year}">Join Crowd</a> | <a href="https://crowdsourcedscores.com">Visit Game Home</a><br>
                            <br>
                            Thanks,<br>
                            <b>Crowd Wisdom Sports</b>`
                },
                Text: {
                    Data: `${event.given_name} ${event.family_name} has invited you to join the crowd ${event.group.groupName} and see who has the best prediction skills!
                            Predict the score of each NFL game throughout the 17 week regular season to compete against other crowd members.
                            Contribute to the crowd wisdom for ${event.group.groupName} and help it compete against other crowds.
                            Each prediction The game is always free to play!
                            https://crowdsourcedscores.com/crowd.html?groupId=${event.group.groupId}&sport=${event.group.sport}&year=${event.group.year}
                            https://crowdsourcedscores.com
                            
                            Thanks,
                            Crowd Wisdom Sports`
                }
            },
            Subject: {
                Data: "Go Beyond the Coin Flip and Join the Crowd - " + event.group.groupName
            }
        },
        Source: "hi@crowdsourcedscores.com",
        Template: {
            TemplateName: "MyTemplate",
            SubjectPart: "Go Beyond the Coin Flip and Join the Crowd - " + event.group.groupName,
            HtmlPart: "<h1>Crowd Wisdom Sports needs your expertise!<br>{{name}} has invited you to join the crowd {{group.groupName}} and see who has the best prediction skills!<br>Predict the score of each NFL game throughout the 17 week regular season to compete against other crowd members.<br>Contribute to the crowd wisdom for {{group.groupName}} and help it compete against other crowds.<br>The game is always free to play!<br><a href=\"https://crowdsourcedscores.com/crowd.html?groupId={{group.groupId}}&sport={{group.sport}}&year={{group.year}}\">Join Crowd</a> | <a href=\"https://crowdsourcedscores.com\">Visit Game Home</a>",
            TextPart: "Crowd Wisdom Sports needs your expertise! {{name}} has invited you to join the crowd {{group.groupName}} and see who has the best prediction skills! Predict the score of each NFL game throughout the 17 week regular season to compete against other crowd members. Contribute to the crowd wisdom for {{group.groupName}} and help it compete against other crowds. The game is always free to play! https://crowdsourcedscores.com/crowd.html?groupId={{group.groupId}}&sport={{group.sport}}&year={{group.year}}"
          },
        TemplateData: "{ \"name\": \"" + event.given_name + " " + event.family_name + "\", \"group\": { \"groupName\": \"" + event.group.groupName + "\", \"groupId\": " + event.group.groupId + ", \"year\": " + event.group.year + ", \"sport\":\"nfl\" } }"
    };


    console.log('===SENDING EMAIL===');
    var email = ses.sendEmail(eParams, function(err, data){
        if(err) console.log(err);
        else {
            console.log("===EMAIL SENT===");
            console.log(data);
            context.succeed(event);
        }
    });
    console.log("EMAIL CODE END");
    console.log('EMAIL: ', email);

};