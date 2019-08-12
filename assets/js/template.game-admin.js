(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['template.game-admin'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                <div class=\"clearfix\"></div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.lambda, alias5=container.escapeExpression;

  return "                <div class=\"col-sm-8 col-md-4\" id=\"container-"
    + ((stack1 = ((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameId","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\">\n                    <div class=\"card prediction\" style=\"margin-bottom:10px;min-width: 293px;\" data-game-id=\""
    + ((stack1 = ((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameId","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"\n                        data-game-week=\""
    + ((stack1 = ((helper = (helper = helpers.gameWeek || (depth0 != null ? depth0.gameWeek : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameWeek","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"\n                        data-game-year=\""
    + ((stack1 = ((helper = (helper = helpers.year || (depth0 != null ? depth0.year : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"year","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"\n                        data-game-sport=\""
    + ((stack1 = ((helper = (helper = helpers.sport || (depth0 != null ? depth0.sport : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"sport","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"\n                        data-game-season=\""
    + ((stack1 = ((helper = (helper = helpers.season || (depth0 != null ? depth0.season : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"season","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"\n                        data-home-code=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "\"\n                        data-home-name=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.fullName : stack1), depth0)) != null ? stack1 : "")
    + "\" data-home-short=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.shortName : stack1), depth0)) != null ? stack1 : "")
    + "\"\n                        data-away-code=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "\"\n                        data-away-name=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.fullName : stack1), depth0)) != null ? stack1 : "")
    + "\" data-away-short=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.shortName : stack1), depth0)) != null ? stack1 : "")
    + "\"\n                        "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                        style=\"display: inline-block;\">\n                        <div class=\"content\">\n                            <div class=\"tab-content text-center\">\n                                <div class=\"tab-pane active\">\n                                    <div class=\"prediction-message\" data-game-id=\""
    + ((stack1 = ((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameId","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"></div>\n                                    <div>\n                                        <div class=\"form-group\">\n                                            <div class=\"gameHeader"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"><input type=\"datetime\" style=\"float:left; color:#3A3B6C\" class=\"startDateTime\" value=\""
    + alias5(((helper = (helper = helpers.startDateTime || (depth0 != null ? depth0.startDateTime : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"startDateTime","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n                                            \n                                            <select class=\"dropdown\" id=\""
    + ((stack1 = ((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameId","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "-gameStatus\">\n                                                <option value=\"notStarted\"\n                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"===","notStarted",{"name":"ifCond","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">Not Started\n                                                </option>\n                                                <option value=\"inProgress\"\n                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"===","inProgress",{"name":"ifCond","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">In Progress\n                                                </option>\n                                                <option value=\"final\"\n                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"===","final",{"name":"ifCond","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">Final\n                                                </option>\n                                            </select>\n                                        </div>\n                                    </div>\n\n\n                                    <table class=\"table\">\n                                        <thead>\n                                        <tr>\n                                            <th></th>\n                                            <th>Score</th>\n                                            <th>Odds</th>\n                                        </tr>\n                                        </thead>\n                                        <tbody>\n                                        <tr class=\"predictionRow\">\n                                            <td><i class=\"fa fa-plane\" aria-hidden=\"true\"></i> "
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "</td>\n                                            <td class=\"away-team-score\" id=\""
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "-score\">\n                                                    <input type=\"number\" min=\"0\" max=\"50\" class=\"form-control predictionInput\" placeholder=\"##\" value=\""
    + alias5(alias4(((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\">\n                                            </td>\n                                            <td></td>\n                                        </tr>\n                                        <tr class=\"predictionRow\">\n                                            <td><i class=\"fa fa-home\" aria-hidden=\"true\"></i> "
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "</td>\n                                            <td class=\"home-team-score\" id=\""
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "-score\">\n                                                    <input type=\"number\" min=\"0\" max=\"50\" class=\"form-control predictionInput\" placeholder=\"##\" value=\""
    + alias5(alias4(((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\">\n                                            </td>\n                                            <td id=\""
    + alias5(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-odds-spread\" class=\"odds-spread\">\n                                                <input type=\"number\" class=\"form-control predictionInput\" placeholder=\"##\" value=\""
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + "\">\n                                                <div style=\"height: 50, overflow: scroll\">\n"
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.history : stack1),{"name":"each","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                </div>\n                                            </td>\n                                        </tr>\n                                        <tr class=\"predictionRow\">\n                                            <td>Total</td>\n                                            <td id=\""
    + alias5(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-total\">"
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.total : stack1), depth0))
    + "</td>\n                                            <td class=\"odds-total\">\n                                                <input type=\"number\" class=\"form-control predictionInput\" placeholder=\"##\" value=\""
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1), depth0))
    + "\">\n                                                <div style=\"height: 50px, overflow: scroll\">\n"
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.history : stack1),{"name":"each","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                </div>\n                                            </td>\n                                        </tr>\n                                        <tr class=\"predictionRow\">\n                                            <td>Spread</td>\n                                            <td id=\""
    + alias5(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-spread\" class=\"results-spread\">"
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.spread : stack1), depth0))
    + "</td>\n                                            <td></td>\n                                        </tr>\n                                        </tbody>\n                                    </table>\n                                    \n                                    <div>\n                                        <button class=\"prediction-btn btn btn-info\">Update</button>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return " data-predicted=\"true\" ";
},"5":function(container,depth0,helpers,partials,data) {
    return " gameHeaderPredicted";
},"7":function(container,depth0,helpers,partials,data) {
    return " gameHeaderNotPredicted";
},"9":function(container,depth0,helpers,partials,data) {
    return "<span class=\"finalRow\" style=\"float: right\">FINAL</span>";
},"11":function(container,depth0,helpers,partials,data) {
    return "selected";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                        ("
    + ((stack1 = (helpers.dateFormat || (depth0 && depth0.dateFormat) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.date : depth0),{"name":"dateFormat","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ": "
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.spread : depth0), depth0))
    + ")<br>\n";
},"14":function(container,depth0,helpers,partials,data) {
    return "";
},"16":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                        ("
    + ((stack1 = (helpers.dateFormat || (depth0 && depth0.dateFormat) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.date : depth0),{"name":"dateFormat","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ": "
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.total : depth0), depth0))
    + ")<br>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n        <div class=\"container\">\n            <div class=\"row\">\n"
    + ((stack1 = (helpers.grouped_each || (depth0 && depth0.grouped_each) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),2,(depth0 != null ? depth0.games : depth0),{"name":"grouped_each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div id=\"lastRow\" class=\"row\"></div>\n        </div>";
},"useData":true});
})();