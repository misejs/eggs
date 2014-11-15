var assert = require('assert');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe('eggs html directive',function(){
  var $;
  var e;
  var vm;

  before(function(){
    $ = utils.loadHTML('<div><div e-html="html"><div id="content"><div e-html="html"></div>');
    e = eggs($,{selector : '#content'});
    vm = {
      html : '<a href="http://prixfixeapp.com"></a>'
    }
    e.bind(vm);
  });

  it('should set the html of the div with the directive',function(){
    assert(/<div e-html="html"><a href="http:\/\/prixfixeapp.com"><\/a><\/div>/.test($.html()));
  });

});
