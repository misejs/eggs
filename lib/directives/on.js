var on = function(key,val,element,model){
  // cheerio doesn't support this, so we'll ignore it if there is no .on method.
  if(typeof element.on == 'function'){
    if(typeof val != 'function'){
      return console.error('Attempt to bind .on handler with a vm value that was not a function.');
    }
    element.on(key,function(){
      var args = Array.prototype.slice.call(arguments);
      val.apply(this,args);
    });
  }
};

on.requiredMethods = ['on'];

module.exports = on;
