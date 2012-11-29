define([
  'backbone',
  'app/models/entry'
], function(Backbone, Entry) {
  
  return Backbone.Collection.extend({

    url: '/entries',
    model: Entry,
    
    comparator: function(e) {
      return -(new Date(e.get('created_at')).getTime())
    }
  });
});
