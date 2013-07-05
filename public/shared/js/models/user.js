define(function(require) {

  var asDocument = require('jsmapper/document');

  function User() {
    this.key('email');
    this.key('password');
    this.key('confirm_password');
  };

  User.url = '/user';

  User.prototype = {

  };

  return asDocument(User);
});

