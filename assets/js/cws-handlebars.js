<div class="container">
    <div class="row">
    {{#grouped_each 2 games}}
        {{#each this}}
        <div class="col-sm-8 col-md-4" id="container-{{{gameId}}}">
            <div class="card prediction" style="margin-bottom:10px;min-width: 293px;" data-game-id="{{{gameId}}}"
                data-game-week="{{{gameWeek}}}"
                data-game-year="{{{year}}}"
                data-home-code="{{{homeTeam.code}}}"
                data-home-name="{{{homeTeam.fullName}}}" data-home-short="{{{homeTeam.shortName}}}"
                data-away-code="{{{awayTeam.code}}}"
                data-away-name="{{{awayTeam.fullName}}}" data-away-short="{{{awayTeam.shortName}}}"
                {{#if prediction.awayTeam.score}} data-predicted="true" {{/if}}
                style="display: inline-block;">
                <div class="panel-group" id="{{{awayTeam.code}}}-{{{homeTeam.code}}}-accordion" role="tablist" aria-multiselectable="true">
                    <div class="panel panel-default">
                        <div class="panel-heading" role="tab" id="{{{awayTeam.code}}}-{{{homeTeam.code}}}-heading">
                            <h4 class="panel-title">
                                <a role="button" data-toggle="collapse" data-parent="#{{{awayTeam.code}}}-{{{homeTeam.code}}}-accordion" href="#{{{awayTeam.code}}}-{{{homeTeam.code}}}" aria-expanded="true" aria-controls="{{{awayTeam.code}}}-{{{homeTeam.code}}}">
                                    {{{awayTeam.fullName}}} vs. {{{homeTeam.fullName}}}
                                </a>
                            </h4>
                        </div>
                        <div id="{{{awayTeam.code}}}-{{{homeTeam.code}}}" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="{{{awayTeam.code}}}-{{{homeTeam.code}}}-heading">
                            <div class="panel-body">
                                <div class="content">
                                    <div class="tab-content text-center">
                                        <div class="tab-pane active">
                                            <div class="prediction-message" data-game-id="{{{gameId}}}"></div>
                                            <div>
                                                <div class="form-group">
                                                    <div class="gameHeader{{#if prediction}} gameHeaderPredicted{{/if}}{{#unless prediction}} gameHeaderNotPredicted{{/unless}}"><span style="float:left">{{startDateTime}}<br/>{{tvStation}}</span>{{#if results}}<span class="finalRow" style="float: right">FINAL</span>{{/if}}</div>
                                                    
                                                </div>
                                            </div>


                                            <table class="table">
                                                <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Me</th>
                                                    <th class="compareHeader">{{#if comparePrediction}}{{comparePrediction.preferred_username}}{{/if}}{{#unless comparePrediction}}The Crowd{{/unless}}</th>
                                                    <th>Odds</th>
                                                    {{#if results}}<th>Actual</th>{{/if}}
                                                </tr>
                                                </thead>
                                                <tbody>

                                                <!-- Away Team Row -->
                                                <tr class="predictionRow">
                                                    <td><i class="fa fa-plane" aria-hidden="true"></i>{{awayTeam.code}}</td>
                                                    <td class="away-team-prediction {{#if results}}{{#ifCond results.awayTeam.score '>' results.homeTeam.score}}{{#ifCond prediction.awayTeam.score '>' prediction.homeTeam.score}} alert alert-success{{/ifCond}}{{/ifCond}}{{/if}}" id="{{{awayTeam.code}}}-prediction">
                                                        {{#ifCond status '===' 'notStarted'}}
                                                            <input type="number" min="0" max="50" class="form-control predictionInput" placeholder="##"
                                                            value="{{prediction.awayTeam.score}}">
                                                        {{/ifCond}}
                                                        {{#ifCond status '!==' 'notStarted'}}
                                                            {{#ifCond prediction.awayTeam.score '>' prediction.homeTeam.score}}<i class="fas fa-angle-double-right"></i>{{/ifCond}}{{prediction.awayTeam.score}}
                                                            {{#if results}}
                                                                {{#ifCond prediction.awayTeam.score '===' results.awayTeam.score}}
                                                                    <sup><i class="fas fa-bullseye"></i></sup>
                                                                {{/ifCond}}
                                                            {{/if}}
                                                        {{/ifCond}}
                                                    </td>
                                                    <td{{#if results}}
                                                        {{#unless comparePrediction}}
                                                            {{#ifCond results.awayTeam.score '>' results.homeTeam.score}}{{#ifCond crowd.awayTeam.score '>' crowd.homeTeam.score}} class="crowdCorrect"{{/ifCond}}{{/ifCond}}
                                                        {{/unless}}
                                                        {{#if comparePrediction}}
                                                            {{#ifCond results.awayTeam.score '>' results.homeTeam.score}}{{#ifCond comparePrediction.awayTeam.score '>' comparePrediction.homeTeam.score}} class="crowdCorrect"{{/ifCond}}{{/ifCond}}
                                                        {{/if}}
                                                    {{/if}}>
                                                            {{#unless comparePrediction}}
                                                            <span
                                                                {{#unless prediction}}
                                                                    {{#unless results}}
                                                                        class="crowdHidden"
                                                                    {{/unless}}
                                                                {{/unless}}>
                                                                {{#ifCond crowd.awayTeam.score '>' crowd.homeTeam.score}}<i class="fas fa-angle-double-right"></i>{{/ifCond}}
                                                                {{crowd.awayTeam.score}}
                                                                {{#if results}}
                                                                    {{#ifCond crowd.awayTeam.score '===' results.awayTeam.score}}
                                                                        <sup><i class="fas fa-bullseye"></i></sup>
                                                                    {{/ifCond}}
                                                                {{/if}}
                                                            </span>
                                                            {{/unless}}
                                                            {{#if comparePrediction}}
                                                                {{#ifCond comparePrediction.awayTeam.score '>' comparePrediction.homeTeam.score}}<i class="fas fa-angle-double-right"></i>{{/ifCond}}
                                                                {{comparePrediction.awayTeam.score}}
                                                                {{#if results}}
                                                                    {{#ifCond comparePrediction.awayTeam.score '===' results.awayTeam.score}}
                                                                        <sup><i class="fas fa-bullseye"></i></sup>
                                                                    {{/ifCond}}
                                                                {{/if}}
                                                            {{/if}}
                                                        {{#unless comparePrediction}}
                                                            {{#unless prediction}}
                                                                {{#unless results}}
                                                                    <span class="fa fa-lock crowdShown"></span>
                                                                {{/unless}}
                                                            {{/unless}}
                                                        {{/unless}}</td>
                                                    <td></td>
                                                    {{#if results}}<td>{{results.awayTeam.score}}</td>{{/if}}
                                                </tr>
                                                <!-- Home Team Row -->
                                                <tr class="predictionRow">
                                                    <td><i class="fa fa-home" aria-hidden="true"></i> {{homeTeam.code}}</td>
                                                    <td class="home-team-prediction{{#if results}}{{#ifCond results.homeTeam.score '>' results.awayTeam.score}}{{#ifCond prediction.homeTeam.score '>' prediction.awayTeam.score}} alert alert-success{{/ifCond}}{{/ifCond}}{{/if}}" id="{{{homeTeam.code}}}-prediction">
                                                        {{#ifCond status '===' 'notStarted'}}
                                                            <input type="number" min="0" max="50" class="form-control predictionInput" placeholder="##"
                                                            value="{{prediction.homeTeam.score}}">
                                                        {{/ifCond}}
                                                        {{#ifCond status '!==' 'notStarted'}}
                                                            {{#ifCond prediction.awayTeam.score '<' prediction.homeTeam.score}}<i class="fas fa-angle-double-right"></i>{{/ifCond}}
                                                            {{prediction.homeTeam.score}}
                                                            {{#if results}}
                                                                {{#ifCond prediction.homeTeam.score '===' results.homeTeam.score}}
                                                                    <sup><i class="fas fa-bullseye"></i></sup>
                                                                {{/ifCond}}
                                                            {{/if}}
                                                        {{/ifCond}}
                                                    </td>
                                                    <td
                                                        {{#if results}}
                                                                {{#ifCond results.homeTeam.score '>' results.awayTeam.score}}
                                                                    {{#unless comparePrediction}}
                                                                        {{#ifCond crowd.homeTeam.score '>' crowd.awayTeam.score}}
                                                                        class="crowdCorrect"
                                                                        {{/ifCond}}
                                                                    {{/unless}}
                                                                    {{#if comparePrediction}}
                                                                        {{#ifCond comparePrediction.homeTeam.score '>' comparePrediction.awayTeam.score}}
                                                                        class="crowdCorrect"
                                                                        {{/ifCond}}
                                                                    {{/if}}
                                                                {{/ifCond}}
                                                        {{/if}}>
                                                        {{#unless comparePrediction}}
                                                            <span
                                                                {{#unless prediction}}
                                                                    {{#unless results}}
                                                                    class="crowdHidden"
                                                                    {{/unless}}
                                                                {{/unless}}
                                                            >{{#ifCond crowd.awayTeam.score '<' crowd.homeTeam.score}}<i class="fas fa-angle-double-right"></i>{{/ifCond}}{{crowd.homeTeam.score}}
                                                            {{#if results}}
                                                                {{#ifCond crowd.homeTeam.score '===' results.homeTeam.score}}
                                                                    <sup><i class="fas fa-bullseye"></i></sup>
                                                                {{/ifCond}}
                                                            {{/if}}
                                                            </span>
                                                            {{#unless prediction}}
                                                                {{#unless results}}
                                                                    <span class="fa fa-lock crowdShown"></span>
                                                                {{/unless}}
                                                            {{/unless}}
                                                        {{/unless}}
                                                        {{#if comparePrediction}}
                                                            {{#ifCond comparePrediction.awayTeam.score '<' comparePrediction.homeTeam.score}}<i class="fas fa-angle-double-right"></i>{{/ifCond}}{{comparePrediction.homeTeam.score}}
                                                            {{#if results}}
                                                                {{#ifCond comparePrediction.homeTeam.score '===' results.homeTeam.score}}
                                                                    <sup><i class="fas fa-bullseye"></i></sup>
                                                                {{/ifCond}}
                                                            {{/if}}
                                                        {{/if}}
                                                    </td>
                                                    <td>
                                                            <span
                                                                {{#unless prediction}}
                                                                    {{#unless results}}
                                                                    class="crowdHidden"
                                                                    {{/unless}}
                                                                {{/unless}}
                                                            >
                                                            {{#ifCond odds.spread '>' 0}}+{{/ifCond}}{{odds.spread}}
                                                            </span>
                                                    </td>
                                                    {{#if results}}<td>{{results.homeTeam.score}}</td>{{/if}}
                                                </tr>
                                                <!-- Total Row -->
                                                <tr class="predictionRow">
                                                    <td>Total</td>
                                                    <td{{#if results}}
                                                        {{#ifCond prediction.total '>' odds.total}}
                                                            {{#ifCond results.total '>' odds.total}}
                                                                class="alert alert-success"
                                                            {{/ifCond}}
                                                        {{/ifCond}}
                                                        {{#ifCond odds.total '>' prediction.total}}
                                                            {{#ifCond odds.total '>' results.total}}
                                                            class="alert alert-success"
                                                            {{/ifCond}}
                                                        {{/ifCond}}
                                                    {{/if}} id="{{{awayTeam.code}}}{{{homeTeam.code}}}-total-prediction">
                                                    {{prediction.total}}
                                                    {{#if results}}
                                                        {{#ifCond prediction.total '===' results.total}}
                                                            <sup><i class="fas fa-bullseye"></i></sup>
                                                        {{/ifCond}}
                                                    {{/if}}
                                                    <span style="font-size: 0.8em; font-weight: bold">{{#ifCond prediction.total '>' odds.total}}<br>(o{{odds.total}}){{/ifCond}}{{#ifCond prediction.total '<' odds.total}}<br>(u{{odds.total}}){{/ifCond}}</span>
                                                    </td>
                                                    <td
                                                        {{#if results}}
                                                            {{#unless comparePrediction}}
                                                                {{#ifCond crowd.total '>' odds.total}}
                                                                    {{#ifCond results.total '>' odds.total}} class="crowdCorrect"
                                                                    {{/ifCond}}
                                                                {{/ifCond}}
                                                                {{#ifCond odds.total '>' crowd.total}}
                                                                    {{#ifCond odds.total '>' results.total}} class="crowdCorrect"
                                                                    {{/ifCond}}
                                                                {{/ifCond}}
                                                            {{/unless}}
                                                            {{#if comparePrediction}}
                                                                {{#ifCond comparePrediction.total '>' odds.total}}
                                                                    {{#ifCond results.total '>' odds.total}} class="crowdCorrect"
                                                                    {{/ifCond}}
                                                                {{/ifCond}}
                                                                {{#ifCond odds.total '>' comparePrediction.total}}
                                                                    {{#ifCond odds.total '>' results.total}} class="crowdCorrect"
                                                                    {{/ifCond}}
                                                                {{/ifCond}}
                                                            {{/if}}
                                                        {{/if}}>
                                                                {{#unless comparePrediction}}
                                                                    <span{{#unless prediction}}
                                                                        {{#unless results}} class="crowdHidden"
                                                                        {{/unless}}
                                                                    {{/unless}}>
                                                                    {{crowd.total}}
                                                                    <span style="font-size: 0.8em; font-weight: bold">
                                                                        {{#if results}}
                                                                            {{#ifCond crowd.total '===' results.total}}
                                                                                <sup><i class="fas fa-bullseye"></i></sup>
                                                                            {{/ifCond}}
                                                                        {{/if}}
                                                                        {{#ifCond crowd.total '>' odds.total}}<br>(o{{odds.total}}){{/ifCond}}
                                                                        {{#ifCond crowd.total '<' odds.total}}<br>(u{{odds.total}}){{/ifCond}}</span>

                                                                    </span>
                                                                    {{#unless prediction}}
                                                                        {{#unless results}}
                                                                            <span class="fa fa-lock crowdShown"></span>
                                                                        {{/unless}}
                                                                    {{/unless}}
                                                                {{/unless}}
                                                                {{#if comparePrediction}}
                                                                    {{comparePrediction.total}}
                                                                    {{#if results}}
                                                                        {{#ifCond comparePrediction.total '===' results.total}}
                                                                            <sup><i class="fas fa-bullseye"></i></sup>
                                                                        {{/ifCond}}
                                                                    {{/if}}
                                                                {{/if}}
                                                    </td>
                                                    <td>
                                                        <span
                                                            {{#unless prediction}}
                                                                {{#unless results}}
                                                                class="crowdHidden"
                                                                {{/unless}}
                                                            {{/unless}}>{{odds.total}}</span></td>
                                                    {{#if results}}<td>{{results.total}}</td>{{/if}}
                                                </tr>
                                                <!-- Spread Row -->
                                                <tr class="predictionRow">
                                                    <td>Spread</td>
                                                    <td
                                                        {{#if results}}
                                                            {{#ifCond prediction.results.spread.correct '===' 1}} class="alert alert-success"
                                                            {{/ifCond}}
                                                        {{/if}} id="{{{awayTeam.code}}}{{{homeTeam.code}}}-spread-prediction">
                                                            {{#ifCond prediction.spread '>' 0}}+{{/ifCond}}{{prediction.spread}}
                                                            {{#if results}}
                                                                {{#ifCond prediction.spread '===' results.spread}}
                                                                    <sup><i class="fas fa-bullseye"></i></sup>
                                                                {{/ifCond}}
                                                            {{/if}}
                                                            <!-- Show the side picked against the spread -->
                                                            <span style="font-size: 0.8em; font-weight: bold">
                                                                {{#ifCond prediction.spread '>' odds.spread}}
                                                                    <br>({{awayTeam.code}}
                                                                        <!-- Format the odds -->
                                                                        {{#ifCond odds.spread '<' 0}}{{#math odds.spread '*' -1}}{{/math}}{{/ifCond}}
                                                                        {{#ifCond odds.spread '>' 0}}+{{odds.spread}}{{/ifCond}}
                                                                        {{#ifCond odds.spread '===' 0}}EV{{/ifCond}})
                                                                {{/ifCond}}
                                                                {{#ifCond prediction.spread '<' odds.spread}}
                                                                    <br>({{homeTeam.code}}
                                                                        {{#ifCond odds.spread '<' 0}}{{#math odds.spread '*' -1}}{{/math}}{{/ifCond}}
                                                                        {{#ifCond odds.spread '>' 0}}+{{odds.spread}}{{/ifCond}}
                                                                        {{#ifCond odds.spread '===' 0}}EV{{/ifCond}})
                                                                {{/ifCond}}
                                                            </span>
                                                    </td>
                                                    <td
                                                        {{#if results}}
                                                            {{#unless comparePrediction}}
                                                                {{#ifCond crowd.spread '>' odds.spread}}
                                                                    {{#ifCond results.spread '>' odds.spread}} class="crowdCorrect"
                                                                    {{/ifCond}}
                                                                {{/ifCond}}
                                                                {{#ifCond odds.spread '>' crowd.spread}}
                                                                    {{#ifCond odds.spread '>' results.spread}} class="crowdCorrect"
                                                                    {{/ifCond}}
                                                                {{/ifCond}}
                                                            {{/unless}}
                                                            {{#if comparePrediction}}
                                                                {{#ifCond comparePrediction.spread '>' odds.spread}}
                                                                    {{#ifCond results.spread '>' odds.spread}} class="crowdCorrect"
                                                                    {{/ifCond}}
                                                                {{/ifCond}}
                                                                {{#ifCond odds.spread '>' comparePrediction.spread}}
                                                                    {{#ifCond odds.spread '>' results.spread}} class="crowdCorrect"
                                                                    {{/ifCond}}
                                                                {{/ifCond}}
                                                            {{/if}}
                                                        {{/if}}>
                                                        {{#unless comparePrediction}}
                                                            <span
                                                                {{#unless prediction}}
                                                                    {{#unless results}}
                                                                    class="crowdHidden"
                                                                    {{/unless}}
                                                                {{/unless}}>
                                                                    {{#ifCond crowd.spread '>' 0}}+{{/ifCond}}
                                                                    {{crowd.spread}}
                                                                    {{#if results}}
                                                                        {{#ifCond crowd.spread '===' results.spread}}
                                                                            <sup><i class="fas fa-bullseye"></i></sup>
                                                                        {{/ifCond}}
                                                                    {{/if}}
                                                                    <span style="font-size: 0.8em; font-weight: bold">
                                                                        {{#ifCond crowd.spread '>' odds.spread}}
                                                                            <br>({{awayTeam.code}} 
                                                                            {{#ifCond odds.spread '<' 0}}{{#math odds.spread '*' -1}}{{/math}}{{/ifCond}}
                                                                            {{#ifCond odds.spread '>' 0}}+{{odds.spread}}{{/ifCond}}
                                                                            {{#ifCond odds.spread '===' 0}}EV{{odds.spread}}{{/ifCond}})
                                                                        {{/ifCond}}
                                                                        {{#ifCond crowd.spread '<' odds.spread}}
                                                                            <br>({{homeTeam.code}}
                                                                            {{#ifCond odds.spread '<' 0}}{{#math odds.spread '*' -1}}{{/math}}{{/ifCond}}
                                                                            {{#ifCond odds.spread '>' 0}}+{{odds.spread}}{{/ifCond}}
                                                                            {{#ifCond odds.spread '===' 0}}EV{{odds.spread}}{{/ifCond}})
                                                                        {{/ifCond}}
                                                                    </span>

                                                            </span>
                                                            {{#unless prediction}}
                                                                {{#unless results}}<span class="fa fa-lock crowdShown"></span>
                                                                {{/unless}}
                                                            {{/unless}}
                                                        {{/unless}}
                                                        {{#if comparePrediction}}
                                                            {{#ifCond comparePrediction.spread '>' 0}}+{{/ifCond}}
                                                            {{comparePrediction.spread}}
                                                            {{#if results}}
                                                                {{#ifCond comparePrediction.spread '===' results.spread}}
                                                                    <sup><i class="fas fa-bullseye"></i></sup>
                                                                {{/ifCond}}
                                                            {{/if}}
                                                            <span style="font-size: 0.8em; font-weight: bold">
                                                                {{#ifCond comparePrediction.spread '>' odds.spread}}
                                                                    <br>({{awayTeam.code}} {{#ifCond odds.spread '>' 0}}
                                                                                            -{{/ifCond}}{{odds.spread}})
                                                                {{/ifCond}}
                                                                {{#ifCond comparePrediction.spread '<' odds.spread}}
                                                                    <br>({{homeTeam.code}} {{#ifCond odds.spread '>' 0}}+{{/ifCond}}{{odds.spread}})
                                                                {{/ifCond}}
                                                            </span>
                                                        {{/if}}
                                                    </td>
                                                    <td>
                                                            <span
                                                                {{#unless prediction}}
                                                                    {{#unless results}}
                                                                    class="crowdHidden"
                                                                    {{/unless}}
                                                                {{/unless}}>
                                                            {{#ifCond odds.spread '!=' 0}}{{#ifCond odds.spread '>' 0}}+{{/ifCond}}{{odds.spread}}{{/ifCond}}
                                                            {{#ifCond odds.spread '===' 0}}Even{{/ifCond}}</span></td>
                                                    {{#if results}}<td>{{results.spread}}</td>{{/if}}
                                                </tr>
                                                </tbody>
                                            </table>
                                            
                                            <div>
                                            {{#unless results}}
                                                {{#if userAuthenticated}}
                                                    {{#dateCheck startDateTime}}
                                                        <button class="prediction-btn btn btn-info">Predict</button>
                                                    {{/dateCheck}}
                                                {{/if}}
                                                {{#unless userAuthenticated}}
                                                    {{#dateCheck startDateTime}}
                                                        <button type="button" class="btn btn-info" onclick="ga('send','event','login','loginClicked');window.location=('https://crowdsourcedscores.auth.us-west-2.amazoncognito.com/login?response_type=code&client_id=2n15lhk845sucm0k4fejjqcbev&redirect_uri=https://crowdsourcedscores.com')">Log in to Predict</button>
                                                    {{/dateCheck}}
                                                {{/unless}}
                                            {{/unless}}
                                                {{#if prediction.predictionScore}}
                                                    <div class="predictionScore">Prediction Score: {{prediction.predictionScore}} <i class="fas fa-info-circle" data-toggle="modal" data-target="#predictionScoreModal"></i></div>
                                                {{/if}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {{/each}}
        <div class="clearfix"></div>
    {{/grouped_each}}
</div>
<div id="lastRow" class="row"></div>
</div>