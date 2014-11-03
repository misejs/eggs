var assert = require('assert');

var eggs = require('../../lib/eggs');
var cheerio = require('cheerio');

describe('eggs',function(){
  var $;

  before(function(){
    $ = cheerio.load('<html>');
  });

  it('should create a new instance of eggs when called',function(){
    var e = eggs($);
    e.someproperty = 'something';
    e = eggs($);
    assert(!e.someproperty);
  });

  it('should expose a bind function',function(){
    assert(eggs($).bind);
  });

  it('should throw an exception if $ is not valid',function(){
    assert.throws(function(){
      eggs();
    },'You must pass a cheerio-compatible $ variable to eggs.');
    assert.throws(function(){
      var e = eggs({});
    },'You must pass a cheerio-compatible $ variable to eggs.');
  });

  it('should have the built-in directives',function(){
    var e = eggs($);
    assert.equal(Object.keys(e.directives).length,9);
  });

  describe('options',function(){

    describe('when adding custom directives',function(){

      it('should properly update the directive when data updates',function(){
        var lastValue;
        var customDirective = function(key,val,el){
          lastValue = val;
        };
        var $ = cheerio.load('<div><div e-directive="test">');
        var e = eggs($,{ directives : {'directive' : customDirective } });
        var model = {test : 'pork'};
        e.bind(model);
        assert.equal(lastValue,'pork');
        model.test = 'pie';
        assert(lastValue,'pie');
      });

      it('should throw an error if you try to override an existing directive',function(){
        assert.throws(function(){
          eggs($,{
            directives : {
              'attr' : {}
            }
          });
        },'Tried to override a built-in directive (attr) without specifying it as an override.');
      });

      it('should allow overriding if the directive specifies it',function(){
        assert.doesNotThrow(function(){
          eggs($,{
            directives : {
              'attr' : { override : true }
            }
          });
        });
      });

    });

    describe('when setting a custom prefix', function(){

      it('should use that prefix for existing directives',function(){
        var lastValue;
        var $ = cheerio.load('<div><div foo-text="test">');
        var e = eggs($,{prefix:'foo'});
        var model = {test : 'pork'};
        e.bind(model);
        assert.equal($.html(),'<div><div foo-text="test">pork</div></div>');
      });

    });

    describe('when setting a selector', function(){

      it('should be constrained to elements inside of that selector',function(){
        var lastValue;
        var $ = cheerio.load('<div><div e-text="test"><div id="pork"><div e-text="test">');
        var e = eggs($,{selector:'#pork'});
        var model = {test : 'pork'};
        e.bind(model);
        assert.equal($.html(),'<div><div e-text="test"><div id="pork"><div e-text="test">pork</div></div></div></div>');
      });
    });

  });
});
