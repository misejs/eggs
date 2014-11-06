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

module.exports = utils;
