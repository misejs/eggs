var assert = require('assert');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe('eggs class directive',function(){
  var e;
  var vm;

  before(function(ready){
    var html = '<div><div e-class="nothing"><div id="content"><div e-class="nothing"></div><div e-class="something"></div><div e-class="one,pickle,three:three">'
    function VM(){
      this.something = 'whatever';
      this.pickle = 'pie-class';
      this.three = true;
      this.one = 'one';
    }
    e = eggs(html,{selector : '#content'},VM,ready);
    vm = e.viewModel;
  });

  it('should set the computed class if available on the model',function(){
    assert(/\sclass="whatever"/.test(e.html()));
  });

  it('should set multiple classes at once',function(){
    assert(/\sclass="one pie-class three"/.test(e.html()));
  });

  it('should remove a class when set to false',function(done){
    vm.three = false;
    setTimeout(function(){
      assert(!/\sclass="[^\"]*three[^\"]*"/.test(e.html()));
      done();
    },utils.updateTimeout);
  });

});
