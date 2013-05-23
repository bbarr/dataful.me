define(function(require) {

  var hub = require('hub'),
      renderer = require('renderer');

  // setup some basic app events
  hub.on('scanForViews', renderer.scan, renderer);
  hub.on('registerView', renderer.registerView, renderer);

});
