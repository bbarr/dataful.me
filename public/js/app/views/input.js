define([
  'backbone',
  'app/views/feedback'
], function(Backbone, Feedback) {
  
  return Backbone.View.extend({
    
    el: '#input',

    events: {
      'blur input': 'submit',
      'submit form': 'submit'
    },

    initialize: function(config) {

      this.entries = config.entries;
      this.stats = config.stats;

      this.feedback = new Feedback;

      this.$form = this.$el.find('form');
      this.$input = this.$form.find('input');
    },

    submit: function(e) {

      e.preventDefault();

      var text = this.$input.val();
      if (!text) return;
      
      var collection = this.is_entry(text) ? this.entries : this.stats;
      collection.create({ raw: text });

      this.$input.val('');
    },

    is_entry: function(text) {
      return !(/"|'/.test(text));
    }
  });
});
