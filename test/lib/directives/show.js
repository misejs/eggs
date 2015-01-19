var assert = require('assert');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe('eggs show directive',function(){
  var $;
  var e;
  var vm;

  before(function(){
    $ = utils.loadHTML('<div><div e-html="html"><div id="content"><div id="showme" e-show="show"></div>');
    e = eggs($,{selector : '#content'},function(){});
    vm = e.viewModel;
  });

  it('should hide an element if the value is falsey',function(done){
    vm.show = false;
    setTimeout(function(){
      assert.equal($('#showme').css('display'),'none');
      done();
    },utils.updateTimeout);
  });

  it('should show an element if the value is truthy',function(done){
    vm.show = true;
    setTimeout(function(){
      // cheerio & jquery differ in what they return here.
      if(typeof document == 'undefined'){
        assert(!$('#showme').css('display'));
      } else {
        assert.equal($('#showme').css('display'),'block');
      }
      done();
    },utils.updateTimeout);
  });
});
