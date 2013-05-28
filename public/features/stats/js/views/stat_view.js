define(function(require) {

  var hub = require('hub'),
      template = require('text!../../html/stat.html'),
      Stat = require('../models/stat');

  function StatView(args) {
    this.stat = {};

    var self = this;
    hub.trigger('getStatById', args[0], function(stat) { self.stat = stat; });
  };

  StatView.prototype = {

    edit: function() {
      this.stat.editing = true;
    },

    remove: function() {
      var self = this;
      this.stat.destroy().success(function() {
        hub.trigger('removedStat', self.stat);
      });
    }
  };

  hub.trigger('registerView', StatView, template);
});


