var assert = require('assert');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe('eggs show directive',function(){
  var e;
  var vm;

  before(function(ready){
    var html = '<div><div e-html="html"><div id="content"><div id="showme" e-show="show"></div></div></div></div>';
    e = eggs(html,{selector : '#content'},function(){},ready);
    vm = e.viewModel;
  });

  it('should hide an element if the value is falsey',function(done){
    vm.show = false;
    setTimeout(function(){
      var show = utils.toHTML(utils.findNode(e.html(),'#showme')[0]);
      assert.ok(/display: none;/.test(show));
      done();
    },utils.updateTimeout);
  });

  it('should show an element if the value is truthy',function(done){
    vm.show = true;
    setTimeout(function(){
      var show = utils.toHTML(utils.findNode(e.html(),'#showme')[0]);
      assert.ok(!/display/.test(show));
      done();
    },utils.updateTimeout);
  });
});
