var utils = require('./utils');

var on = function(key,val,node,model){
  if(typeof val != 'function'){
    return console.error('Attempt to bind .on handler with a vm value that was not a function.');
  }
  utils.addEvent(this.delegator,key,key,node,val);
};

module.exports = on;
