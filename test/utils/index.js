var assert = require('assert');
var utils = {};

var currentContainer;

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

utils.outerHTML = function($,element){
  return $('<p>').append(element.clone()).html();
}

utils.updateTimeout = Object.observe ? 0 : 110;

module.exports = utils;
