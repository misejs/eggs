var assert = require('assert');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe('eggs text directive',function(){
  var $;
  var e;
  var vm;

  before(function(){
    $ = utils.loadHTML('<div><div e-text="text"><div id="content"><div e-text="text"></div>');
    e = eggs($,{selector : '#content'});
    vm = {
      text : 'some text'
    }
    e.bind(vm);
  });

  it('should set the text of the div with the directive',function(){
    assert(/<div e-text="text">some text<\/div>/.test($.html()));
  });

  it('should set the text of the div when updated',function(done){
    vm.text = "updated text";
    setTimeout(function(){
      assert(/<div e-text="text">updated text<\/div>/.test($.html()));
      done();
    },utils.updateTimeout);
  });

});
