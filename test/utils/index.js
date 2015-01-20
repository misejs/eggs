var assert = require('assert');
var utils = {};

var currentContainer;
var current$;

utils.loadHTML = function(html){
  if(typeof document != 'undefined'){
    // clear out any previous container
    if(currentContainer){
      currentContainer.parentNode.removeChild(currentContainer);
      currentContainer = null;
    }
    var container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    currentContainer = container;
    if(!current$){
      var $ = document.$ = require('jquery');
      $.html = function(){
        return currentContainer.innerHTML;
      }
      current$ = $;
    }
    return current$;
  } else {
    return require('cheerio').load(html);
  }
}

// TODO: This works in chrome, but I can't seem to find an equivalent for other browsers.
// utils.type = function($,element,text){
//   var e;
//   e = document.createEvent('TextEvent');
//   e.initTextEvent('textInput',true,true,null,text,9,"en-US");
//   (element.length ? element[0] : element).dispatchEvent(e);
// }

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
