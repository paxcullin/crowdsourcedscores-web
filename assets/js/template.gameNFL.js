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
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.preferred_username : stack1), depth0));
},"15":function(container,depth0,helpers,partials,data) {
    return "The Crowd";
},"17":function(container,depth0,helpers,partials,data) {
    return "<th>Actual</th>";
},"19":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"20":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"21":function(container,depth0,helpers,partials,data) {
    return " alert alert-success";
},"23":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                <input type=\"number\" min=\"0\" max=\"50\" class=\"form-control predictionInput\" placeholder=\"##\"\n                                                value=\""
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\">\n";
},"25":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(28, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"26":function(container,depth0,helpers,partials,data) {
    return "<i class=\"fas fa-angle-double-right\"></i>";
},"28":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"29":function(container,depth0,helpers,partials,data) {
    return "                                                        <sup><i class=\"fas fa-bullseye\"></i></sup>\n";
},"31":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(36, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        ";
},"32":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(33, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"33":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(34, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"34":function(container,depth0,helpers,partials,data) {
    return " class=\"crowdCorrect\"";
},"36":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(37, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"37":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(34, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"39":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(40, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                    "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(43, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                </span>\n";
},"40":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(41, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                    ";
},"41":function(container,depth0,helpers,partials,data) {
    return "                                                            class=\"crowdHidden\"\n";
},"43":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(44, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"44":function(container,depth0,helpers,partials,data) {
    return "                                                            <sup><i class=\"fas fa-bullseye\"></i></sup>\n";
},"46":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                    "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(47, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"47":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(44, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"49":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(50, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                            ";
},"50":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(51, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"51":function(container,depth0,helpers,partials,data) {
    return "                                                        <div style=\"width:40%; position: relative; left: 30%\">Predict to Access Crowd Wisdom</div>\n";
},"53":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<td>"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "</td>";
},"55":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(56, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"56":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"58":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                <input type=\"number\" min=\"0\" max=\"50\" class=\"form-control predictionInput\" placeholder=\"##\"\n                                                value=\""
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\">\n";
},"60":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"<",((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(61, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"61":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"63":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(64, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                            ";
},"64":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(65, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(68, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"65":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(66, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"66":function(container,depth0,helpers,partials,data) {
    return "                                                            class=\"crowdCorrect\"\n";
},"68":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),">",((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(66, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"70":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(71, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                >"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"<",((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(74, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                </span>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(50, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"71":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(72, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"72":function(container,depth0,helpers,partials,data) {
    return "                                                        class=\"crowdHidden\"\n";
},"74":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"76":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.awayTeam : stack1)) != null ? stack1.score : stack1),"<",((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(77, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"77":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),"===",((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"79":function(container,depth0,helpers,partials,data) {
    return "+";
},"81":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<td>"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.homeTeam : stack1)) != null ? stack1.score : stack1), depth0))
    + "</td>";
},"83":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.results : stack1)) != null ? stack1.total : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(84, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        ";
},"84":function(container,depth0,helpers,partials,data) {
    return "                                                class=\"alert alert-success\"\n";
},"86":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(87, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"87":function(container,depth0,helpers,partials,data) {
    return "                                                <sup><i class=\"fas fa-bullseye\"></i></sup>\n";
},"89":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                        <span style=\"font-size: 0.8em; font-weight: bold\">"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),">",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(90, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),"<",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(92, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span>\n";
},"90":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<br>(o"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1), depth0))
    + ")";
},"92":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<br>(u"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1), depth0))
    + ")";
},"94":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(95, data, 0),"inverse":container.program(98, data, 0),"data":data})) != null ? stack1 : "")
    + "                                            ";
},"95":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.results : stack1)) != null ? stack1.total : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(96, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"96":function(container,depth0,helpers,partials,data) {
    return "                                                        class=\"crowdCorrect\"\n";
},"98":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.results : stack1)) != null ? stack1.total : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(96, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"100":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.total : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(101, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"101":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.total : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"103":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                <span"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(104, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n                                                "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.total : stack1), depth0))
    + "\n                                                <span style=\"font-size: 0.8em; font-weight: bold\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(107, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.total : stack1),{"name":"if","hash":{},"fn":container.program(109, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span>\n\n                                                </span>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(50, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"104":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n                                                    "
    + ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(105, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                ";
},"105":function(container,depth0,helpers,partials,data) {
    return " class=\"crowdHidden\"\n";
},"107":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.total : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(44, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"109":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"if","hash":{},"fn":container.program(110, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                    ";
},"110":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                                        "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.total : stack1),">",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(90, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                        "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.total : stack1),"<",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(92, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"112":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(113, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                ";
},"113":function(container,depth0,helpers,partials,data) {
    return "                                                    class=\"crowdHidden\"\n";
},"115":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<td>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.total : stack1), depth0))
    + "</td>";
},"117":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.results : stack1)) != null ? stack1.spread : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(118, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                            ";
},"118":function(container,depth0,helpers,partials,data) {
    return " class=\"alert alert-success\"\n";
},"120":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"122":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),">",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(123, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),"<",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(131, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"123":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                                            <br>("
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "\n                                                                <!-- Format the odds -->\n                                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"<",0,{"name":"ifCond","hash":{},"fn":container.program(124, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(127, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"===",0,{"name":"ifCond","hash":{},"fn":container.program(129, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"124":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "+"
    + ((stack1 = (helpers.math || (depth0 && depth0.math) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"*",-1,{"name":"math","hash":{},"fn":container.program(125, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ")";
},"125":function(container,depth0,helpers,partials,data) {
    return "";
},"127":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.math || (depth0 && depth0.math) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"*",-1,{"name":"math","hash":{},"fn":container.program(125, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ")";
},"129":function(container,depth0,helpers,partials,data) {
    return "EV)";
},"131":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                                            <br>("
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "\n                                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"<",0,{"name":"ifCond","hash":{},"fn":container.program(132, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(134, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"===",0,{"name":"ifCond","hash":{},"fn":container.program(129, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"132":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + ")";
},"134":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "+"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + ")";
},"136":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(137, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(140, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                            ";
},"137":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.results : stack1)) != null ? stack1.spread : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(138, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"138":function(container,depth0,helpers,partials,data) {
    return " class=\"crowdCorrect\"\n";
},"140":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.results : stack1)) != null ? stack1.spread : stack1)) != null ? stack1.correct : stack1),"===",1,{"name":"ifCond","hash":{},"fn":container.program(138, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"142":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(79, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.spread : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(143, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                <span style=\"font-size: 0.8em; font-weight: bold\">\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.spread : stack1),">",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(145, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.spread : stack1),"<",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(148, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                </span>\n";
},"143":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.comparePrediction : depth0)) != null ? stack1.spread : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"145":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "                                                        <br>("
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + " "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(146, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + ")\n";
},"146":function(container,depth0,helpers,partials,data) {
    return "\n                                                                                -";
},"148":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "                                                        <br>("
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + " "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(79, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + ")\n";
},"150":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                                                <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(151, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n                                                        "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(79, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                        "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(153, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                        <span style=\"font-size: 0.8em; font-weight: bold\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1),{"name":"if","hash":{},"fn":container.program(156, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                        </span>\n\n                                                </span>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(50, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"151":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(72, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                    ";
},"153":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1),"===",((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(154, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"154":function(container,depth0,helpers,partials,data) {
    return "                                                                <sup><i class=\"fas fa-bullseye\"></i></sup>\n";
},"156":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"if","hash":{},"fn":container.program(157, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"157":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1),">",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(158, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.spread : stack1),"<",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(161, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"158":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                                                    <br>("
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + " \n                                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"<",0,{"name":"ifCond","hash":{},"fn":container.program(124, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(127, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"===",0,{"name":"ifCond","hash":{},"fn":container.program(159, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"159":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "EV"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + ")";
},"161":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                                                    <br>("
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "\n                                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"<",0,{"name":"ifCond","hash":{},"fn":container.program(132, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(134, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                                    "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"===",0,{"name":"ifCond","hash":{},"fn":container.program(129, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"163":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(79, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0));
},"165":function(container,depth0,helpers,partials,data) {
    return "Even";
},"167":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<td>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.results : depth0)) != null ? stack1.spread : stack1), depth0))
    + "</td>";
},"169":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.userAuthenticated : depth0),{"name":"if","hash":{},"fn":container.program(170, data, 0),"inverse":container.program(176, data, 0),"data":data})) != null ? stack1 : "");
},"170":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.dateCheck || (depth0 && depth0.dateCheck) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.startDateTime : depth0),{"name":"dateCheck","hash":{},"fn":container.program(171, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"171":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "                                            <button class=\"prediction-btn btn btn-info\">Predict</button>\n                                            \n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1),"===",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"ifCond","hash":{},"fn":container.program(172, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),"===",((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"ifCond","hash":{},"fn":container.program(174, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"172":function(container,depth0,helpers,partials,data) {
    return "                                                <br><sup><i class=\"fas fa-exclamation-triangle total\"></i><span class=\"warningTextTotal\">Your total matches the odds total.</span></sup>\n";
},"174":function(container,depth0,helpers,partials,data) {
    return "                                                <br><sup><i class=\"fas fa-exclamation-triangle spread\"></i><span class=\"warningTextSpread\">Your spread matches the odds spread.</span></sup>\n";
},"176":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.dateCheck || (depth0 && depth0.dateCheck) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.startDateTime : depth0),{"name":"dateCheck","hash":{},"fn":container.program(177, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"177":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                                            <button type=\"button\" class=\"btn btn-info\" onclick=\"ga('send','event','login','loginClicked');window.location=('https://crowdsourcedscores.auth.us-west-2.amazoncognito.com/login?response_type=code&client_id=2n15lhk845sucm0k4fejjqcbev&redirect_uri=https://"
    + container.escapeExpression(((helper = (helper = helpers.getWindowLocation || (depth0 != null ? depth0.getWindowLocation : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"getWindowLocation","hash":{},"data":data}) : helper)))
    + "')\">Log in to Predict</button>\n";
},"179":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                        <div class=\"predictionScore myResultsRow\">My Score: "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.predictionScore : stack1), depth0))
    + " <i class=\"fas fa-info-circle\" data-toggle=\"modal\" data-target=\"#predictionScoreModal\"></i></div>\n";
},"181":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.predictionScore : stack1),">",-1,{"name":"ifCond","hash":{},"fn":container.program(182, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"182":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                            <div class=\"predictionScore crowdResultsRow\">Crowd Score: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.crowd : depth0)) != null ? stack1.results : stack1)) != null ? stack1.predictionScore : stack1), depth0))
    + " <i class=\"fas fa-info-circle\" data-toggle=\"modal\" data-target=\"#predictionScoreModal\"></i></div>\n";
},"184":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.predictionScore : stack1),">",-1,{"name":"ifCond","hash":{},"fn":container.program(185, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"185":function(container,depth0,helpers,partials,data) {
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
    + "                                        </div>\n                                    </div>\n                                </div>\n\n\n                                <table class=\"table\">\n                                    <thead>\n                                    <tr>\n                                        <th></th>\n                                        <th>Me</th>\n                                        <th class=\"compareHeader\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</th>\n                                        <th>Odds</th>\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                    </tr>\n                                    </thead>\n                                    <tbody>\n\n                                    <!-- Away Team Row -->\n                                    <tr class=\"predictionRow\">\n                                        <td><i class=\"fa fa-plane\" aria-hidden=\"true\"></i>"
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "</td>\n                                        <td class=\"away-team-prediction "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" id=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-prediction\">\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"===","notStarted",{"name":"ifCond","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"!==","notStarted",{"name":"ifCond","hash":{},"fn":container.program(25, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        </td>\n                                        <td"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(31, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(46, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(49, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</td>\n                                        <td></td>\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(53, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                    </tr>\n                                    <!-- Home Team Row -->\n                                    <tr class=\"predictionRow\">\n                                        <td><i class=\"fa fa-home\" aria-hidden=\"true\"></i> "
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0))
    + "</td>\n                                        <td class=\"home-team-prediction"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(55, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" id=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-prediction\">\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"===","notStarted",{"name":"ifCond","hash":{},"fn":container.program(58, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"!==","notStarted",{"name":"ifCond","hash":{},"fn":container.program(60, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        </td>\n                                        <td\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(63, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(70, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(76, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        </td>\n                                        <td>\n                                                <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(71, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                >\n                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(79, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1), depth0))
    + "\n                                                </span>\n                                        </td>\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(81, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                    </tr>\n                                    <!-- Total Row -->\n                                    <tr class=\"predictionRow\">\n                                        <td>Total</td>\n                                        <td"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(83, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " id=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-total-prediction\">\n                                        "
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.total : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(86, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1),{"name":"if","hash":{},"fn":container.program(89, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                        </td>\n                                        <td\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(94, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(100, data, 0),"inverse":container.program(103, data, 0),"data":data})) != null ? stack1 : "")
    + "                                        </td>\n                                        <td>\n                                            <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(112, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.total : stack1), depth0))
    + "</span></td>\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(115, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                    </tr>\n                                    <!-- Spread Row -->\n                                    <tr class=\"predictionRow\">\n                                        <td>Spread</td>\n                                        <td\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(117, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " id=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.awayTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.homeTeam : depth0)) != null ? stack1.code : stack1), depth0)) != null ? stack1 : "")
    + "-spread-prediction\">\n                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1),">",0,{"name":"ifCond","hash":{},"fn":container.program(79, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.spread : stack1), depth0))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(120, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                <!-- Show the side picked against the spread -->\n                                                <span style=\"font-size: 0.8em; font-weight: bold\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),{"name":"if","hash":{},"fn":container.program(122, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                </span>\n                                        </td>\n                                        <td\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(136, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n                                            \n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(142, data, 0),"inverse":container.program(150, data, 0),"data":data})) != null ? stack1 : "")
    + "                                        </td>\n                                        <td>\n                                                <span\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.prediction : depth0),{"name":"unless","hash":{},"fn":container.program(151, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"!=",0,{"name":"ifCond","hash":{},"fn":container.program(163, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                                "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.odds : depth0)) != null ? stack1.spread : stack1),"===",0,{"name":"ifCond","hash":{},"fn":container.program(165, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span></td>\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":container.program(167, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                    </tr>\n                                    </tbody>\n                                </table>\n                                \n                                <div>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"unless","hash":{},"fn":container.program(169, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.prediction : depth0)) != null ? stack1.predictionScore : stack1),">",-1,{"name":"ifCond","hash":{},"fn":container.program(179, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"unless","hash":{},"fn":container.program(181, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.comparePrediction : depth0),{"name":"if","hash":{},"fn":container.program(184, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>";
},"useData":true});
})();