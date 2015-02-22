var assert = require('assert');
var $ = require('jquery');

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
      this.noneditable = 'nothing';
      this.bool = true;
    }
    e = eggs(html,{selector : '#content'},VM,function(){
      $('body').append(e.html());
      ready();
    });
    vm = e.viewModel;
  });

  after(function(){
    $('body').find('#content').remove();
  });

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
    });

});
