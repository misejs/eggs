var assert = require('assert');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe('eggs text directive',function(){
  var e;
  var vm;

  before(function(ready){
    var html = '<div><div e-text="text"><div id="content"><div e-text="text"></div></div></div></div>';
    function VM(){
      this.text = 'some text';
    }
    e = eggs(html,{selector : '#content'},VM,ready);
    vm = e.viewModel;
  });

  it('should set the text of the div with the directive',function(){
    assert(/<div e-text="text">some text<\/div>/.test(e.html()));
  });

  it('should set the text of the div when updated',function(done){
    vm.text = "updated text";
    setTimeout(function(){
      assert(/<div e-text="text">updated text<\/div>/.test(e.html()));
      done();
    },utils.updateTimeout);
  });

});
