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
      exports: 'Backbone',
      init: function(_) {
        var events = _({}).extend(this.Backbone.Events);
        this.Backbone.View.prototype.hub = events;
        return this.Backbone;
      }
    },
    bootstrap: [ 'vendor/jquery' ],
    charts: [ 'goog' ]
  },
  paths: {
    bootstrap: 'vendor/bootstrap',
    backbone: 'vendor/backbone',
    underscore: 'vendor/underscore',
    marker: 'vendor/marker',
    events: 'lib/events',
    charts: 'vendor/google.charts',
    async: 'vendor/require.async',
    goog: 'vendor/require.goog',
    propertyParser: 'vendor/require.property_parser'
  }
});

require([ 
  'vendor/modernizr',
  'bootstrap',
  'app/boot'
]);
