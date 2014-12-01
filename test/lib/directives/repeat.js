var assert = require('assert');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe('eggs repeat directive',function(){
  var $;
  var e;
  var vm;

  before(function(){
    $ = utils.loadHTML('<div id="content">\
      <ul id="ul" e-repeat="items">\
        <li>\
          <h3 e-text="key"></h3>');
    function VM(){
      this.items = [
        { key : 'item one' },
        { key : 'item two' },
        { key : 'item three' }
      ]
    };
    e = eggs($,{selector : '#content'},VM);
    vm = e.viewModel;
  });

  it('should create the proper number of children',function(){
    assert.equal($('#ul').children().length,3);
  });

  it('should evaluate each child in the correct context',function(){
    $('#ul').children().each(function(idx,child){
      var text;
      switch(idx){
        case 0:
          text='item one';
          break;
        case 1:
          text='item two';
          break;
        case 2:
          text='item three';
          break;
      }
      assert($(child).find('h3').text(),text);
    });
  });

  describe('adding and removing items',function(){
    it('should remove the DOM element when removing an item',function(done){
      vm.items.pop();
      setTimeout(function(){
        assert.equal($('#ul').children().length,2);
        done();
      },utils.updateTimeout);
    });
    it('should replace html when replacing the array',function(done){
      vm.items = [ { text : 'new item' } ];
      setTimeout(function(){
        var els = $('#ul').children();
        assert.equal(els.length,1);
        assert(els.first().find('h3').text(),'new item');
        done();
      },utils.updateTimeout);
    });
    it('should be able to add even if no DOM elements exist',function(done){
      vm.items = [];
      setTimeout(function(){
        assert.equal($('#ul').children().length,0);
        vm.items.push({ text : 'pushed one' });
        setTimeout(function(){
          var els = $('#ul').children();
          assert.equal(els.length,1);
          assert(els.first().find('h3').text(),'pushed one');
          vm.items.push({ text : 'pushed two' });
          setTimeout(function(){
            var els = $('#ul').children();
            assert.equal(els.length,2);
            assert(els.last().find('h3').text(),'pushed two');
            done();
          },utils.updateTimeout);
        },utils.updateTimeout);
      },utils.updateTimeout);
    });
  });

});
