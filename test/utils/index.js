var assert = require('assert');
var utils = {};

utils.loadHTML = function(html){
  if(typeof document != 'undefined'){
    document.body.innerHTML = html;
    $ = document.$ = require('jquery');
    $.html = function(){
      return document.body.innerHTML;
    }
    return $;
  } else {
    return require('cheerio').load(html);
  }
}

utils.type = function(element,text){
  var e;
  e = document.createEvent('TextEvent');
  e.initTextEvent('textInput',true,true,null,text,9,"en-US");
  (element.length ? element[0] : element).dispatchEvent(e);
}

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

utils.updateTimeout = Object.observe ? 0 : 110;

module.exports = utils;
