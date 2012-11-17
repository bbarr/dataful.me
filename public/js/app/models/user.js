define([
  'backbone',
  'app/models/session'
], function(Backbone, Session) {
  
  return Backbone.Model.extend({
    
    url: '/user',

    initialize: function() {
      this.session = new Session;
    },

    logout: function(cb) {
      this.session.destroy({ success: cb });
    }
  });
})
