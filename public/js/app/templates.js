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
        .ul({ cache: 'list' })
          .li({ className: 'if_empty' }, 'No entries yet.', true)
  });

  Marker.register('entry', function(entry) {

    var date = new Date(entry.get('created_at')),
        hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours(),
        ampm = date.getHours() > 12 ? 'pm' : 'am',
        pad = function(val) { return val.toString().length > 1 ? val : ('0' + val); },
        date_str = (pad(date.getMonth() + 1) + '/' + pad(date.getDate()) + '/' + date.getFullYear() + ' ' + hours + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + ampm);

    this
      .div({ className: 'entry' })
        .a({ href: '#', className: 'remove' }, 'remove', true)
        .p(entry.get('category'), true)
        .span(date_str, true)
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
        .ul({ cache: 'list' })
          .li({ className: 'if_empty' }, 'No stats yet.', true)
  });

  Marker.register('stat', function(stat) {

    var value = stat.get('value');
    value = typeof value === 'number' ? value : (value[0] + ' ' + value[1] + '%');

    this
      .div({ className: 'stat' })
        .span(value, true) 
        .p(stat.get('raw'), true)
        .a({ href: '#', className: 'remove' }, 'remove', true)
        .div({ className: 'chart', cache: 'chart' }, true);
  });
});
