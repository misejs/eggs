
eggs
=========

Note: these docs are woefully out of date - once the API stabilizes, this issue (and this readme) will be updated: https://github.com/misejs/eggs/issues/3
----

*server rendering tests:*
[![Build Status](https://travis-ci.org/misejs/eggs.svg)](https://travis-ci.org/misejs/eggs)

*browser rendering tests:*
[![Sauce Test Status](https://saucelabs.com/browser-matrix/eggs.svg)](https://saucelabs.com/u/eggs)

[![Dependencies](https://david-dm.org/misejs/eggs.svg)](https://david-dm.org/misejs/eggs)

An isomorphic html data binding library, built for [mise.js](https://github.com/misejs/mise)

Why:
====

The world probably does not need another data binding library, but after trying nearly all of them, I found that I couldn't make any of them do what I wanted them to do. Namely:

- Isomorphic - I needed a library that will render everywhere
- Size/features - I needed a library that was not trying to do more than binding - just the basics.
- Avoid Dirty checking/polling - Object.observe is a wonderful new API, and while I'm sure everyone will eventually migrate, I'd prefer to have a library that was built with it in mind.
- Native JS objects as viewmodels - I don't want to call `vm.property()` to access it's value, I just want my viewmodels rendered in real time without any modification.

What it does:
============

Similar to other 2-way data binding libraries, eggs relies on viewmodels and data attributes to populate html in real time based on js objects.

Unlike other 2-way data binding libraries, eggs follows these patterns:

- eggs is isomorphic, so it will render both on the server (via node.js), and the client. This means that when you use eggs to render your viewmodels, it bootstraps with your content, so there's no [FOUC](http://en.wikipedia.org/wiki/Flash_of_unstyled_content), and your content is scrapable (and SEO compatible).

- eggs observes your viewmodels greedily and recursively, so you're able to interact with your viewmodels exactly like native js objects. In fact, eggs uses [Object.observe](http://wiki.ecmascript.org/doku.php?id=harmony:observe) under the hood when available, so if you're on a modern browser your viewmodel properties won't even be wrapped (more on this later)

- eggs is extensible with custom directives, but comes with the basics. Directives are just functions, so they are much simpler than Angular or Polymer directives (for better or worse depending on your preference).

- eggs uses jQuery-like APIs under the hood, but does not come with any dependencies except [observe-js](https://github.com/polymer/observe-js), so you can choose your own $. This is mostly done to bridge the DOM apis on the client and server, and for most purposes will require you to use [cheerio](https://github.com/cheeriojs/cheerio) compatible APIs.

- eggs does not store any content on elements, so all rendered html can always be picked back up by another eggs instance.

An example:
==========

install eggs

```sh
$ npm install eggs
```

On the server, spin up a $ variable, an instance of eggs, and bind a viewmodel:

```javascript
var cheerio = require('cheerio');
var eggs = require('eggs');

var $ = cheerio.load('<div id="content">\
  <ul id="ul" e-repeat="items">\
    <li>\
      <h3 e-text="title"></h3>');
function ViewModel(){
  this.items = [
    { title : "Item One" },
    { title : "Item Two" },
    { title : "Item Three" }
  ];
};
eggs($,{selector : '#content'},ViewModel);
```

In your preferred server side library, you can render the content by grabbing the html from cheerio:

```javascript
res.render($.html());
```

This will send the following response to your client:

```html
<div id="content">
  <ul id="ul" e-repeat="items" data-eggs-repeat-template="&lt;li&gt;&lt;h3 e-text=&quot;key&quot;&gt;&lt;/h3&gt;&lt;/li&gt;">
    <li>
      <h3 e-text="title">Item One</h3>
    </li>
    <li>
      <h3 e-text="title">Item Two</h3>
    </li>
    <li>
      <h3 e-text="title">Item Three</h3>
    </li>
  </ul>
</div>
```

On the client, you'll now have bootstrapped content, but you can re-bind if you want to make changes in real time:

```javascript
function ViewModel(){
  this.items = [
    { title : "Item One" },
    { title : "Item Two" },
    { title : "Item Three" }
  ];
};
eggs($,{selector : '#content'},ViewModel);
```

This is a bit of a contrived example, but since your viewmodels now work on both the server and the client, you're able to either generate or retrieve the same data from your API, and it'll be rendered on both.

Also, on the client you can now make changes and it'll automatically update the DOM:

```javascript
viewModel.items.push({ title : 'Another Item'});
```

And now your html will instantly update to:

```html
<div id="content">
  <ul id="ul" e-repeat="items" data-eggs-repeat-template="&lt;li&gt;&lt;h3 e-text=&quot;key&quot;&gt;&lt;/h3&gt;&lt;/li&gt;">
    <li>
      <h3 e-text="title">Item One</h3>
    </li>
    <li>
      <h3 e-text="title">Item Two</h3>
    </li>
    <li>
      <h3 e-text="title">Item Three</h3>
    </li>
    <li>
      <h3 e-text="title">Another Item</h3>
    </li>
  </ul>
</div>
```

We're using 2 directives in this example, `repeat`, and `text`. There are a few more, covered in the API docs.

API Docs:
======

####`constructor/factory`

```javascript
var eggs = require('eggs');

/**
* factory - the factory that instantiates an eggs instance
*
* @param {function} $ - a cheerio-compatible $ Object
* @param {object} options - an optional object with options
* @param {function} ViewModel - a constructor function for a viewModel
* @param {function} callback - an optional callback for when we complete setup
*
* @return {object} eggs - an instantiated eggs object
*/
var e = eggs($,options,ViewModel,callback);
```

the top level eggs object is a factory that returns an instance of eggs.

You must pass a first argument of $, which should be a cheerio compatible, jQuery-like object/function.

The second argument is an optional hash of options, which can be one or more of:

- `selector`   : a css selector of the root level object for the viewmodel you intend to bind. If you pass a selector and it is unmatched, we will not instantiate the passed ViewModel.
- `prefix`     : a string, used to define what the directive prefix is. Defaults to `e`.
- `directives` : a hash of custom directives, with names as keys and directive functions as values.

The third argument is a ViewModel constructor. It must be a function, and will be called by eggs.
The constructor takes one optional argument, a callback for asynchronous ViewModels. If your ViewModel is not asynchronous, don't provide this argument and eggs will run non-async (and still call the main callback).

The last argument is an optional callback, for when eggs has completed initial binding.

####`eggs.update`

```javascript
e.update();
```

Force an update to the latest viewmodel data - this is unnecessary (and does nothing) if your environment supports `Object.observe`, if you're polling, you'll have to call this to get instant updates - otherwise, updates will be delivered to the DOM in 1-100ms.

Directives:
======

###**TODO:**

####`attr`

####`class`

####`html`

####`model`

####`on`

####`repeat`

####`show`

####`style`

####`text`

Custom Directives:
======

###**TODO:**

Caveats:
======

- eggs is still under development, so APIs aren't locked down. However, there's not much to it, so things shouldn't change much.
- There is a significant performance difference when using eggs in an environment that supports `Object.observe` vs ones that don't. On normal browsers, observed models will be polled every 100ms and dirty checked for updates. If you're in Chrome 36+, everything will be much speedier. As more browsers adopt parts of the harmony spec, this library will speed up.
- eggs assumes your audience is somewhat modern. It supports modern browsers, but I won't be making an effort to support < IE 9 or similar. There's a chart at the top of this page with current test status per browser, and all of the directives are fully unit tested in all supported browsers.
- At the time of writing, I'm unaware of any server side jQuery-compatible libraries except cheerio, so although eggs doesn't include it as a dependency, to use eggs on the server you'll have to use it.
