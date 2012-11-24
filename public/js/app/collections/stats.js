define([
  'backbone',
  'app/models/stat'
], function(Backbone, Stat) {
  
  return Backbone.Collection.extend({

    model: Stat,
    url: '/stats'

  });
});
