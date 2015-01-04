/*!
 * Events - utilities for getting events from a DOM node
 * Note that this implementation is fairly brittle, since it has to work around custom library code.
 */

var parseEvents = function($,element){
  // TODO: add support for non eggs-created (jquery) events. Until then, I believe the virtual dom will clobber other events when initializing and patching.
  var events = $._data($(element)[0],'events');
  if(!events){
    // fallback to old jquery
    events = $(element).data('events');
  }
  if(!events){
    // no events, bail early
    return null;
  }
  // events is now an object with event names and arrays of handlers.
  // normalize them:
  var eventsMap = Object.keys(events).reduce(function(o,eventName){
    o[eventName] = events[eventName].map(function(event){
      var eventObj = {};
      eventObj.type = event.type;
      eventObj.data = event.data;
      eventObj.handler = event.handler;
      eventObj.namespace = event.namespace;
      return eventObj;
    });
    return o;
  },{});
  return eventsMap;
}

module.exports = parseEvents;
