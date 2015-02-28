var utils = require('./directives/utils');

var event_attr = 'eggs-event-';
var hasDocument = typeof document !== 'undefined';

var eventTypes = {};
var eventsHash = {};

var handleEvent = function(ev){
  var self = this;
  var args = arguments;
  var element = ev.target;
  var typeNames = Object.keys(eventTypes);
  typeNames.forEach(function(type){
    var key = event_attr + type;
    var val = element.getAttribute(key);
    if(val){
      var handlerIds = val.split(':');
      handlerIds.forEach(function(id){
        eventsHash[id].apply(self,args);
      });
    }
  });
};

var addEvent = function(node,type,handler){
  // adds an event
  if(!hasDocument) return false;
  var uid = utils.uid();
  var events = [];
  var key = event_attr + type;
  if(!node.properties.attributes) node.properties.attributes = {};
  if(node.properties.attributes[key]) events = node.properties.attributes[key].split(':');
  events.push(uid);
  eventsHash[uid] = handler;
  node.properties.attributes[key] = events.join(':');
  if(!eventTypes[type]) eventTypes[type] = document.addEventListener(type,handleEvent,true);
  return uid;
};

var removeEvent = function(node,type,uid){
  // removes a single event
  if(!hasDocument) return false;
  var key = event_attr + type;
  if(!node.properties.attributes || !node.properties.attributes[key]) return 0;
  var events = node.properties.attributes[key].split(':');
  utils.reverseEnumerate(events,function(id,idx){
    if(id == uid) return events.splice(idx,1);
  });
  var handler = !!eventsHash[uid];
  delete eventsHash[uid];
  node.properties.attributes[key] = events.join(':');
  return handler ? 1 : 0;
};

var removeEvents = function(node,type){
  // removes all events
  if(!hasDocument) return false;
  var key = event_attr + type;
  if(!node.properties.attributes || !node.properties.attributes[key]) return 0;
  var events = node.properties.attributes[key].split(':');
  var count = 0;
  events.forEach(function(uid){
    count += eventsHash[uid] ? 1 : 0;
    delete eventsHash[uid];
  });
  delete node.properties.attributes[key];
  return count;
};

var events = module.exports = {
  addEvent : addEvent,
  removeEvent : removeEvent,
  removeEvents : removeEvents
};
