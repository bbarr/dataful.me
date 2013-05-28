define(function(require) {

  var hub = require('hub'),
      template = require('text!../../html/entry.html'),
      Entry = require('../models/entry');

  function EntryView(args) {
    this.entry = {};
    var self = this;
    hub.trigger('getEntryById', args[0], function(e) { self.entry = e; });
  };

  EntryView.prototype = {

    edit: function() {
      this.entry.editing = true;
    },

    remove: function() {
      var self = this;
      this.entry.destroy().success(function() {
        hub.trigger('removedEntry', self.entry);
      });
    }

  };

  hub.trigger('registerView', EntryView, template);
});

