define([
  'backbone',
  'app/models/entry'
], function(Backbone, Entry) {
  
  return Backbone.Collection.extend({

    url: '/entries',
    model: Entry

  });
});
