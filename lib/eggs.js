/*!
  * @preserve Eggs - Binding agent, part of mise.js
  * https://github.com/misejs/eggs
  * (c) Jesse Ditson 2014 | License ISC
  */

// add some polyfills
require('./polyfills');

// virtual dom
var virtualize = require('./virtualize');
var stringify = require('vdom-to-html');
var select = require('vtree-select');
var parseOptions = require('./parseOptions');
var Delegator = require('html-delegator');

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
            deepObserve(object[i]);
          }
        }
      });
      callback.apply(this,arguments);
    };
  } else if(object && typeof object === 'object') {
    observer = new ObjectObserver(object);
    for (var k in object) {
      deepObserve(object[k],callback);
    }
    // observe new values when added
    callbackFn = function(added,removed,changed){
      Object.keys(changed).forEach(function(property) {
        deepObserve(changed[property],callback);
      });
      callback.apply(this,arguments);
    };
  }
  if (observer) {
    observer.open(callbackFn);
  }
};

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
};

var parseDirectiveAttributes = function(el,model){
  var self = this;
  var prefixTest = new RegExp('^'+self.prefix+'-','i');
  var atts = el.properties.attributes;
  if(!atts) return;
  var attNames = Object.keys(atts);
  var i=0,len=attNames.length;
  for(i;i<len;i++){
    var attribute = attNames[i];
    if(prefixTest.test(attribute)){
      var directiveName = attribute.replace(prefixTest,'');
      var directive = self.directives[directiveName];
      if(directive){
        parseOptions(model,atts[attribute],function(key,value,keydefined){
          directive.call(self,key,value,el,model,keydefined);
        });
      } else {
        console.warn('tried to bind to an invalid directive :',directiveName);
      }
    }
  }
};

var parseDirectives = function(model,el,parentTag){
  var self = this;
  self.parseDirectives = parseDirectives.bind(self);
  var elements = el.children;
  elements.forEach(function(element){
    // ignore text nodes
    if(!element.tagName) return;
    var nonParsed = nonParsedDirectiveSelector.call(self);
    if(parentTag){
      nonParsed = nonParsed.replace('[' + self.prefix + '-' + parentTag + ']','').replace(/,\s?$/,'');
    }
    parseDirectiveAttributes.call(self,element,model);
    if (nonParsed && select(nonParsed)(el)) {
      // skip non parsed selectors
      return;
    }
    parseDirectives.call(self,model,element,el);
  });
};

var modelUpdated = function(viewModel){
  var self = this;
  parseDirectives.call(self,viewModel,this.rootNode);
};

var setupViewModel = function(viewModel){
  // validate the generated viewModel
  if (!viewModel || typeof viewModel !== 'object') {
    throw new Error('When binding with eggs, you must pass a javascript object.');
  }
  deepObserve(viewModel,modelUpdated.bind(this,viewModel));
  modelUpdated.call(this,viewModel);
  // update our check interval when Binding
  if(!checkInterval){
    checkInterval = setInterval(performCheck);
  }
  return this;
};


 /**
  * factory - the factory that instantiates an eggs instance
  *
  * @param {string} html - the html to render mise with
  * @param {object} options - an object with options, or a selector string
  * @param {function} ViewModel - a constructor function for a viewModel
  * @param {function} callback - a callback for when setup is completed on this viewModel.
  *
  * @return {object} eggs - an instantiated eggs object
  */
var factory = function(htmlString,options,ViewModel,callback){

  if (typeof options === 'string'){
    options = { selector : options };
  }

  // make sure the viewModel is a function
  if(typeof ViewModel !== 'function'){
    throw new Error('ViewModels must be functions.');
  }

  // set up our virtualDom for this html.
  var virtualdom;
  try {
    virtualdom = virtualize(htmlString);
  } catch(e){
    console.error(e,e.stack);
    var err = new Error('invalid html : '+htmlString);
    if(callback){
      callback(err);
    } else {
      throw err;
    }
  }

  // set up our eggs object
  var delegator = Delegator();
  var eggs = {
    delegator : delegator,
    prefix : 'e',
    enabled : false,
    directives : defaultDirectives,
    update : performCheck,
    html : function(){
      return stringify(virtualdom);
    }
  };

  // bail early if this selector doesn't exist
  var selector = options.selector;
  var tree = select(selector)(virtualdom);
  if (!tree || !tree.length) {
    if(callback) callback();
    return eggs;
  } else if (tree.length > 1){
    var error = new Error('Eggs selectors must only match one node.');
    if(callback) return callback(error);
    throw error;
  } else {
    eggs.rootNode = tree[0];
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

  // instantiate and set up our viewModel
  var viewModel;
  var complete = function(){
    if(!viewModel) throw new Error('ViewModel was not instantiated when binding with eggs. If your viewModel is not asynchronous, remove the ready callback.');
    setupViewModel.call(eggs,viewModel);
    if(callback) callback();
  };
  viewModel = eggs.viewModel = new ViewModel(complete);
  // no callback on this viewmodel, so we assume it's synchronous.
  if(!ViewModel.length){
    setImmediate(function(){
      complete();
    });
  }

  return eggs;
};

module.exports = factory;
