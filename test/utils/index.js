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
  var e = document.createEvent('TextEvent');
  e.initTextEvent('textInput',true,true,null,text);
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

module.exports = utils;
