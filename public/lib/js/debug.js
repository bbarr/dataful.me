define(function(require) {

  var noConsole = typeof console === 'undefined';

  return {
    
    log: function() {
      if (noConsole) return;
      console.log.apply(console, arguments);
    },

    warn: function() {
      if (noConsole) return;
      console.warn.apply(console, arguments);
    }
  }
});
