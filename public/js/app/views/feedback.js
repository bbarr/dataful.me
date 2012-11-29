define([
  'backbone'
], function(Backbone) {
  
  return Backbone.View.extend({

    el: '#feedback',
    
    initialize: function() {
      this.hub.on('feedback', this.render, this);
      this.open = true;
    },

    render: function(msg, options) {
      return;
      this.$el
        .show('fast')
        .html(msg)
        .delay(3000)
        .hide('slow');
    }
  });
});
