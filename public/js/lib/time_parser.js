define({

  TIME_RE: /( TIME:)(\S+)/,
  DATE_RE: /( DATE:)(\S+)/,

  parse: function(str) {

    if (!str) return;

    var date,
        date_matches = str.match(this.DATE_RE),
        time_matches = str.match(this.TIME_RE);

    if (date_matches) {
      date = new Date(date_matches[2]);
    } else {
      date = new Date;
    }
    
    if (time_matches) {
      var parts = time_matches[2].split(':');
      if (parts[1]) {
        hours = parts[0];
        minutes = parseInt(parts[1], 10);
      } else {
        hours = parseInt(parts[0], 10);
        minutes = '00';
      }

      if (parts[0].substr(-2).toLowerCase() === 'pm') hours += 12;
      date.setHours(hours);
      date.setMinutes(minutes);
    }

    str = str.replace(this.TIME_RE, '').replace(this.DATE_RE, '');
    return str + ' DATE:' + (date.getUTCMonth() + 1) + '/' + date.getUTCDate() + '/' + date.getUTCFullYear() + ' TIME:' + date.getUTCHours() + ':' + date.getUTCMinutes();
  }
});
