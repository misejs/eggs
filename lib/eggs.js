/*!
  * @preserve Eggs - Binding agent, part of mise.js
  * https://github.com/misejs/eggs
  * (c) Jesse Ditson 2014 | License ISC
  */

// add some polyfills
require('./polyfills');

// virtual dom
var VirtualDom = require('./vdom/vdom');
var attributes = require('./vdom/parseAttributes');

// use the observe-js lib to polyfill O.o() with dirty checking.
var observe = require('observe-js');
var ArrayObserver = observe.ArrayObserver;
var ObjectObserver = observe.ObjectObserver;
var performCheck = Platform.performMicrotaskCheckpoint.bind(Platform);
var checkInterval;
var defaultDirectives = {
  'text' : require('./directives/text'),
  'html' : require('./directives/html'),
  'show' : require('./directives/show'),
  'if' : require('./directives/if'),
  'class' : require('./directives/class'),
  'attr' : require('./directives/attr'),
  'style' : require('./directives/style'),
  'on' : require('./directives/on'),
  'model' : require('./directives/model'),
  'repeat' : require('./directives/repeat')
};
var utils = require('./directives/utils');

// necessary $ methods for this to function at all
var requiredDollarMethods = ['find','parents'];

// recursive observation
var deepObserve = function(object,callback){
  var observer;
  var callbackFn;
  if (Array.isArray(object)) {
    observer = new ArrayObserver(object);
    object.forEach(function(o){
      deepObserve(o,callback);
    });
    callbackFn = function(splices){
      splices.forEach(function(splice) {
        var i=splice.index;
        var l=splice.addedCount;
        // observe any new values
        if(l>i){
          for(i;i<l;i++){
            deepObserve(object[i])
          }
        }
      });
      callback.apply(this,arguments);
    }
  } else if(object && typeof object == 'object') {
    observer = new ObjectObserver(object);
    for (var k in object) {
      deepObserve(object[k],callback);
    }
    // observe new values when added
    callbackFn = function(added,removed,changed,oldValueFn){
      Object.keys(changed).forEach(function(property) {
        deepObserve(changed[property],callback);
      });
      callback.apply(this,arguments);
    }
  }
  if (observer) {
    observer.open(callbackFn);
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

var parseVariable = function(model,variable){
  var parts = variable.split('.');
  var value;
  var prev = model;
  parts.forEach(function(part){
    value = prev[part];
    if(!value){
      return undefined;
    } else {
      prev = value;
    }
  });
  return value;
}

var parseOptions = function(model,string,argCallback){
  var optionsMatcher = /([^\s:,]+)\s*(?:\:\s*([^\s,]+))?,?/g;
  var match = optionsMatcher.exec(string);
  do {
    var name, val, keydefined;
    if(match[2]){
      keydefined = true;
      name = match[1];
      val = parseVariable(model,match[2]);
    } else {
      keydefined = false;
      name = match[1];
      val = parseVariable(model,match[1]);
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

var parseDirectiveAttributes = function(element,model){
  var self = this;
  var $ = self.$;
  var el = element[0];
  var prefixTest = new RegExp('^'+self.prefix+'-','i');
  var atts = attributes(el);
  var attNames = Object.keys(atts);
  var i=0,len=attNames.length;
  for(i;i<len;i++){
    var attribute = attNames[i];
    if(prefixTest.test(attribute)){
      var directiveName = attribute.replace(prefixTest,'');
      var directive = self.directives[directiveName];
      validateDirective.call(self,directive);
      if(directive){
        parseOptions(model,atts[attribute],function(key,value,keydefined){
          var newElement = directive.call(self,key,value,element,model,keydefined);
          if(newElement){
            // if directives return an element, it has replaced the original one. break out and re-parse.
            return parseDirectiveAttributes.call(self,$(newElement),model);
          }
        });
      } else {
        console.warn('tried to bind to an invalid directive :',directiveName);
      }
    }
  }
}

var parseDirectives = function(model,el,parentTag){
  var self = this;
  self.parseDirectives = parseDirectives.bind(self);
  var $ = self.$;
  var elements = $(el).find('*');
  elements.each(function(index,el){
    var element = $(el);
    var nonParsed = nonParsedDirectiveSelector.call(self);
    if(parentTag){
      nonParsed = nonParsed.replace('[' + self.prefix + '-' + parentTag + ']','').replace(/,\s?$/,'');
    }
    if (nonParsed && element.parents(nonParsed).length) {
      // skip non parsed selectors
      return;
    }
    parseDirectiveAttributes.call(self,element,model);
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
  var self = this;
  var $ = self.$;
  var rootElement = this.virtualDom ? this.virtualDom.context() : self.selector;
  parseDirectives.call(self,viewModel,rootElement);
  if(self.virtualDom){
    self.virtualDom.render(rootElement);
  }
}

var setupViewModel = function(viewModel){
  // validate the generated viewModel
  if (!viewModel || typeof viewModel != 'object') {
    throw new Error('When binding with eggs, you must pass a javascript object.');
    return;
  }
  deepObserve(viewModel,modelUpdated.bind(this,viewModel));
  modelUpdated.call(this,viewModel);
  // update our check interval when Binding
  if(!checkInterval){
    checkInterval = setInterval(performCheck);
  }
  return this;
}


 /**
  * factory - the factory that instantiates an eggs instance
  *
  * @param {function} $ - a cheerio-compatible $ Object
  * @param {object} options - an optional object with options
  * @param {function} ViewModel - a constructor function for a viewModel
  * @param {function} callback - an optional callback for when we complete setup
  *
  * @return {object} eggs - an instantiated eggs object
  */
var factory = function($,options,ViewModel,callback){

  if(!callback && typeof options == 'function'){
    callback = ViewModel;
    ViewModel = options;
    options = {};
  }

  // verify the $ api
  if (!validateDollar($)) {
    throw new Error('You must pass a cheerio-compatible $ variable to eggs.');
  }

  // make sure the viewModel is a function
  if(typeof ViewModel != 'function'){
    throw new Error('ViewModels must be functions.');
  }

  // set up our eggs object
  var eggs = {
    prefix : 'e',
    $ : $,
    enabled : false,
    directives : defaultDirectives,
    update : performCheck
  };
  // bail early if this selector doesn't exist
  var selector = options.selector || ':root';
  if (!$(selector).length) {
    if(callback) callback();
    return eggs;
  } else if($(selector).length > 1){
    throw new Error('eggs can only be bound to a root selector that matches a single node.');
  } else {
    eggs.enabled = true;
  }

  // defaults & options parsing
  options = options || {};
  if (options.prefix) eggs.prefix = options.prefix;
  if (options.debug) eggs.debug = true;
  eggs.selector = selector;
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

  // set up our VirtualDom
  if(typeof document != 'undefined'){
    eggs.virtualDom = new VirtualDom($,$(selector));
  }

  // instantiate and set up our viewModel
  var viewModel;
  var complete = function(){
    if(!viewModel) throw new Error('ViewModel was not instantiated when binding with eggs. If your viewModel is not asynchronous, remove the ready callback.');
    setupViewModel.call(eggs,viewModel);
    if(callback) callback();
  }
  viewModel = eggs.viewModel = new ViewModel(complete);
  if(!ViewModel.length){
    complete();
  }

  return eggs;
}

factory.configureViewEngine = require('./middleware/eggs-html.js');

module.exports = factory;
