var assert = require('assert');

var eggs = require('../../lib/eggs');
var utils = require('../utils');

describe('eggs',function(){

  it('should create a new instance of eggs when called',function(){
    var html = '<div><div id="one"></div><div id="two"></div></div>';
    var e = eggs(html,'#one',function(){});
    e.someproperty = 'something';
    e = eggs(html,'#two',function(){});
    assert(!e.someproperty);
  });

  it('should have the built-in directives',function(){
    var e = eggs('<div id="pork"></pork>','#pork',function(){});
    assert.equal(Object.keys(e.directives).length,10);
  });

  describe('options',function(){

    describe('when adding custom directives',function(){

      it('should properly update the directive when data updates',function(done){
        var lastValue;
        var customDirective = function(key,val,el){
          lastValue = val;
        };
        var html = '<div id="pork"><div e-directive="test"></div></div>';
        function Model(){ this.test = 'pork'; };
        var e;
        e = eggs(html,{ selector: '#pork', directives : {'directive' : customDirective } },Model,function(){
          assert.equal(lastValue,'pork');
          e.viewModel.test = 'pie';
          assert(lastValue,'pie');
          done();
        });
      });

      it('should throw an error if you try to override an existing directive',function(){
        assert.throws(function(){
          eggs('<div id="pork"></div>',{
            selector: '#pork',
            directives : {
              'attr' : {}
            }
          },function(){});
        },'Tried to override a built-in directive (attr) without specifying it as an override.');
      });

      it('should allow overriding if the directive specifies it',function(){
        assert.doesNotThrow(function(){
          eggs('<div id="pork"></div>',{
            selector: '#pork',
            directives : {
              'attr' : { override : true }
            }
          },function(){});
        });
      });

    });

    describe('when setting a custom prefix', function(){

      it('should use that prefix for existing directives',function(done){
        var lastValue;
        function Model(){ this.test = 'pork'; };
        var e = eggs('<div id="pork"><div foo-text="test"></div></div>',{ selector: '#pork', prefix:'foo'},Model,function(){
          assert.equal(e.html(),'<div id="pork"><div foo-text="test">pork</div></div>');
          done();
        });
      });

    });

    describe('when setting a selector', function(){

      it('should be constrained to elements inside of that selector',function(done){
        var html = '<div><div e-text="test"><div id="pork"><div e-text="test"></div></div></div></div>';
        function Model(){ this.test = 'pork'; };
        var e = eggs(html,{selector:'#pork'},Model,function(){
          assert.equal(e.html(),'<div><div e-text="test"><div id="pork"><div e-text="test">pork</div></div></div></div>');
          done();
        });
      });
    });

  });

  describe('instantiation',function(){
    var html = '<div id="pork"><div e-text="test">';
    var e;
    var VM;
    var finishedHTML = '<div id="pork"><div e-text="test">pork</div></div>';

    beforeEach(function(){
      VM = function(){ this.test = 'pork'; };
    });

    it('should call back after viewmodel is set up',function(done){
      e = eggs(html,{selector:'#pork'},VM,function(){
        assert.equal(e.html(),finishedHTML);
        done();
      });
    });

  });

  describe('arguments',function(){
    var html = '<div id="pork">';

    it('should throw when viewmodel is absent',function(){
      assert.throws(function(){
        eggs(html,'#pork');
      },'ViewModels must be functions');
    });

    it('should throw when viewmodel is not a function',function(){
      assert.throws(function(){
        eggs(html,'#pork',{});
      },'ViewModels must be functions');
    });

    it('should throw an exception if $ is not valid',function(){
      assert.throws(function(){
        eggs();
      },'You must pass a cheerio-compatible $ variable to eggs.');
      assert.throws(function(){
        var e = eggs({});
      },'You must pass a cheerio-compatible $ variable to eggs.');
    });

  });
});
