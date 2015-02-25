/*!
 * Shared DOM utilities for use in directives.
 */

var isVText = require('virtual-dom/vnode/is-vtext');
var VText = require('virtual-dom/vnode/vtext');
var EventSinks = require('event-sinks/geval');
var event = require('html-delegator/event');

function setText(node,val){
  // remove any previous text node
  for(var i=0;i<node.children.length;i++){
    if(isVText(node.children[i])){
      node.children.splice(i,1);
      break;
    }
  }
  if(val){
    node.children.push(new VText(val));
  }
}

function getText(node){
  for(var i=0;i<node.children.length;i++){
    if(isVText(node.children[i])){
      return node.children[i].text;
    }
  }
}

function selectValue(node,value){
  for(var i=0;i<node.children.length;i++){
    var option = node.children[i];
    if(option.tagName !== 'option') continue;
    if(option.properties.value == value){
      option.properties.selected = 'selected';
      return value;
    } else if(!value) {
      if(option.properties.selected) return option.value;
    } else {
      delete option.properties.selected;
    }
  }
}

function value(node,val){
  var setValue = val === undefined ? null : val;
  var checkable = node.properties.type === 'radio' || node.properties.type === 'checkbox';
  var select = node.tagName === 'select';
  if(node.tagName == 'textarea'){
    if(setValue) setText(node,setValue);
    return getText(node);
  } else if(checkable) {
    if(setValue === false) {
      delete node.properties.checked;
    } else if(setValue) {
      node.properties.checked = 'checked';
    }
    return !!node.properties.checked;
  } else if(select) {
    return selectValue(node,setValue);
  } else {
    if(setValue) node.properties.value = setValue;
    return node.properties.value;
  }
}

function domValue(element){
  var val = element.value;
  var type = element.getAttribute('type');
  if(/^input$/i.test(element.tagName) && (type === 'checkbox' || type === 'radio')){
    val = element.checked;
  }
  return val;
}

function reverseEnumerate(arr,fn){
  var i=arr.length-1;
  for(i;i>=0;i--){
    var el = arr[i];
    if(fn(el,i) === true) break;
  }
}

var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};
function htmlEscape(str){
  return String(str).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
}

var reverseEntityMap = {
  "&amp;"  : "&",
  "&lt;"   : "<",
  "&gt;"   : ">",
  '&quot;' : '"',
  '&#39;'  : "'",
  '&#x2F;' : "/"
};
function htmlUnescape(str){
  var str = String(str);
  Object.keys(reverseEntityMap).forEach(function(e){
    str = str.replace(new RegExp(e,'g'),reverseEntityMap[e]);
  });
  return str;
}

var uid = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

var addEvent = function(delegator,eventName,key,node,fn){
  // only add events if we have a delegator.
  if(delegator){
    var inputs = EventSinks(delegator.id,[key]);
    var sinks = inputs.sinks;
    var events = inputs.events;
    // TODO: this overwrites other events with the same key. We need to make the key unique.
    var eventSink = event(sinks[key]);
    events[key](function(){
      var args = Array.prototype.slice.call(arguments);
      args.unshift(eventSink);
      fn.apply(this,args);
    });
    // TODO: this will overwrite other events, so we should probably put them in a pool and delete them when we call parseDirective.
    node.properties.dataset[eventName] = eventSink;
  }
}

module.exports = {
  value : value,
  reverseEnumerate : reverseEnumerate,
  setText : setText,
  domValue : domValue,
  htmlEscape : htmlEscape,
  htmlUnescape : htmlUnescape,
  uid : uid,
  addEvent : addEvent
};
