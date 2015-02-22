/*!
 * Shared DOM utilities for use in directives.
 */

var isVText = require('virtual-dom/vnode/is-vtext');
var VText = require('virtual-dom/vnode/vtext');

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
    fn(el,i);
  }
}

module.exports = {
  value : value,
  reverseEnumerate : reverseEnumerate,
  setText : setText,
  domValue : domValue
};
