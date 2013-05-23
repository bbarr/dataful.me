define(function(require) {

  var Backbone = require('backbone');

  return Backbone.Model.extend({

    urlRoot: '',

    url: '/session',

    isNew: function() { return this.get('email'); },

    login: function() {
      this.save({ email: this.get('email'), password: this.get('password') }, { wait: true });
      hub.trigger('modal:close');
    },

    logout: function() {
      var self = this;
      this.destroy().success(function() { self.clear(); });
    }
  });
});
