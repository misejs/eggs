var assert = require('assert');

var eggs = require('../../../lib/eggs');
var cheerio = require('cheerio');

describe('eggs attr directive',function(){
  var $;
  var e;
  var vm;

  before(function(){
    $ = cheerio.load('<div><div e-attr="nothing"><div id="content"><div e-attr="nothing"></div><div e-attr="something:somevalue"></div><div e-attr="one:pork,two:pie,three">');
    e = eggs($,{selector : '#content'});
    vm = {
      somevalue : 'whatever',
      nothing : 'some-value',
      pie : 'pieValue',
      three : 'three-value',
      testing : false
    }
    e.bind(vm);
  });

  it('should set an attribute to the associated property of the model',function(){
    assert(/some-value="some-value"/.test($.html()));
  });

  it('should set an attribute to the computed value of a property if available',function(){
    assert(/something="whatever"/.test($.html()));
  });

  it('should set multiple properties when provided a single statement',function(){
    assert(/one=".+two=".+three-value="/.test($.html()));
  });

  it('should set the value to the variable name when not provided by the model',function(){
    assert(/one="pork"/.test($.html()));
  });

  it('should set the value to a the value of the property by that name when both value and key are provided',function(){
    assert(/two="pieValue"/.test($.html()));
  });

  it('should set an attrobute to the associated property when provided as part of a map',function(){
    assert(/three-value="three-value"/.test($.html()));
  });

  it('should remove an attribute if set to false',function(done){
    vm.somevalue = false;
    setTimeout(function(){
      assert(!/whatever/.test($.html()));
      vm.somevalue = true;
      done();
    },20);
  });

});
