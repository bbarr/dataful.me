define(function(require) {

  // Library components
  var hub = require('hub');

  // utilities
  require('renderer');
  require('observer');
  require('shared/js/modal');

  // Views
  require('shared/js/views/nav_view');
  require('features/entries/js/views/entries_view');
  require('features/entries/js/views/entry_view');
  require('features/entries/js/views/entry_form_view');
  require('features/stats/js/views/stats_view');
  require('features/stats/js/views/stat_view');
  require('features/stats/js/views/stat_form_view');
  require('features/snapshot/js/views/snapshot_view');
  require('features/input/js/views/input_view');

  // initial scan
  hub.trigger('scanForViews');

  // initial dirty-check for 5 sec for page load
  hub.trigger('observe', 1000);

  // for testing
  window.hub = hub;

});
