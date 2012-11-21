define([
  'backbone'
], function(Backbone) {
  
  return Backbone.View.extend({

    el: '#feedback',
    
    initialize: function() {
      this.hub.on('feedback', this.render, this);
    },

    render: function(msg, options) {
      console.log(msg);
      this.$el.html(msg);
    }
  });
});
