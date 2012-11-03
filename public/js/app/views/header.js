define([
  'backbone',
  'marker'
], function(Backbone, Marker) {
  
  return Backbone.View.extend({
    
    el: '#header',

    template: 'header',

    render: function() {
      var html = Marker.render(this.template);
      this.$el.append(html);
    }
  });
});
