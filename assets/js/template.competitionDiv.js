(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['template.competitionDiv'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "    <div class=\"tab\">\r\n        <button class=\"tablinks active\""
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.sport : depth0),"===","ncaam",{"name":"ifCond","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.sport : depth0),"===","ncaaf",{"name":"ifCond","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " onclick=\"openLeaderboard(event, 'usersDiv')\"><span class=\"hidden-xs hidden-lg\">User Leaderboard</span><span class=\"visible-xs visible-lg\">Overall</span></button>\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.sport : depth0),"===","nfl",{"name":"ifCond","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\r\n    <div id=\"myTabContent\">\r\n        <div class=\"tabcontent\" id=\"usersDiv\" style=\"display:block\">\r\n            <div id=\"allUsers\"></div>\r\n            <button type=\"button\" class=\"btn btn-primary\" id=\"leaderboardButton\" onclick=\"window.location='/leaderboard.html'\">Leaderboard</button>\r\n        </div>\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.sport : depth0),"===","nfl",{"name":"ifCond","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "style=\"width: 100%\" ";
},"4":function(container,depth0,helpers,partials,data) {
    return "            <button class=\"tablinks\" onclick=\"openLeaderboard(event, 'weeklyDiv')\"><span class=\"hidden-xs hidden-lg\">Weekly Leaderboard</span><span class=\"visible-xs visible-lg\">Weekly</span></button>\r\n            <button class=\"tablinks\" onclick=\"openLeaderboard(event, 'crowdsDiv')\"><span class=\"hidden-xs hidden-lg\">Crowd Leaderboard</span><span class=\"visible-xs visible-lg\">Crowd</span></button>\r\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "            <div class=\"tabcontent\" id=\"weeklyDiv\">\r\n                <div id=\"weeklyUsers\"></div>\r\n                <button type=\"button\" class=\"btn btn-primary\" id=\"leaderboardButton\" onclick=\"window.location='/leaderboard.html'\">Leaderboard</button>\r\n            </div>\r\n            <div class=\"tabcontent\" id=\"crowdsDiv\">\r\n                <div id=\"allGroups\"></div>\r\n                <div id=\"createCrowdButtonDiv\"></div>\r\n            </div>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.sport : depth0),"!==","ncaam",{"name":"ifCond","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
})();