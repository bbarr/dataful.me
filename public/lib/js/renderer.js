define(function(require) {

  var hub = require('hub'),
      utils = require('jsmapper/utils'),
      observable = require('jsmapper/observable'),
      rivets = require('rivets'),
      views, bindings;

  views = {
    
    cache: {},

    register: function(Constructor, template, customName) {
      var name = customName || Constructor.name;
      utils.extend(Constructor.prototype, observable);
      views.cache[name] = { Constructor: Constructor, template: template, name: name };
    }
  }

  bindings = {
    
    cache: [],

    register: function(el, viewInstance, rivetsBinding, view) {
      el.setAttribute('data-view-uid', utils.id());
      bindings.cache.push({ el: el, viewInstance: viewInstance, rivetsBinding: rivetsBinding, view: view })
    },

    find: function(el) {
      for (var i = 0, len = bindings.cache.length; i < len; i++) {
        if (bindings.cache[i].el.getAttribute('data-view-uid') === el.getAttribute('data-view-uid')) return bindings.cache[i];
      }
    },

    reset: function(binding) {
      binding.viewInstance.cleanUp && binding.viewInstance.cleanUp();
      [].slice.call(binding.el.querySelectorAll('[data-view]'))
        .forEach(function(c) { bindings.reset(bindings.find(c)); });
      binding.el.innerHTML = '';
      binding.rivetsBinding.unbind();
      bindings.cache.splice(bindings.cache.indexOf(binding), 1);
    }
  }

  scanner = {

    childElements: function(el) {
      return [].slice.call(el.childNodes).filter(function(c) { return c.nodeType === 1; });
    },

    inDOM: function(el) {
      while (el = el.parentNode) {
          if (el == document) {
              return true;
          }
      }
      return false;
    },

    go: function(el, skipContainer) {
      el = el || document.body;

      var els = [ el ].concat([].slice.call(el.querySelectorAll('[data-view]')))
      if (skipContainer) els.shift();

      // clean up missing elements
      for (var i = 0; i < bindings.cache.length; i++) {
        if (!scanner.inDOM(bindings.cache[i].el)) {
          bindings.reset(bindings.cache[i]);
          i--; // try this node again
        }
      }

      // check for new/changed views
      var len = els.length;
      for (i = 0; i < len; i++) this.testElement(els[i]);
    },

    testElement: function(el) {

      if (!scanner.inDOM(el)) return;

      var name = el.getAttribute('data-view');
      if (!name) return;

      var args = name.split(' ');
      var viewName = args.shift();
      var view = views.cache[viewName];
      if (!view) return;
      
      var binding = bindings.find(el);
      if (binding) {
        if (binding.view.name === viewName) return;
        else {
          bindings.reset(binding);
        }
      }

      scanner.bindAndRender(el, view, args);
    },

    bindAndRender: function(el, view, args) {

      var viewInstance = new view.Constructor(args);
      if (!view.template) return;

      var html = this.render(view.template);
      el.appendChild(html);

      var rivetsBinding = rivets.bind(el, viewInstance);
      bindings.register(el, viewInstance, rivetsBinding, view);

      //HAX
      viewInstance.rendered && setTimeout(function() { viewInstance.rendered() }, 200);
      scanner.go(el, true);
    },

    render: function(template) {
      var html = document.createElement('div');
      html.innerHTML = template;
      var childElements = scanner.childElements(html);
      if (childElements.length == 1) {
        html = childElements[0];
      }
      return html;
    }
  }

  // expose via some handy-dandy events
  hub.on('registerView', views.register, views);
  hub.on('scanForViews', scanner.go, scanner);

});
