require([
  'app/collections/stats',
  'app/collections/entries',
  'app/views/input',
  'app/views/stats',
  'app/views/entries',
  'app/views/header',
  'app/templates'
], function(
  Stats, 
  Entries, 
  InputView, 
  StatsView, 
  EntriesView,
  HeaderView
) {

  var stats = new Stats,
      entries = new Entries;
    
  new InputView({
    entries: entries,
    stats: stats
  });

  new StatsView({
    collection: stats
  });

  new EntriesView({
    collection: entries
  });

  new HeaderView().render();

  stats.fetch();
  entries.fetch();

});
