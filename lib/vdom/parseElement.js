/*!
 * Parse element
 * takes a jquery instance and a DOM element
 * parses the element in to vdom virtual hypertext
 */

var h = require('virtual-dom/h');
var parseAttributes = require('./parseAttributes');
var parseEvents = require('./parseEvents');

var parseElement = function($,$element){
 var element = $element[0];
 if(element.nodeType == 3){
   // return text nodes as text
   return element.data;
 } else if (element.nodeType > 3){
   // we don't support comments or other nodes like doctype...
   return null;
 }
 var contents = $element.contents();
 var children = [];
 contents.each(function(i,content){
   children.push(parseElement($,$(content)));
 });
 var properties = parseAttributes(element);
 // TODO: vdom ev-* properties create event hooks, not sure what kind of performance impact this may have.
 // For instance, does re-binding events cause these elements to be diffed? That would be unfortunate.
 var events = parseEvents($,element);
 if(events){
   Object.keys(events).forEach(function(eventName){
     var handlers = events[eventName];
     // Another drawback of doing it this way is that we have to wrap all the events here.
     properties['ev-'+eventName] = function(){
       var ctx = this;
       var args = arguments;
       handlers.forEach(function(ev){
         ev.handler.apply(ctx,args);
       });
     };
   });
 }
 return h(element.nodeName,properties,children);
};

module.exports = parseElement;
