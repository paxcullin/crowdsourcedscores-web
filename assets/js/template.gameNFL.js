(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['template.gameNFL'] = template({"1":function(container,depth0,helpers,partials,data) {
    return " data-predicted=\"true\" ";
},"3":function(container,depth0,helpers,partials,data) {
    return "                            <i class=\"fas fa-exclamation-triangle total\"></i>\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "                            <i class=\"fas fa-exclamation-triangle spread\"></i>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return " gameHeaderPredicted";
},"9":function(container,depth0,helpers,partials,data) {
    return " gameHeaderNotPredicted";
},"11":function(container,depth0,helpers,partials,data) {
    return "                                                <span class=\"finalRow\" style=\"float: right\">FINAL</span>\n";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.lambda, alias4=container.escapeExpression;

  return "                                <table class=\"table\">\n                                    <thead>\n                                    <tr>\n                                        <th></th>\n                                        <th>Me</th>\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.gameId : depth0),"===",267,{"name":"ifCond","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        <th class=\"compareHeader\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</th>\n                                        <th>Odds</th>\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                    </tr>\n                                    </thead>\n                                    <tbody>\n\n                                    <!-- Away Team Row -->\n                                    <tr class=\"predictionRow\">\n                                        <td><i class=\"fa fa-plane\" aria-hidden=\"true\"></i>"
    + alias4(alias3(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "</td>\n                                        <td class=\"away-team-prediction "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(22, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" id=\""
    + ((stack1 = alias3(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-prediction\">\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"===","notStarted",{"name":"ifCond","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"!==","notStarted",{"name":"ifCond","hash":{},"fn":container.program(28, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        </td>\n                                        \n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.gameId : depth0),"===",267,{"name":"ifCond","hash":{},"fn":container.program(34, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        <td"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(36, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(44, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(51, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(54, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</td>\n                                        <td></td>\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(58, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                    </tr>\n                                    <!-- Home Team Row -->\n                                    <tr class=\"predictionRow\">\n                                        <td><i class=\"fa fa-home\" aria-hidden=\"true\"></i> "
    + alias4(alias3(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "</td>\n                                        <td class=\"home-team-prediction"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(60, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" id=\""
    + ((stack1 = alias3(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-prediction\">\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"===","notStarted",{"name":"ifCond","hash":{},"fn":container.program(63, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"!==","notStarted",{"name":"ifCond","hash":{},"fn":container.program(65, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        </td>\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.gameId : depth0),"===",267,{"name":"ifCond","hash":{},"fn":container.program(68, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        <td\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(70, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(77, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(83, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        </td>\n                                        <td>\n                                                <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(78, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                >\n                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(86, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias4(alias3(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + "\n                                                </span>\n                                        </td>\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(88, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                    </tr>\n                                    <!-- Total Row -->\n                                    <tr class=\"predictionRow\">\n                                        <td>Total</td>\n                                        <td"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(90, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " id=\""
    + ((stack1 = alias3(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + ((stack1 = alias3(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-total-prediction\">\n                                        "
    + alias4(alias3(((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(93, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"if","hash":{},"fn":container.program(96, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        </td>\n                                        <td\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(101, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(107, data, 0),"inverse":container.program(110, data, 0),"data":data})) != null ? stack1 : "")
    + "                                        </td>\n                                        <td>\n                                            <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(119, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias4(alias3(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1), depth0))
    + "</span></td>\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(122, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                    </tr>\n                                    <!-- Spread Row -->\n                                    <tr class=\"predictionRow\">\n                                        <td>Spread</td>\n                                        <td\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(124, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " id=\""
    + ((stack1 = alias3(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + ((stack1 = alias3(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-spread-prediction\">\n                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(86, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias4(alias3(((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(127, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                <!-- Show the side picked against the spread -->\n                                                <span style=\"font-size: 0.8em; font-weight: bold\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"if","hash":{},"fn":container.program(129, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                </span>\n                                        </td>\n                                        <td\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(143, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n                                            \n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(149, data, 0),"inverse":container.program(157, data, 0),"data":data})) != null ? stack1 : "")
    + "                                        </td>\n                                        <td>\n                                                <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(158, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"!=",0,{"name":"ifCond","hash":{},"fn":container.program(170, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"===",0,{"name":"ifCond","hash":{},"fn":container.program(172, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span></td>\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(174, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                    </tr>\n                                    </tbody>\n                                </table>\n";
},"14":function(container,depth0,helpers,partials,data) {
    return "                                        <th class=\"quarters\">Quarters</th>\n";
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

  return "                                                <input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput\" placeholder=\"##\"\n                                                value=\""
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\">\n";
},"28":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(31, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"29":function(container,depth0,helpers,partials,data) {
    return "<i class=\"fas fa-angle-double-right\"></i>";
},"31":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"32":function(container,depth0,helpers,partials,data) {
    return "                                                        <sup><i class=\"fas fa-bullseye\"></i></sup>\n";
},"34":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=helpers.helperMissing, alias5="function";

  return "                                        <td class=\"quarters awayQuarters\">\n                                            <span class=\"visible-xs\">Q1: </span><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-away-team-q1-prediction\">\n                                            <span class=\"visible-xs\">Q2: </span><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q2 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-away-team-q2-prediction\">\n                                            <span class=\"visible-xs\">Q3: </span><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q3 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-away-team-q3-prediction\">\n                                            <span class=\"visible-xs\">Q4: </span><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q4 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-away-team-q4-prediction\">\n                                        </td>\n";
},"36":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(37, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(41, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        ";
},"37":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(38, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"38":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"39":function(container,depth0,helpers,partials,data) {
    return " class=\"crowdCorrect\"";
},"41":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(42, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"42":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"44":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                    "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(48, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                </span>\n";
},"45":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(46, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                    ";
},"46":function(container,depth0,helpers,partials,data) {
    return "                                                            class=\"crowdHidden\"\n";
},"48":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(49, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"49":function(container,depth0,helpers,partials,data) {
    return "                                                            <sup><i class=\"fas fa-bullseye\"></i></sup>\n";
},"51":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                    "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(52, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"52":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(49, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"54":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(55, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                            ";
},"55":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(56, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"56":function(container,depth0,helpers,partials,data) {
    return "                                                        <div style=\"width:40%; position: relative; left: 30%\">Predict to Access Crowd Wisdom</div>\n";
},"58":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<td>"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "</td>";
},"60":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(61, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"61":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(24, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"63":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression;

  return "                                                <input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput\" placeholder=\"##\"\n                                                value=\""
    + alias1(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\" id=\""
    + alias1(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-home-team-prediction\">\n";
},"65":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"<",((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(66, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"66":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"68":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=helpers.helperMissing, alias5="function";

  return "                                        <td class=\"quarters homeQuarters\">\n                                            <span class=\"visible-xs\">Q1: </span><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-home-team-q1-prediction\">\n                                            <span class=\"visible-xs\">Q2: </span><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q2 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-home-team-q2-prediction\">\n                                            <span class=\"visible-xs\">Q3: </span><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q3 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-home-team-q3-prediction\">\n                                            <span class=\"visible-xs\">Q4: </span><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q4 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data}) : helper)))
    + "-home-team-q4-prediction\">\n                                        </td>\n";
},"70":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(71, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                            ";
},"71":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(72, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(75, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"72":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(73, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"73":function(container,depth0,helpers,partials,data) {
    return "                                                            class=\"crowdCorrect\"\n";
},"75":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(73, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"77":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(78, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                >"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"<",((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(81, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                </span>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(55, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"78":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(79, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"79":function(container,depth0,helpers,partials,data) {
    return "                                                        class=\"crowdHidden\"\n";
},"81":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"83":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"<",((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(84, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"84":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"86":function(container,depth0,helpers,partials,data) {
    return "+";
},"88":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<td>"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "</td>";
},"90":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.results : stack1)) != null ? stack1.total : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(91, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        ";
},"91":function(container,depth0,helpers,partials,data) {
    return "                                                class=\"alert alert-success\"\n";
},"93":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(94, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"94":function(container,depth0,helpers,partials,data) {
    return "                                                <sup><i class=\"fas fa-bullseye\"></i></sup>\n";
},"96":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                        <span style=\"font-size: 0.8em; font-weight: bold\">"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),">",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(97, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),"<",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(99, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span>\n";
},"97":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<br>(o"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1), depth0))
    + ")";
},"99":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<br>(u"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1), depth0))
    + ")";
},"101":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(102, data, 0),"inverse":container.program(105, data, 0),"data":data})) != null ? stack1 : "")
    + "                                            ";
},"102":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.results : stack1)) != null ? stack1.total : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(103, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"103":function(container,depth0,helpers,partials,data) {
    return "                                                        class=\"crowdCorrect\"\n";
},"105":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.results : stack1)) != null ? stack1.total : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(103, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"107":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.total : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(108, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"108":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.total : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"110":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                <span"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(111, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n                                                "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.total : stack1), depth0))
    + "\n                                                <span style=\"font-size: 0.8em; font-weight: bold\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(114, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.total : stack1),{"name":"if","hash":{},"fn":container.program(116, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span>\n\n                                                </span>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(55, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"111":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n                                                    "
    + ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(112, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                ";
},"112":function(container,depth0,helpers,partials,data) {
    return " class=\"crowdHidden\"\n";
},"114":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.total : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(49, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"116":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"if","hash":{},"fn":container.program(117, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                    ";
},"117":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                                        "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.total : stack1),">",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(97, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                        "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.total : stack1),"<",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(99, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"119":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(120, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                ";
},"120":function(container,depth0,helpers,partials,data) {
    return "                                                    class=\"crowdHidden\"\n";
},"122":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<td>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.total : stack1), depth0))
    + "</td>";
},"124":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.results : stack1)) != null ? stack1.spread : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(125, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                            ";
},"125":function(container,depth0,helpers,partials,data) {
    return " class=\"alert alert-success\"\n";
},"127":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"129":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),">",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(130, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),"<",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(138, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"130":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                                            <br>("
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "\n                                                                <!-- Format the odds -->\n                                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"<",0,{"name":"ifCond","hash":{},"fn":container.program(131, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(134, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"===",0,{"name":"ifCond","hash":{},"fn":container.program(136, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"131":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "+"
    + ((stack1 = (helpers.math || (depth0 && depth0.math) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"*",-1,{"name":"math","hash":{},"fn":container.program(132, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ")";
},"132":function(container,depth0,helpers,partials,data) {
    return "";
},"134":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.math || (depth0 && depth0.math) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"*",-1,{"name":"math","hash":{},"fn":container.program(132, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ")";
},"136":function(container,depth0,helpers,partials,data) {
    return "EV)";
},"138":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                                            <br>("
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "\n                                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"<",0,{"name":"ifCond","hash":{},"fn":container.program(139, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(141, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"===",0,{"name":"ifCond","hash":{},"fn":container.program(136, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"139":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + ")";
},"141":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "+"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + ")";
},"143":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(144, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(147, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                            ";
},"144":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.results : stack1)) != null ? stack1.spread : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(145, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"145":function(container,depth0,helpers,partials,data) {
    return " class=\"crowdCorrect\"\n";
},"147":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.results : stack1)) != null ? stack1.spread : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(145, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"149":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(86, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.spread : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(150, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                <span style=\"font-size: 0.8em; font-weight: bold\">\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.spread : stack1),">",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(152, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.spread : stack1),"<",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(155, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                </span>\n";
},"150":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.spread : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"152":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "                                                        <br>("
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + " "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(153, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + ")\n";
},"153":function(container,depth0,helpers,partials,data) {
    return "\n                                                                                -";
},"155":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "                                                        <br>("
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + " "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(86, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + ")\n";
},"157":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(158, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n                                                        "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(86, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                        "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(160, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                        <span style=\"font-size: 0.8em; font-weight: bold\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1),{"name":"if","hash":{},"fn":container.program(163, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                        </span>\n\n                                                </span>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(55, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"158":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(79, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                    ";
},"160":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(161, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"161":function(container,depth0,helpers,partials,data) {
    return "                                                                <sup><i class=\"fas fa-bullseye\"></i></sup>\n";
},"163":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"if","hash":{},"fn":container.program(164, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"164":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1),">",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(165, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1),"<",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(168, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"165":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                                                    <br>("
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + " \n                                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"<",0,{"name":"ifCond","hash":{},"fn":container.program(131, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(134, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"===",0,{"name":"ifCond","hash":{},"fn":container.program(166, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"166":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "EV"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + ")";
},"168":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                                                    <br>("
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "\n                                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"<",0,{"name":"ifCond","hash":{},"fn":container.program(139, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(141, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"===",0,{"name":"ifCond","hash":{},"fn":container.program(136, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"170":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(86, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0));
},"172":function(container,depth0,helpers,partials,data) {
    return "Even";
},"174":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<td>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.spread : stack1), depth0))
    + "</td>";
},"176":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                <!--No prediction-->\n"
    + ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(177, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"177":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "                                        <!--no results -->\n                                            <table class=\"table\">\n                                                <thead>\n                                                <tr>\n                                                    <th><i class=\"fa fa-plane\" aria-hidden=\"true\"></i>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "</th>\n                                                    <th><i class=\"fa fa-home\" aria-hidden=\"true\"></i>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "</th>\n                                                </tr>\n                                                </thead>\n                                                <tbody>\n\n                                                <!-- Initial Prediction Row -->\n                                                <tr class=\"predictionRow\">\n                                                    <td class=\"away-team-prediction\">\n                                                        <input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput\" placeholder=\"##\"\n                                                            value=\""
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\">\n                                                    </td>\n                                                    <td class=\"home-team-prediction\">\n                                                        <input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput\" placeholder=\"##\"\n                                                            value=\""
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\">\n                                                    </td>\n                                                </tr>\n                                                </tbody>\n                                            </table>\n";
},"179":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.userAuthenticated : depth0),{"name":"if","hash":{},"fn":container.program(180, data, 0),"inverse":container.program(186, data, 0),"data":data})) != null ? stack1 : "");
},"180":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.dateCheck || (depth0 && depth0.dateCheck) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.startDateTime : depth0),{"name":"dateCheck","hash":{},"fn":container.program(181, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"181":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                            <button class=\"prediction-btn btn btn-info\">Predict</button>\n                                            \n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),"===",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(182, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),"===",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(184, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"182":function(container,depth0,helpers,partials,data) {
    return "                                                <br><sup><i class=\"fas fa-exclamation-triangle total\"></i><span class=\"warningTextTotal\">Your total matches the odds total.</span></sup>\n";
},"184":function(container,depth0,helpers,partials,data) {
    return "                                                <br><sup><i class=\"fas fa-exclamation-triangle spread\"></i><span class=\"warningTextSpread\">Your spread matches the odds spread.</span></sup>\n";
},"186":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.dateCheck || (depth0 && depth0.dateCheck) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.startDateTime : depth0),{"name":"dateCheck","hash":{},"fn":container.program(187, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"187":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                                            <button type=\"button\" class=\"btn btn-info\" onclick=\"ga('send','event','login','loginClicked');window.location=('https://crowdsourcedscores.auth.us-west-2.amazoncognito.com/login?response_type=code&client_id=2n15lhk845sucm0k4fejjqcbev&redirect_uri=https://"
    + container.escapeExpression(((helper = (helper = helpers.getWindowLocation || (depth0 != null ? depth0.getWindowLocation : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"getWindowLocation","hash":{},"data":data}) : helper)))
    + "')\">Log in to Predict</button>\n";
},"189":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                        <div class=\"predictionScore myResultsRow\">My Score: "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.predictionScore : stack1), depth0))
    + " <i class=\"fas fa-info-circle\" data-toggle=\"modal\" data-target=\"#predictionScoreModal\"></i></div>\n";
},"191":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.predictionScore : stack1),">",-1,{"name":"ifCond","hash":{},"fn":container.program(192, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"192":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                            <div class=\"predictionScore crowdResultsRow\">Crowd Score: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.results : stack1)) != null ? stack1.predictionScore : stack1), depth0))
    + " <i class=\"fas fa-info-circle\" data-toggle=\"modal\" data-target=\"#predictionScoreModal\"></i></div>\n";
},"194":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.predictionScore : stack1),">",-1,{"name":"ifCond","hash":{},"fn":container.program(195, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"195":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "                                            <div class=\"predictionScore crowdResultsRow\"><span class=\"compareHeader\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.preferred_username : stack1), depth0))
    + "</span> Score: "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.predictionScore : stack1), depth0))
    + " <i class=\"fas fa-info-circle\" data-toggle=\"modal\" data-target=\"#predictionScoreModal\"></i></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.lambda, alias5=container.escapeExpression;

  return "<div class=\"card prediction\" style=\"margin-bottom:10px;min-width: 293px;\" data-game-id=\""
    + ((stack1 = ((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameId","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"\n    data-game-week=\""
    + ((stack1 = ((helper = (helper = helpers.gameWeek || (depth0 != null ? depth0.gameWeek : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameWeek","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"\n    data-game-year=\""
    + ((stack1 = ((helper = (helper = helpers.year || (depth0 != null ? depth0.year : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"year","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"\n    data-home-code=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "\"\n    data-home-name=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.fullName : stack1), depth0)) != null ? stack1 : "")
    + "\" data-home-short=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.shortName : stack1), depth0)) != null ? stack1 : "")
    + "\"\n    data-away-code=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "\"\n    data-away-name=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.fullName : stack1), depth0)) != null ? stack1 : "")
    + "\" data-away-short=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.shortName : stack1), depth0)) != null ? stack1 : "")
    + "\"\n    data-game-sport=\""
    + ((stack1 = ((helper = (helper = helpers.sport || (depth0 != null ? depth0.sport : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"sport","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"\n    data-game-season=\""
    + ((stack1 = ((helper = (helper = helpers.season || (depth0 != null ? depth0.season : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"season","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"\n    "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    style=\"display: inline-block;\">\n    <div class=\"panel-group\" id=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-accordion\" role=\"tablist\" aria-multiselectable=\"true\">\n        <div class=\"panel panel-default\">\n            <div class=\"panel-heading\" role=\"tab\" id=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-heading\">\n                <h4 class=\"panel-title\">\n                    <a role=\"button\" data-toggle=\"collapse\" data-parent=\"#"
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
    + "\">\n                        <span class=\"hidden-md\">"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.fullName : stack1), depth0)) != null ? stack1 : "")
    + " vs. "
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.fullName : stack1), depth0)) != null ? stack1 : "")
    + "</span>\n                        <span class=\"visible-md\">"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.shortName : stack1), depth0)) != null ? stack1 : "")
    + " vs. "
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.shortName : stack1), depth0)) != null ? stack1 : "")
    + "</span>\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),"===",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),"===",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                    </a>\n\n                </h4>\n            </div>\n            <div id=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "\" class=\"panel-collapse collapse in\" role=\"tabpanel\" aria-labelledby=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-heading\">\n                <div class=\"panel-body\">\n                    <div class=\"content\">\n                        <div class=\"tab-content text-center\">\n                            <div class=\"tab-pane active\">\n                                <div class=\"prediction-message\" data-game-id=\""
    + ((stack1 = ((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameId","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"></div>\n                                <div>\n                                    <div class=\"form-group\">\n                                        <div class=\"gameHeader"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n                                            <span style=\"float:left\">"
    + alias5(((helper = (helper = helpers.startDateTime || (depth0 != null ? depth0.startDateTime : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"startDateTime","hash":{},"data":data}) : helper)))
    + "<br/>"
    + alias5(((helper = (helper = helpers.tvStation || (depth0 != null ? depth0.tvStation : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"tvStation","hash":{},"data":data}) : helper)))
    + "</span>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        </div>\n                                    </div>\n                                </div>\n\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.prediction : depth0),"||",(depth0 != null ? depth0.results : depth0),{"name":"ifCond","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(176, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                \n                                <div>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(179, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.predictionScore : stack1),">",-1,{"name":"ifCond","hash":{},"fn":container.program(189, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(191, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(194, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>";
},"useData":true});
})();