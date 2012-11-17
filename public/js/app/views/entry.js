define([
  'backbone'
], function(Backbone) {
  
  return Backbone.View.extend({
    
    events: {
      'click .remove': 'remove'
    },

    initialize: function() {
      this.model.on('destroy', this.remove_html, this);
    },

    render: function() {
      var html = Marker.render('entry', this.model);
      this.$el.append(html);
      return this;
    },

    remove: function(e) {
      e.preventDefault();
      this.model.destroy({ wait: true });
    },

    remove_html: function() {
      this.$el.remove();
    }
  });
});
