/*!
  * @preserve Eggs - Binding agent, part of mise.js
  * https://github.com/misejs/eggs
  * (c) Jesse Ditson 2014 | License ISC
  */

// add some polyfills
require('./polyfills');

// virtual dom
var diff = require('virtual-dom/diff');
var createElement = require('virtual-dom/create-element');
var patch = require('virtual-dom/patch');
var virtualize = require('./virtualize');
var stringify = require('vdom-to-html');
var select = require('vtree-select');
var parseOptions = require('./parseOptions');
var isVNode = require('virtual-dom/vnode/is-vnode');

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

var isEmpty = function(o){
  return Object.getOwnPropertyNames(o).length == 0;
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
      if(splices.length > 0) callback.apply(this,arguments);
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
      if(!isEmpty(changed)) callback.apply(this,arguments);
    };
  }
  if (observer) {
    observer.open(callbackFn);
  }
};

var nonParsedDirectiveSelector = function(){
  var self = this;
  var selector = Object.keys(self.directives).reduce(function(arr,name){
    var directive = self.directives[name];
    if(directive.parseChildDirectives === false){
      arr.push('['+self.prefix+'-'+name+']');
    }
    return arr;
  },[]).join(',');
  return selector;
};

var parseDirectiveAttributes = function(node,model,parent){
  var self = this;
  var prefixTest = new RegExp('^'+self.prefix+'-','i');
  var atts = node.properties.attributes;
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
          directive.call(self,key,value,node,model,keydefined,parent);
        });
      } else {
        console.warn('tried to bind to an invalid directive :',directiveName);
      }
    }
  }
};

var parseChildDirective = function(model,node,child,parentTag){
  // ignore text nodes
  if(!isVNode(child)) return;
  parseDirectiveAttributes.call(this,child,model,node);
  parseDirectives.call(this,model,child,parentTag);
};

var parseDirectives = function(model,node,parentTag){
  var self = this;
  var nonParsed = nonParsedDirectiveSelector.call(self);
  if(parentTag){
    nonParsed = nonParsed.split(',').filter(function(sel){
      if(sel === '[' + self.prefix + '-' + parentTag + ']') return false;
      return true;
    }).join(',');
  }

  if (nonParsed && select(nonParsed)(node) && select(nonParsed)(node)[0] === node) {
    // skip children of non parsed selectors
    return;
  }

  self.parseDirectives = parseDirectives.bind(self);
  self.parseChildDirective = parseChildDirective.bind(self);
  var children = node.children;
  children.forEach(parseChildDirective.bind(self,model,node));
};

var modelUpdated = function(viewModel){
  var self = this;
  parseChildDirective.call(self,viewModel,null,this.rootNode);
  if(this.renderNode){
    var currentTree = virtualize.dom(this.renderNode);
    var patches = diff(currentTree,this.rootNode);
    this.renderNode = patch(this.renderNode,patches);
    this.rootNode = virtualize.dom(this.renderNode);
  }
};

var setupViewModel = function(viewModel,options){
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
  * @param {string} html - the html to render eggs on <optional>
  * @param {object} options - an object with options, or a selector string
  * @param {function} ViewModel - a constructor function for a viewModel
  * @param {function} callback - a callback for when setup is completed on this viewModel.
  *
  * @return {object} eggs - an instantiated eggs object
  */
var factory = function(htmlString,options,ViewModel,callback){
  if (typeof options === 'function' && !callback ){
    // not passing an htmlString, so move our arguments over
    callback = ViewModel;
    ViewModel = options;
    options = htmlString;
    htmlString = null;
  }
  if (typeof options === 'string'){
    options = { selector : options };
  }

  // make sure the viewModel is a function
  if(typeof ViewModel !== 'function'){
    throw new Error('ViewModels must be functions.');
  }

  var rootNode;
  if(!htmlString){
    if(typeof document === 'undefined'){
      var error = new Error('When running eggs on the server, you must pass an html string.');
      if(callback) return callback(error);
      throw error;
    }
    // no html string, so use the selector as the root
    var rootNodes = document.querySelectorAll(options.selector);
    if(!rootNodes.length) {
      callback(null,null);
      return null;
    }
    if(rootNodes.length > 1) {
      var error = new Error('selector given to eggs should only match a single node.');
      if(callback) return callback(error);
      throw error;
    }
    rootNode = rootNodes[0];
  }

  // set up our virtualDom for this html.
  var virtualdom;
  try {
    if(htmlString){
      virtualdom = virtualize.html(htmlString);
    } else {
      virtualdom = virtualize.dom(rootNode);
    }
  } catch(e){
    console.error(e,e.stack);
    var err = new Error('invalid html : '+(rootNode || htmlString));
    if(callback){
      callback(err);
    } else {
      throw err;
    }
  }

  // set up our eggs object
  var eggs = {
    prefix : 'e',
    enabled : false,
    directives : defaultDirectives,
    update : performCheck,
    html : function(){
      return stringify(virtualdom);
    }
  };
  if(!htmlString){
    var renderNode = createElement(virtualdom);
    rootNode.parentNode.replaceChild(renderNode,rootNode);
    eggs.renderNode = renderNode;
  }

  // bail early if this selector doesn't exist
  var selector = options.selector;
  var tree = [virtualdom];
  if(selector) {
    tree = select(selector)(virtualdom);
  }
  if (!tree || !tree.length) {
    if(callback) callback(null,htmlString);
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
    setupViewModel.call(eggs,viewModel,options);
    if(callback) callback(null,eggs.html());
  };

  // add our passed options to the prototype so they're available to the viewmodel during instantiation.
  Object.keys(options).forEach(function(o){
    if(typeof o != 'object' && !ViewModel.prototype[o]) ViewModel.prototype[o] = options[o];
  });

  viewModel = eggs.viewModel = new ViewModel(complete);
  // no callback on this viewmodel, so we assume it's synchronous.
  if(!ViewModel.length){
    setImmediate(function(){
      complete();
    });
  }

  return eggs;
};

// expose our view engine
factory.viewEngine = require('../view-engine/view-engine')(factory);

module.exports = factory;
