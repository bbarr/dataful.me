define([
  'backbone',
  'marker'
], function(Backbone, Marker) {
  
  return Backbone.View.extend({
    
    el: '#header',

    template: 'header',

    events: {
      'click .logout': 'logout'
    },

    render: function() {
      var html = Marker.render(this.template);
      this.$el.append(html);
    },

    logout: function(e) {
      e.preventDefault();
      this.model.logout(function() { window.location.reload(); });
    }
  });
});
