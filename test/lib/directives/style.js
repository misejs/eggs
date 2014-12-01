var assert = require('assert');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe('eggs style directive',function(){
  var $;
  var e;
  var vm;

  before(function(){
    $ = utils.loadHTML('<div id="content">\
      <div id="a" e-style="background-color:somevalue"></div>\
      <div id="b" e-style="background-color:pork,width:pie,height:three">');
    function VM(){
      this.pork = 'blue';
      this.somevalue = 'red';
      this.pie = 189;
      this.three = 100;
    };
    e = eggs($,{selector : '#content'},VM);
    vm = e.viewModel;
  });

  it('should set the style of a specified key to the evaluated value',function(){
    var val = $('#a').css('background-color');
    assert.equal(val,'red');
  });

  it('should set multiple styles when provided a single statement',function(){
    assert.equal($('#b').css('background-color'),'blue');
    assert.equal($('#b').css('width'),'189');
    assert.equal($('#b').css('height'),'100');
  });

  it('should update values when changed',function(done){
    vm.pie = 200;
    setTimeout(function(){
      assert.equal($('#b').css('width'),'200');
      done();
    },utils.updateTimeout);
  });

});
