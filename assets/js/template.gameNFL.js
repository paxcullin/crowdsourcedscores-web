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
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.lambda, alias4=container.escapeExpression;

  return "                                <table class=\"table\">\n                                    <thead>\n                                    <tr>\n                                        <th></th>\n                                        <th>Me</th>\n"
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,(depth0 != null ? depth0.gameId : depth0),"===",1235067,{"name":"ifCond","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":52,"column":40},"end":{"line":54,"column":51}}})) != null ? stack1 : "")
    + "                                        <th class=\"compareHeader\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":55,"column":66},"end":{"line":55,"column":138}}})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":55,"column":138},"end":{"line":55,"column":187}}})) != null ? stack1 : "")
    + "</th>\n                                        <th>Odds</th>\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":57,"column":40},"end":{"line":57,"column":77}}})) != null ? stack1 : "")
    + "\n                                    </tr>\n                                    </thead>\n                                    <tbody>\n\n                                    <!-- Away Team Row -->\n                                    <tr class=\"predictionRow\">\n                                        <td><i class=\"fa fa-plane\" aria-hidden=\"true\"></i>"
    + alias4(alias3(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "</td>\n                                        <td class=\"away-team-prediction "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(22, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":65,"column":72},"end":{"line":65,"column":264}}})) != null ? stack1 : "")
    + "\" id=\""
    + ((stack1 = alias3(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-prediction\">\n"
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"===","notStarted",{"name":"ifCond","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":66,"column":44},"end":{"line":69,"column":55}}})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"!==","notStarted",{"name":"ifCond","hash":{},"fn":container.program(28, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":70,"column":44},"end":{"line":77,"column":55}}})) != null ? stack1 : "")
    + "                                        </td>\n                                        \n"
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,(depth0 != null ? depth0.gameId : depth0),"===",1235067,{"name":"ifCond","hash":{},"fn":container.program(34, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":80,"column":40},"end":{"line":125,"column":51}}})) != null ? stack1 : "")
    + "                                        <td"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(41, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":126,"column":43},"end":{"line":133,"column":47}}})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(49, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":134,"column":48},"end":{"line":149,"column":59}}})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(55, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":150,"column":48},"end":{"line":158,"column":55}}})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(58, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":159,"column":44},"end":{"line":165,"column":55}}})) != null ? stack1 : "")
    + "</td>\n                                        <td></td>\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(62, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":167,"column":40},"end":{"line":167,"column":97}}})) != null ? stack1 : "")
    + "\n                                    </tr>\n                                    <!-- Home Team Row -->\n                                    <tr class=\"predictionRow\">\n                                        <td><i class=\"fa fa-home\" aria-hidden=\"true\"></i> "
    + alias4(alias3(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "</td>\n                                        <td class=\"home-team-prediction"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(64, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":172,"column":71},"end":{"line":172,"column":263}}})) != null ? stack1 : "")
    + "\" id=\""
    + ((stack1 = alias3(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-prediction\">\n"
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"===","notStarted",{"name":"ifCond","hash":{},"fn":container.program(67, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":173,"column":44},"end":{"line":176,"column":55}}})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"!==","notStarted",{"name":"ifCond","hash":{},"fn":container.program(69, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":177,"column":44},"end":{"line":185,"column":55}}})) != null ? stack1 : "")
    + "                                        </td>\n"
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,(depth0 != null ? depth0.gameId : depth0),"===",1235067,{"name":"ifCond","hash":{},"fn":container.program(72, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":187,"column":40},"end":{"line":228,"column":51}}})) != null ? stack1 : "")
    + "                                        <td\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(81, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":230,"column":44},"end":{"line":243,"column":51}}})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(88, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":244,"column":44},"end":{"line":263,"column":55}}})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(94, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":264,"column":44},"end":{"line":271,"column":51}}})) != null ? stack1 : "")
    + "                                        </td>\n                                        <td>\n                                                <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(89, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":275,"column":52},"end":{"line":279,"column":63}}})) != null ? stack1 : "")
    + "                                                >\n                                                "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(97, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":281,"column":48},"end":{"line":281,"column":89}}})) != null ? stack1 : "")
    + alias4(alias3(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + "\n                                                </span>\n                                        </td>\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(99, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":284,"column":40},"end":{"line":284,"column":97}}})) != null ? stack1 : "")
    + "\n                                    </tr>\n                                    <!-- Total Row -->\n                                    <tr class=\"predictionRow\">\n                                        <td>Total</td>\n                                        <td"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(101, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":289,"column":43},"end":{"line":293,"column":47}}})) != null ? stack1 : "")
    + " id=\""
    + ((stack1 = alias3(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + ((stack1 = alias3(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-total-prediction\">\n                                        "
    + alias4(alias3(((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(104, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":295,"column":40},"end":{"line":299,"column":47}}})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"if","hash":{},"fn":container.program(107, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":300,"column":40},"end":{"line":302,"column":47}}})) != null ? stack1 : "")
    + "                                        </td>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(112, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":304,"column":40},"end":{"line":306,"column":51}}})) != null ? stack1 : "")
    + "                                        <td\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(114, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":308,"column":44},"end":{"line":318,"column":51}}})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(120, data, 0),"inverse":container.program(123, data, 0),"data":data,"loc":{"start":{"line":319,"column":44},"end":{"line":351,"column":51}}})) != null ? stack1 : "")
    + "                                        </td>\n                                        <td>\n                                            <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(132, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":355,"column":48},"end":{"line":359,"column":59}}})) != null ? stack1 : "")
    + ">"
    + alias4(alias3(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1), depth0))
    + "</span></td>\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(135, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":360,"column":40},"end":{"line":360,"column":88}}})) != null ? stack1 : "")
    + "\n                                    </tr>\n                                    <!-- Spread Row -->\n                                    <tr class=\"predictionRow\">\n                                        <td>Spread</td>\n                                        <td\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(137, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":366,"column":44},"end":{"line":369,"column":51}}})) != null ? stack1 : "")
    + " id=\""
    + ((stack1 = alias3(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + ((stack1 = alias3(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-spread-prediction\">\n                                                "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(97, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":370,"column":48},"end":{"line":370,"column":95}}})) != null ? stack1 : "")
    + alias4(alias3(((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(140, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":371,"column":48},"end":{"line":375,"column":55}}})) != null ? stack1 : "")
    + "                                                <!-- Show the side picked against the spread -->\n                                                <span style=\"font-size: 0.8em; font-weight: bold\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"if","hash":{},"fn":container.program(142, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":378,"column":52},"end":{"line":392,"column":59}}})) != null ? stack1 : "")
    + "                                                </span>\n                                        </td>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(112, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":395,"column":40},"end":{"line":397,"column":51}}})) != null ? stack1 : "")
    + "                                        <td\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(156, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":399,"column":44},"end":{"line":408,"column":51}}})) != null ? stack1 : "")
    + ">\n                                            \n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(162, data, 0),"inverse":container.program(170, data, 0),"data":data,"loc":{"start":{"line":410,"column":44},"end":{"line":466,"column":51}}})) != null ? stack1 : "")
    + "                                        </td>\n                                        <td>\n                                                <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(171, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":470,"column":52},"end":{"line":474,"column":63}}})) != null ? stack1 : "")
    + ">\n                                                "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"!=",0,{"name":"ifCond","hash":{},"fn":container.program(182, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":475,"column":48},"end":{"line":475,"column":145}}})) != null ? stack1 : "")
    + "\n                                                "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"===",0,{"name":"ifCond","hash":{},"fn":container.program(184, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":476,"column":48},"end":{"line":476,"column":94}}})) != null ? stack1 : "")
    + "</span></td>\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(186, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":477,"column":40},"end":{"line":477,"column":89}}})) != null ? stack1 : "")
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

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":65,"column":87},"end":{"line":65,"column":257}}})) != null ? stack1 : "");
},"23":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(24, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":65,"column":148},"end":{"line":65,"column":246}}})) != null ? stack1 : "");
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
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":71,"column":48},"end":{"line":71,"column":167}}})) != null ? stack1 : "")
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(31, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":72,"column":48},"end":{"line":76,"column":55}}})) != null ? stack1 : "");
},"29":function(container,depth0,helpers,partials,data) {
    return "<i class=\"fas fa-angle-double-right\"></i>";
},"31":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":73,"column":52},"end":{"line":75,"column":63}}})) != null ? stack1 : "");
},"32":function(container,depth0,helpers,partials,data) {
    return "                                                        <sup><i class=\"fas fa-bullseye\"></i></sup>\n";
},"34":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing;

  return "                                        <td class=\"quarters awayQuarters\">\n"
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"===","notStarted",{"name":"ifCond","hash":{},"fn":container.program(35, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":82,"column":44},"end":{"line":91,"column":55}}})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"!==","notStarted",{"name":"ifCond","hash":{},"fn":container.program(37, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":92,"column":44},"end":{"line":123,"column":55}}})) != null ? stack1 : "")
    + "                                        </td>\n";
},"35":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, alias5="function";

  return "                                            <span class=\"visible-xs\">Q1: </span><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data,"loc":{"start":{"line":84,"column":95},"end":{"line":84,"column":105}}}) : helper)))
    + "-away-team-q1-prediction\">\n                                            <span class=\"visible-xs\">Q2: </span><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q2 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data,"loc":{"start":{"line":86,"column":95},"end":{"line":86,"column":105}}}) : helper)))
    + "-away-team-q2-prediction\">\n                                            <span class=\"visible-xs\">Q3: </span><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q3 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data,"loc":{"start":{"line":88,"column":95},"end":{"line":88,"column":105}}}) : helper)))
    + "-away-team-q3-prediction\">\n                                            <span class=\"visible-xs\">Q4: </span><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q4 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data,"loc":{"start":{"line":90,"column":95},"end":{"line":90,"column":105}}}) : helper)))
    + "-away-team-q4-prediction\">\n";
},"37":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1),{"name":"if","hash":{},"fn":container.program(38, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":93,"column":48},"end":{"line":122,"column":55}}})) != null ? stack1 : "");
},"38":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing;

  return "                                                <span class=\"visible-xs\">Q1:<br></span>\n                                                    <span class=\"quarterResults\">\n                                                        "
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1), depth0))
    + "\n"
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias4).call(alias3,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1),"===",((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1),{"name":"ifCond","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":97,"column":56},"end":{"line":99,"column":67}}})) != null ? stack1 : "")
    + "                                                    </span>\n                                                <span class=\"visible-xs\">Q2:<br></span>\n                                                    <span class=\"quarterResults\">\n                                                        "
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q2 : stack1), depth0))
    + "\n"
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias4).call(alias3,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q2 : stack1),"===",((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q2 : stack1),{"name":"ifCond","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":104,"column":56},"end":{"line":106,"column":67}}})) != null ? stack1 : "")
    + "                                                    </span>\n                                                <span class=\"visible-xs\">Q3:<br></span>\n                                                    <span class=\"quarterResults\">\n                                                        "
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q3 : stack1), depth0))
    + "\n"
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias4).call(alias3,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q3 : stack1),"===",((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q3 : stack1),{"name":"ifCond","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":111,"column":56},"end":{"line":113,"column":67}}})) != null ? stack1 : "")
    + "                                                    </span>\n                                                <span class=\"visible-xs\">Q4:<br></span>\n                                                    <span class=\"quarterResults\">\n                                                        "
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q4 : stack1), depth0))
    + "\n"
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias4).call(alias3,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q4 : stack1),"===",((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q4 : stack1),{"name":"ifCond","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":118,"column":56},"end":{"line":120,"column":67}}})) != null ? stack1 : "")
    + "                                                    </span>\n";
},"39":function(container,depth0,helpers,partials,data) {
    return "                                                            <sup><i class=\"fas fa-bullseye\"></i></sup>\n";
},"41":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(42, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":127,"column":44},"end":{"line":129,"column":55}}})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(46, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":130,"column":44},"end":{"line":132,"column":51}}})) != null ? stack1 : "")
    + "                                        ";
},"42":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(43, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":128,"column":48},"end":{"line":128,"column":209}}})) != null ? stack1 : "")
    + "\n";
},"43":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(44, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":128,"column":109},"end":{"line":128,"column":198}}})) != null ? stack1 : "");
},"44":function(container,depth0,helpers,partials,data) {
    return " class=\"crowdCorrect\"";
},"46":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(47, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":131,"column":48},"end":{"line":131,"column":233}}})) != null ? stack1 : "")
    + "\n";
},"47":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(44, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":131,"column":109},"end":{"line":131,"column":222}}})) != null ? stack1 : "");
},"49":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(50, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":136,"column":52},"end":{"line":140,"column":63}}})) != null ? stack1 : "")
    + ">\n                                                    "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":141,"column":52},"end":{"line":141,"column":161}}})) != null ? stack1 : "")
    + "\n                                                    "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(53, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":143,"column":52},"end":{"line":147,"column":59}}})) != null ? stack1 : "")
    + "                                                </span>\n";
},"50":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(51, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":137,"column":56},"end":{"line":139,"column":67}}})) != null ? stack1 : "")
    + "                                                    ";
},"51":function(container,depth0,helpers,partials,data) {
    return "                                                            class=\"crowdHidden\"\n";
},"53":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":144,"column":56},"end":{"line":146,"column":67}}})) != null ? stack1 : "");
},"55":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                    "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":151,"column":52},"end":{"line":151,"column":185}}})) != null ? stack1 : "")
    + "\n                                                    "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(56, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":153,"column":52},"end":{"line":157,"column":59}}})) != null ? stack1 : "");
},"56":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":154,"column":56},"end":{"line":156,"column":67}}})) != null ? stack1 : "");
},"58":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(59, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":160,"column":48},"end":{"line":164,"column":59}}})) != null ? stack1 : "")
    + "                                            ";
},"59":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(60, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":161,"column":52},"end":{"line":163,"column":63}}})) != null ? stack1 : "");
},"60":function(container,depth0,helpers,partials,data) {
    return "                                                        <div style=\"width:40%; position: relative; left: 30%\">Predict to Access Crowd Wisdom</div>\n";
},"62":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<td>"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "</td>";
},"64":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(65, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":172,"column":86},"end":{"line":172,"column":256}}})) != null ? stack1 : "");
},"65":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(24, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":172,"column":147},"end":{"line":172,"column":245}}})) != null ? stack1 : "");
},"67":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression;

  return "                                                <input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput\" placeholder=\"##\"\n                                                value=\""
    + alias1(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\" id=\""
    + alias1(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"gameId","hash":{},"data":data,"loc":{"start":{"line":175,"column":90},"end":{"line":175,"column":100}}}) : helper)))
    + "-home-team-prediction\">\n";
},"69":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"<",((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":178,"column":48},"end":{"line":178,"column":167}}})) != null ? stack1 : "")
    + "\n                                                "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(70, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":180,"column":48},"end":{"line":184,"column":55}}})) != null ? stack1 : "");
},"70":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":181,"column":52},"end":{"line":183,"column":63}}})) != null ? stack1 : "");
},"72":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing;

  return "                                            <td class=\"quarters homeQuarters\">\n"
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"===","notStarted",{"name":"ifCond","hash":{},"fn":container.program(73, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":189,"column":48},"end":{"line":198,"column":59}}})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"!==","notStarted",{"name":"ifCond","hash":{},"fn":container.program(75, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":199,"column":48},"end":{"line":226,"column":59}}})) != null ? stack1 : "")
    + "                                            </td>\n";
},"73":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, alias5="function";

  return "                                                <span class=\"visible-xs\">Q1: </span><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                    value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data,"loc":{"start":{"line":191,"column":99},"end":{"line":191,"column":109}}}) : helper)))
    + "-home-team-q1-prediction\">\n                                                <span class=\"visible-xs\">Q2: </span><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                    value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q2 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data,"loc":{"start":{"line":193,"column":99},"end":{"line":193,"column":109}}}) : helper)))
    + "-home-team-q2-prediction\">\n                                                <span class=\"visible-xs\">Q3: </span><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                    value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q3 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data,"loc":{"start":{"line":195,"column":99},"end":{"line":195,"column":109}}}) : helper)))
    + "-home-team-q3-prediction\">\n                                                <span class=\"visible-xs\">Q4: </span><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                    value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q4 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data,"loc":{"start":{"line":197,"column":99},"end":{"line":197,"column":109}}}) : helper)))
    + "-home-team-q4-prediction\">\n";
},"75":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1),{"name":"if","hash":{},"fn":container.program(76, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":200,"column":52},"end":{"line":225,"column":59}}})) != null ? stack1 : "");
},"76":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing;

  return "                                                    <span class=\"visible-xs\">Q1:<br></span>\n                                                        <span class=\"quarterResults\">"
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1), depth0))
    + "\n"
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias4).call(alias3,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1),"===",((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1),{"name":"ifCond","hash":{},"fn":container.program(77, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":203,"column":60},"end":{"line":205,"column":71}}})) != null ? stack1 : "")
    + "</span>\n                                                    <span class=\"visible-xs\">Q2:<br></span>\n                                                        <span class=\"quarterResults\">"
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q2 : stack1), depth0))
    + "\n"
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias4).call(alias3,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q2 : stack1),"===",((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q2 : stack1),{"name":"ifCond","hash":{},"fn":container.program(79, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":208,"column":60},"end":{"line":210,"column":71}}})) != null ? stack1 : "")
    + "                                                        </span>\n                                                    <span class=\"visible-xs\">Q3:<br></span>\n                                                        <span class=\"quarterResults\">"
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q3 : stack1), depth0))
    + "\n"
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias4).call(alias3,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q3 : stack1),"===",((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q3 : stack1),{"name":"ifCond","hash":{},"fn":container.program(79, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":214,"column":60},"end":{"line":216,"column":71}}})) != null ? stack1 : "")
    + "                                                        </span>\n                                                    <span class=\"visible-xs\">Q4:<br></span>\n                                                        <span class=\"quarterResults\">\n                                                            "
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q4 : stack1), depth0))
    + "\n"
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias4).call(alias3,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q4 : stack1),"===",((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q4 : stack1),{"name":"ifCond","hash":{},"fn":container.program(79, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":221,"column":60},"end":{"line":223,"column":71}}})) != null ? stack1 : "")
    + "                                                        </span>\n";
},"77":function(container,depth0,helpers,partials,data) {
    return "                                                                <sup><i class=\"fas fa-bullseye\"></i></sup>\n                                                            ";
},"79":function(container,depth0,helpers,partials,data) {
    return "                                                                <sup><i class=\"fas fa-bullseye\"></i></sup>\n";
},"81":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(82, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":231,"column":52},"end":{"line":242,"column":63}}})) != null ? stack1 : "")
    + "                                            ";
},"82":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(83, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":232,"column":56},"end":{"line":236,"column":67}}})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(86, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":237,"column":56},"end":{"line":241,"column":63}}})) != null ? stack1 : "");
},"83":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(84, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":233,"column":60},"end":{"line":235,"column":71}}})) != null ? stack1 : "");
},"84":function(container,depth0,helpers,partials,data) {
    return "                                                            class=\"crowdCorrect\"\n";
},"86":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(84, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":238,"column":60},"end":{"line":240,"column":71}}})) != null ? stack1 : "");
},"88":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(89, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":246,"column":52},"end":{"line":250,"column":63}}})) != null ? stack1 : "")
    + "                                                >"
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"<",((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":251,"column":49},"end":{"line":251,"column":158}}})) != null ? stack1 : "")
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(92, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":252,"column":48},"end":{"line":256,"column":55}}})) != null ? stack1 : "")
    + "                                                </span>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(59, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":258,"column":48},"end":{"line":262,"column":59}}})) != null ? stack1 : "");
},"89":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(90, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":247,"column":56},"end":{"line":249,"column":67}}})) != null ? stack1 : "");
},"90":function(container,depth0,helpers,partials,data) {
    return "                                                        class=\"crowdHidden\"\n";
},"92":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":253,"column":52},"end":{"line":255,"column":63}}})) != null ? stack1 : "");
},"94":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"<",((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":265,"column":48},"end":{"line":265,"column":181}}})) != null ? stack1 : "")
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(95, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":266,"column":48},"end":{"line":270,"column":55}}})) != null ? stack1 : "");
},"95":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":267,"column":52},"end":{"line":269,"column":63}}})) != null ? stack1 : "");
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
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.results : stack1)) != null ? stack1.total : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(102, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":290,"column":44},"end":{"line":292,"column":55}}})) != null ? stack1 : "")
    + "                                        ";
},"102":function(container,depth0,helpers,partials,data) {
    return "                                                class=\"alert alert-success\"\n";
},"104":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(105, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":296,"column":44},"end":{"line":298,"column":55}}})) != null ? stack1 : "");
},"105":function(container,depth0,helpers,partials,data) {
    return "                                                <sup><i class=\"fas fa-bullseye\"></i></sup>\n";
},"107":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing;

  return "                                        <span style=\"font-size: 0.8em; font-weight: bold\">"
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),">",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(108, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":301,"column":90},"end":{"line":301,"column":165}}})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),"<",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(110, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":301,"column":165},"end":{"line":301,"column":240}}})) != null ? stack1 : "")
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
    return "                                        <td></td>\n";
},"114":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(115, data, 0),"inverse":container.program(118, data, 0),"data":data,"loc":{"start":{"line":309,"column":48},"end":{"line":317,"column":55}}})) != null ? stack1 : "")
    + "                                            ";
},"115":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.results : stack1)) != null ? stack1.total : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(116, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":310,"column":52},"end":{"line":312,"column":63}}})) != null ? stack1 : "");
},"116":function(container,depth0,helpers,partials,data) {
    return "                                                        class=\"crowdCorrect\"\n";
},"118":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.results : stack1)) != null ? stack1.total : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(116, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":314,"column":52},"end":{"line":316,"column":63}}})) != null ? stack1 : "");
},"120":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.total : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(121, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":321,"column":48},"end":{"line":325,"column":55}}})) != null ? stack1 : "");
},"121":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.total : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":322,"column":52},"end":{"line":324,"column":63}}})) != null ? stack1 : "");
},"123":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                <span"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(124, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":327,"column":53},"end":{"line":330,"column":59}}})) != null ? stack1 : "")
    + ">\n                                                "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.total : stack1), depth0))
    + "\n                                                <span style=\"font-size: 0.8em; font-weight: bold\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(127, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":333,"column":52},"end":{"line":337,"column":59}}})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.total : stack1),{"name":"if","hash":{},"fn":container.program(129, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":338,"column":52},"end":{"line":343,"column":59}}})) != null ? stack1 : "")
    + "</span>\n\n                                                </span>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(59, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":346,"column":48},"end":{"line":350,"column":59}}})) != null ? stack1 : "");
},"124":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n                                                    "
    + ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(125, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":328,"column":52},"end":{"line":329,"column":63}}})) != null ? stack1 : "")
    + "                                                ";
},"125":function(container,depth0,helpers,partials,data) {
    return " class=\"crowdHidden\"\n";
},"127":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.total : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":334,"column":56},"end":{"line":336,"column":67}}})) != null ? stack1 : "");
},"129":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"if","hash":{},"fn":container.program(130, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":339,"column":52},"end":{"line":342,"column":59}}})) != null ? stack1 : "")
    + "                                                    ";
},"130":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing;

  return "                                                        "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.total : stack1),">",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(108, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":340,"column":56},"end":{"line":340,"column":126}}})) != null ? stack1 : "")
    + "\n                                                        "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.total : stack1),"<",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(110, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":341,"column":56},"end":{"line":341,"column":126}}})) != null ? stack1 : "")
    + "\n";
},"132":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(133, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":356,"column":52},"end":{"line":358,"column":63}}})) != null ? stack1 : "")
    + "                                                ";
},"133":function(container,depth0,helpers,partials,data) {
    return "                                                    class=\"crowdHidden\"\n";
},"135":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<td>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.total : stack1), depth0))
    + "</td>";
},"137":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.results : stack1)) != null ? stack1.spread : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(138, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":367,"column":48},"end":{"line":368,"column":59}}})) != null ? stack1 : "")
    + "                                            ";
},"138":function(container,depth0,helpers,partials,data) {
    return " class=\"alert alert-success\"\n";
},"140":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":372,"column":52},"end":{"line":374,"column":63}}})) != null ? stack1 : "");
},"142":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),">",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(143, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":379,"column":56},"end":{"line":385,"column":67}}})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),"<",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(151, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":386,"column":56},"end":{"line":391,"column":67}}})) != null ? stack1 : "");
},"143":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing;

  return "                                                            <br>("
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "\n                                                                <!-- Format the odds -->\n                                                                "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"<",0,{"name":"ifCond","hash":{},"fn":container.program(144, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":382,"column":64},"end":{"line":382,"column":143}}})) != null ? stack1 : "")
    + "\n                                                                "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(147, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":383,"column":64},"end":{"line":383,"column":142}}})) != null ? stack1 : "")
    + "\n                                                                "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"===",0,{"name":"ifCond","hash":{},"fn":container.program(149, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":384,"column":64},"end":{"line":384,"column":109}}})) != null ? stack1 : "")
    + "\n";
},"144":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "+"
    + ((stack1 = (helpers.math||(depth0 && depth0.math)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"*",-1,{"name":"math","hash":{},"fn":container.program(145, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":382,"column":94},"end":{"line":382,"column":131}}})) != null ? stack1 : "")
    + ")";
},"145":function(container,depth0,helpers,partials,data) {
    return "";
},"147":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.math||(depth0 && depth0.math)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"*",-1,{"name":"math","hash":{},"fn":container.program(145, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":383,"column":93},"end":{"line":383,"column":130}}})) != null ? stack1 : "")
    + ")";
},"149":function(container,depth0,helpers,partials,data) {
    return "EV)";
},"151":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing;

  return "                                                            <br>("
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "\n                                                                "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"<",0,{"name":"ifCond","hash":{},"fn":container.program(152, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":388,"column":64},"end":{"line":388,"column":120}}})) != null ? stack1 : "")
    + "\n                                                                "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(154, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":389,"column":64},"end":{"line":389,"column":121}}})) != null ? stack1 : "")
    + "\n                                                                "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"===",0,{"name":"ifCond","hash":{},"fn":container.program(149, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":390,"column":64},"end":{"line":390,"column":109}}})) != null ? stack1 : "")
    + "\n";
},"152":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + ")";
},"154":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "+"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + ")";
},"156":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(157, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":400,"column":48},"end":{"line":403,"column":59}}})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(160, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":404,"column":48},"end":{"line":407,"column":55}}})) != null ? stack1 : "")
    + "                                            ";
},"157":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                    "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.results : stack1)) != null ? stack1.spread : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(158, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":401,"column":52},"end":{"line":402,"column":63}}})) != null ? stack1 : "");
},"158":function(container,depth0,helpers,partials,data) {
    return " class=\"crowdCorrect\"\n";
},"160":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                    "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.results : stack1)) != null ? stack1.spread : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(158, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":405,"column":52},"end":{"line":406,"column":63}}})) != null ? stack1 : "");
},"162":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing;

  return "                                                "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(97, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":411,"column":48},"end":{"line":411,"column":102}}})) != null ? stack1 : "")
    + "\n                                                "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.spread : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(163, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":413,"column":48},"end":{"line":417,"column":55}}})) != null ? stack1 : "")
    + "                                                <span style=\"font-size: 0.8em; font-weight: bold\">\n"
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.spread : stack1),">",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(165, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":419,"column":52},"end":{"line":422,"column":63}}})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.spread : stack1),"<",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(168, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":423,"column":52},"end":{"line":425,"column":63}}})) != null ? stack1 : "")
    + "                                                </span>\n";
},"163":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.spread : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":414,"column":52},"end":{"line":416,"column":63}}})) != null ? stack1 : "");
},"165":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "                                                        <br>("
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + " "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(166, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":420,"column":79},"end":{"line":421,"column":92}}})) != null ? stack1 : "")
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + ")\n";
},"166":function(container,depth0,helpers,partials,data) {
    return "\n                                                                                -";
},"168":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "                                                        <br>("
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + " "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(97, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":424,"column":79},"end":{"line":424,"column":120}}})) != null ? stack1 : "")
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + ")\n";
},"170":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(171, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":429,"column":52},"end":{"line":433,"column":63}}})) != null ? stack1 : "")
    + ">\n                                                        "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(97, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":434,"column":56},"end":{"line":434,"column":98}}})) != null ? stack1 : "")
    + "\n                                                        "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(173, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":436,"column":56},"end":{"line":440,"column":63}}})) != null ? stack1 : "")
    + "                                                        <span style=\"font-size: 0.8em; font-weight: bold\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1),{"name":"if","hash":{},"fn":container.program(175, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":442,"column":60},"end":{"line":457,"column":67}}})) != null ? stack1 : "")
    + "                                                        </span>\n\n                                                </span>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(59, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":461,"column":48},"end":{"line":465,"column":59}}})) != null ? stack1 : "");
},"171":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(90, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":430,"column":56},"end":{"line":432,"column":67}}})) != null ? stack1 : "")
    + "                                                    ";
},"173":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(79, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":437,"column":60},"end":{"line":439,"column":71}}})) != null ? stack1 : "");
},"175":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"if","hash":{},"fn":container.program(176, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":443,"column":60},"end":{"line":456,"column":67}}})) != null ? stack1 : "");
},"176":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1),">",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(177, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":444,"column":64},"end":{"line":449,"column":75}}})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1),"<",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(180, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":450,"column":64},"end":{"line":455,"column":75}}})) != null ? stack1 : "");
},"177":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing;

  return "                                                                    <br>("
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + " \n                                                                    "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"<",0,{"name":"ifCond","hash":{},"fn":container.program(144, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":446,"column":68},"end":{"line":446,"column":147}}})) != null ? stack1 : "")
    + "\n                                                                    "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(147, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":447,"column":68},"end":{"line":447,"column":146}}})) != null ? stack1 : "")
    + "\n                                                                    "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"===",0,{"name":"ifCond","hash":{},"fn":container.program(178, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":448,"column":68},"end":{"line":448,"column":128}}})) != null ? stack1 : "")
    + "\n";
},"178":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "EV"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + ")";
},"180":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing;

  return "                                                                    <br>("
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "\n                                                                    "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"<",0,{"name":"ifCond","hash":{},"fn":container.program(152, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":452,"column":68},"end":{"line":452,"column":124}}})) != null ? stack1 : "")
    + "\n                                                                    "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(154, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":453,"column":68},"end":{"line":453,"column":125}}})) != null ? stack1 : "")
    + "\n                                                                    "
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"===",0,{"name":"ifCond","hash":{},"fn":container.program(149, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":454,"column":68},"end":{"line":454,"column":113}}})) != null ? stack1 : "")
    + "\n";
},"182":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(97, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":475,"column":78},"end":{"line":475,"column":119}}})) != null ? stack1 : "")
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0));
},"184":function(container,depth0,helpers,partials,data) {
    return "Even";
},"186":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<td>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.spread : stack1), depth0))
    + "</td>";
},"188":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                <!--No prediction-->\n"
    + ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(189, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":484,"column":36},"end":{"line":534,"column":47}}})) != null ? stack1 : "");
},"189":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "                                        <!--no results -->\n                                            <table class=\"table\">\n                                                <thead>\n                                                <tr>\n                                                    <th><i class=\"fa fa-plane\" aria-hidden=\"true\"></i>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "</th>\n                                                    <th><i class=\"fa fa-home\" aria-hidden=\"true\"></i>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "</th>\n                                                </tr>\n                                                </thead>\n                                                <tbody>\n\n                                                <!-- Initial Prediction Row -->\n                                                <tr class=\"predictionRow\">\n                                                    <td class=\"away-team-prediction\">\n                                                        <input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput\" placeholder=\"##\"\n                                                            value=\""
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\">\n                                                    </td>\n                                                    <td class=\"home-team-prediction\">\n                                                        <input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput\" placeholder=\"##\"\n                                                            value=\""
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\">\n                                                    </td>\n                                                </tr>\n"
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.gameId : depth0),"===",1235067,{"name":"ifCond","hash":{},"fn":container.program(190, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":506,"column":48},"end":{"line":531,"column":59}}})) != null ? stack1 : "")
    + "                                                </tbody>\n                                            </table>\n";
},"190":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, alias5="function";

  return "                                                \n                                                <!-- Initial Prediction Quarters Row -->\n                                                <tr class=\"predictionRow\">\n                                                    <td class=\"away-team-prediction\">\n                                                        <span class=\"quarterLabel\">Q1</span><br><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                            value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data,"loc":{"start":{"line":512,"column":107},"end":{"line":512,"column":117}}}) : helper)))
    + "-away-team-q1-prediction\">\n                                                        <span class=\"quarterLabel\">Q2</span><br><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                            value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q2 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data,"loc":{"start":{"line":514,"column":107},"end":{"line":514,"column":117}}}) : helper)))
    + "-away-team-q2-prediction\">\n                                                        <span class=\"quarterLabel\">Q3</span><br><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                            value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q3 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data,"loc":{"start":{"line":516,"column":107},"end":{"line":516,"column":117}}}) : helper)))
    + "-away-team-q3-prediction\">\n                                                        <span class=\"quarterLabel\">Q4</span><br><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                            value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q4 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data,"loc":{"start":{"line":518,"column":107},"end":{"line":518,"column":117}}}) : helper)))
    + "-away-team-q4-prediction\">\n                                                    </td>\n                                                    <td class=\"home-team-prediction\">\n                                                        <span class=\"quarterLabel\">Q1</span><br><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                            value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q1 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data,"loc":{"start":{"line":522,"column":107},"end":{"line":522,"column":117}}}) : helper)))
    + "-home-team-q1-prediction\">\n                                                        <span class=\"quarterLabel\">Q2</span><br><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                            value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q2 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data,"loc":{"start":{"line":524,"column":107},"end":{"line":524,"column":117}}}) : helper)))
    + "-home-team-q2-prediction\">\n                                                        <span class=\"quarterLabel\">Q3</span><br><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                            value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q3 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data,"loc":{"start":{"line":526,"column":107},"end":{"line":526,"column":117}}}) : helper)))
    + "-home-team-q3-prediction\">\n                                                        <span class=\"quarterLabel\">Q4</span><br><input type=\"number\" min=\"0\" max=\"70\" class=\"form-control predictionInput predictionQuarterInput\" placeholder=\"##\"\n                                                            value=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.periods : stack1)) != null ? stack1.q4 : stack1), depth0))
    + "\" id=\""
    + alias2(((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"gameId","hash":{},"data":data,"loc":{"start":{"line":528,"column":107},"end":{"line":528,"column":117}}}) : helper)))
    + "-home-team-q4-prediction\">\n                                                    </td>\n                                                </tr>\n";
},"192":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.userAuthenticated : depth0),{"name":"if","hash":{},"fn":container.program(193, data, 0),"inverse":container.program(199, data, 0),"data":data,"loc":{"start":{"line":539,"column":36},"end":{"line":554,"column":43}}})) != null ? stack1 : "");
},"193":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.dateCheck||(depth0 && depth0.dateCheck)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.startDateTime : depth0),{"name":"dateCheck","hash":{},"fn":container.program(194, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":540,"column":40},"end":{"line":549,"column":54}}})) != null ? stack1 : "");
},"194":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing;

  return "                                            <button class=\"prediction-btn btn btn-info\">Predict</button>\n                                            \n"
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),"===",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(195, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":543,"column":44},"end":{"line":545,"column":55}}})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),"===",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(197, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":546,"column":44},"end":{"line":548,"column":55}}})) != null ? stack1 : "");
},"195":function(container,depth0,helpers,partials,data) {
    return "                                                <br><sup><i class=\"fas fa-exclamation-triangle total\"></i><span class=\"warningTextTotal\">Your total matches the odds total.</span></sup>\n";
},"197":function(container,depth0,helpers,partials,data) {
    return "                                                <br><sup><i class=\"fas fa-exclamation-triangle spread\"></i><span class=\"warningTextSpread\">Your spread matches the odds spread.</span></sup>\n";
},"199":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.dateCheck||(depth0 && depth0.dateCheck)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.startDateTime : depth0),{"name":"dateCheck","hash":{},"fn":container.program(200, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":551,"column":40},"end":{"line":553,"column":54}}})) != null ? stack1 : "");
},"200":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                                            <button type=\"button\" class=\"btn btn-info\" onclick=\"ga('send','event','login','loginClicked');window.location=('https://crowdsourcedscores.auth.us-west-2.amazoncognito.com/login?response_type=code&client_id=2n15lhk845sucm0k4fejjqcbev&redirect_uri=https://"
    + container.escapeExpression(((helper = (helper = helpers.getWindowLocation || (depth0 != null ? depth0.getWindowLocation : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"getWindowLocation","hash":{},"data":data,"loc":{"start":{"line":552,"column":299},"end":{"line":552,"column":320}}}) : helper)))
    + "')\">Log in to Predict</button>\n";
},"202":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                        <div class=\"predictionScore myResultsRow\">My Score: "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.predictionScore : stack1), depth0))
    + " <i class=\"fas fa-info-circle\" data-toggle=\"modal\" data-target=\"#predictionScoreModal\"></i></div>\n";
},"204":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.predictionScore : stack1),">",-1,{"name":"ifCond","hash":{},"fn":container.program(205, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":560,"column":44},"end":{"line":562,"column":51}}})) != null ? stack1 : "");
},"205":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                            <div class=\"predictionScore crowdResultsRow\">Crowd Score: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.results : stack1)) != null ? stack1.predictionScore : stack1), depth0))
    + " <i class=\"fas fa-info-circle\" data-toggle=\"modal\" data-target=\"#predictionScoreModal\"></i></div>\n";
},"207":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.predictionScore : stack1),">",-1,{"name":"ifCond","hash":{},"fn":container.program(208, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":565,"column":44},"end":{"line":567,"column":51}}})) != null ? stack1 : "");
},"208":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "                                            <div class=\"predictionScore crowdResultsRow\"><span class=\"compareHeader\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.preferred_username : stack1), depth0))
    + "</span> Score: "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.predictionScore : stack1), depth0))
    + " <i class=\"fas fa-info-circle\" data-toggle=\"modal\" data-target=\"#predictionScoreModal\"></i></div>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.lambda, alias5=container.escapeExpression;

  return "<div class=\"card prediction\" style=\"margin-bottom:10px;min-width: 293px;\" data-game-id=\""
    + ((stack1 = ((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameId","hash":{},"data":data,"loc":{"start":{"line":1,"column":88},"end":{"line":1,"column":100}}}) : helper))) != null ? stack1 : "")
    + "\"\n    data-game-week=\""
    + ((stack1 = ((helper = (helper = helpers.gameWeek || (depth0 != null ? depth0.gameWeek : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameWeek","hash":{},"data":data,"loc":{"start":{"line":2,"column":20},"end":{"line":2,"column":34}}}) : helper))) != null ? stack1 : "")
    + "\"\n    data-game-year=\""
    + ((stack1 = ((helper = (helper = helpers.year || (depth0 != null ? depth0.year : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"year","hash":{},"data":data,"loc":{"start":{"line":3,"column":20},"end":{"line":3,"column":30}}}) : helper))) != null ? stack1 : "")
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
    + ((stack1 = ((helper = (helper = helpers.sport || (depth0 != null ? depth0.sport : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"sport","hash":{},"data":data,"loc":{"start":{"line":8,"column":21},"end":{"line":8,"column":32}}}) : helper))) != null ? stack1 : "")
    + "\"\n    data-game-season=\""
    + ((stack1 = ((helper = (helper = helpers.season || (depth0 != null ? depth0.season : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"season","hash":{},"data":data,"loc":{"start":{"line":9,"column":22},"end":{"line":9,"column":34}}}) : helper))) != null ? stack1 : "")
    + "\"\n    "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":10,"column":4},"end":{"line":10,"column":67}}})) != null ? stack1 : "")
    + "\n    style=\"display: inline-block;\">\n    <div class=\"panel-group\" id=\""
    + ((stack1 = ((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameId","hash":{},"data":data,"loc":{"start":{"line":12,"column":33},"end":{"line":12,"column":45}}}) : helper))) != null ? stack1 : "")
    + "-accordion\" role=\"tablist\" aria-multiselectable=\"true\">\n        <div class=\"panel panel-default\">\n            <div class=\"panel-heading\" role=\"tab\" id=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-heading\">\n                <h4 class=\"panel-title\">\n                    <a role=\"button\" data-toggle=\"collapse\" data-parent=\"#"
    + ((stack1 = ((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameId","hash":{},"data":data,"loc":{"start":{"line":16,"column":74},"end":{"line":16,"column":86}}}) : helper))) != null ? stack1 : "")
    + "-accordion\" href=\"#"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "\" aria-expanded=\"true\" aria-controls=\""
    + ((stack1 = ((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameId","hash":{},"data":data,"loc":{"start":{"line":16,"column":182},"end":{"line":16,"column":194}}}) : helper))) != null ? stack1 : "")
    + "\">\n                        <span class=\"hidden-md\">"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.fullName : stack1), depth0)) != null ? stack1 : "")
    + " vs. "
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.fullName : stack1), depth0)) != null ? stack1 : "")
    + "</span>\n                        <span class=\"visible-md\">"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.shortName : stack1), depth0)) != null ? stack1 : "")
    + " vs. "
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.shortName : stack1), depth0)) != null ? stack1 : "")
    + "</span>\n"
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),"===",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":19,"column":24},"end":{"line":21,"column":35}}})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),"===",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":22,"column":24},"end":{"line":24,"column":35}}})) != null ? stack1 : "")
    + "                    </a>\n\n                </h4>\n            </div>\n            <div id=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "\" class=\"panel-collapse collapse in\" role=\"tabpanel\" aria-labelledby=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-"
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-heading\">\n                <div class=\"panel-body\">\n                    <div class=\"content\">\n                        <div class=\"tab-content text-center\">\n                            <div class=\"tab-pane active\">\n                                <div class=\"prediction-message\" data-game-id=\""
    + ((stack1 = ((helper = (helper = helpers.gameId || (depth0 != null ? depth0.gameId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameId","hash":{},"data":data,"loc":{"start":{"line":34,"column":78},"end":{"line":34,"column":90}}}) : helper))) != null ? stack1 : "")
    + "\"></div>\n                                <div>\n                                    <div class=\"form-group\">\n                                        <div class=\"gameHeader"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":37,"column":62},"end":{"line":37,"column":107}}})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":37,"column":107},"end":{"line":37,"column":163}}})) != null ? stack1 : "")
    + "\">\n                                            <span style=\"float:left\">"
    + alias5(((helper = (helper = helpers.startDateTime || (depth0 != null ? depth0.startDateTime : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"startDateTime","hash":{},"data":data,"loc":{"start":{"line":38,"column":69},"end":{"line":38,"column":86}}}) : helper)))
    + "<br/>"
    + alias5(((helper = (helper = helpers.tvStation || (depth0 != null ? depth0.tvStation : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"tvStation","hash":{},"data":data,"loc":{"start":{"line":38,"column":91},"end":{"line":38,"column":104}}}) : helper)))
    + "</span>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":39,"column":44},"end":{"line":41,"column":51}}})) != null ? stack1 : "")
    + "                                        </div>\n                                    </div>\n                                </div>\n\n"
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,(depth0 != null ? depth0.prediction : depth0),"||",(depth0 != null ? depth0.results : depth0),{"name":"ifCond","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":46,"column":32},"end":{"line":481,"column":43}}})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(188, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":482,"column":32},"end":{"line":535,"column":43}}})) != null ? stack1 : "")
    + "                                \n                                <div>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(192, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":538,"column":32},"end":{"line":555,"column":43}}})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond||(depth0 && depth0.ifCond)||alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.predictionScore : stack1),">",-1,{"name":"ifCond","hash":{},"fn":container.program(202, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":556,"column":36},"end":{"line":558,"column":47}}})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(204, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":559,"column":36},"end":{"line":563,"column":47}}})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(207, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":564,"column":36},"end":{"line":568,"column":43}}})) != null ? stack1 : "")
    + "                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>";
},"useData":true});
})();