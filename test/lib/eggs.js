var assert = require('assert');

var eggs = require('../../lib/eggs');
var utils = require('../utils');

describe('eggs',function(){

  it('should create a new instance of eggs when called',function(){
    var $ = utils.loadHTML('<div id="one"></div><div id="two"></div>');
    var e = eggs($,'#one',function(){});
    e.someproperty = 'something';
    e = eggs($,'#two',function(){});
    assert(!e.someproperty);
  });

  it('should have the built-in directives',function(){
    var $ = utils.loadHTML('<div id="pork">');
    var e = eggs($,'#pork',function(){});
    assert.equal(Object.keys(e.directives).length,10);
  });

  describe('options',function(){

    describe('when adding custom directives',function(){
      var $;

      it('should properly update the directive when data updates',function(){
        var lastValue;
        var customDirective = function(key,val,el){
          lastValue = val;
        };
        $ = utils.loadHTML('<div id="pork"><div e-directive="test">');
        function Model(){ this.test = 'pork'; };
        var e = eggs($,{ selector: '#pork', directives : {'directive' : customDirective } },Model);
        assert.equal(lastValue,'pork');
        e.viewModel.test = 'pie';
        assert(lastValue,'pie');
      });

      it('should throw an error if you try to override an existing directive',function(){
        assert.throws(function(){
          eggs($,{
            selector: '#pork',
            directives : {
              'attr' : {}
            }
          },function(){});
        },'Tried to override a built-in directive (attr) without specifying it as an override.');
      });

      it('should allow overriding if the directive specifies it',function(){
        assert.doesNotThrow(function(){
          eggs($,{
            selector: '#pork',
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
        var $ = utils.loadHTML('<div id="pork"><div foo-text="test">');
        function Model(){ this.test = 'pork'; };
        var e = eggs($,{ selector: '#pork', prefix:'foo'},Model);
        assert.equal($.html(),'<div id="pork"><div foo-text="test">pork</div></div>');
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

  });

  describe('arguments',function(){
    var $;

    beforeEach(function(){
      $ = utils.loadHTML('<div id="pork">');
    });

    it('should throw when viewmodel is absent',function(){
      assert.throws(function(){
        eggs($,'#pork');
      },'ViewModels must be functions');
    });

    it('should throw when viewmodel is not a function',function(){
      assert.throws(function(){
        eggs($,'#pork',{});
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
