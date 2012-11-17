require([
  'app/models/user',
  'app/collections/stats',
  'app/collections/entries',
  'app/views/input',
  'app/views/stats',
  'app/views/entries',
  'app/views/header',
  'app/templates'
], function(
  User,
  Stats, 
  Entries, 
  InputView, 
  StatsView, 
  EntriesView,
  HeaderView
) {

  var stats = new Stats,
      entries = new Entries,
      user = new User;
    
  new InputView({
    entries: entries,
    stats: stats
  });

  new StatsView({
    collection: stats,
    entries: entries
  });

  new EntriesView({
    collection: entries
  });

  new HeaderView({ model: user }).render();

  stats.fetch();
  entries.fetch();

});
