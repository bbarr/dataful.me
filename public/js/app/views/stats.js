define([
  'backbone',
  'app/views/stat'
], function(Backbone, StatView) {
  
  return Backbone.View.extend({

    el: '#stats',
    template: 'stats',

    initialize: function(config) {
      this.entries = config.entries;
      this.collection.on('reset', this.render, this);
      this.collection.on('add remove', this.render, this);
      this.entries.on('add remove', function() { this.collection.fetch(); }, this);
    },

    render: function() {

      var html = Marker.render(this.template, this.collection);
      this.$list = $(html.cache.list);

      if (this.collection.length) {
        this.$list.removeClass('empty');
        this.collection.each(function(stat) {
          this.$list.append(new StatView({ model: stat }).render().el);
        }, this);
      } else {
        this.$list.addClass('empty');
      }

      this.$el.html('').append(html);
    }
  });
});
