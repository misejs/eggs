/*!
 * Shared DOM utilities for use in directives.
 */

var value = function(el,value){
  var contenteditable = el.is('[contenteditable]');
  var checkable = el.is('[type="radio"],[type="checkbox"]');
  var select = el.is('select');
  if(contenteditable){
    return value ? el.text(value) : el.text();
  } else if(checkable){
    if(value){
      return el.attr('checked','checked');
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

function reverseEnumerate(arr,fn){
  var i=arr.length-1;
  for(i;i>=0;i--){
    var el = arr[i];
    fn(el,i);
  }
}

module.exports = {
  value : value,
  reverseEnumerate : reverseEnumerate
};
