define(function(require) {

  var util = require('./util'),
      notifierize = require('./notifier'),
      rivets = require('rivets');

  return function(fn) {

    function View(config) {
      config = config || {};

      this.template = config.template || this.template;
      this.presenter = config.presenter || this.presenter;

      this.render = function() {
        var container = document.createElement('div');
        container.innerHTML = this.template;
        rivets.bind(container, { data: this.presenter });
        return container;
      };

      // add pubsub
      notifierize(this);

      // view specific constructor
      fn.call(this, config);
    };

    View.prototype = fn.prototype;

    return View;
  };
});
