var assert = require('assert');

var eggs = require('../../lib/eggs');
var utils = require('../utils');

describe('eggs',function(){
  var $;

  before(function(){
    $ = utils.loadHTML('<html>');
  });

  it('should create a new instance of eggs when called',function(){
    var e = eggs($,function(){});
    e.someproperty = 'something';
    e = eggs($,function(){});
    assert(!e.someproperty);
  });

  it('should have the built-in directives',function(){
    var e = eggs($,function(){});
    assert.equal(Object.keys(e.directives).length,9);
  });

  describe('options',function(){

    describe('when adding custom directives',function(){

      it('should properly update the directive when data updates',function(){
        var lastValue;
        var customDirective = function(key,val,el){
          lastValue = val;
        };
        var $ = utils.loadHTML('<div><div e-directive="test">');
        function Model(){ this.test = 'pork'; };
        var e = eggs($,{ directives : {'directive' : customDirective } },Model);
        assert.equal(lastValue,'pork');
        e.viewModel.test = 'pie';
        assert(lastValue,'pie');
      });

      it('should throw an error if you try to override an existing directive',function(){
        assert.throws(function(){
          eggs($,{
            directives : {
              'attr' : {}
            }
          },function(){});
        },'Tried to override a built-in directive (attr) without specifying it as an override.');
      });

      it('should allow overriding if the directive specifies it',function(){
        assert.doesNotThrow(function(){
          eggs($,{
            directives : {
              'attr' : { override : true }
            }
          },function(){});
        });
      });

    });

    describe('when setting a custom prefix', function(){

      it('should use that prefix for existing directives',function(){
        var lastValue;
        var $ = utils.loadHTML('<div><div foo-text="test">');
        function Model(){ this.test = 'pork'; };
        var e = eggs($,{prefix:'foo'},Model);
        assert.equal($.html(),'<div><div foo-text="test">pork</div></div>');
      });

    });

    describe('when setting a selector', function(){

      it('should be constrained to elements inside of that selector',function(){
        var lastValue;
        var $ = utils.loadHTML('<div><div e-text="test"><div id="pork"><div e-text="test">');
        function Model(){ this.test = 'pork'; };
        var e = eggs($,{selector:'#pork'},Model);
        assert.equal($.html(),'<div><div e-text="test"><div id="pork"><div e-text="test">pork</div></div></div></div>');
      });
    });

  });

  describe('instantiation',function(){
    var $;
    var e;
    var VM;
    var finishedHTML = '<div id="pork"><div e-text="test">pork</div></div>';

    beforeEach(function(){
      $ = utils.loadHTML('<div id="pork"><div e-text="test">');
      VM = function(){ this.test = 'pork'; };
    });

    it('should call back after viewmodel is set up',function(done){
      eggs($,{selector:'#pork'},VM,function(){
        assert.equal($.html(),finishedHTML);
        done();
      });
    });

    it('should call back even when not given options',function(done){
      eggs($,VM,function(){
        assert.equal($.html(),finishedHTML);
        done();
      });
    });
  });

  describe('arguments',function(){

    it('should throw when viewmodel is absent',function(){
      assert.throws(function(){
        eggs($);
      },'ViewModels must be functions');
    });

    it('should throw when viewmodel is not a function',function(){
      assert.throws(function(){
        eggs($,{});
      },'ViewModels must be functions');
    });

    it('should accept an options argument if passed before the viewmodel arg',function(){
      assert.doesNotThrow(function(){
        eggs($,{},function(){});
      });
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
