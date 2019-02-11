(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['template.gameNFL'] = template({"1":function(container,depth0,helpers,partials,data) {
    return " data-predicted=\"true\" ";
},"3":function(container,depth0,helpers,partials,data) {
    return "                            <i class=\"fas fa-exclamation-triangle total\"></i>\r\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "                            <i class=\"fas fa-exclamation-triangle spread\"></i>\r\n";
},"7":function(container,depth0,helpers,partials,data) {
    return " gameHeaderPredicted";
},"9":function(container,depth0,helpers,partials,data) {
    return " gameHeaderNotPredicted";
},"11":function(container,depth0,helpers,partials,data) {
    return "                                                <span class=\"finalRow\" style=\"float: right\">FINAL</span>\r\n";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.lambda, alias4=container.escapeExpression;

  return "                                <table class=\"table\">\r\n                                    <thead>\r\n                                    <tr>\r\n                                        <th></th>\r\n                                        <th>Me</th>\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.gameId : depth0),"===",267,{"name":"ifCond","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        <th class=\"compareHeader\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</th>\r\n                                        <th>Odds</th>\r\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n                                    </tr>\r\n                                    </thead>\r\n                                    <tbody>\r\n\r\n                                    <!-- Away Team Row -->\r\n                                    <tr class=\"predictionRow\">\r\n                                        <td><i class=\"fa fa-plane\" aria-hidden=\"true\"></i>"
    + alias4(alias3(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "</td>\r\n                                        <td class=\"away-team-prediction "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(22, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" id=\""
    + ((stack1 = alias3(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-prediction\">\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"===","notStarted",{"name":"ifCond","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"!==","notStarted",{"name":"ifCond","hash":{},"fn":container.program(28, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        </td>\r\n                                        \r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.gameId : depth0),"===",267,{"name":"ifCond","hash":{},"fn":container.program(34, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        <td"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(41, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(49, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(55, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(58, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</td>\n                                        <td></td>\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(62, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                    </tr>\n                                    <!-- Home Team Row -->\n                                    <tr class=\"predictionRow\">\n                                        <td><i class=\"fa fa-home\" aria-hidden=\"true\"></i> "
    + alias4(alias3(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "</td>\n                                        <td class=\"home-team-prediction"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(64, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" id=\""
    + ((stack1 = alias3(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-prediction\">\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"===","notStarted",{"name":"ifCond","hash":{},"fn":container.program(67, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"!==","notStarted",{"name":"ifCond","hash":{},"fn":container.program(69, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        </td>\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.gameId : depth0),"===",267,{"name":"ifCond","hash":{},"fn":container.program(72, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        <td\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(81, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(88, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(94, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        </td>\n                                        <td>\n                                                <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(89, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                >\n                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(97, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias4(alias3(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + "\n                                                </span>\n                                        </td>\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(99, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                    </tr>\n                                    <!-- Total Row -->\n                                    <tr class=\"predictionRow\">\n                                        <td>Total</td>\n                                        <td"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(101, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " id=\""
    + ((stack1 = alias3(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + ((stack1 = alias3(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-total-prediction\">\r\n                                        "
    + alias4(alias3(((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(104, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"if","hash":{},"fn":container.program(107, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        </td>\n                                        <td></td>\n                                        <td\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(112, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(118, data, 0),"inverse":container.program(121, data, 0),"data":data})) != null ? stack1 : "")
    + "                                        </td>\n                                        <td>\n                                            <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(130, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias4(alias3(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1), depth0))
    + "</span></td>\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(133, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                    </tr>\n                                    <!-- Spread Row -->\n                                    <tr class=\"predictionRow\">\n                                        <td>Spread</td>\n                                        <td\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(135, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " id=\""
    + ((stack1 = alias3(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + ((stack1 = alias3(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-spread-prediction\">\n                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(97, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias4(alias3(((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(138, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                <!-- Show the side picked against the spread -->\n                                                <span style=\"font-size: 0.8em; font-weight: bold\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"if","hash":{},"fn":container.program(140, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                </span>\n                                        </td>\n                                        <td></td>\n                                        <td\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(154, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n                                            \n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(160, data, 0),"inverse":container.program(168, data, 0),"data":data})) != null ? stack1 : "")
    + "                                        </td>\n                                        <td>\n                                                <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(169, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"!=",0,{"name":"ifCond","hash":{},"fn":container.program(180, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"===",0,{"name":"ifCond","hash":{},"fn":container.program(182, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span></td>\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(184, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                    </tr>\n                                    </tbody>\n                                </table>\n";
},"14":function(container,depth0,helpers,partials,data) {
    return "                                        <th class=\"quarters\">Quarters</th>\r\n";
},"16":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.preferred_username : stack1), depth0));
},"18":function(container,depth0,helpers,partials,data) {
    return "The Crowd";
},"20":function(container,depth0,helpers,partials,data) {
    return "<th>Actual</th>";
},"22":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"23":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(24, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"24":function(container,depth0,helpers,partials,data) {
    return " alert alert-success";
},"26":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                <input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput\" placeholder=\"##\"\r\n                                                value=\""
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\">\r\n";
},"28":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(31, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"29":function(container,depth0,helpers,partials,data) {
    return "<i class=\"fas fa-angle-double-right\"></i>";
},"31":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"32":function(container,depth0,helpers,partials,data) {
    return "                                                        <sup><i class=\"fas fa-bullseye\"></i></sup>\r\n";
},"34":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                        <td class=\"quarters awayQuarters\">\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"===","notStarted",{"name":"ifCond","hash":{},"fn":container.program(35, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"!==","notStarted",{"name":"ifCond","hash":{},"fn":container.program(37, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        </td>\n";
},"35":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=helpers.helperMissing, alias5="function";

  return "                                            <span class=\"visible-xs\">Q1: </span><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-away-team-q1-prediction\">\r\n                                            <span class=\"quarterLabel visible-xs\">Q2</span><br><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\r\n                                                value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q2 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-away-team-q2-prediction\">\r\n                                            <span class=\"quarterLabel visible-xs\">Q3</span><br><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\r\n                                                value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q3 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-away-team-q3-prediction\">\r\n                                            <span class=\"quarterLabel visible-xs\">Q4</span><br><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\r\n                                                value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q4 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-away-team-q4-prediction\">\n";
},"37":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1),{"name":"if","hash":{},"fn":container.program(38, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"38":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=helpers.helperMissing;

  return "                                                <span class=\"visible-xs\">Q1:<br></span>\n                                                    <span class=\"quarterResults\">\n                                                        "
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1), depth0))
    + "\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias4).call(alias3,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1),"===",((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1),{"name":"ifCond","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                    </span>\n                                                <span class=\"visible-xs\">Q2:<br></span>\n                                                    <span class=\"quarterResults\">\n                                                        "
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q2 : stack1), depth0))
    + "\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias4).call(alias3,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q2 : stack1),"===",((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q2 : stack1),{"name":"ifCond","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                    </span>\n                                                <span class=\"visible-xs\">Q3:<br></span>\n                                                    <span class=\"quarterResults\">\n                                                        "
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q3 : stack1), depth0))
    + "\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias4).call(alias3,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q3 : stack1),"===",((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q3 : stack1),{"name":"ifCond","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                    </span>\n                                                <span class=\"visible-xs\">Q4:<br></span>\n                                                    <span class=\"quarterResults\">\n                                                        "
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q4 : stack1), depth0))
    + "\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias4).call(alias3,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q4 : stack1),"===",((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q4 : stack1),{"name":"ifCond","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                    </span>\n";
},"39":function(container,depth0,helpers,partials,data) {
    return "                                                            <sup><i class=\"fas fa-bullseye\"></i></sup>\n";
},"41":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(42, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(46, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        ";
},"42":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(43, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"43":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(44, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"44":function(container,depth0,helpers,partials,data) {
    return " class=\"crowdCorrect\"";
},"46":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(47, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"47":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(44, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"49":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(50, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n                                                    "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(53, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                </span>\n";
},"50":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(51, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                    ";
},"51":function(container,depth0,helpers,partials,data) {
    return "                                                            class=\"crowdHidden\"\n";
},"53":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"55":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n                                                    "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(56, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"56":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"58":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(59, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                            ";
},"59":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(60, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"60":function(container,depth0,helpers,partials,data) {
    return "                                                        <div style=\"width:40%; position: relative; left: 30%\">Predict to Access Crowd Wisdom</div>\n";
},"62":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<td>"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "</td>";
},"64":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(65, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"65":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(24, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"67":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression;

  return "                                                <input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput\" placeholder=\"##\"\r\n                                                value=\""
    + alias1(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\" id=\""
    + alias1(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-home-team-prediction\">\n";
},"69":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"<",((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n                                                "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(70, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"70":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"72":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                            <td class=\"quarters homeQuarters\">\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"===","notStarted",{"name":"ifCond","hash":{},"fn":container.program(73, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"!==","notStarted",{"name":"ifCond","hash":{},"fn":container.program(75, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                            </td>\n";
},"73":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=helpers.helperMissing, alias5="function";

  return "                                                <span class=\"visible-xs\">Q1: </span><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                    value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-home-team-q1-prediction\">\n                                                <span class=\"visible-xs\">Q2: </span><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                    value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q2 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-home-team-q2-prediction\">\n                                                <span class=\"visible-xs\">Q3: </span><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                    value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q3 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-home-team-q3-prediction\">\n                                                <span class=\"visible-xs\">Q4: </span><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                    value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q4 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-home-team-q4-prediction\">\n";
},"75":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1),{"name":"if","hash":{},"fn":container.program(76, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"76":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=helpers.helperMissing;

  return "                                                    <span class=\"visible-xs\">Q1:<br></span>\n                                                        <span class=\"quarterResults\">"
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1), depth0))
    + "\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias4).call(alias3,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1),"===",((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1),{"name":"ifCond","hash":{},"fn":container.program(77, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span>\n                                                    <span class=\"visible-xs\">Q2:<br></span>\n                                                        <span class=\"quarterResults\">"
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q2 : stack1), depth0))
    + "\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias4).call(alias3,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q2 : stack1),"===",((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q2 : stack1),{"name":"ifCond","hash":{},"fn":container.program(79, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                        </span>\n                                                    <span class=\"visible-xs\">Q3:<br></span>\n                                                        <span class=\"quarterResults\">"
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q3 : stack1), depth0))
    + "\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias4).call(alias3,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q3 : stack1),"===",((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q3 : stack1),{"name":"ifCond","hash":{},"fn":container.program(79, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                        </span>\n                                                    <span class=\"visible-xs\">Q4:<br></span>\n                                                        <span class=\"quarterResults\">\n                                                            "
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q4 : stack1), depth0))
    + "\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias4).call(alias3,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q4 : stack1),"===",((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q4 : stack1),{"name":"ifCond","hash":{},"fn":container.program(79, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                        </span>\n";
},"77":function(container,depth0,helpers,partials,data) {
    return "                                                                <sup><i class=\"fas fa-bullseye\"></i></sup>\n                                                            ";
},"79":function(container,depth0,helpers,partials,data) {
    return "                                                                <sup><i class=\"fas fa-bullseye\"></i></sup>\n";
},"81":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(82, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                            ";
},"82":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(83, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(86, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"83":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(84, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"84":function(container,depth0,helpers,partials,data) {
    return "                                                            class=\"crowdCorrect\"\n";
},"86":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(84, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"88":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(89, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                >"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"<",((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(92, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                </span>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(59, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"89":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(90, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"90":function(container,depth0,helpers,partials,data) {
    return "                                                        class=\"crowdHidden\"\n";
},"92":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"94":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"<",((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(95, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"95":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"97":function(container,depth0,helpers,partials,data) {
    return "+";
},"99":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<td>"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "</td>";
},"101":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.results : stack1)) != null ? stack1.total : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(102, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        ";
},"102":function(container,depth0,helpers,partials,data) {
    return "                                                class=\"alert alert-success\"\n";
},"104":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(105, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"105":function(container,depth0,helpers,partials,data) {
    return "                                                <sup><i class=\"fas fa-bullseye\"></i></sup>\n";
},"107":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                        <span style=\"font-size: 0.8em; font-weight: bold\">"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),">",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(108, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),"<",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(110, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span>\n";
},"108":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<br>(o"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1), depth0))
    + ")";
},"110":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<br>(u"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1), depth0))
    + ")";
},"112":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(113, data, 0),"inverse":container.program(116, data, 0),"data":data})) != null ? stack1 : "")
    + "                                            ";
},"113":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.results : stack1)) != null ? stack1.total : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(114, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"114":function(container,depth0,helpers,partials,data) {
    return "                                                        class=\"crowdCorrect\"\n";
},"116":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.results : stack1)) != null ? stack1.total : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(114, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"118":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.total : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(119, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"119":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.total : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"121":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                <span"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(122, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n                                                "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.total : stack1), depth0))
    + "\n                                                <span style=\"font-size: 0.8em; font-weight: bold\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(125, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.total : stack1),{"name":"if","hash":{},"fn":container.program(127, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span>\n\n                                                </span>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(59, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"122":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n                                                    "
    + ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(123, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                ";
},"123":function(container,depth0,helpers,partials,data) {
    return " class=\"crowdHidden\"\n";
},"125":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.total : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"127":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"if","hash":{},"fn":container.program(128, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                    ";
},"128":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                                        "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.total : stack1),">",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(108, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                        "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.total : stack1),"<",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(110, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"130":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(131, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                ";
},"131":function(container,depth0,helpers,partials,data) {
    return "                                                    class=\"crowdHidden\"\n";
},"133":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<td>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.total : stack1), depth0))
    + "</td>";
},"135":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.results : stack1)) != null ? stack1.spread : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(136, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                            ";
},"136":function(container,depth0,helpers,partials,data) {
    return " class=\"alert alert-success\"\n";
},"138":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"140":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),">",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(141, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),"<",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(149, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"141":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                                            <br>("
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "\n                                                                <!-- Format the odds -->\n                                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"<",0,{"name":"ifCond","hash":{},"fn":container.program(142, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(145, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"===",0,{"name":"ifCond","hash":{},"fn":container.program(147, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"142":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "+"
    + ((stack1 = (helpers.math || (depth0 && depth0.math) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"*",-1,{"name":"math","hash":{},"fn":container.program(143, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ")";
},"143":function(container,depth0,helpers,partials,data) {
    return "";
},"145":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.math || (depth0 && depth0.math) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"*",-1,{"name":"math","hash":{},"fn":container.program(143, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ")";
},"147":function(container,depth0,helpers,partials,data) {
    return "EV)";
},"149":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                                            <br>("
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "\n                                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"<",0,{"name":"ifCond","hash":{},"fn":container.program(150, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(152, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"===",0,{"name":"ifCond","hash":{},"fn":container.program(147, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"150":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + ")";
},"152":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "+"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + ")";
},"154":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(155, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(158, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                            ";
},"155":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.results : stack1)) != null ? stack1.spread : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(156, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"156":function(container,depth0,helpers,partials,data) {
    return " class=\"crowdCorrect\"\n";
},"158":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.results : stack1)) != null ? stack1.spread : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(156, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"160":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(97, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.spread : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(161, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                <span style=\"font-size: 0.8em; font-weight: bold\">\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.spread : stack1),">",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(163, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.spread : stack1),"<",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(166, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                </span>\n";
},"161":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.spread : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"163":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "                                                        <br>("
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + " "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(164, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + ")\n";
},"164":function(container,depth0,helpers,partials,data) {
    return "\n                                                                                -";
},"166":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "                                                        <br>("
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + " "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(97, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + ")\n";
},"168":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(169, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n                                                        "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(97, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                        "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(171, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                        <span style=\"font-size: 0.8em; font-weight: bold\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1),{"name":"if","hash":{},"fn":container.program(173, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                        </span>\n\n                                                </span>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(59, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"169":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(90, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                    ";
},"171":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(79, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"173":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"if","hash":{},"fn":container.program(174, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"174":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1),">",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(175, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1),"<",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(178, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"175":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                                                    <br>("
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + " \n                                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"<",0,{"name":"ifCond","hash":{},"fn":container.program(142, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(145, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"===",0,{"name":"ifCond","hash":{},"fn":container.program(176, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"176":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "EV"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + ")";
},"178":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                                                    <br>("
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "\n                                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"<",0,{"name":"ifCond","hash":{},"fn":container.program(150, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(152, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"===",0,{"name":"ifCond","hash":{},"fn":container.program(147, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"180":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(97, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0));
},"182":function(container,depth0,helpers,partials,data) {
    return "Even";
},"184":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<td>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.spread : stack1), depth0))
    + "</td>";
},"186":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                <!--No prediction-->\n"
    + ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(187, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"187":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=helpers.helperMissing, alias5="function";

  return "                                        <!--no results -->\r\n                                            <table class=\"table\">\r\n                                                <thead>\r\n                                                <tr>\r\n                                                    <th><i class=\"fa fa-plane\" aria-hidden=\"true\"></i>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "</th>\r\n                                                    <th><i class=\"fa fa-home\" aria-hidden=\"true\"></i>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "</th>\r\n                                                </tr>\r\n                                                </thead>\r\n                                                <tbody>\r\n\r\n                                                <!-- Initial Prediction Row -->\r\n                                                <tr class=\"predictionRow\">\r\n                                                    <td class=\"away-team-prediction\">\r\n                                                        <input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput\" placeholder=\"##\"\r\n                                                            value=\""
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\">\r\n                                                    </td>\r\n                                                    <td class=\"home-team-prediction\">\r\n                                                        <input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput\" placeholder=\"##\"\r\n                                                            value=\""
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\">\r\n                                                    </td>\r\n                                                </tr>\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.gameId : depth0),"===",267,{"name":"ifCond","hash":{},"fn":container.program(178, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                </tbody>\r\n                                            </table>\r\n";
},"178":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=helpers.helperMissing, alias5="function";

  return "                                                \r\n                                                <!-- Initial Prediction Quarters Row -->\r\n                                                <tr class=\"predictionRow\">\r\n                                                    <td class=\"away-team-prediction\">\r\n                                                        <span class=\"quarterLabel\">Q1</span><br><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\r\n                                                            value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-away-team-q1-prediction\">\r\n                                                        <span class=\"quarterLabel\">Q2</span><br><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\r\n                                                            value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q2 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-away-team-q2-prediction\">\r\n                                                        <span class=\"quarterLabel\">Q3</span><br><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\r\n                                                            value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q3 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-away-team-q3-prediction\">\r\n                                                        <span class=\"quarterLabel\">Q4</span><br><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\r\n                                                            value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q4 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-away-team-q4-prediction\">\r\n                                                    </td>\r\n                                                    <td class=\"home-team-prediction\">\r\n                                                        <span class=\"quarterLabel\">Q1</span><br><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\r\n                                                            value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-home-team-q1-prediction\">\r\n                                                        <span class=\"quarterLabel\">Q2</span><br><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\r\n                                                            value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q2 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-home-team-q2-prediction\">\r\n                                                        <span class=\"quarterLabel\">Q3</span><br><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\r\n                                                            value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q3 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-home-team-q3-prediction\">\r\n                                                        <span class=\"quarterLabel\">Q4</span><br><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\r\n                                                            value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q4 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-home-team-q4-prediction\">\n                                                    </td>\n                                                </tr>\n                                                </tbody>\n                                            </table>\n";
},"189":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.userAuthenticated : depth0),{"name":"if","hash":{},"fn":container.program(190, data, 0),"inverse":container.program(196, data, 0),"data":data})) != null ? stack1 : "");
},"190":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.dateCheck || (depth0 && depth0.dateCheck) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.startDateTime : depth0),{"name":"dateCheck","hash":{},"fn":container.program(191, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"191":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                            <button class=\"prediction-btn btn btn-info\">Predict</button>\n                                            \n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),"===",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(192, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),"===",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(194, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"192":function(container,depth0,helpers,partials,data) {
    return "                                                <br><sup><i class=\"fas fa-exclamation-triangle total\"></i><span class=\"warningTextTotal\">Your total matches the odds total.</span></sup>\n";
},"194":function(container,depth0,helpers,partials,data) {
    return "                                                <br><sup><i class=\"fas fa-exclamation-triangle spread\"></i><span class=\"warningTextSpread\">Your spread matches the odds spread.</span></sup>\n";
},"196":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.dateCheck || (depth0 && depth0.dateCheck) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.startDateTime : depth0),{"name":"dateCheck","hash":{},"fn":container.program(197, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"197":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                                            <button type=\"button\" class=\"btn btn-info\" onclick=\"ga('send','event','login','loginClicked');window.location=('https://crowdsourcedscores.auth.us-west-2.amazoncognito.com/login?response_type=code&client_id=2n15lhk845sucm0k4fejjqcbev&redirect_uri=https://"
    + container.escapeExpression(((helper = (helper = helpers.getWindowLocation || (depth0 != null ? depth0.getWindowLocation : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"getWindowLocation","hash":{},"data":data}) : helper)))
    + "')\">Log in to Predict</button>\n";
},"199":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                        <div class=\"predictionScore myResultsRow\">My Score: "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.predictionScore : stack1), depth0))
    + " <i class=\"fas fa-info-circle\" data-toggle=\"modal\" data-target=\"#predictionScoreModal\"></i></div>\n";
},"201":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.predictionScore : stack1),">",-1,{"name":"ifCond","hash":{},"fn":container.program(202, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"202":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                            <div class=\"predictionScore crowdResultsRow\">Crowd Score: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.results : stack1)) != null ? stack1.predictionScore : stack1), depth0))
    + " <i class=\"fas fa-info-circle\" data-toggle=\"modal\" data-target=\"#predictionScoreModal\"></i></div>\n";
},"204":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.predictionScore : stack1),">",-1,{"name":"ifCond","hash":{},"fn":container.program(205, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"205":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "                                            <div class=\"predictionScore crowdResultsRow\"><span class=\"compareHeader\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.preferred_username : stack1), depth0))
    + "</span> Score: "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.predictionScore : stack1), depth0))
    + " <i class=\"fas fa-info-circle\" data-toggle=\"modal\" data-target=\"#predictionScoreModal\"></i></div>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.lambda, alias5=container.escapeExpression;

  return "<div class=\"card prediction\" style=\"margin-bottom:10px;min-width: 293px;\" data-game-id=\""
    + ((stack1 = ((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameId","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"\r\n    data-game-week=\""
    + ((stack1 = ((helper = (helper = helpers.gameWeek || (depth0 != null ? depth0.gameWeek : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameWeek","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"\r\n    data-game-year=\""
    + ((stack1 = ((helper = (helper = helpers.year || (depth0 != null ? depth0.year : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"year","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"\r\n    data-home-code=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "\"\r\n    data-home-name=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.fullName : stack1), depth0)) != null ? stack1 : "")
    + "\" data-home-short=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.shortName : stack1), depth0)) != null ? stack1 : "")
    + "\"\r\n    data-away-code=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "\"\r\n    data-away-name=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.fullName : stack1), depth0)) != null ? stack1 : "")
    + "\" data-away-short=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.shortName : stack1), depth0)) != null ? stack1 : "")
    + "\"\r\n    data-game-sport=\""
    + ((stack1 = ((helper = (helper = helpers.sport || (depth0 != null ? depth0.sport : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"sport","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"\r\n    data-game-season=\""
    + ((stack1 = ((helper = (helper = helpers.season || (depth0 != null ? depth0.season : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"season","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"\r\n    "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n    style=\"display: inline-block;\">\r\n    <div class=\"panel-group\" id=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-accordion\" role=\"tablist\" aria-multiselectable=\"true\">\r\n        <div class=\"panel panel-default\">\r\n            <div class=\"panel-heading\" role=\"tab\" id=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-heading\">\r\n                <h4 class=\"panel-title\">\r\n                    <a role=\"button\" data-toggle=\"collapse\" data-parent=\"#"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-accordion\" href=\"#"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "\" aria-expanded=\"true\" aria-controls=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "\">\r\n                        <span class=\"hidden-md\">"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.fullName : stack1), depth0)) != null ? stack1 : "")
    + " vs. "
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.fullName : stack1), depth0)) != null ? stack1 : "")
    + "</span>\r\n                        <span class=\"visible-md\">"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.shortName : stack1), depth0)) != null ? stack1 : "")
    + " vs. "
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.shortName : stack1), depth0)) != null ? stack1 : "")
    + "</span>\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),"===",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),"===",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                    </a>\r\n\r\n                </h4>\r\n            </div>\r\n            <div id=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "\" class=\"panel-collapse collapse in\" role=\"tabpanel\" aria-labelledby=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-heading\">\r\n                <div class=\"panel-body\">\r\n                    <div class=\"content\">\r\n                        <div class=\"tab-content text-center\">\r\n                            <div class=\"tab-pane active\">\r\n                                <div class=\"prediction-message\" data-game-id=\""
    + ((stack1 = ((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameId","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"></div>\r\n                                <div>\r\n                                    <div class=\"form-group\">\r\n                                        <div class=\"gameHeader"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\r\n                                            <span style=\"float:left\">"
    + alias5(((helper = (helper = helpers.startDateTime || (depth0 != null ? depth0.startDateTime : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"startDateTime","hash":{},"data":data}) : helper)))
    + "<br/>"
    + alias5(((helper = (helper = helpers.tvStation || (depth0 != null ? depth0.tvStation : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"tvStation","hash":{},"data":data}) : helper)))
    + "</span>\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        </div>\r\n                                    </div>\r\n                                </div>\r\n\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.prediction : depth0),"||",(depth0 != null ? depth0.results : depth0),{"name":"ifCond","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(186, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                \n                                <div>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(189, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.predictionScore : stack1),">",-1,{"name":"ifCond","hash":{},"fn":container.program(199, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(201, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(204, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>";
},"useData":true});
})();