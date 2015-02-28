var utils = require('./utils');
var events = require('../events');

var model = function(key,val,node,model){


  var changed = function(e){
    var el = e.target;
    var value = utils.domValue(el);
    el.setAttribute('value',value);
    if(model[key] !== utils.domValue(el)) {
      model[key] = utils.domValue(el);
    }
  };
  // TODO: this will nuke `on` directive events, it's an edge case but should be fixed at some point.
  // TODO: fix input - needs to track so it won't blur the field (needs to not update any properties, so updating the events should only happen when it doesn't have an event yet.) (we'll probably need unique IDs on each model for this to work...)
  // events.removeEvents(node,'input');
  events.removeEvents(node,'change');
  // events.addEvent(node,'input',changed);
  events.addEvent(node,'change',changed);
  // set the value if it's not already that value.
  utils.value(node,val);
};

module.exports = model;
