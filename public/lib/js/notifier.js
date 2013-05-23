define(function(require) {

  var Backbone = require('backbone'),
      _ = require('underscore');
  
  return function(obj) { _(obj).extend(Backbone.Events); };
})
