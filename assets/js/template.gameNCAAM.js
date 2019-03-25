(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['template.gameNCAAM'] = template({"1":function(container,depth0,helpers,partials,data) {
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
    return "                                                <br><span class=\"finalRow\" style=\"float: right\">FINAL</span>\r\n";
},"13":function(container,depth0,helpers,partials,data) {
    return "                                                <th>Side</th>\r\n                                                <th>Total</th>\r\n";
},"15":function(container,depth0,helpers,partials,data) {
    return "                                                    Prediction Score\r\n";
},"17":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"18":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"19":function(container,depth0,helpers,partials,data) {
    return " alert alert-success";
},"21":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                    <input type=\"number\" min=\"0\" max=\"150\" class=\"form-control predictionInput\" placeholder=\"##\"\r\n                                                    value=\""
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\">\r\n";
},"23":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(24, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"24":function(container,depth0,helpers,partials,data) {
    return "<i class=\"fas fa-angle-double-right\"></i>";
},"26":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(27, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"27":function(container,depth0,helpers,partials,data) {
    return "                                                            <sup><i class=\"fas fa-bullseye\"></i></sup>\r\n";
},"29":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(30, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"30":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"32":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                    <input type=\"number\" min=\"0\" max=\"150\" class=\"form-control predictionInput\" placeholder=\"##\"\r\n                                                    value=\""
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\">\r\n";
},"34":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"<",((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(24, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n                                                    "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(35, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"35":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(27, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"37":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                                <td>\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),">",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(38, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),"<",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(46, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),"===",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(53, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                </td>\r\n                                                <td>\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),">",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(55, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),"<",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(57, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),"===",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(59, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                </td>\r\n";
},"38":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                                        "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "\r\n                                                        "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"<",0,{"name":"ifCond","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n                                                        "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(42, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n                                                        "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"===",0,{"name":"ifCond","hash":{},"fn":container.program(44, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n";
},"39":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "(+"
    + ((stack1 = (helpers.math || (depth0 && depth0.math) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"*",-1,{"name":"math","hash":{},"fn":container.program(40, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ")";
},"40":function(container,depth0,helpers,partials,data) {
    return "";
},"42":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "("
    + ((stack1 = (helpers.math || (depth0 && depth0.math) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"*",-1,{"name":"math","hash":{},"fn":container.program(40, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ")";
},"44":function(container,depth0,helpers,partials,data) {
    return "EV)";
},"46":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                                        "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "\r\n                                                        "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"<",0,{"name":"ifCond","hash":{},"fn":container.program(47, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n                                                        "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(49, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n                                                        "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"===",0,{"name":"ifCond","hash":{},"fn":container.program(51, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n";
},"47":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "("
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + ")";
},"49":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "(+"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + ")";
},"51":function(container,depth0,helpers,partials,data) {
    return "(EV)";
},"53":function(container,depth0,helpers,partials,data) {
    return "                                                        PUSH<sup><i class=\"fas fa-exclamation-triangle spread\"></i><span class=\"warningTextSpread\">Your spread matches the odds spread.</span></sup>\r\n";
},"55":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                        Over "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1), depth0))
    + "\r\n";
},"57":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                        Under "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1), depth0))
    + "\r\n";
},"59":function(container,depth0,helpers,partials,data) {
    return "                                                        Push<sup><i class=\"fas fa-exclamation-triangle spread\"></i><span class=\"warningTextSpread\">Your total matches the odds total.</span></sup>\r\n";
},"61":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.predictionScore : stack1),">",-1,{"name":"ifCond","hash":{},"fn":container.program(62, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n";
},"62":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                        <div class=\"predictionScore myResultsRow\">My Score: "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.predictionScore : stack1), depth0))
    + " <i class=\"fas fa-info-circle\" data-toggle=\"modal\" data-target=\"#predictionScoreModal\"></i></div>\r\n";
},"64":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.userAuthenticated : depth0),{"name":"if","hash":{},"fn":container.program(65, data, 0),"inverse":container.program(68, data, 0),"data":data})) != null ? stack1 : "");
},"65":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.dateCheck || (depth0 && depth0.dateCheck) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.startDateTime : depth0),{"name":"dateCheck","hash":{},"fn":container.program(66, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"66":function(container,depth0,helpers,partials,data) {
    return "                                                            <button class=\"prediction-btn btn btn-info\">Predict</button>\r\n";
},"68":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.dateCheck || (depth0 && depth0.dateCheck) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.startDateTime : depth0),{"name":"dateCheck","hash":{},"fn":container.program(69, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"69":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                                                            <button type=\"button\" class=\"btn btn-info\" onclick=\"ga('send','event','login','predictButtonClicked');window.location=('https://crowdsourcedscores.auth.us-west-2.amazoncognito.com/login?response_type=code&client_id=2n15lhk845sucm0k4fejjqcbev&redirect_uri=https://"
    + container.escapeExpression(((helper = (helper = helpers.getWindowLocation || (depth0 != null ? depth0.getWindowLocation : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"getWindowLocation","hash":{},"data":data}) : helper)))
    + "')\">Log in to Predict</button>\r\n";
},"71":function(container,depth0,helpers,partials,data) {
    return "                                                            <br><sup><i class=\"fas fa-exclamation-triangle total\"></i><span class=\"warningTextTotal\">Your total matches the odds total.</span></sup>\r\n";
},"73":function(container,depth0,helpers,partials,data) {
    return "                                                            <br><sup><i class=\"fas fa-exclamation-triangle spread\"></i><span class=\"warningTextSpread\">Your spread matches the odds spread.</span></sup>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.lambda, alias5=container.escapeExpression;

  return "<div class=\"card prediction\" style=\"margin-bottom:10px;min-width: 293px;\" data-game-id=\""
    + ((stack1 = ((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameId","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"\r\n    data-game-year=\""
    + ((stack1 = ((helper = (helper = helpers.year || (depth0 != null ? depth0.year : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"year","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"\r\n    data-game-sport=\""
    + ((stack1 = ((helper = (helper = helpers.sport || (depth0 != null ? depth0.sport : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"sport","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"\r\n    data-game-week=\""
    + ((stack1 = ((helper = (helper = helpers.gameWeek || (depth0 != null ? depth0.gameWeek : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameWeek","hash":{},"data":data}) : helper))) != null ? stack1 : "")
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
    + "\"\r\n    "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n    style=\"display: inline-block;\">\r\n    <div class=\"panel-group\" id=\""
    + ((stack1 = ((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameId","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "-accordion\" role=\"tablist\" aria-multiselectable=\"true\">\r\n        <div class=\"panel panel-default\">\r\n            <div class=\"panel-heading\" role=\"tab\" id=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-heading\">\r\n                <h4 class=\"panel-title\">\r\n                    <a role=\"button\" data-toggle=\"collapse\" data-parent=\"#"
    + ((stack1 = ((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameId","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "-accordion\" href=\"#"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "\" aria-expanded=\"true\" aria-controls=\""
    + ((stack1 = ((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameId","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\">\r\n                        "
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.fullName : stack1), depth0))
    + " at "
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.fullName : stack1), depth0))
    + "                        \r\n"
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
    + "\">\r\n                                            <div>"
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.fullName : stack1), depth0))
    + " vs. "
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.fullName : stack1), depth0))
    + "</div>\r\n                                            <div style=\"margin: 0 auto\">"
    + alias5(((helper = (helper = helpers.startDateTime || (depth0 != null ? depth0.startDateTime : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"startDateTime","hash":{},"data":data}) : helper)))
    + "<br/>"
    + alias5(((helper = (helper = helpers.location || (depth0 != null ? depth0.location : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"location","hash":{},"data":data}) : helper)))
    + "\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                            </div>\r\n                                            \r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n\r\n\r\n                                <table class=\"table\">\r\n                                    <thead>\r\n                                        <tr class=\"predictionHeaderRow\">\r\n                                            <th><!--predictor--></th>\r\n                                            <th>"
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.rank : stack1), depth0))
    + " "
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "</th>\r\n                                            <th>"
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.rank : stack1), depth0))
    + " "
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "</th>\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.prediction : depth0),"||",(depth0 != null ? depth0.results : depth0),{"name":"ifCond","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                            <th>\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                            </th>\r\n                                        </tr>\r\n                                    </thead>\r\n                                    <tbody>\r\n                                        <tr class=\"predictionRow\">\r\n                                            <td>Me</td>\r\n                                            <td class=\"away-team-prediction "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" id=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-prediction\">\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"===","notStarted",{"name":"ifCond","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"!==","notStarted",{"name":"ifCond","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                            </td>\r\n                                            <td class=\"home-team-prediction"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" id=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-prediction\">\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"===","notStarted",{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"!==","notStarted",{"name":"ifCond","hash":{},"fn":container.program(34, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                            </td>\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.prediction : depth0),"||",(depth0 != null ? depth0.results : depth0),{"name":"ifCond","hash":{},"fn":container.program(37, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                            <td>\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(61, data, 0),"inverse":container.program(64, data, 0),"data":data})) != null ? stack1 : "")
    + "                                            </td>\r\n                                        </tr>\r\n                                        <!--\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),"===",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(71, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),"===",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(73, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        \r\n                                        -->\r\n                                    </tbody>\r\n                                </table>\r\n                                \r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";
},"useData":true});
})();