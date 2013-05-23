define(function(require) {

  var events = {},
      debug = require('debug');

  return {

    on: function(name, cb, scope) {
      var qs = events;
      cb.scope = scope || this;
      (qs[name] || (qs[name] = [])).push(cb);
    },

    once: function(name, cb, scope) {
      var _this = this,
          cbAndRemove = function() {
            _this.off(name, cbAndRemove);
            cb.apply(scope, arguments);
          }
      this.on(name, cbAndRemove, scope);
    },

    off: function(name, cb) {

      var queue = events[name];
      if (!queue) return;

      if (cb) {
        var index = queue.indexOf(cb);
        if (index > -1) {
          queue.splice(index, 1); 
          if (queue.length === 0) {
            delete events[name];
          }
        }
      } else {
        delete events[name];
      }
    },

    trigger: function(name) {

      var queue = events[name];
      if (!queue || !queue.length) return;

      var args = [].slice.call(arguments, 1);
      for (var i = queue.length - 1; i >= 0; i--) {
        debug.log('Triggering event: ', name, ' with ', args);
        queue[i].apply(queue[i].scope, args);
      }
    }
  }
});
