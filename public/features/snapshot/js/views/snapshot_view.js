define(function(require) {

  var hub = require('hub'),
      template = require('text!../../html/snapshot.html');

  function SnapshotView() {
    this.hidden = true;
  };

  SnapshotView.prototype = {

    show: function() {
      this.hidden = false;
    },

    hide: function() {
      this.hidden = true;
    }
  };

  hub.trigger('registerView', SnapshotView, template);
});
