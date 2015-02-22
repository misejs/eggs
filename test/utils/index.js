var select = require('vtree-select');
var virtualize = require('../../lib/virtualize').html;
var stringify = require('vdom-to-html');
var assert = require('assert');
var utils = {};

var currentContainer;

utils.findNode = function(html,selector){
  var v = html;
  if(typeof html === 'string') v = virtualize(html);
  return select(selector)(v);
};

utils.toHTML = function(node){
  return stringify(node);
};

// NOTE: this does not actually test the input event, but it fires an equal number of change events. It'll do for now.
var typeChar = function(char,element){
  element.value = element.value + char;
  utils.change(element);
};

utils.type = function(element,text){
  var element = element.length ? element[0] : element;
  element.value = "";
  var i = setInterval(function(){
    if(!text.length) clearInterval(i);
    typeChar(text[0],element);
    text = text.slice(1);
  },25);
  return (text.length+1) * 25;
};

utils.change = function(element){
  var e;
  try {
    e = new Event('change');
  } catch(err){
    e = document.createEvent('HTMLEvents');
    e.initEvent('change', true, true);
  }
  (element.length ? element[0] : element).dispatchEvent(e);
}

utils.click = function(element){
  var e;
  try {
    e = new MouseEvent('click',{
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
  } catch(err) {
    e = document.createEvent('MouseEvent');
    e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  }
  (element.length ? element[0] : element).dispatchEvent(e);
}

utils.htmlEscape = function(str) {
  if (typeof document == 'undefined') {
    return str;
  }
  return String(str)
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');
}

utils.updateTimeout = Object.observe ? 0 : 110;

module.exports = utils;
