/*!
  * @preserve Eggs - Binding agent, part of mise.js
  * https://github.com/misejs/eggs
  * (c) Jesse Ditson 2014 | License ISC
  */

var assert = require('assert');
// include the Object.observe polyfill
require('./polyfills/Object.observe.poly');
// include the setImmediate polyfill
require("setimmediate");

// recursive observation
var deepObserve = function(object,callback){
  if(Array.observe && Array.isArray(object)){
    Array.observe(object,callback);
    object.forEach(function(o){
      deepObserve(o,callback);
    })
  } else if(typeof object == 'object') {
    Object.observe(object,callback);
    for (var k in object) {
      deepObserve(object[k],callback);
    }
  }
}

var eggs = {
  prefix : 'e'
};

var directives = {
  'text' : require('./directives/text'),
  'html' : require('./directives/html'),
  'show' : require('./directives/show'),
  'class' : require('./directives/class'),
  'attr' : require('./directives/attr'),
  'style' : require('./directives/style'),
  'on' : require('./directives/on'),
  'model' : require('./directives/model'),
  'repeat' : require('./directives/repeat')
}

var nonParsedDirectiveSelector = function(prefix){
  var selector = Object.keys(directives).reduce(function(str,name){
    var directive = directives[name];
    if(directive.parseChildDirectives === false){
      str += '['+prefix+'-'+name+'],';
    }
    return str;
  },'');
  return selector.slice(0,-1);
}

var parseOptions = function(model,string,argCallback){
  var optionsMatcher = /([^\s]+)\s:\s([^\s,]+),?/g;
  var match = optionsMatcher.exec(string);
  var value = model[string];
  if(match){
    do {
      var name = match[1];
      var val = model[match[2]];
      argCallback(name,val || match[2]);
    } while(match = optionsMatcher.exec(string));
  } else if(typeof value != 'undefined'){
    argCallback(null,value);
  }
}

var parseDirectives = function(model,el,parentTag){
  var self = this;
  self.parseDirectives = parseDirectives;
  var $ = self.$;
  var elements = $(el).find('*');
  elements.each(function(index,el){
    var element = $(el);
    var nonParsed = nonParsedDirectiveSelector(self.prefix);
    nonParsed = nonParsed.replace('[' + self.prefix + '-' + parentTag + ']','');
    if (nonParsed && element.parents(nonParsed).length) {
      // skip non parsed selectors
      return;
    }
    var prefixTest = new RegExp('^'+self.prefix+'-','i');
    var atts = {};
    // API differs here between cheerio & jQuery, so we'll use whatever is available.
    if (el.attribs) {
      atts = el.attribs;
    } else {
      atts = Array.prototype.slice.call(el.attributes).reduce(function(o,item){
        o[item.name] = item.value;
        return o;
      },{});
    }
    attNames = Object.keys(atts);
    if(attNames.length){
      attNames.forEach(function(attribute){
        if(prefixTest.test(attribute)){
          var directiveName = attribute.replace(prefixTest,'');
          var directive = directives[directiveName];
          if(directive){
            parseOptions(model,atts[attribute],function(key,value){
              directive.call(self,key,value,element,model);
            });
          }
        }
      })
    }
  });
};

var assertAPI = function(){
  var $ = this.$;
  assert($,'You must set a $ variable on eggs for it to function properly.');
  // Object.keys(directives).forEach(function(name){
  //   var methods = directives[name].requiredMethods;
  //   if(methods){
  //     methods.forEach(function(method){
  //       console.log(typeof $[method] == 'function','Your dollar sign must support the ' + method + ' method for the ' + name + ' directive.');
  //     });
  //   }
  // });
}

var modelUpdated = function(options,viewModel,changes){
  var elements = this.$(options.selector).toArray();
  elements.forEach(parseDirectives.bind(this,viewModel));
}

eggs.bind = function(viewModel,options){
  // assert that the necessary api methods exist
  var self = this;
  assertAPI.call(self);

  deepObserve(viewModel,modelUpdated.bind(self,options,viewModel));
  modelUpdated.call(self,options,viewModel);
}

module.exports = eggs;
