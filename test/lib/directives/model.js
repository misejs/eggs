var assert = require('assert');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe('eggs model directive',function(){
  var $;
  var e;
  var vm;

  before(function(){
    $ = utils.loadHTML('<div><div id="content">\
    <input id="text" e-model="inputfield" type="text"/>\
    <textarea id="textarea" e-model="textarea"></textarea>\
    <select id="select" e-model="select"><option value="1">one</option><option value="2">two</option><option value="3">three</option></select>\
    <input id="checkbox" e-model="bool" type="checkbox"/>\
    <div e-model="editable" id="editable" contenteditable="true"></div>\
    <div id="noneditable">original</div>');
    function VM(){
      this.inputfield = "input text";
      this.textarea = "textarea text";
      this.select = 2;
      this.editable = "some content that is editable";
      this.noneditable = "nothing";
      this.bool = true;
    }
    e = eggs($,{selector : '#content'},VM);
    vm = e.viewModel;
  });

  describe('initial values',function(){
    var out;
    before(function(){
      out = $.html();
    });

    it('should set the correct value for input fields',function(){
      assert.equal($('#text').val(),'input text');
    });
    it('should set the correct value for textareas',function(){
      assert.equal($('#textarea').val(),'textarea text');
    });
    it('should set the correct value for select elements',function(){
      assert.equal($('#select').val(),'2');
    });
    it('should set the correct value for checkbox elements',function(){
      assert($('#checkbox').is(':checked'));
    });
    it('should set the correct value for contenteditable elements',function(){
      assert.equal($('#editable').text(),'some content that is editable');
    });
    it('should not set values on non-editable fields',function(){
      assert.equal($('#noneditable').text(),'original');
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
      assert.equal($('#text').val(),'new text');
    });
    it('should set the correct value for textareas',function(){
      assert.equal($('#textarea').val(),'new textarea');
    });
    it('should set the correct value for select elements',function(){
      assert.equal($('#select').val(),'1');
    });
    it('should set the correct value for checkbox elements',function(){
      assert(!$('#checkbox').is(':checked'));
    });
    it('should set the correct value for contenteditable elements',function(){
      assert.equal($('#editable').text(),'new editable');
    });
    it('should not set values on non-editable fields',function(){
      assert.equal($('#noneditable').text(),'original');
    });
  });

  if(typeof window != 'undefined'){
    describe('when setting values via the UI',function(){

      it('should set the correct value on the viewmodel for input fields',function(done){
        var t = 'text from client';
        $('#text').attr('value',t);
        utils.change($('#text'));
        setTimeout(function(){
          assert.equal(vm.inputfield,t);
          done();
        },utils.updateTimeout);
      });
      it('should set the correct value on the viewmodel for textareas',function(done){
        var t = 'textarea new text';
        $('#textarea').val(t);
        utils.change($('#textarea'));
        setTimeout(function(){
          assert.equal(vm.textarea,t);
          done();
        },utils.updateTimeout);
      });
      it('should set the correct value on the viewmodel for select elements',function(done){
        var t = '3';
        $('#select').val(t);
        utils.change($('#select'));
        setTimeout(function(){
          assert.equal(vm.select,t);
          done();
        },utils.updateTimeout);
      });
      it('should set the correct value on the viewmodel for checkbox elements',function(done){
        $('#checkbox').attr('checked',true);
        utils.change($('#checkbox'));
        setTimeout(function(){
          assert.equal(vm.bool,true);
          $('#checkbox').attr('checked',false);
          utils.change($('#checkbox'));
          setTimeout(function(){
            assert.equal(vm.bool,false);
            done();
          },utils.updateTimeout);
        },utils.updateTimeout);
      });
      it('should set the correct value on the viewmodel for contenteditable elements',function(done){
        var t = 'contenteditable text';
        $('#editable').text(t);
        utils.change($('#editable'));
        setTimeout(function(){
          assert.equal(vm.editable,t);
          done();
        },utils.updateTimeout);
      });
    });
  } else {
    console.log('no jQuery on method found, unable to test 2-way data binding.');
  }

});
