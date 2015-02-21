var assert = require('assert');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe('eggs attr directive',function(){
  var e;
  var vm;
  var out;

  before(function(ready){
    var html = '<div><div e-attr="nothing"><div id="content"><div e-attr="nothing"></div><div e-attr="something:somevalue"></div><div e-attr="one:pork,two:pie,three"></div></div></div></div>';
    function VM(){
      this.somevalue = 'whatever';
      this.nothing = 'some-value';
      this.pie = 'pieValue';
      this.three = 'three-value';
      this.testing = false;
      this.pork = 'beans';
    };
    e = eggs(html,{selector : '#content'},VM,ready);
    vm = e.viewModel;
  });

  it.only('should set an attribute to the associated property of the model',function(){
    assert(/some-value="some-value"/.test(e.html()));
  });

  it('should set an attribute to the computed value of a property if available',function(){
    assert(/something="whatever"/.test(e.html()));
  });

  it('should set multiple properties when provided a single statement',function(){
    var fragment = utils.htmlEscape(out);
    assert(/one="/.test(out),'expected to find attribute one in html fragment: ' + fragment);
    assert(/two="/.test(out),'expected to find attribute two in html fragment: ' + fragment);
    assert(/three-value="/.test(out),'expected to find attribute three-value in html fragment: ' + fragment);
  });

  it('should set the value to a the value of the property by that name when both value and key are provided',function(){
    assert(/two="pieValue"/.test(out));
  });

  it('should set an attribute to the associated property when provided as part of a map',function(){
    assert(/three-value="three-value"/.test(out));
  });

  it('should remove an attribute if set to false',function(done){
    vm.somevalue = false;
    setTimeout(function(){
      assert(!/whatever/.test($.html()));
      vm.somevalue = true;
      done();
    },utils.updateTimeout);
  });

  describe('when changing specific attributes',function(){
    var e;
    var vm;

    before(function(done){
      var html = '<div id="container"> <input id="input" e-attr="type:type"/>';
      function VM(){
        this.type = 'checkbox';
      };
      e = eggs(html,{selector : '#container'},VM,done);
      vm = e.viewModel;
    });

    it('should have the correct type attribute when changing type',function(){
      console.log(e.html());
      // assert.equal($('#input').attr('type'),'checkbox');
    });

    it('should be able to change the type when on the client',function(done){
      vm.type = 'password';
      setTimeout(function(){
        console.log(e.html());
        // assert.equal($('#input').attr('type'),'password');
        done();
      },utils.updateTimeout);
    });
  });

});
