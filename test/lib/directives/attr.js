var assert = require('assert');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe('eggs attr directive',function(){
  var e;
  var vm;
  var out;

  before(function(ready){
    var html = '<div><div e-attr="nothing"><div id="content"><div e-attr="nothing"></div><div e-attr="label:somevalue"></div><div e-attr="name:pork,title:pie,target"></div></div></div></div>';
    function VM(){
      this.somevalue = 'whatever';
      this.nothing = 'role';
      this.pie = 'pieValue';
      this.target = 'target';
      this.testing = false;
      this.pork = 'beans';
    };
    e = eggs(html,{selector : '#content'},VM,function(){
      out = e.html();
      ready();
    });
    vm = e.viewModel;
  });

  it('should set an attribute to the associated property of the model',function(){
    assert(/role="role"/.test(out));
  });

  it('should set an attribute to the computed value of a property if available',function(){
    assert(/label="whatever"/.test(out));
  });

  it('should set multiple properties when provided a single statement',function(){
    var fragment = utils.htmlEscape(out);
    assert(/name="/.test(out),'expected to find attribute name in html fragment: ' + fragment);
    assert(/title="/.test(out),'expected to find attribute title in html fragment: ' + fragment);
    assert(/target="/.test(out),'expected to find attribute target in html fragment: ' + fragment);
  });

  it('should set the value to a the value of the property by that name when both value and key are provided',function(){
    assert(/title="pieValue"/.test(out));
  });

  it('should set an attribute to the associated property when provided as part of a map',function(){
    assert(/target="target"/.test(out));
  });

  it('should remove an attribute if set to false',function(done){
    vm.somevalue = false;
    setTimeout(function(){
      assert(!/whatever/.test(e.html()));
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
      assert.equal(e.html(),'<div id="container"> <input e-attr="type:type" id="input" type="checkbox"></div>');
    });

    it('should be able to change the type when on the client',function(done){
      vm.type = 'password';
      setTimeout(function(){
        assert.equal(e.html(),'<div id="container"> <input e-attr="type:type" id="input" type="password"></div>');
        done();
      },utils.updateTimeout);
    });
  });

});
