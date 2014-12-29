var template_attr = 'data-eggs-if-template';
var template_selector = '['+template_attr+']';
var template_tag = 'eggstemplatetag';
var shimmed = false;

// shims a custom tag in IE so it's not unhappy.
var shimCustomTag = function(){
  if(shimmed) return;
  if(typeof window != 'undefined') document.createElement(template_tag);
  shimmed = true;
}

var ifDirective = function(key,val,element,model){
  shimCustomTag();
  var $ = this.$;
  var template = element.attr(template_attr);
  if(!template){
    // node hasn't been rendered yet, make the content the template
    template = $(element)[0].outerHTML;
  }
  var el;
  if(val === true){
    el = $(template);
  } else {
    el = $('<'+template_tag+' style="display:none">');
  }
  el.attr(template_attr,template);
  element.replaceWith(el);
  return el;
};

ifDirective.requiredMethods = ['replaceWith','attr','html','style'];

module.exports = ifDirective;
