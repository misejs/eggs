// eggs view engine setup
var async = require('async');
var fs = require('fs');
var path = require('path');
var eggs;

var defaultViewmodelsDir = "public/javascripts";

var render = function(filePath,options,html,callback){
  html = html.toString();
  var routeMethods = options.routes.map(function(route){
    return function(err,html,done){
      var e = eggs(html,{selector : route.selector},route.viewmodel,done);
    };
  });
  async.waterfall([function(done){
      done(html);
    }].concat(routeMethods),function(html){
      callback(null,html);
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
