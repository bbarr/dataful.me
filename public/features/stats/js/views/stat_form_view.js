define(function(require) {

  var hub = require('hub'),
      template = require('text!../../html/stat_form.html'),
      Stat = require('../models/stat');

  function StatFormView(args) {
    this.stat = {};
    this.tagKeys = []

    var self = this;

    hub.trigger('requestBaked', function(baked) { self.tagKeys = baked.tagKeys; });

    hub.trigger('getStatById', args[0], function(stat) { 
      self.originalValue = stat.raw;
      self.stat = stat; 
    });

    this.showingFilter = false;
    this.showingTimeFilter = false;
    this.filterText = 'Yes';
    this.timeFilterText = 'Yes';
  };

  StatFormView.prototype = {

    toggleFilter: function() {
      this.stat.showingFilter = !this.stat.showingFilter;
      this.filterText = this.stat.showingFilter ? 'No' : 'Yes';
    },

    toggleTimeFilter: function() {
      this.stat.showingTimeFilter = !this.stat.showingTimeFilter;
      this.timeFilterText = this.stat.showingTimeFilter ? 'No' : 'Yes';
    },

    save: function() {
      var self = this;
      this.stat.raw = this.stat.string;
      this.stat.save().success(function() {
        self.stat.editing = false;
      });
    },

    cancel: function() {
      this.stat.raw = this.originalValue;
      this.stat.editing = false;
      if (!this.stat.raw) hub.trigger('removedStat', this.stat);
    },

    detectCancel: function(e) {
      if (e.keyCode === 27) {
        this.cancel();
      }
    }
  };

  hub.trigger('registerView', StatFormView, template);
});



