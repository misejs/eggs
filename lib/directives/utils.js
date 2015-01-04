/*!
 * Shared DOM utilities for use in directives.
 * Some jquery methods need some help when used isomorphicly or when trying to shoehorn es5+ only support.
 */

var value = function(el,value,force){
  var contenteditable = el.is('[contenteditable],textarea');
  var checkable = el.is('[type="radio"],[type="checkbox"]');
  var select = el.is('select');
  var args = [];
  if(value || force) args.push(value);
  if(contenteditable){
    el.text.apply(el,args);
  } else if(checkable){
    args[0] = !!args[0];
    args.unshift('checked');
    el.attr.apply(el,args);
  } else if(select){
    el[0].value = value;
  } else {
    args.unshift('value');
    el.attr.apply(el,args);
  }
};
value.requiredMethods = ['attr','text','is'];

var outerHTML = function($,element){
  return $('<p>').append(element.clone()).html();
}
outerHTML.requiredMethods = ['html','append','clone'];

module.exports = {
  value : value,
  outerHTML : outerHTML
};
