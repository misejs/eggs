var assert = require('assert');
var utils = require('../../utils');
var parseElement = require('../../../lib/vdom/parseElement');
var createElement = require('virtual-dom/create-element');
var $ = require('jquery');

suite('parseElement');

var inputHTML = '<input e-if="textInput" e-model="value" e-attr="type:type,name:name,disabled:disabled,value:value" data-eggs-if-template="<input e-if=&quot;textInput&quot; e-model=&quot;value&quot; e-attr=&quot;type:type,name:name,disabled:disabled,value:value&quot;>" value="54a70a94250e156aefb9c697" type="text" name="_id" disabled="true">';
var currentTree = parseElement($,$(inputHTML));
var createdDom = createElement(currentTree);

test('should properly set the value on the DOM element when parsing',function(){
  assert(createdDom.value === '54a70a94250e156aefb9c697','value was not properly set on the DOM element');
});
