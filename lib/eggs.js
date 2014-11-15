/*!
  * @preserve Eggs - Binding agent, part of mise.js
  * https://github.com/misejs/eggs
  * (c) Jesse Ditson 2014 | License ISC
  */

// add some polyfills
require('./polyfills');

// necessary $ methods for this to function at all
var requiredDollarMethods = ['find','parents'];

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

var nonParsedDirectiveSelector = function(){
  var self = this;
  var selector = Object.keys(self.directives).reduce(function(str,name){
    var directive = self.directives[name];
    if(directive.parseChildDirectives === false){
      str += '['+self.prefix+'-'+name+'],';
    }
    return str;
  },'');
  return selector.slice(0,-1);
}

var parseOptions = function(model,string,argCallback){
  var optionsMatcher = /([^\s:,]+)\s*(?:\:\s*([^\s,]+))?,?/g;
  var match = optionsMatcher.exec(string);
  do {
    var name, val, keydefined;
    if(match[2]){
      keydefined = true;
      name = match[1];
      val = model[match[2]];
      if(typeof val == 'undefined') val = match[2];
    } else {
      keydefined = false;
      name = match[1];
      val = model[match[1]];
      if(typeof val == 'undefined') val = match[1];
    }
    argCallback(name,val,keydefined);
  } while(match = optionsMatcher.exec(string));
}

var validateDirective = function(directive){
  // TODO: flip out if $ doesn't support this directive's required methods
  return true;
  var $ = this.$;
  return directive.requiredMethods.every(function(method){
    return !!$[method];
  });
}

var parseDirectives = function(model,el,parentTag){
  var self = this;
  self.parseDirectives = parseDirectives.bind(self);
  var $ = self.$;
  var elements = $(el).find('*');
  elements.each(function(index,el){
    var element = $(el);
    var nonParsed = nonParsedDirectiveSelector.call(self);
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
    var attNames = Object.keys(atts);
    if(attNames.length){
      attNames.forEach(function(attribute){
        if(prefixTest.test(attribute)){
          var directiveName = attribute.replace(prefixTest,'');
          var directive = self.directives[directiveName];
          validateDirective.call(self,directive);
          if(directive){
            parseOptions(model,atts[attribute],function(key,value,keydefined){
              directive.call(self,key,value,element,model,keydefined);
            });
          }
        }
      })
    }
  });
};

var validateDollar = function($){
  if (!$ || typeof $ != 'function') {
    return false;
  } else {
    // TODO: fix this validation, doesn't seem to work for cheerio
    return true;
    return requiredDollarMethods.every(function(methodName){
      return $.prototype[methodName] || $[methodName];
    });
  }
}

var modelUpdated = function(viewModel,changes){
  var elements = this.$(this.selector).toArray();
  elements.forEach(parseDirectives.bind(this,viewModel));
}

var factory = function($,options){
  var eggs = {
    prefix : 'e',
    $ : $
  };

  eggs.directives = {
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

  eggs.bind = function(viewModel){
    deepObserve(viewModel,modelUpdated.bind(this,viewModel));
    modelUpdated.call(this,viewModel);
  }
  // verify the $ api
  if (!validateDollar($)) {
    throw new Error('You must pass a cheerio-compatible $ variable to eggs.');
  }

  // defaults & options parsing
  options = options || {};
  if (options.prefix) eggs.prefix = options.prefix;
  eggs.selector = options.selector || ':root';
  if(options.directives){
    eggs.directives = Object.keys(options.directives).reduce(function(directives,name){
      var directive = options.directives[name];
      if(directives[name] && !directive.override){
        throw new Error('Tried to override a built-in directive ('+name+') without specifying it as an override.');
      } else {
        directives[name] = directive;
      }
      return directives;
    },eggs.directives);
  }

  return eggs;
}

module.exports = factory;
