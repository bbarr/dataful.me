define([
  'backbone'
], function(Backbone, Session) {
  
  return Backbone.Model.extend({
    url: '/session',
    isNew: function() { return false }
  });
})
