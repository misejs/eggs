/*!
 * Shared DOM utilities for use in directives.
 * Some jquery methods need some help when used isomorphicly or when trying to shoehorn es5+ only support.
 */

var value = function(el,value){
  var contenteditable = el.is('[contenteditable],textarea');
  var checkable = el.is('[type="radio"],[type="checkbox"]');
  var select = el.is('select');
  var args = [];
  if(value) args.push(value);
  if(contenteditable){
    return el.text.apply(el,args);
  } else if(checkable){
    if(value){
      args[0] = 'checked';
      args.unshift('checked');
      return el.attr.apply(el,args);
    } else if(value === false) {
      return el.removeAttr('checked');
    } else {
      return el.is(':checked');
    }
  } else if(select){
    if(!value && value !== false){
      return el.attr.apply(el,args);
    }
    if(typeof document != 'undefined'){
      // if we have a dom, setting the value will select the right element.
      el[0].value = value;
    } else {
      // if we're in cheerio, we'll need to do this manually.
      el.find('option').filter(function(){
        return this.attribs['value'] == value;
      }).attr('selected',true);
    }
  } else {
    args.unshift('value');
    return el.attr.apply(el,args);
  }
};
value.requiredMethods = ['attr','text','is','removeAttr'];

var outerHTML = function($,element){
  return $('<p>').append(element.clone()).html();
}
outerHTML.requiredMethods = ['html','append','clone','find','filter'];

module.exports = {
  value : value,
  outerHTML : outerHTML
};
