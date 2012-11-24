define([
  'backbone',
  'app/models/entry'
], function(Backbone, Entry) {
  
  return Backbone.Collection.extend({

    url: '/entries',
    model: Entry,
    
    comparator: function(first, second) {
      return +(new Date(first.get('created_at'))) < +(new Date(second.get('created_at')));
    }
  });
});
