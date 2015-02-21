// html & eggs view engine setup
var ejs = require('ejs');
var cheerio = require('cheerio');
var async = require('async');

module.exports = function(app,client){
  app.use(require('express-layout')());
  app.use(function(req,res,next){
    res.locals.js = res.locals.js || [];
    res.locals.js.push(client);
    next();
  });
  app.engine('html', function(filename,options,callback){
    ejs.renderFile(filename,options,function(err,html){
      // detect if this has completed rendering the layout.
      // TODO: this may not be specific enough.
      var finalRender = !!options.body;
      if(!finalRender){
        return callback(err,html);
      } else {
        var $ = cheerio.load(html);
        async.forEach(options.js, function(js,done){
          js.call(options,$,done);
        },function(err){
          if(callback){
            callback(err,!err && $.html());
          }
        });
      }
    });
  });
  app.set('view engine', 'html');
}
