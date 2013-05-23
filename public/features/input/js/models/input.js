define(function(require) {

  var asDocument = require('jsmapper/document');

  function Input() {
    this.key('value');
  };

  Input.prototype = {

  };

  Input.url = '/input';

  return asDocument(Input);
});

