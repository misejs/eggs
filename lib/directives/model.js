var utils = require('./utils');

var model = function(key,val,node,model){
  var changed = function(eventSink){
    var el = document.querySelectorAll('[data-change="'+eventSink+'"]');
    if(!el[0]) console.warn('Warning: still attached to an element that no longer exists.');
    el = el[0];
    model[key] = utils.domValue(el);
  }
  utils.addEvent(this.delegator,'change',key,node,changed);
  utils.addEvent(this.delegator,'input',key,node,changed);
  // set the initial value
  utils.value(node,val);
};

module.exports = model;
