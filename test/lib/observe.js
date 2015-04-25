var assert = require('assert');

var observe = require('../../lib/observe');
var utils = require('../utils');

describe('observe',function(){

  describe('single level object', function() {

    it('should fire an update when a property is changed', function(done) {
      var o = { key: 'val' };
      observe(o, function(added, removed, changed, oldValueFn) {
        assert.equal(oldValueFn(Object.keys(changed)[0]), 'val');
        assert.deepEqual(changed, {key: 'test'});
        done()
      });
      o.key = 'test';
    });

  });

  describe('objects inside of an array', function() {

    it('should fire a single event when an object inside of an array is changed', function(done) {
      var calledCount = 0;
      var callback = function(added, removed, changed, oldValueFn) {
        calledCount++;
      };
      var o = [{a:1}, {b:1}];
      observe(o, callback);
      o[0].a = 'testing';
      setImmediate(function(){
        assert.equal(calledCount, 1);
        done();
      });
    });

  });

});
