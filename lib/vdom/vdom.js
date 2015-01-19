/*!
* Virtual dom adapter for converting & diffing raw html with virtual-dom
*
*/

// virtual dom
var diff = require('virtual-dom/diff');
var createElement = require('virtual-dom/create-element');
var patch = require('virtual-dom/patch');
var EvStore = require('ev-store');

// element parsing
var parseElement = require('./parseElement');

var attachEvents = function(node){
  var events = EvStore(node);
  var self = this;
  var $ = this.$;
  Object.keys(events).forEach(function(name){
    var handler = events[name];
    $(node).on(name,handler);
  });
  Array.prototype.slice.call(node.children).forEach(function(child){
    attachEvents.call(self,child);
  });
}

var render = function(newRoot){
  var $ = this.$;
  var newTree = parseElement($,$(newRoot));
  var patches = diff(this.currentTree,newTree);
  this.rootNode = patch(this.rootNode,patches);
  // console.log('---------- re rendered with '+(Object.keys(patches).length-1)+' patches ------------');
  this.currentTree = newTree;
  attachEvents.call(this,this.rootNode);
};

var createContext = function(){
  return createElement(this.currentTree);
};

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
  this.context = createContext.bind(this);
};

module.exports = VirtualDom;
