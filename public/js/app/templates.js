define([ 'marker' ], function(Marker) {

  Marker.register('header', function() {
    this
      .div({ className: 'navbar-inner' })
        .div({ className: 'container' })
          .h1('Dataful.me', true)
          .a({ href: '#', className: 'logout brand' }, 'Logout');
  });

});
