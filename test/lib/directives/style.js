var assert = require('assert');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe.only('eggs style directive',function(){
  var e;
  var vm;

  before(function(ready){
    var html = '<div id="content">\
    <div id="a" e-style="background-color:somevalue"></div>\
    <div id="b" e-style="background-color:pork,width:pie,height:three"></div>\
    </div>';
    function VM(){
      this.pork = 'rgb(0, 0, 255)';
      this.somevalue = 'rgb(255, 0, 0)';
      this.pie = '189px';
      this.three = '100px';
    };
    e = eggs(html,{selector : '#content'},VM,ready);
    vm = e.viewModel;
  });

  it('should set the style of a specified key to the evaluated value',function(){
    var a = utils.toHTML(utils.findNode(e.html(),'#a')[0]);
    assert.ok(/background-color: rgb\(255, 0, 0\);/.test(a));
  });

  it('should set multiple styles when provided a single statement',function(){
    var b = utils.toHTML(utils.findNode(e.html(),'#b')[0]);
    assert.ok(/background-color: rgb\(0, 0, 255\);/.test(b));
    assert.ok(/width: 189px;/.test(b));
    assert.ok(/height: 100px;/.test(b));
  });

  it('should update values when changed',function(done){
    vm.pie = '200px';
    setTimeout(function(){
      var b = utils.toHTML(utils.findNode(e.html(),'#b')[0]);
      assert.ok(/width: 200px;/.test(b));
      done();
    },utils.updateTimeout);
  });

});
