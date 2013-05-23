define(function(require) {

  var hub = require('hub'),
      template = require('text!../../html/input.html'),
      Input = require('../models/input');

  function InputView() {
    this.input = '';
    this.feedback = '';

    this.addingEntry = false;
    this.addingStat = false;

    hub.on('promptAddEntry', this.promptAddEntry, this);
    hub.on('promptAddStat', this.promptAddStat, this);
  };

  InputView.prototype = {

    promptAddEntry: function() {
      this.show();
      this.addingEntry = true;
      this.addingStat = false;
    },

    promptAddStat: function() {
      this.show();
      this.addingStat = true;
      this.addingEntry = false;
    },

    show: function() {
      this.active = true;
    },

    hide: function() {
      this.active = false;
      this.addingStat = false;
      this.addingEntry = false;
    },

    process: function() {
      if (!this.input) this.feedback = '';
      else this.feedback = 'Looks like you are submitting a new entry: ' + this.input + '. Press "Enter" again to submit.';
    }
  };

  hub.trigger('registerView', InputView, template);
});
