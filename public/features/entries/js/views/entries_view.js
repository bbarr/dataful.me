define(function(require) {

  var hub = require('hub'),
      template = require('text!../../html/entries.html'),
      Entry = require('../models/entry');

  function EntriesView() {
    var self = this;
    this.entries = [];
    Entry.load().success(function(entries) { self.entries = entries; });
  };

  EntriesView.prototype = {

  };

  hub.trigger('registerView', EntriesView, template);
});
