define(function(require) {

  var hub = require('hub'),
      template = require('text!../../html/stats.html'),
      Stat = require('../models/stat');

  function StatsView() {
    this.stats = [];

    var self = this;
    Stat.load().success(function(stats) { self.stats = stats; });

    hub.on('getStatById', function(id, cb) {
      var filtered = this.stats.filter(function(s) { return s.meta('id') == id });
      cb(filtered[0]);
    }, this);

    hub.on('removedStat', function(stat) {
      this.stats = this.stats.filter(function(s) { return s !== stat; });
    }, this);
  };

  StatsView.prototype = {

    add: function() {
      this.stats.unshift(new Stat({ editing: true }));
    }
  };

  hub.trigger('registerView', StatsView, template);
});

