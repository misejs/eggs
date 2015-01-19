var assert = require('assert');
var parseOptions = require('../../lib/parseOptions');

describe('parseOptions',function(){

  var model;

  beforeEach(function(){
    model = {
      foo : 'bar',
      baz : {
        pork : 'beans',
        very : {
          deep : {
            value : 'buttbutt'
          }
        }
      },
      val : 'value'
    };
  });

  it('should parse a single option without a mapped value correctly',function(){
    parseOptions(model,'foo',function(name,value,keydefined){
      assert.equal(name,'foo');
      assert.equal(value,'bar');
      assert.equal(keydefined,false);
    });
  });

  it('should use the corresponding value instead of the value string when defined',function(){
    parseOptions(model,'foo:foo',function(name,value,keydefined){
      assert.equal(name,'foo');
      assert.equal(value,'bar');
    });
  });

  it('should report that the key was defined if it was',function(){
    parseOptions(model,'foo:bar',function(name,value,keydefined){
      assert(keydefined);
    });
  });

  it('should report that the key was not defined if it wasn\'t',function(){
    parseOptions(model,'foo',function(name,value,keydefined){
      assert.equal(keydefined,false);
    });
  });

  it('should properly parse deep values',function(){
    parseOptions(model,'foo:baz.very.deep.value',function(name,value,keydefined){
      assert.equal(value,'buttbutt');
    });
  });

  it('should properly parse multiple values',function(){
    var count = 0;
    parseOptions(model,'a:foo,b:baz.pork,c:val',function(name,value,keydefined){
      count++;
      var expected;
      switch(name){
        case 'a':
          expected = 'bar';
          break;
        case 'b':
          expected = 'beans';
          break;
        case 'c':
          expected = 'value';
          break;
        default:
          assert(false,'unexpected option.');
          break;
      }
      assert.equal(value,expected);
    });
    assert.equal(count,3);
  });

});
