/*!
* Virtual dom adapter for converting & diffing raw html with virtual-dom
*
*/

// virtual dom
var diff = require('virtual-dom/diff');
var createElement = require('virtual-dom/create-element');
var virtualHtml = require('virtual-html');
var patch = require('virtual-dom/patch');
var events = require('value-event');

// element parsing
var parseElement = require('./parseElement');

var render = function(newRoot){
  var $ = this.$;
  var newTree = parseElement($,$(newRoot));
  var patches = diff(this.currentTree,newTree);
  this.rootNode = patch(this.rootNode,patches);
  this.currentTree = newTree;
};

var createContext = function(){
  return createElement(this.currentTree);
};

// instance
function VirtualDom(html){

  // initialize this virtual dom
  var rootNode = virtualHtml(html);

  // ivars
  this.currentTree = html;
  this.rootNode = rootNode;

  // expose the render function
  this.render = render.bind(this);
  this.context = createContext.bind(this);
};

module.exports = VirtualDom;
