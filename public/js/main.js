require.config({
  shim: {
    marker: {
      exports: 'Marker'
    },
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: [ 'underscore', 'vendor/jquery' ],
      exports: 'Backbone'
    },
    bootstrap: [ 'vendor/jquery' ]
  },
  paths: {
    bootstrap: 'vendor/bootstrap',
    backbone: 'vendor/backbone',
    underscore: 'vendor/underscore',
    marker: 'vendor/marker',
    events: 'lib/events'
  }
});

require([ 
  'vendor/modernizr',
  'bootstrap',
  'app/boot'
]);
