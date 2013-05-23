requirejs.config({
  shim: {
    rivets: { exports: 'rivets' },
    boot: [ 'config/rivets', 'vendor/js/modernizr', 'bootstrap' ],
    'config/rivets': [ 'rivets', 'vendor/js/jsmapper.min' ],
    bootstrap: [ 'vendor/js/jquery' ]
  },
  paths: {
    hub: 'lib/js/hub',
    renderer: 'lib/js/renderer',
    observer: 'lib/js/observer',
    debug: 'lib/js/debug',
    bootstrap: 'vendor/js/bootstrap',
    text: 'vendor/js/require.text',
    moment: 'vendor/js/moment',
    rivets: 'vendor/js/rivets'
  }
});

require([ 'boot' ]);
