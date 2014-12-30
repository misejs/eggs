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

var parseElement = function($,$element){
  // console.log('----------------- PARSING NEW ELEMENT --------');
  var element = $element.get(0);
  // console.log('parsing',element);
  // console.log('of type',element.type);
  if(element.type == 'text'){
    // return text nodes as text
    return element.data;
  } else if (element.type == 'comment'){
    // we don't support comments...
    return;
  }
  var contents = $element.contents();
  // console.log('----',contents.length,' children -----');
  var children = [];
  contents.each(function(i,content){
    var child = parseElement($,$(content));
    if(child) children.push(child);
  });
  // console.log('finished parsing',element.name);
  // console.log('attributes :',attributes(element));
  // console.log('children : ',children);
  return h(element.name,attributes(element),children);
}

module.exports = {
  parseElement : parseElement
}
