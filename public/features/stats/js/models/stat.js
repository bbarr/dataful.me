define(function(require) {

  var asDocument = require('jsmapper/document'),
      decorator = require('../decorators/stat_decorator');

  function Stat() {
    this.key('raw', { default: '' });
  };

  Stat.prototype = {

  };

  Stat.url = '/stats';

  return asDocument(Stat).include(decorator);
});
