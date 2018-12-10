(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['template.nav'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "                        <li class=\"active\"><a href=\"#\">NFL</a></li>\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "                        <li class=\"active\"><a href=\"?sport=ncaaf\">College Bowls</a></li>\r\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                        <li style=\"text-align: center\"><a href=\"/profile.html\"><span><i class=\"glyphicon glyphicon-user\"></i></span> "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.userInformation : depth0)) != null ? stack1.attributes : stack1)) != null ? stack1.preferred_username : stack1), depth0))
    + "</a></li>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "    <div class=\"row\">\r\n        <div class=\"navbar navbar-default navbar-fixed-top\">\r\n            <div class=\"container\">\r\n                <div class=\"header-icon\"><a href=\"/\"><img src=\"https://crowdsourcedscores.files.wordpress.com/2016/11/cropped-css-logo-footballleft-webres-1300px.jpg?w=520\" alt=\"Crowd Wisdom Sports\"></a></div>\r\n                <div class=\"navbar-header\"><a href=\"/\" class=\"navbar-brand\"><span class=\"hidden-md\">Crowd Wisdom Sports</span><span class=\"visible-md\">CW Sports</span></a>\r\n                <button type=\"button\" data-toggle=\"collapse\" data-target=\"#navbar-main\" class=\"navbar-toggle\"><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span></button>\r\n                </div>\r\n                <div id=\"navbar-main\" class=\"navbar-collapse collapse\">\r\n                <ul class=\"nav navbar-nav\">\r\n                    <li class=\"active\"><a href=\"#\">Home</a></li>\r\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.sport : depth0),"!==","nfl",{"name":"ifCond","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.sport : depth0),"===","ncaaf",{"name":"ifCond","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                    <li><a href=\"https://blog.crowdsourcedscores.com/\" target=\"blog\">Blog</a></li>\r\n                    <li><a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\" id=\"leaderboards\">Leaderboards<span class=\"caret\"></span></a>\r\n                        <ul class=\"dropdown-menu\">\r\n                            <li style=\"text-align: center\"><a href=\"/crowd.html\"><span class=\"glyphicons glyphicons-group\"></span> Groups</a></li>\r\n                            <li style=\"text-align: center\"><a href=\"/leaderboard.html\"><span><i class=\"glyphicon glyphicon-user\"></i></span> Users</a></li>\r\n                        </ul>\r\n                    </li>\r\n                    <li class=\"dropdown\">\r\n                        <a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\" id=\"podcasts\"><i class=\"fa fa-headphones\" aria-hidden=\"true\"></i> Podcast<span class=\"caret\"></span></a>\r\n                        <ul class=\"dropdown-menu\">\r\n                            <li style=\"text-align: center\">\r\n                                <a target=\"_blank\" href=\"https://itunes.apple.com/us/podcast/the-crowd-wisdom-sports-podcast/id1331165617?mt=2\" style=\"display:inline-block;overflow:hidden;background:url(https://linkmaker.itunes.apple.com/assets/shared/badges/en-us/podcast-lrg.svg) no-repeat;width:133px;height:34px;background-size:contain;\"><span style=\"height: 34px; width:133px; padding: 16px 0\"></span></a>\r\n                            </li>\r\n                            <li style=\"text-align: center\">\r\n                                <a href=\"https://www.stitcher.com/s?fid=162919&refid=stpr\"><img src=\"https://secureimg.stitcher.com/promo.assets/stitcher-banner-88x31.jpg\" width=\"88\" height=\"31\" alt=\"Listen to Stitcher\"></a>\r\n                            </li>\r\n                            <li style=\"text-align: center\">\r\n                                <a target=\"_blank\" href='https://playmusic.app.goo.gl/?ibi=com.google.PlayMusic&amp;isi=691797987&amp;ius=googleplaymusic&amp;apn=com.google.android.music&amp;link=https://play.google.com/music/m/Ikd4ilzctaypo3idfl2admka4ve?t%3DThe_Crowd_Wisdom_Sports_Podcast%26pcampaignid%3DMKT-na-all-co-pr-mu-pod-16' rel='nofollow'><img width='125px' alt='Listen on Google Play Music' src='https://play.google.com/intl/en_us/badges-music/images/badges/en_badge_web_music.png'/></a>\r\n                            </li>\r\n                        </ul>\r\n                    </li>\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.userInformation : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                    \r\n                </ul>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>";
},"useData":true});
})();