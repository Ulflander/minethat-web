(function(){var a,b,h,g=require("./lib/internet.js"),e=0;exports.aggregate=function(c,d){g.feed(c.feed_url,function(f,a){var e=a.items,b,h=0,g=e.length;for(b=0;b<g;b+=1)e[b].date>(c.last||0)&&(console.log(e[b].title),e[b].date>h&&(h=e[b].date));0<h&&(c.last=h);d(c)})};exports.check=function(c){exports.aggregate(c,function(d){h.update({_id:d._id},{last:d.last},function(d,c,e){d?a.error("Error updating source",d):0===c&&a.error("Error updating source: no item affected")})})};exports.update=function(){h.find({},
{},{skip:e,limit:1},function(c,d){if(c)a.error("Error querying db",c);else{var f,b=d.length;if(0===b)e=0;else for(e+=1,f=0;f<b;f+=1)exports.check(d[f])}})};require("./conf.js").conf(function(c){a=c.logger;b=require("./lib/models.js");h=b.model("Source");setInterval(function(){exports.update()},3E4);exports.update()})})();(function(){var a=process.env.ENV,b,h=require("fs"),g=require("tracer").console({format:["{{timestamp}} <{{title}}> {{message}}",{error:"{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}"}],transport:function(c){5===c.level?console.error(c.output):console.log(c.output)}}),e={loaded:!1,logger:g,env:a};"string"!==typeof a&&(g.error('No environment variable "ENV(test|local|development|production)"'),process.exit(1));b=__dirname+"/../../../conf/conf."+a+".sh";exports.parseLine=
function(c){0!==c.indexOf("#")&&0<c.indexOf("=")&&(c=c.split("="),e[c[0]]=/^[0-9]+$/ig.test(c[1])?parseInt(c[1],10):c[1])};exports.parse=function(c){c=c.split("\n");var d,f=c.length;for(d=0;d<f;d+=1)exports.parseLine(c[d])};exports.read=function(c){e.loaded=!0;h.readFile(b,function(d,f){d&&(g.error("No way to load conf",d),process.exit(1));exports.parse(f.toString());h.realpath(__dirname+"/../../",function(d,f){d&&(g.error("No way to get root path",d),process.exit(1));e.root=f;"function"===typeof c&&
c(e)})});return e};exports.conf=function(c){return e.loaded?e:exports.read(c)}})();(function(){require("./conf.js").conf(function(a){require("./server.js").run(a)})})();(function(){var a=require("connect"),b=require("serve-static"),h=require("body-parser"),g=require("./lib/blog.js"),e=require("./lib/init.js").initialize,c=require("./routes/router.js").router,d=require("./controllers/404.js"),f;exports.run=function(k){f=a();f.conf=k;f.logger=k.logger;g.init(function(){f.use(require("./lib/auth.js").auth);f.use(b(k.WEB_SERVER_STATIC_PATH||__dirname+"/../../dist"));f.use(h());f.use(e);f.use(c());f.use(d.index);f.listen(k.WEB_SERVER_PORT);f.logger.log("Server started on "+
k.WEB_SERVER_HOST+":"+k.WEB_SERVER_PORT)})}})();(function(){var a=require("../lib/controller-view.js");exports.index=function(b,h,g){b.logger.warn("Page not found: ["+b.method+"] "+b.url);a.view(b,h,"404.html")}})();(function(){var a=require("../lib/controller-view.js"),b={},h={};exports.add=function(a,e){b[a]=e;var c=/<p>([^<]+)/im.exec(e);console.log(c);h[a]=c?c[1].split("\n").join(" "):""};exports.index=function(h,e,c){c=[];var d,f;for(d in b)b.hasOwnProperty(d)&&(f=d.split("/blog/").join("").split(".html").join("").split("-"),c.push({url:"/blog/"+f.join("-")+".html",date:f.splice(0,3).join("/"),title:f.join(" ")}));a.view(h,e,"blog/articles.html",{articles:c})};exports.article=function(g,e,c){c=g.url.split("/blog/").join("").split(".html").join("").split("-");
a.view(g,e,"blog/article.html",{summary:h[g.url],url:"http://www.minethat.co"+g.url,content:b[g.url]||"Article not found",date:c.splice(0,3).join("/"),title:c.join(" ")})}})();(function(){var a=require("../lib/controller-view.js");exports.index=function(b,h,g){a.findAll(b,h,"Document",null,null,null,"document/list.html")};exports.display=function(b,h,g){a.find(b,h,"Document","document/display.html")};exports.remove=function(b,h,g){a.remove(b,h,"Document")}})();(function(){var a=require("../lib/controller-view.js"),b=require("../lib/valid.js"),h=require("../lib/mail.js"),g=require("url"),e=require("ua-parser-js"),c=require("../routes/campaigns.js").campaigns;exports.campaign=function(d){var f={ref_campaign:"None",ref_domain:"Unknown"};d.query&&d.query.r&&(f.ref_campaign=c[d.query.r]||d.query.r);d.headers.referer&&(f.ref_domain=g.parse(d.headers.referer).hostname,0===f.ref_domain.indexOf("www.")&&(f.ref_domain=f.ref_domain.substr(4)));return f};exports.index=
function(d,f,c){a.view(d,f,"landing/landing.html",exports.campaign(d))};exports.subscribe=function(d,f,c){c=d.model("Subscriber");if(!d.body||!d.body.email)return f.json({error:"miss_param"},500);if(!b.email(d.body.email))return f.json({error:"invalid_email"},500);c.findOne({email:d.body.email},function(c,a){if(c)return f.json({error:"db_check_failed"},500);if(a)return f.json({status:"exists",id:a._id},200);exports.create(d,f)})};exports.create=function(d,f){var c=d.model("Subscriber"),a=(new e).setUA(d.headers["user-agent"]).getResult()||
{},b=new c({email:d.body.email,ref_campaign:d.body.ref_campaign,ref_domain:d.body.ref_domain,browser:a.browser&&a.browser.name?a.browser.name:"Unknown",os:a.os&&a.os.name?a.os.name:"Unknown",device:a.device&&a.device.vendor?a.device.vendor+" / "+(a.device.model||"Unknown"):"Unknown"});b.save(function(c){if(c)return f.json({error:"db_save_failed"},500);h.template(d.body.email,"You're in!","landing-subscribed.html",{sub:b});h.template("xav@minethat.co","He's in!","landing-subscribed-alert.html",{sub:b});
f.json({status:"success"})})}})();(function(){var a=require("../lib/controller-view.js"),b=require("../lib/internet.js");exports.index=function(b,g,e){a.findAll(b,g,"Source",null,null,null,"source/list.html")};exports.display=function(b,g,e){a.find(b,g,"Source","source/edit.html")};exports.from_feed=function(h,g,e){"GET"===h.method?a.view(h,g,"source/from_feed.html"):b.feed(h.body.feed_url,function(c,d){c||!d?a.view(h,g,"source/from_feed.html",{error:"Invalid feed"}):(h.body.name=d.metadata.title,h.body.url=d.metadata.url,exports.add(h,
g,e))})};exports.add=function(b,g,e){a.create(b,g,"Source","source/edit.html","/app/source/:id")};exports.edit=function(b,g,e){a.edit(b,g,"Source","source/edit.html")};exports.check=function(a,g,e){b.feed(a.body.feed_url,function(c,d){c||!d?g.json({status:"error",error:"Invalid feed"},422):a.findAll(a,"Source",{feed_url:a.body.feed_url},null,null,function(d,c){d?g.json({status:"error",error:"Internal error"},500):(console.log(c),0===c.total?g.json({status:"success"},200):g.json({status:"exists"},
409))})})};exports.remove=function(b,g,e){a.remove(b,g,"Source")}})();(function(){var a=require("../lib/controller-view.js");exports.index=function(b,h,g){a.findAll(b,h,"Subscriber",null,null,null,"subscriber/list.html")};exports.display=function(b,h,g){a.find(b,h,"Subscriber","subscriber/display.html")};exports.csv=function(b,h,g){a.find(b,h,"Subscriber","subscriber/display.html")}})();(function(){var a=require("../lib/controller-view.js");exports.index=function(b,h){var g=b.model("Subscriber");if(!b.query.id)return h.error("Missing param for unsubscription",500);g.findById(b.query.id,function(e,c){var d=null;if(e)return h.error("DB query error",500);b.query.action&&("unsubscribe"===b.query.action?(c.unactivated=!0,d="Done! You won't receive our newsletter anymore."):(c.unactivated=!1,d="Thanks! You're now subscribed to our newsletter!"),c.save());a.view(b,h,"subscriber/subscription.html",
{msg:d,sub:c})})}})();(function(){var a=require("http-auth").basic({authRealm:"Private Minethat",file:__dirname+"/../../../users.htpasswd"});exports.auth=function(b,h,g){0===b._parsedUrl.href.indexOf("/private")||0===b._parsedUrl.href.indexOf("/admin")||0===b._parsedUrl.href.indexOf("/app")?a.check(b,h,function(a){g()}):g()}})();(function(){var a=require("fs"),b=require("../routes/routes.js"),h=require("../controllers/blog.js"),g=require("marked"),e=require("../conf.js").conf();exports.add=function(c){var d=c.split(".md").join("");b.add("/blog/"+d+".html",["get","blog.article"]);a.readFile(e.root+"/src/blog/"+c,function(f,a){f?e.logger.error("Unable to read blog article"+e.root+"/src/blog/"+c,f):g(a.toString(),{},function(f,a){f?e.logger.error("Unable to convert blog article"+e.root+"/src/blog/"+c,f):h.add("/blog/"+d+".html",
a)})})};exports.init=function(c){a.readdir(e.root+"/src/blog/",function(d,f){if(d)e.logger.error('Blog files not found at "'+e.root+'/src/blog/"',d);else{var a,b=f.length;for(a=0;a<b;a+=1)-1<f[a].indexOf(".md")&&exports.add(f[a]);"function"===typeof c&&c()}})}})();(function(){var a=require("ejs"),b=require("fs"),h=require("async"),g=require("../conf.js").conf(),e=/<%-\s+partial\s*\(\s*['"]([a-zA-Z0-9\\\-_]+)['"]/ig,c={};exports.remove=function(d,f,a,c){d.isAPI?d.model(a).findById(d.params.id,function(d,a){d||null===a?f.json({status:"error",error:"Resource not found"},404):a.remove(function(d){d?f.json({status:"error",error:"Resource not deleted"},500):f.json({status:"success"},200)})}):f.error(404,"Only available through API")};exports.save=function(d,f,a,
c,b){var e=new (d.model(a))(d.body),g=!1;e.save(function(a){var h={status:a?"success":"error",doc:e.toObject()};g||(g=!0,a&&(h.error={message:a}),d.isAPI?f.json(h,a?500:200):b?f.redirect(b.split(":id").join(e._id)):exports.view(d,f,c,h))})};exports.create=function(d,a,c,b,e){var g=d.model(c);"POST"===d.method?exports.save(d,a,c,b,e):d.isAPI?a.json({error:"Not implemented"},500):exports.view(d,a,b,{doc:new g,status:"create"})};exports.find=function(d,a,c,b){d.find(c,d.params.id,function(c,e){if(c)return a.error(500);
e?d.isAPI?a.json(e):exports.view(d,a,b,{doc:e,status:"exists"}):d.isAPI?a.json({status:"error",error:"Resource not found"},404):a.error(404)})};exports.edit=function(d,a,c,b){"GET"===d.method?exports.find(d,a,c,b):d.model(c).update({_id:d.params.id},d.body,function(e,g,h){if(e)return a.error(500);d.find(c,d.params.id,function(c,e){if(c)return a.error(500);e?d.isAPI?a.json(e):exports.view(d,a,b,{doc:e,status:"exists"}):d.isAPI?a.json({status:"error",error:"Resource not found"},404):a.error(404)})})};
exports.findAll=function(d,a,c,b,e,g,h){d.findAll(d,c,b,e,g,function(c,b){if(c)return a.error(404);d.isAPI?a.json(b):exports.view(d,a,h,b)})};exports.requiresLoading=function(a){return!c[a]||"local"===g.env};exports.load=function(a,f){b.readFile(__dirname+"/../views/"+a,function(b,e){b?(g.logger.error("File not found: views/"+a),c[a]="Template not found"):c[a]=e.toString();var h=exports.detectPartials(a);0<h.length?exports.loadPartials(h,f):"function"===typeof f&&f()})};exports.render=function(d,
b){try{return a.render(c[d],{data:b?b:{},partial:exports.partial})}catch(e){return g.logger.error("Unable to render template",e),null}};exports.view=function(a,c,b,e){exports.renderView(b,e,function(a){c.html(a)})};exports.renderView=function(a,c,b){var e=function(){b(exports.render(a,c))};if(exports.requiresLoading(a))return exports.load(a,e);e()};exports.partial=function(d,b){return a.render(c["_partials/"+d+".html"],b)};exports.loadPartials=function(a,c){var b,e=a.length,g=[];for(b=0;b<e;b+=1)g.push(exports.loadPartial(a[b]));
h.parallel(g,c)};exports.loadPartial=function(a){return function(c){exports.load("_partials/"+a+".html",c)}};exports.detectPartials=function(a){for(var b=[],g;;){g=e.exec(c[a]);if(!g)break;b.push(g[1])}return b}})();(function(){var a=require("../conf.js").conf(),b=require("./respond.js"),h=require("./models.js"),g=require("qs");exports.initialize=function(e,c,d){var f;e.logger=a.logger;e.query=g.parse(e._parsedUrl.query);for(f in h)h.hasOwnProperty(f)&&(e[f]?a.logger.error("Injection failed: key "+f+"already defined in Request object"):e[f]=h[f]);for(f in b)b.hasOwnProperty(f)&&(c[f]?a.logger.error("Injection failed: key "+f+"already defined in Response object"):c[f]=b[f]);d()}})();(function(){var a=require("request"),b=require("blindparser");exports.get=function(b,g){a(b,function(a,c){a||200!==c.statusCode?g(a):g(null,c.body,c.href)})};exports.feed=function(a,g){exports.get(a,function(a,c,d){if(a)g(a);else try{b.parseString(c,{},function(a,c){a?g(a):g(null,c)})}catch(f){g(f)}})}})();(function(){var a,b=require("html-to-text"),h=require("./controller-view.js"),g=require("../conf.js").conf(),e=g.logger,c=require("nodemailer");exports.html=function(d,f,h,m,l){a||(a=c.createTransport("SMTP",{service:"Gmail",auth:{user:g.WEB_EMAIL_USER,pass:g.WEB_EMAIL_PASS}}));a.sendMail({from:m||"Xav from Minethat <xav@minethat.co>",to:d,subject:f,text:l||b.fromString(h),html:h},function(a,c){a?e.error(a):e.debug("Message sent: "+c.message)})};exports.template=function(a,c,b,e,g,n){h.renderView("emails/"+
b,e,function(b){exports.html(a,c,b,g,n)})}})();(function(){var a={},b=require("../conf.js").conf(),h=b.logger,g=require("mongoose");g.connect("mongodb://"+b.MONGO_HOST+":"+b.MONGO_PORT+"/"+b.MONGO_DB_PREFIX+b.env.toLowerCase());exports.loadModel=function(b){a[b]=require("../models/"+b.toLowerCase()+".js").define(g)};exports.model=function(b){a[b]||exports.loadModel(b);return a[b]};exports.find=function(a,b,d){"string"===typeof a&&(a=exports.model(a));a.findById(b,function(a,b){a&&h.error("Error querying db",a);"function"===typeof d&&d(a,b)})};
exports.findAll=function(a,b,d,f,g,m){var l=a.query?parseInt(a.query.page,10)||1:1;"string"===typeof b&&(b=exports.model(b));b.count(d||{},function(a,e){a&&h.error("Error querying db",a);b.find(d||{},f||{},exports.page(l,g),function(a,b){a&&h.error("Error querying db",a);"function"===typeof m&&m(a,{docs:b,total:e,limit:20,page:l,hasNext:20*l<e,hasPrevious:1<l})})})};exports.page=function(a,b){var d,f;d={skip:20*(a-1),limit:20};if(b)for(f in b)b.hasOwnProperty(f)&&(d[f]=b[f]);return d}})();(function(){exports.error=function(a){this.respond(a||404,"text/plain","File not found")};exports.html=function(a,b){this.respond(b||200,"text/html",a)};exports.plain=function(a,b){this.respond(b||200,"text/plain",a)};exports.json=function(a,b){this.respond(b||200,"application/json","string"===typeof a?a:JSON.stringify(a))};exports.respond=function(a,b,h){this.writeHead(a,{"Content-type":b});this.end(h)};exports.redirect=function(a){this.writeHead(302,{Location:a});this.end()}})();(function(){exports.email=function(a){var b,h;if(!a||"string"!==typeof a)return!1;b=a.indexOf("@");h=a.lastIndexOf(".");return 0<b&&3<h&&b<h&&a.length>h+2}})();(function(){exports.define=function(a){return a.model("Document",new a.Schema({rawLength:Number,raw:String}))}})();(function(){exports.define=function(a){return a.model("Job",new a.Schema({start:{type:Date,"default":Date.now},end:Date,status:String,gateway:String,value:String,type:String,document:String,customerId:{type:String,index:!0},meta:{url:String,title:String,author:String,organization:String},email:String,target:{type:String,"default":"MINE"},classes:String}))}})();(function(){var a=require("../lib/internet.js");exports.define=function(b){var h=new b.Schema({name:String,url:String,feed_url:{type:String,index:!0},type:{type:String,"default":"CONTENT"},customer_id:{type:String,index:!0},last:{type:Number}});b=b.model("Source",h);h.pre("save",function(b){var e=this,c=!1,d=0,f=function(a){a&&(c=!0);d+=1;2===d&&b(c?Error("Validation error"):null)};a.get(this.url,function(a,b,c){a&&e.invalidate("url","URL is invalid");f(a)});a.feed(this.feed_url,function(a,b,c){a&&
e.invalidate("url","Feed URL is invalid");f(a)})});return b}})();(function(){exports.define=function(a){return a.model("Subscriber",new a.Schema({email:String,ref_campaign:String,ref_domain:String,os:String,device:String,browser:String,ts_created:{type:Date,"default":Date.now},unactivated:{type:Boolean,"default":!1}}))}})();(function(){exports.campaigns={b:"Blog",r1:"Reddit landing feedback",r2:"Reddit marketing campaign",t1:"Twitter Minethat link",t2:"Twitter xav link",c1:"First marketing campaign",e1:"Xav email footer",e2:"Minethat email footer",e3:"Newsletters"}})();(function(){var a=require("./routes.js").routes,b={},h=require("urlrouter");exports.setup=function(a,b,c,d,f){if("function"!==typeof d[f])throw Error('Route "'+c+'" is invalid:  function "'+f+'" does not exist in controller.');a[b](c,function(a,b,e){0===c.indexOf("/api")?a.isAPI=!0:a.isAPI=!1;d[f](a,b,e)})};exports.route=function(a,e,c){var d=c[1].split(".");b[d[0]]||(b[d[0]]=require("../controllers/"+d[0]+".js"));2>d.length&&(d[1]="index");exports.setup(a,c[0],e,b[d[0]],d[1])};exports.apply=function(b){var e,
c,d;for(e in a)if(a.hasOwnProperty(e))if("string"===typeof a[e][0])exports.route(b,e,a[e]);else for(c=0,d=a[e].length;c<d;c+=1)exports.route(b,e,a[e][c])};exports.router=function(){return h(exports.apply)}})();(function(){exports.add=function(a,b){exports.routes[a]=b};exports.routes={"/app/sources":["get","source.index"],"/app/source/new":[["get","source.add"],["post","source.add"]],"/app/source/generate":[["get","source.from_feed"],["post","source.from_feed"]],"/app/source/:id":[["get","source.edit"],["post","source.edit"]],"/app/documents":["get","document.index"],"/app/document/:id":["get","document.display"],"/admin/subscribers":["get","subscriber"],"/admin/subscribers.csv":["get","subscriber.csv"],
"/admin/subscriber/:id":["get","subscriber.display"],"/api/v1/sources":["get","source.index"],"/api/v1/sources/check":["post","source.check"],"/api/v1/source/:id":[["get","source.display"],["post","source.edit"],["delete","source.remove"]],"/api/v1/source":["post","source.add"],"/":["get","home"],"/blog":["get","blog"],"/ajax/landing_subscribe":["post","home.subscribe"],"/subscription":["get","subscription"]}})();
