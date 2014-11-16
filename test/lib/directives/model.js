var assert = require('assert');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe('eggs model directive',function(){
  var $;
  var e;
  var vm;

  before(function(){
    $ = utils.loadHTML('<div><div id="content">\
        <input id="text" e-model="inputText" type="text"/>\
        <textarea id="textarea" e-model="textarea"></textarea>\
        <select id="select" e-model="select"><option label="one" value="1"/><option label="two" value="2"/><option label="three" value="3"/></select>\
        <div e-model="editable" id="editable" contenteditable="true"></div>\
        <div id="noneditable">original</div>');
    e = eggs($,{selector : '#content'});
    vm = {
      inputText : "input text",
      textarea : "textarea text",
      select : "2",
      editable : "some content that is editable",
      noneditable : "nothing"
    }
    e.bind(vm);
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
    it('should set the correct value for contenteditable elements',function(){
      assert.equal($('#editable').text(),'some content that is editable');
    });
    it('should not set values on non-editable fields',function(){
      assert.equal($('#noneditable').text(),'original');
    });
  });

  describe('when changing the value on the viewModel',function(){
    var out;
    var old_vm;
    before(function(done){
      old_vm = vm;
      vm.inputText = 'new text';
      vm.textarea = 'new textarea';
      vm.select = '1';
      vm.editable = 'new editable';
      setTimeout(function(){
        out = $.html();
        done();
      },200);
    });

    after(function(){
      vm = old_vm;
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
        $('#text').val('');
        setTimeout(function(){
          utils.type($('#text'),t);
          setTimeout(function(){
            assert.equal(vm.inputText,t);
            done();
          },100);
        },100);
      });
      it('should set the correct value on the viewmodel for textareas',function(done){
        var t = 'textarea new text';
        $('#textarea').val(t);
        setTimeout(function(){
          utils.change($('#textarea'));
          setTimeout(function(){
            assert.equal(vm.textarea,t);
            done();
          },100);
        },100);
      });
      it('should set the correct value on the viewmodel for select elements',function(done){
        var t = '3';
        $('#select').val(t);
        setTimeout(function(){
          utils.change($('#select'));
          setTimeout(function(){
            assert.equal(vm.select,t);
            done();
          },100);
        },100);
      });
      it('should set the correct value on the viewmodel for contenteditable elements',function(done){
        var t = 'contenteditable text';
        $('#editable').text(t);
        setTimeout(function(){
          utils.change($('#editable'));
          setTimeout(function(){
            assert.equal(vm.editable,t);
            done();
          },100);
        },100);
      });
    });
  } else {
    console.log('no jQuery on method found, unable to test 2-way data binding.');
  }

});
