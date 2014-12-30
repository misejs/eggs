/*!
 * Async helper methods
 */

var runSeries = function(array,callback){
 var cb = callback || function(){};
 if(array.length){
   var fn = array.shift();
   fn(function(err){
     if(err) return cb(err);
     runSeries(array,callback);
   });
 } else {
   cb();
 }
};

var runParallel = function(array,parseFn,callback){
  var cb = callback || function(){};
  var toGo = array.length;
  var complete = function(err){
    if(--toGo == 0 || err){
      cb(err);
    }
  };
  if(array.length){
    array.forEach(function(element){
      parseFn(element,complete);
    });
  } else {
    cb();
  }
};

module.exports = {
  forEachSeries : runSeries,
  forEach : runParallel
}
