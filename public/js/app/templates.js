define([ 'marker' ], function(Marker) {

  Marker.register('header', function() {
    this
      .div({ className: 'navbar-inner' })
        .div({ className: 'container' })
          .h1('Dataful.me', true)
          .a({ href: '#', className: 'logout brand' }, 'Logout');
  });

  Marker.register('entries', function(entries) {
    this
      .div({ className: '' })
        .h3('Entries', true)
        .ul({ cache: 'list' }, true);
  });

  Marker.register('entry', function(entry) {
    this
      .div({ className: 'entry' })
        .p(entry.get('category'), true)
        .a({ href: '#', className: 'remove' }, 'remove', true)
        .dl()
          .each(entry.get('tags'), function(val, key) {
            this
              .dt(key, true)
              .dd(val, true);
          })
        .end()
      .end();
  });

  Marker.register('stats', function(stats) {
    this
      .div({ className: '' })
        .h3('Stats', true)
        .each(stats.models, function(stat) {
          this
            .div({ className: 'stat' })
              .p(stat.get('raw'), true)
              .when(stat.get('value')[0])
                .each(stat.get('value'), function(value) {
                  this.span(value[0] + ' ' + value[1] + '%', true);
                })
              .otherwise()
                .span(stat.get('value'), true)
              .end()
            .end();
        });
  });
});
