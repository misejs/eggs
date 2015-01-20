var assert = require('assert');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe('eggs on directive',function(){
  var $;
  var e;
  var vm;

  before(function(){
    $ = utils.loadHTML('<div><div id="content">\
        <input id="button" e-on="click:clicked" type="button" value="click me"/>');
    e = eggs($,{selector : '#content'},function(){
      var self = this;
      this.clicked = function(){
        self.wasClicked = true;
      };
    });
    vm = e.viewModel;
  });

  if(typeof window != 'undefined'){
    describe('when adding an on handler for a click event',function(){
      it('should call the correct method on the viewmodel when clicked',function(){
        utils.click($('#button'));
        assert.equal(vm.wasClicked,true);
      });
    });
  } else {
    console.log('no jQuery on method found, unable to test .on handlers.');
  }

});
