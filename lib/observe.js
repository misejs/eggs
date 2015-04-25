// use the observe-js lib to polyfill O.o() with dirty checking.
var observe = require('observe-js');
var ArrayObserver = observe.ArrayObserver;
var ObjectObserver = observe.ObjectObserver;

var isEmpty = function(o){
  return Object.getOwnPropertyNames(o).length == 0;
};

/**
 * Recursively observe an object, and fire a callback when a key has changed.
 * @param {object} object - the object to observe
 * @param {function} callback - returns either (added, removed, changed, getOldValueFn) if an object, or (splices) if an array.
 */
var observe = function(object,callback){
  var observer;
  var callbackFn;
  if (Array.isArray(object)) {
    observer = new ArrayObserver(object);
    object.forEach(function(o){
      observe(o,callback);
    });
    callbackFn = function(splices){
      splices.forEach(function(splice) {
        var i=splice.index;
        var l=splice.addedCount;
        // observe any new values
        if(l>i){
          for(i;i<l;i++){
            observe(object[i]);
          }
        }
      });
      if(splices.length > 0) callback.apply(this,arguments);
    };
  } else if(object && typeof object === 'object') {
    observer = new ObjectObserver(object);
    for (var k in object) {
      observe(object[k],callback);
    }
    // observe new values when added
    callbackFn = function(added, removed, changed){
      Object.keys(changed).forEach(function(property) {
        observe(changed[property],callback);
      });
      if(!isEmpty(changed)) callback.apply(this,arguments);
    };
  }
  if (observer) {
    observer.open(callbackFn);
  }
};

module.exports = observe;
