define({

  TIME_RE: /(TIME:)(\S+)/,

  parse: function(str) {

    if (!str) return;

    var matches = str.match(this.TIME_RE);
    if (!matches) return;

    var now = new Date,
        parts = matches[2].split(':'),
        hours = parts[0],
        ampm = matches[2].match(/am|AM|pm|PM/);

    if (parts[1]) now.setMinutes(parts[1].replace(/\D/g, ''));
    else now.setMinutes('00');
    if (ampm[0] && ampm[0].toLowerCase() === 'pm') hours = parseInt(hours, 10) + 12
    now.setHours(hours);

    var matches = now.toISOString().match(/T(\d+:\d\d)/);

    return str.replace(this.TIME_RE, '$1' + matches[1]);
  }
});
