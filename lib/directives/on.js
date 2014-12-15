var on = function(key,val,element,model){
  // cheerio doesn't support this, so we'll ignore it if there is no .on method.
  if(typeof element.on == 'function'){
    element.on(key,function(){
      if(typeof model[val] == 'function'){
        var args = Array.prototype.slice.call(arguments);
        model[val].apply(this,args);
      } else {
        console.error('Attempt to fire .on handler with a vm value that was not a function.');
      }
    });
  }
};

on.requiredMethods = ['on'];

module.exports = on;
