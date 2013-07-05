define(function(require) {

  var hub = require('hub'),
      template = require('text!../../html/nav.html'),
      Session = require('shared/js/models/session');

  function NavView() {

  }

  NavView.prototype = {

    viewSettings: function() {
      debugger
    },

    logout: function() {
      new Session().destroy().success(function() {
        hub.trigger('session:destroyed');
      });
    }
  };

  hub.trigger('registerView', NavView, template);
});
