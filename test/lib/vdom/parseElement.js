var assert = require('assert');
var utils = require('../../utils');
var parseElement = require('../../../lib/vdom/parseElement');
var createElement = require('virtual-dom/create-element');
var $ = require('jquery');

describe('parseElement',function(){

  var inputHTML = '<input e-if="textInput" e-model="value" e-attr="type:type,name:name,disabled:disabled,value:value" data-eggs-if-template="<input e-if=&quot;textInput&quot; e-model=&quot;value&quot; e-attr=&quot;type:type,name:name,disabled:disabled,value:value&quot;>" value="54a70a94250e156aefb9c697" type="text" name="_id" disabled="true">';
  var currentTree = parseElement($,$(inputHTML));
  var createdDom = createElement(currentTree);

  describe('when item has a value',function(){

    it('should properly set the value on the DOM element when parsing',function(){
      assert.equal(createdDom.value,'54a70a94250e156aefb9c697','value was not properly set on the DOM element');
    });

    it('should have the right value when rendered',function(){
      var newElement = document.createElement('div');
      newElement.appendChild(createdDom);
      assert.equal($(newElement).children().first().val(),'54a70a94250e156aefb9c697','value was not properly set when rendering');
    });

  });

  describe('when item has a custom attribute',function(){

    it('should properly set the attribute on the DOM element when parsing',function(){
      assert.equal(createdDom.getAttribute('e-model'),'value','custom attribute was not set on the DOM element');
    });

    it('should have the attribute when rendered',function(){
      var newElement = document.createElement('div');
      newElement.appendChild(createdDom);
      assert.equal($(newElement).children().first().attr('e-model'),'value','custom attribute was not set when rendering');
    });

  });

});
