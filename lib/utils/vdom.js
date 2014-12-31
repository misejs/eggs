/*!
 * Virtual dom adapter for converting & diffing raw html with virtual-dom
 *
 */

// virtual dom
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var createElement = require('virtual-dom/create-element');
var patch = require('virtual-dom/patch');

// utils
var parseAttributes = require('./attributes');
var parseEvents = require('./events');

var parseElement = function($,$element){
  var element = $element[0];
  if(element.nodeType == 3){
    // return text nodes as text
    return element.data;
  } else if (element.nodeType > 3){
    // we don't support comments or other nodes like doctype...
    return null;
  }
  var contents = $element.contents();
  var children = [];
  contents.each(function(i,content){
    children.push(parseElement($,$(content)));
  });
  var properties = parseAttributes(element);
  // TODO: vdom ev-* properties create event hooks, but doesn't seem to actually do anything on the client.
  //
  var events = parseEvents($,element);
  Object.keys(events).forEach(function(eventName){
    var handlers = events[eventName];
    // unfortunately we have to wrap these guys, cause this just uses the on<whatever> handlers.
    properties['ev-'+eventName] = function(){
      var ctx = this;
      var args = arguments;
      handlers.forEach(function(ev){
        ev.handler.apply(ctx,args);
      });
    };
  });
  return h(element.nodeName,properties,children);
};

var render = function(newRoot){
  var $ = this.$;
  var newTree = parseElement($,$(newRoot));
  var patches = diff(this.currentTree,newTree);
  this.rootNode = patch(this.rootNode,patches);
  this.currentTree = newTree;
  console.log('---------- re rendered ------------');
};

var currentElement = function(){
  return createElement(this.currentTree);
}

// instance
function VirtualDom($,rootElement){
  // make sure we're on the client
  if(typeof document == 'undefined'){
    throw new Error('You may not use virtual dom on the server.');
  }

  // initialize this virtual dom
  var currentTree = parseElement($,rootElement);
  var rootNode = createElement(currentTree);
  var treeNode = rootElement[0];
  treeNode.parentNode.replaceChild(rootNode,treeNode);

  // ivars
  this.$ = $;
  this.currentTree = currentTree;
  this.rootNode = rootNode;

  // expose the render function
  this.render = render.bind(this);
  this.currentElement = currentElement.bind(this);
};

module.exports = VirtualDom;
