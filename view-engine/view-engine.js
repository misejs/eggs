// eggs view engine setup
var async = require('async');
var fs = require('fs');
var path = require('path');
var eggs;

var layoutCache = {};
var partialCache = {};

var layoutPattern = /<e-layout[\s]+\w+="([^"]+)"[^\/>]*\/?>/ig;
var layoutClosePattern = /<\/e-layout>/i;
var yieldPattern = /<e-yield[^\/>]*\/?>/ig;
var yieldClosePattern = /<\/e-yield>/i;
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
    html = html.replace(layoutAttr,'').replace(layoutClosePattern,'');
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
      layoutStr = layoutStr.replace(tag,html).replace(yieldClosePattern,'');
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
    callback(null,html.trim());
  }
};

var partialPattern = /<e-partial[\s]+\w+="([^"]+)"[^\/>]*\/?>/ig;
var partialClosePattern = /<\/e-partial>/ig;
var renderPartials = function(basePath,html,callback){
  var match;
  var partials=[];
  while(match = partialPattern.exec(html)) {
    partials.push({
      tag : match[0],
      path : match[1]
    });
  };

  if(!partials.length){
    return callback(null,html.trim());
  }

  html = html.replace(partialClosePattern,'');

  async.forEach(partials,function(p,done){
    var partialPath = p.path;
    if(!/\./.test(partialPath)) partialPath = partialPath + '.html';
    partialPath = path.resolve(basePath,partialPath);

    var addPartial = function(partial){
      html = html.replace(p.tag,partial);
      var partialDir = path.dirname(partialPath);
      renderPartials(partialPath,html,done);
    };

    if(partialCache[partialPath]){
      addPartial(partialCache[partialPath]);
    } else {
      fs.exists(partialPath,function(exists){
        if(!exists) return callback(new Error('Unable to find partial at ' + partialPath));
        fs.readFile(partialPath,'utf8',function(err,partial){
          var partial = partial.toString();
          partialCache[partialPath] = partial;
          addPartial(partial);
        });
      });
    }
  },function(err){
    callback(err,html);
  });
};

var render = function(filePath,options,html,callback){
  html = html.toString().trim();
  var applyRoute = function(route,html,done){
    options.selector = route.selector;
    eggs(html,options,route.viewmodel,function(err,html){
      done(err,html);
    });
  };
  var basePath = path.dirname(filePath);
  var layout = renderLayout.bind(null,basePath,html);
  var partials = renderPartials.bind(null,basePath);
  var routeMethods = options.routes.map(function(route){
    return applyRoute.bind(null,route);
  });
  async.waterfall([layout,partials].concat(routeMethods),function(err,html){
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
