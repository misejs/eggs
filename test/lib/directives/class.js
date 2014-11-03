var assert = require('assert');

var eggs = require('../../../lib/eggs');
var cheerio = require('cheerio');

describe('eggs class directive',function(){
  var $;
  var e;
  var vm;

  before(function(){
    $ = cheerio.load('<div><div e-class="nothing"><div id="content"><div e-class="nothing"></div><div e-class="something"></div><div e-class="one,pie,three:three">');
    e = eggs($,{selector : '#content'});
    vm = {
      something : 'whatever',
      pie : 'pie-class',
      three : true
    }
    e.bind(vm);
  });

  it('should set the hardcoded class if unavailable on the model',function(){
    assert(/\sclass="nothing"/.test($.html()));
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
      assert(/\sclass="one pie-class"/.test($.html()));
      done();
    },20);
  });

});
