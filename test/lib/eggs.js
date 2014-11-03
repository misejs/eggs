var assert = require('assert');

var eggs = require('../../lib/eggs');
var cheerio = require('cheerio');

describe('eggs',function(){

  it('should create a new instance of eggs when called',function(){
    var e = eggs();
    e.someproperty = 'something';
    e = eggs();
    assert(!e.someproperty);
  });

  it('should expose a bind function',function(){
    assert(eggs().bind);
  });

  it('should throw an exception if eggs.$ is not set or not a function',function(){
    assert.throws(function(){
      eggs().bind({});
    },/You must set a \$ variable on eggs/);
    assert.throws(function(){
      var e = eggs();
      e.$ = {};
      e.bind({});
    },/You must set a \$ variable on eggs/);
  });

  it('should bind to the body if no selector option is provided',function(){
    var e = eggs();
    e.$ = cheerio.load('<html>');
    e.bind({});
    assert.equal(e.selector,'body');
  });

  it('should have the built-in directives',function(){
    var e = eggs();
    assert.equal(Object.keys(e.directives).length,9);
  });

  describe('options',function(){

    describe('when adding custom directives',function(){

      it('should properly update the directive when data updates',function(){
        // TODO
      });

      it('should throw an error if you try to override an existing directive',function(){
        assert.throws(function(){
          eggs({
            directives : {
              'attr' : {}
            }
          });
        },'Tried to override a built-in directive (attr) without specifying it as an override.');
      });

      it('should allow overriding if the directive specifies it',function(){
        assert.doesNotThrow(function(){
          eggs({
            directives : {
              'attr' : { override : true }
            }
          });
        });
      });

    });

    describe('when setting a custom prefix', function(){
      // TODO
    });

    describe('when setting a selector', function(){
      // TODO
    });

  });
});
