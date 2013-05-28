define(function(require) {

  var hub = require('hub'),
      template = require('text!../../html/entry_form.html'),
      Entry = require('../models/entry');

  function EntryFormView(args) {
    this.entry = {};
    var self = this;
    hub.trigger('getEntryById', args[0], function(e) { 
      self.originalValue = e.raw;
      self.entry = e; 
    });
  };

  EntryFormView.prototype = {

    save: function() {
      var self = this;
      this.entry.save().success(function() {
        self.entry.editing = false;
      });
    },

    cancel: function() {
      this.entry.raw = this.originalValue;
      this.entry.editing = false;
      if (!this.entry.raw) hub.trigger('removedEntry', this.entry);
    },

    detectCancel: function(e) {
      if (e.keyCode === 27) {
        this.cancel();
      }
    }

  };

  hub.trigger('registerView', EntryFormView, template);
});

