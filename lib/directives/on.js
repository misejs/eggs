var utils = require('./utils');
var events = require('../events');

var on = function(key,val,node,model){
  if(typeof val != 'function'){
    return console.error('Attempt to bind .on handler with a vm value that was not a function.');
  }
  // TODO: need something similar to model here to avoid deleting unrelated events but also avoid double-binding.
  events.removeEvents(node,key);
  events.addEvent(node,key,val);
};

module.exports = on;
