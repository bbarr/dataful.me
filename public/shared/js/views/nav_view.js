define(function(require) {

  var hub = require('hub'),
      template = require('text!../../html/nav.html');

  function NavView() {

  }

  NavView.prototype = {

    logout: function() {
      hub.trigger('logout bitches');
    }
  };

  hub.trigger('registerView', NavView, template);
});