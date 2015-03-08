var assert = require('assert');

var eggs = require('../../../lib/eggs');
var utils = require('../../utils');

describe('eggs repeat directive',function(){
  var e;
  var vm;

  before(function(ready){
    var html = '<div id="content">\
      <ul id="ul" e-repeat="items">\
        <li>\
          <h3 e-text="key"></h3>\
        </li>\
      </ul>\
    </div>';
    function VM(){
      this.items = [
        { key : 'item one' },
        { key : 'item two' },
        { key : 'item three' }
      ]
    };
    e = eggs(html,{selector : '#content'},VM,ready);
    vm = e.viewModel;
  });

  it('should create the proper number of children',function(){
    var ul = utils.findNode(e.html(),'#ul')[0];
    assert.equal(ul.children.length,3);
  });

  it('should evaluate each child in the correct context',function(){
    var ul = utils.findNode(e.html(),'#ul')[0];
    ul.children.forEach(function(child,idx){
      var text;
      switch(idx){
        case 0:
          text='item one';
          break;
        case 1:
          text='item two';
          break;
        case 2:
          text='item three';
          break;
      }
      var h3 = utils.findNode(child,'h3')[0];
      var h3text = h3.children[0].text;
      assert(h3text,text);
    });
  });

  describe('adding and removing items',function(){
    it('should remove the DOM element when removing an item',function(done){
      vm.items.pop();
      setTimeout(function(){
        var ul = utils.findNode(e.html(),'#ul')[0];
        assert.equal(ul.children.length,2);
        done();
      },utils.updateTimeout);
    });
    it('should replace html when replacing the array',function(done){
      vm.items = [ { key : 'new item' } ];
      setTimeout(function(){
        var ul = utils.findNode(e.html(),'#ul')[0];
        var els = ul.children;
        assert.equal(els.length,1);
        var h3 = utils.findNode(els[0],'h3')[0];
        var h3text = h3.children[0].text;
        assert.equal(h3text,'new item');
        done();
      },utils.updateTimeout);
    });
    it('should be able to add even if no DOM elements exist',function(done){
      vm.items = [];
      setTimeout(function(){
        var ul = utils.findNode(e.html(),'#ul')[0];
        assert.equal(ul.children.length,0);
        vm.items.push({ key : 'pushed one' });
        setTimeout(function(){
          var ul = utils.findNode(e.html(),'#ul')[0];
          var els = ul.children;
          assert.equal(els.length,1);
          var h3 = utils.findNode(els[0],'h3')[0];
          var h3text = h3.children[0].text;
          assert.equal(h3text,'pushed one');
          vm.items.push({ key : 'pushed two' });
          setTimeout(function(){
            var ul = utils.findNode(e.html(),'#ul')[0];
            var els = ul.children;
            assert.equal(els.length,2);
            var h3 = utils.findNode(els[1],'h3')[0];
            var h3text = h3.children[0].text;
            assert.equal(h3text,'pushed two');
            done();
          },utils.updateTimeout);
        },utils.updateTimeout);
      },utils.updateTimeout);
    });
  });

  describe('nested repeats', function(){
    var e;
    var vm;

    before(function(ready){
      var html = '<div id="content">\
        <ul id="ul" e-repeat="items">\
          <li e-repeat="list">\
            <p e-text="text"></p>\
          </li>\
        </ul>\
      </div>';
      function VM() {
        this.items = [
          { list : [{text : 'a one'},{text : 'a two'}] },
          { list : [{text : 'b one'},{text : 'b two'}] }
        ];
      };
      e = eggs(html,{selector : '#content'},VM,ready);
      vm = e.viewModel;
    });

    it('should have the proper number of top level childen',function(){
      var ul = utils.findNode(e.html(),'#ul')[0];
      assert.equal(ul.children.length,2);
    });

    it('should have the proper number of nested children at each level', function(){
      var ul = utils.findNode(e.html(),'#ul')[0];
      assert.equal(ul.children[0].children.length,2);
      assert.equal(ul.children[1].children.length,2);
      assert.equal(ul.children[1].children[1].children[0].text,'b two');
    });

  });

  describe('with existing server-populated data', function(){
    var e;
    var vm;

    before(function(ready){
      var html = '<div id="content">\
        <ul id="ul" e-repeat="items" data-eggs-repeat-template="&lt;li&gt; &lt;h3 e-text=&quot;key&quot;&gt;&lt;/h3&gt; &lt;/li&gt;">\
          <li>\
            <h3 e-text="key">item one</h3>\
            <h3 e-text="key">item two</h3>\
            <h3 e-text="key">item three</h3>\
          </li>\
        </ul>\
      </div>';
      function VM(){
        this.items = [
          { key : 'item one' },
          { key : 'item two' },
          { key : 'item three' }
        ]
      };
      e = eggs(html,{selector : '#content'},VM,ready);
      vm = e.viewModel;
    });

    it('should have the proper number of children',function(){
      var ul = utils.findNode(e.html(),'#ul')[0];
      assert.equal(ul.children.length,3);
    });
  });

});
