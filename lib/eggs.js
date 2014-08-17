/*!
  * @preserve Eggs - Binding agent, part of mise.js
  * https://github.com/misejs/eggs
  * (c) Jesse Ditson 2014 | License ISC
  */

// Module
(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports){
    module.exports = definition(require('qwery'),require('watchjs'));
  } else if (typeof define == 'function' && define.amd){
    define(name,['qwery','watchjs'],definition);
  } else {
    context[name] = definition($ || qwery,WatchJS);
  }
})('eggs', this, function (qwery,WatchJS) {
  // Built-in Directives
  var defaultDirectives = {
    // appearance
    text : function(info, element, value, prop, action, newvalue, oldvalue){
      // console.log(info, prop,action,newvalue,oldvalue);
    },
    foreach : function(info, element, value, prop, action, newvalue, oldvalue){
      console.log(element.innerHTML);
    }
  };
  // helpers
  var parseAttr = function(attr){
    var attrPattern = /(\w+)\s*:\s*([^:]+)/g;
    var match;
    var info = {};
    while(match = attrPattern.exec(attr)){
      var directiveName = match[1];
      var directiveValue = match[2].replace(/[\w\s]+:/,'');
      info[directiveName] = directiveValue;
    }
    return info;
  };


  var watch = WatchJS.watch;
  var unwatch = WatchJS.unwatch;
  var eggs = {
    directives : defaultDirectives,
    boundElements : {}
  };

  var getOpts = function(options,callback){
    options = options || {};
    if(!callback && typeof options == 'function' && !options.callback){
      options = {callback : options};
    } else if(callback){
      options.callback = callback;
    }
    return options;
  };

  eggs.bind = function(obj,selector,options,callback){
    options = getOpts(options,callback);
    var dataAttr = options.attr || 'data-egg';
    var elements = qwery(selector);
    var self = eggs;
    self.boundElements[selector] = { elements : elements, callback : options.callback };
    elements.forEach(function(el){
      var boundEls = qwery('['+dataAttr+']',el);
      boundEls.forEach(function(boundEl){
        var info = parseAttr(boundEl.getAttribute(dataAttr));
        console.log(info);
        if(!info) return console.error('Invalid data in bound element : "'+info+'", error : ',e.message);
        Object.keys(info).forEach(function(directive){
          var dir = self.directives[directive];
          if(!dir)return console.warn('Unknown directive called : ',directive,info[directive]);
          dir = dir.bind(self,info[directive],boundEl);
          if(options.remove === true) {
            unwatch(obj,dir);
            if(options.callback) unwatch(obj,options.callback);
          } else {
            watch(obj,dir,0,true);
            if(options.callback) watch(obj,options.callback,0,true);
          }
        });
      });
    });
  };

  eggs.unbind = function(obj,selector,options,callback){
    options = getOpts(options,callback);
    options.remove = true;
    return eggs.bind(obj,selector,options);
  };

  return eggs;
});
