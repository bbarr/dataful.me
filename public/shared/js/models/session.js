define(function(require) {

  var asDocument = require('jsmapper/document');

  function Session() {
    this.key('email');
    this.key('password');
  };

  Session.url = '/session';

  Session.prototype = {

  };

  return asDocument(Session);
});
