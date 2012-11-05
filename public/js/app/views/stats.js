define([
  'backbone'
], function(Backbone) {
  
  return Backbone.View.extend({

    el: '#stats',
    template: 'stats',

    initialize: function() {
      this.collection.on('reset', this.render, this);
    },

    render: function() {
      var html = Marker.render(this.template, this.collection);
      this.$el.html('').append(html);
    }
    
  });
});
