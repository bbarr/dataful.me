define([
  'backbone',
  'lib/time_parser'
], function(Backbone, time_parser) {
  
  return Backbone.Model.extend({

    initialize: function() {
      this.ensure_date_time();
    },

    ensure_date_time: function() {
      if (this.isNew()) {
        var with_parsed_time = time_parser.parse(this.get('raw'));
        if (with_parsed_time) {
          this.set('raw', with_parsed_time);
        }
      }
    }
  });
});
