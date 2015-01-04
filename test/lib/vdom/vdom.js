var assert = require('assert');
var $ = require('jquery');
var VirtualDom = require('../../../lib/vdom/vdom');

describe('VirtualDom',function(){
  var mainHTML = require('../../fixtures/fieldsHTML.js');
  var initialElement;
  var vDom;

  beforeEach(function(){
    var currentElement = initialElement = $(mainHTML);
    currentElement.addClass('vdom-test-root');
    $('body').append(currentElement);
    vDom = new VirtualDom($,currentElement);
  });

  afterEach(function(){
    vDom.rootNode.remove();
  });

  describe('initializing a new virtual dom with existing content',function(){

    it('should replace the root element',function(){
      assert(!initialElement[0].parentNode);
    });

    it('should return an isolated context when context() is called',function(){
      var context = $(vDom.context());
      assert(context.is('.vdom-test-root'));
      context.addClass('testingMutation');
      var actualNode = $('.vdom-test-root');
      assert(!actualNode.is('.testingMutation'));
    });

    it('should update the main root when rendering a context',function(){
      var context = $(vDom.context());
      context.addClass('testingRender');
      var actualNode = $('.vdom-test-root');
      vDom.render(context);
      assert(actualNode.is('.testingRender'));
    });

  });

  describe('changing values',function(){

    var getValueElement = function(root){
      return root[0].children[0].children[0].children[1];
    };

    it('should render a new value properly',function(){
      var context = $(vDom.context());
      var valEl = getValueElement(context);
      $(valEl).addClass('testValueElement').val('my great new value');
      vDom.render(context);
      var rendered = $('.testValueElement');
      assert.equal(rendered.val(),'my great new value');
    });

  });

});
