define(function(require) {

  var asDocument = require('jsmapper/document'),
      decorator = require('../decorators/stat_decorator');

  function Stat() {
    this.key('raw');
    this.key('value');
  };

  Stat.prototype = {

  };

  Stat.url = '/stats';

  return asDocument(Stat).include(decorator);
});
