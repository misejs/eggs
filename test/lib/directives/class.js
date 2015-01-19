var assert = require('assert');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe('eggs class directive',function(){
  var $;
  var e;
  var vm;

  before(function(){
    $ = utils.loadHTML('<div><div e-class="nothing"><div id="content"><div e-class="nothing"></div><div e-class="something"></div><div e-class="one,pickle,three:three">');
    function VM(){
      this.something = 'whatever';
      this.pickle = 'pie-class';
      this.three = true;
      this.one = 'one';
    }
    e = eggs($,{selector : '#content'},VM);
    vm = e.viewModel;
  });

  it('should set the computed class if available on the model',function(){
    assert(/\sclass="whatever"/.test($.html()));
  });

  it('should set multiple classes at once',function(){
    assert(/\sclass="one pie-class three"/.test($.html()));
  });

  it('should remove a class when set to false',function(done){
    vm.three = false;
    setTimeout(function(){
      assert(!/\sclass="[^\"]*three[^\"]*"/.test($.html()));
      done();
    },utils.updateTimeout);
  });

});
