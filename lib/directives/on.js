var utils = require('./utils');
var events = require('../events');

var on = function(key,val,node,model){
  if(typeof val != 'function'){
    return console.error('Attempt to bind .on handler with a vm value that was not a function.');
  }
  events.addEvent(node,key,val);
};

module.exports = on;
