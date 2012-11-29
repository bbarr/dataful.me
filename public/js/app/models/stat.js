define([
  'backbone',
  'lib/time_parser'
], function(Backbone, time_parser) {
  
  return Backbone.Model.extend({
    
    initialize: function() {
    },

    ensure_date_time: function() {
      // this needs updating
      if (this.isNew()) {
        var with_parsed_time = time_parser.parse(this.get('raw'));
        if (with_parsed_time) {
          this.set('raw', with_parsed_time);
        }
      }
    },

    has_value: function() {
      return this.get('value') !== '';
    }
  });
});
