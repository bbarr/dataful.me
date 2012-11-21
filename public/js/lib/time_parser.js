define({

  TIME_RE: /(TIME:)(\S+)/,

  parse: function(str) {

    if (!str) return;

    var matches = str.match(this.TIME_RE);
    if (!matches) return;

    var now = new Date,
        parts = matches[2].split(':');
    now.setHours(parts[0]);
    now.setMinutes(parts[1]);

    var matches = now.toISOString().match(/T(\d+:\d\d)/);

    return str.replace(this.TIME_RE, '$1' + matches[1]);
  }
});
