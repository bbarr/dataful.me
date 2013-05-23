define(function(require) {

  var hub = require('hub'),
      template = require('text!../../html/stat.html'),
      Stat = require('../models/stat');

  function StatView(id) {
    this.stat = {};

    var self = this;
    hub.trigger('getStatById', id, function(stat) { self.stat = stat; });
  };

  StatView.prototype = {

  };

  hub.trigger('registerView', StatView, template);
});


