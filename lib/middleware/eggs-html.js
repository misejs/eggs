// html & eggs view engine setup
var ejs = require('ejs');
var url = require('url');
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
      var $ = cheerio.load(html);
      async.forEach(options.js, function(js,done){
        js.call(options,$,done);
      },function(err){
        if(callback){
          callback(err, err ? null : $.html());
        }
      });
    });
  });
  app.set('view engine', 'html');
}
