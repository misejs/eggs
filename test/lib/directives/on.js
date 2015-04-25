var assert = require('assert');
var $ = require('jquery');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe('eggs on directive',function(){
  var e, vm, $el;

  before(function(ready){
    var html = '<div><div id="content"><input id="button" e-on="click:clicked" type="button" value="click me"/>';
    $el = $(html);
    $('body').append($el);
    e = eggs({selector : '#content'},function(){
      var self = this;
      this.clicked = function(){
        self.wasClicked = true;
      };
    },ready);
    vm = e.viewModel;
  });

  after(function() {
    $el.remove();
  })

  describe('when adding an on handler for a click event',function(){
    it('should call the correct method on the viewmodel when clicked',function(){
      utils.click($('#button'));
      assert.equal(vm.wasClicked,true);
    });
  });
});
