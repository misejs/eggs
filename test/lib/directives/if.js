var assert = require('assert');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe('eggs if directive',function(){
  var $;
  var e;
  var vm;

  before(function(){
    $ = utils.loadHTML('<div id="content"><div class="el1" e-if="hasElementOne"></div><div class="el2" e-if="hasElementTwo"></div>');
    function VM(){
      this.hasElementOne = false;
      this.hasElementTwo = true;
    };
    e = eggs($,{selector : '#content'},VM);
    vm = e.viewModel;
  });

  it('should render without the first element',function(){
    var element = $('.el1');
    assert(!element.length);
  });

  it('should render with the second element',function(){
    var element = $('.el2');
    assert(element.length);
  });

  describe('when changing the value on the view model',function(){

    it('should add an element with a true value',function(done){
      vm.hasElementOne = true;
      setTimeout(function(){
        var element = $('.el1');
        assert(element.length);
        done();
      },utils.updateTimeout);
    });

    it('should remove an element that has a false value',function(done){
      vm.hasElementTwo = false;
      setTimeout(function(){
        var element = $('.el2');
        assert(!element.length);
        done();
      },utils.updateTimeout);
    });
  });

});
