define(function(require) {

  var asDocument = require('jsmapper/document'),
      decorator = require('../decorators/entry_decorator');

  function Entry() {
    this.key('tags');
    this.key('raw');
  };

  Entry.prototype = {

  };

  Entry.url = '/entries';

  return asDocument(Entry).include(decorator);
});
