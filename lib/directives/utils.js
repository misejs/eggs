/*!
 * Shared DOM utilities for use in directives.
 * Some jquery methods need some help when used isomorphicly or when trying to shoehorn es5+ only support.
 */

var value = function(el,value){
  var contenteditable = el.is('[contenteditable]');
  var checkable = el.is('[type="radio"],[type="checkbox"]');
  var select = el.is('select');
  if(contenteditable){
    return value ? el.text(value) : el.text();
  } else if(checkable){
    if(value){
      return el.val('checked','checked');
    } else if(value === false) {
      return el.removeAttr('checked');
    } else {
      return el.is(':checked');
    }
  } else if(select){
    if(!value && value !== false){
      return el.val();
    } else {
      el.find('option').filter(function(){
        if(this.attribs){
          return this.attribs['value'] == value;
        } else {
          return this.getAttribute('value') == value;
        }
      }).attr('selected',!!value);
    }
  } else if(el.is('textarea')) {
    return value ? el.text(value) : el.val();
  } else {
    return value ? el.attr('value',value) : el.val();
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
