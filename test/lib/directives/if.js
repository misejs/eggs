var assert = require('assert');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe('eggs if directive',function(){
  var e;
  var vm;

  before(function(ready){
    var html = '<div id="content"><div class="el1" e-if="hasElementOne"></div><div class="el2" e-if="hasElementTwo"></div>';
    function VM(){
      this.hasElementOne = false;
      this.hasElementTwo = true;
    };
    e = eggs(html,{selector : '#content'},VM,ready);
    vm = e.viewModel;
  });

  it('should render without the first element',function(){
    var el = utils.findNode(e.html(),'.el1');
    assert(!el);
  });

  it('should render with the second element',function(){
    var el = utils.findNode(e.html(),'.el2');
    assert(el && el.length);
  });

  describe('when changing the value on the view model',function(){

    it('should add an element with a true value',function(done){
      vm.hasElementOne = true;
      setTimeout(function(){
        var el = utils.findNode(e.html(),'.el1');
        assert(el && el.length);
        done();
      },utils.updateTimeout);
    });

    it('should remove an element that has a false value',function(done){
      vm.hasElementTwo = false;
      setTimeout(function(){
        var el = utils.findNode(e.html(),'.el2');
        assert(!el);
        done();
      },utils.updateTimeout);
    });
  });

});
