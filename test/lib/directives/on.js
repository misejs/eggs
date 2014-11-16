var assert = require('assert');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe('eggs model directive',function(){
  var $;
  var e;
  var vm;

  before(function(){
    $ = utils.loadHTML('<div><div id="content">\
        <input id="button" e-on="click:clicked" type="button" value="click me"/>');
    e = eggs($,{selector : '#content'});
    vm = {}
    e.bind(vm);
  });

  if(typeof window != 'undefined'){
    describe('when adding an on handler for a click event',function(){
      it('should call the correct method on the viewmodel when clicked',function(){
        var clicked = false;
        vm.clicked = function(){
          clicked = true;
        }
        utils.click($('#button'));
        assert(clicked);
      });
    });
  } else {
    console.log('no jQuery on method found, unable to test .on handlers.');
  }

});
