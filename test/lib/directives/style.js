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
      this.pork = 'rgb(0, 0, 255)';
      this.somevalue = 'rgb(255, 0, 0)';
      this.pie = '189px';
      this.three = '100px';
    };
    e = eggs($,{selector : '#content'},VM);
    vm = e.viewModel;
  });

  it('should set the style of a specified key to the evaluated value',function(){
    var val = $('#a').css('background-color');
    assert.equal(val,'rgb(255, 0, 0)');
  });

  it('should set multiple styles when provided a single statement',function(){
    assert.equal($('#b').css('background-color'),'rgb(0, 0, 255)');
    assert.equal($('#b').css('width'),'189px');
    assert.equal($('#b').css('height'),'100px');
  });

  it('should update values when changed',function(done){
    vm.pie = '200px';
    setTimeout(function(){
      assert.equal($('#b').css('width'),'200px');
      done();
    },utils.updateTimeout);
  });

});
