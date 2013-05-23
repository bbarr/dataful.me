define(function(require) {

  var hub = require('hub'),
      template = require('text!../../html/entry_form.html'),
      Entry = require('../models/entry');

  function EntryFormView(id) {
    this.entry = {};
    var self = this;
    hub.trigger('getEntryById', id, function(e) { self.entry = e; });
  };

  EntryFormView.prototype = {

    save: function() {
      var self = this;
      this.entry.save().success(function() {
        self.entry.editing = false;
      });
    }

  };

  hub.trigger('registerView', EntryFormView, template);
});

