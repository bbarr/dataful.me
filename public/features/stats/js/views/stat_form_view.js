define(function(require) {

  var hub = require('hub'),
      template = require('text!../../html/stat_form.html'),
      Stat = require('../models/stat');

  function StatFormView(id) {
    this.stat = {};

    var self = this;
    hub.trigger('getStatById', id, function(stat) { self.stat = stat; });
  };

  StatFormView.prototype = {

    save: function() {
      var self = this;
      this.stat.save().success(function() {
        self.stat.editing = false;
      });
    }
  };

  hub.trigger('registerView', StatFormView, template);
});



