var utils = require('./utils');
var events = require('../events');

var model = function(key,val,node,model){
  var changed = function(e){
    var el = e.target;
    model[key] = utils.domValue(el);
  };
  events.addEvent(node,'input',changed);
  events.addEvent(node,'change',changed);
  // set the initial value
  utils.value(node,val);
};

module.exports = model;
