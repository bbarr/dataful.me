define([
  'backbone',
  'app/views/chart'
], function(Backbone, ChartView) {
  
  return Backbone.View.extend({
    
    template: 'stat',
    events: {
      'click .remove': 'remove'
    },

    initialize: function() {
      this.model.on('destroy', this.remove_html, this);
    },

    render: function() {
      var html = Marker.render(this.template, this.model);
      this.$el.append(html);
      this.chart = new ChartView({ el: html.cache.chart }).render();
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

