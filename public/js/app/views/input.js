define([
  'backbone',
  'app/views/feedback'
], function(Backbone, Feedback) {
  
  return Backbone.View.extend({
    
    el: '#input',

    events: {
      'submit form': 'submit'
    },

    initialize: function(config) {
      this.entries = config.entries;
      this.stats = config.stats;
      this.entries.on('add', function() { this.hub.trigger('feedback', 'Created entry.'); }, this);
      this.stats.on('add', function() { this.hub.trigger('feedback', 'Created stat.'); }, this);
      this.$form = this.$el.find('form');
      this.$input = this.$form.find('input');
      setTimeout(function() {
        this.$input.focus();
      }.bind(this), 1000);
    },

    submit: function(e) {

      e.preventDefault();

      var text = this.$input.val();
      if (!text) return;
      
      var collection = this.is_entry(text) ? this.entries : this.stats;
      this.hub.trigger('feedback', 'Creating ' + (collection === this.entries ? 'entry' : 'stat') + '.', {
        sticky: true 
      });
      collection.create({ raw: text }, { wait: true });

      this.$input.val('');
    },

    is_entry: function(text) {
      return !(/^count|^average|^usual|^sum/.test(text));
    }
  });
});
