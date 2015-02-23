// eggs view engine setup
var async = require('async');
var fs = require('fs');
var path = require('path');
var eggs;

var defaultViewmodelsDir = "public/javascripts";

var render = function(filePath,options,html,callback){
  html = html.toString();
  var applyRoute = function(route,html,done){
    eggs(html,{selector : route.selector},route.viewmodel,function(err,html){
      done(err,html);
    });
  };
  var returnHtml = function(done){
    done(null,html.trim());
  };
  var routeMethods = options.routes.map(function(route){
    return applyRoute.bind(null,route);
  });
  async.waterfall([returnHtml].concat(routeMethods),function(err,html){
    callback(err,html);
  });
};

var engine = function(routes){
  if(!routes || typeof routes !== 'object'){
    throw new Error('Eggs view model must be configured with a routes option.');
  }
  return function (filePath, options, callback) {
    options.routes = routes;
    async.waterfall([
      fs.readFile.bind(fs,filePath,'utf8'),
      render.bind(this,filePath,options)
    ],callback);
  };
};

module.exports = function(eggsFactory){
  eggs = eggsFactory;
  return engine;
};
