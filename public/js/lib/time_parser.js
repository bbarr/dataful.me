define({

  TIME_RE: /(TIME:)(\S+)/,

  parse: function(str) {

    if (!str) return;

    var matches = str.match(this.TIME_RE);
    if (!matches) return;

    var date = new Date(matches[2].replace('T', ' '));
    if (!date.getDate()) {
      var now = new Date,
          parts = matches[2].split(':');
      now.setHours(parts[0]);
      now.setMinutes(parts[1]);
      date = now;
    }

    return str.replace(this.TIME_RE, '$1' + date.toISOString());
  }
});
