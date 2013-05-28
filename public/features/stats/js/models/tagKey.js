define(function(require) {

  var asDocument = require('jsmapper/document');

  function TagKey() {
    this.key('value');
  }

  TagKey.url = "/entries/keys";

  return asDocument(TagKey);
});
