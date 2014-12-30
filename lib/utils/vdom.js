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
var attributes = require('./attributes');

// local vars
var rootNode;

var parseElement = function($,$element){
  var element = $element.get(0);
  if(element.type == 'text'){
    // return text nodes as text
    return element.data;
  } else if (element.type == 'comment'){
    // we don't support comments...
    return null;
  }
  var contents = $element.contents();
  var children = [];
  contents.each(function(i,content){
    children.push(parseElement($,$(content)));
  });
  return h(element.name,attributes(element),children);
};

var patch = function(left,right){
  if(!rootNode){

    rootNode = createElement(left);
  }
  var patches = diff(left,right);
  patch(rootNode, patches);
};

var render = function($,modifierFn){
  var complete = function(){};
  // if we're on the client, patch the document. Otherwise, $.html() will have the content we want, so leave it alone.
  if(typeof document != 'undefined'){
    var left = parseElement($,$(':root').clone());
    complete = function(){
      patch(left,right);
    };
  }
  modifierFn(complete);
};

module.exports = {
  parseElement : parseElement,
  render : render
}
