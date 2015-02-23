// eggs view engine setup
var async = require('async');
var fs = require('fs');
var path = require('path');
var eggs;

var layoutCache = {};

var layoutPattern = /e-layout="(\w+)"/ig;
var yieldPattern = /<e-yield[^\/>]*\/?>/ig;
var renderLayout = function(basePath,html,callback){
  var match;
  var layout;
  var layoutAttr;
  while(match = layoutPattern.exec(html)) {
    if(layout) return callback(new Error('Multiple layout directives found. You may only use one layout per file.'));
    layoutAttr = match[0];
    layout = match[1];
  };

  if(layout){
    html = html.replace(layoutAttr,'');
    if(!/\./.test(layout)) layout = layout + '.html';
    var layoutPath = path.resolve(basePath,layout);

    var finishLayout = function(layoutStr){
      var yMatch;
      var tag;
      while(match = yieldPattern.exec(layoutStr)) {
        if(tag) return callback(new Error('Multiple yield tags found. You may only use one yield per layout.'));
        tag = match[0];
      };
      if(!tag) return callback(new Error('No yield tag found in layout file. Layouts must include a yield tag.'));
      layoutStr = layoutStr.replace(tag,html);
      var layoutDir = path.dirname(layoutPath);
      renderLayout(layoutDir,layoutStr,callback);
    };

    if(layoutCache[layoutPath]){
      finishLayout(layoutCache[layoutPath]);
    } else {
      fs.exists(layoutPath,function(exists){
        if(!exists) return callback(new Error('Unable to find layout at ' + layoutPath));
        fs.readFile(layoutPath,'utf8',function(err,layoutStr){
          var layoutStr = layoutStr.toString();
          layoutCache[layoutPath] = layoutStr;
          finishLayout(layoutStr);
        });
      });
    }
  } else {
    callback(null,html);
  }
};

var render = function(filePath,options,html,callback){
  html = html.toString().trim();
  var applyRoute = function(route,html,done){
    eggs(html,{selector : route.selector},route.viewmodel,function(err,html){
      done(err,html);
    });
  };
  var basePath = path.dirname(filePath);
  var layout = renderLayout.bind(null,basePath,html);
  var routeMethods = options.routes.map(function(route){
    return applyRoute.bind(null,route);
  });
  async.waterfall([layout].concat(routeMethods),function(err,html){
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
