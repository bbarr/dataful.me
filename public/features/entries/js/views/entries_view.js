define(function(require) {

  var hub = require('hub'),
      template = require('text!../../html/entries.html'),
      Entry = require('../models/entry');

  function EntriesView() {
    var self = this;
    this.entries = [];
    Entry.load().success(function(entries) { self.entries = entries; });

    hub.on('getEntryById', function(id, cb) {
      var filtered = this.entries.filter(function(e) { return e.meta('id') == id });
      cb(filtered[0]);
    }, this);

    hub.on('removedEntry', function(entry) {
      this.entries = this.entries.filter(function(e) { return e !== entry; });
    }, this);
  };

  EntriesView.prototype = {

    add: function() {
      this.entries.unshift(new Entry({ editing: true }));
    },

    subViewName: function() {
      return function(id) {
        return (this.entry.editing ? 'EntryFormView' : 'EntryView') + ' ' + id;
      }
    }
  };

  hub.trigger('registerView', EntriesView, template);
});
