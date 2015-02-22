var assert = require('assert');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe('eggs model directive',function(){
  var e;
  var vm;

  before(function(ready){
    var html = '<div><div id="content">\
    <input id="text" e-model="inputfield" type="text"/>\
    <textarea id="textarea" e-model="textarea"></textarea>\
    <select id="select" e-model="select"><option value="1">one</option><option value="2">two</option><option value="3">three</option></select>\
    <input id="checkbox" e-model="bool" type="checkbox"/>\
    <div id="noneditable">original</div>\
    </div>';
    function VM(){
      this.inputfield = 'input text';
      this.textarea = 'textarea text';
      this.select = 2;
      this.editable = 'some content that is editable';
      this.noneditable = 'nothing';
      this.bool = true;
    }
    e = eggs(html,{selector : '#content'},VM,ready);
    vm = e.viewModel;
  });

  describe('initial values',function(){
    it('should set the correct value for input fields',function(){
      var el = utils.findNode(e.html(),'#text')[0];
      assert.equal(el.properties.value,'input text');
    });
    it('should set the correct value for textareas',function(){
      var el = utils.findNode(e.html(),'#textarea')[0];
      assert.equal(el.children[0].text,'textarea text');
    });
    it('should set the correct value for select elements',function(){
      var el = utils.findNode(e.html(),'#select')[0];
      assert.ok(!el.children[0].properties.selected);
      assert.notEqual(el.children[1].properties.selected,undefined);
      assert.ok(!el.children[2].properties.selected);
    });
    it('should set the correct value for checkbox elements',function(){
      var el = utils.findNode(e.html(),'#checkbox')[0];
      assert.notEqual(el.properties.checked,undefined);
    });
    it('should not set values on non-editable fields',function(){
      var el = utils.findNode(e.html(),'#noneditable')[0];
      assert.equal(el.children[0].text,'original');
      assert.equal(el.properties.value,undefined);
    });
  });

  describe('when changing the value on the viewModel',function(){

    before(function(done){
      vm.inputfield = 'new text';
      vm.textarea = 'new textarea';
      vm.select = '1';
      vm.editable = 'new editable';
      vm.bool = false;
      setTimeout(function(){
        done();
      },utils.updateTimeout);
    });

    it('should set the correct value for input fields',function(){
      var el = utils.findNode(e.html(),'#text')[0];
      assert.equal(el.properties.value,'new text');
    });
    it('should set the correct value for textareas',function(){
      var el = utils.findNode(e.html(),'#textarea')[0];
      assert.equal(el.children[0].text,'new textarea');
    });
    it('should set the correct value for select elements',function(){
      var el = utils.findNode(e.html(),'#select')[0];
      assert.notEqual(el.children[0].properties.selected,undefined);
      assert.ok(!el.children[1].properties.selected);
      assert.ok(!el.children[2].properties.selected);
    });
    it('should set the correct value for checkbox elements',function(){
      var el = utils.findNode(e.html(),'#checkbox')[0];
      assert.equal(el.properties.checked,undefined);
    });
    it('should not set values on non-editable fields',function(){
      var el = utils.findNode(e.html(),'#noneditable')[0];
      assert.equal(el.children[0].text,'original');
      assert.equal(el.properties.value,undefined);
    });
  });

});
