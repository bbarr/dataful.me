define([
  'backbone',
  'app/views/entry'
], function(Backbone, EntryView) {
  
  return Backbone.View.extend({

    el: '#entries',
    template: 'entries',
    
    initialize: function() {
      this.collection.on('reset', this.render, this);
    },

    render: function() {

      var html = Marker.render(this.template, this.collection);
      this.$list = $(html.cache.list);

      this.collection.each(function(entry) {
        this.$list.append(new EntryView({ model: entry }).render().el);
      }, this);

      this.$el.html('').append(html);
    }
  });
});
