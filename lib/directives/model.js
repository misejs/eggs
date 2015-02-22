var utils = require('./utils');
var EventSinks = require('event-sinks/geval');
var event = require('html-delegator/event');

var model = function(key,val,node,model){
  // only add events if we have a delegator.
  if(this.delegator){
    var inputs = EventSinks(this.delegator.id,[key]);
    var sinks = inputs.sinks;
    var events = inputs.events;
    var eventSink = event(sinks[key]);
    events[key](function(){
      var el = document.querySelectorAll('[data-change="'+eventSink+'"]');
      if(!el[0]) console.warn('Warning: still attached to an element that no longer exists.');
      el = el[0];
      model[key] = utils.domValue(el);
    });
    // TODO: this will overwrite other events, so we should probably put them in a pool and delete them when we call parseDirective.
    node.properties['data-click'] = eventSink;
    node.properties['data-change'] = eventSink;
    node.properties['data-input'] = eventSink;
  }
  // set the initial value
  utils.value(node,val);
};

module.exports = model;
