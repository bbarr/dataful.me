define(function(require) {

  var hub = require('hub'),
      template = require('text!../../html/home.html'),
      Session = require('shared/js/models/session'),
      User = require('shared/js/models/user');

  function HomeView() {
    this.newSession = new Session;
    this.newUser = new User;
    this.showingLogin = true;
  }

  HomeView.prototype = {

    showSignup: function() {
      this.showingLogin = false;
    },

    showLogin: function() {
      this.showingLogin = true;
    },
    
    login: function() {
      this.newSession.save().success(function() {
        hub.trigger('session:created');
      }).error(function(errors) {
        console.log(errors);
      });
    },

    signup: function() {
      this.newUser.save().success(function() {
        hub.trigger('session:created');
      }).error(function(errors) {
        console.log(errors);
      });
    }
  };

  hub.trigger('registerView', HomeView, template);
});
