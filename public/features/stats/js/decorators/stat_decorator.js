define(function(require) {

  return function() {
    var self = this;

    this.viewName = function() {
      return (this.editing ? 'StatFormView' : 'StatView') + ' ' + this.meta('id');
    }

    this.valueString = function() { 
      var val = this.value;
      if (typeof val === 'object') {
        val = "'" + val[0] + "' " + val[1] + "% of the time";
      }
      return 'is ' + val;
    };

    var PARTS_RE = /(\w+)\s(\w+)(?:(?:\s\((\w+)(?:(?:([:><\*]+))?(?:([\w\.]+))?)?\))?(?:\s(less than|greater than)\s(\d+)(\w)\s(before|after)\s(\w+)(?:\s(\(\w+\)))?)?)?/
    this.rawToString = function() {
      var matches = this.raw.match(PARTS_RE);
      if (!matches) return;
      this.string = this.raw;
      this.action = matches[1];
      this.subject = matches[2];
      this.filterSubject = matches[3];
      this.filterClause = (typeof matches[4] === 'undefined' && matches[3]) ? ':*' : matches[4];
      this.filterValue = matches[5];
      this.timeFilterDurationDirection = matches[6];
      this.timeFilterDuration = matches[7];
      this.timeFilterUnit = matches[8];
      this.timeFilterDirection = matches[9];
      this.timeFilterSubject = matches[10];
    }

    this.watch('raw', this.rawToString);
    this.watch('string', function() { this.raw = this.string; });

    this.partsToString = function() { 
      var raw = '';
      raw += (this.action || '') + ' ';
      raw += (this.subject || '') + ' ';
      this.existentialFilter = false;
      if (this.filterSubject || this.filterClause || this.filterValue) {
        this.showingFilter = true;
        this.existentialFilter = this.filterClause === ':*';
        if (this.existentialFilter) {
          this.filterValue = undefined;
        }
        raw += '(';
        raw += (this.filterSubject || '');
        raw += (this.filterClause === ':*' ? '' : (this.filterClause || ''));
        raw += (this.filterValue || '');
        raw += ') ';
      }
      if (this.timeFilterDirection && this.timeFilterDurationDirection && this.timeFilterDuration && this.timeFilterUnit && this.timeFilterSubject) {
        this.showingTimeFilter = true;
        raw += (this.timeFilterDurationDirection || '') + ' ';
        raw += (this.timeFilterDuration || '');
        raw += (this.timeFilterUnit || '') + ' ';
        raw += (this.timeFilterDirection || '') + ' ';
        raw += (this.timeFilterSubject || '') + ' ';
      }
      this.string = raw.replace(/\s(\s+)/, '').replace(/(\s)$/, '');
    }

    this.watch('action', this.partsToString);
    this.watch('subject', this.partsToString);
    this.watch('filterSubject', this.partsToString);
    this.watch('filterClause', this.partsToString);
    this.watch('filterValue', this.partsToString);
    this.watch('timeFilterDirection', this.partsToString);
    this.watch('timeFilterDuration', this.partsToString);
    this.watch('timeFilterDurationDirection', this.partsToString);
    this.watch('timeFilterSubject', this.partsToString);


    var self = this;
    window.foo = function() { return self.filterSubject; }
  }
});
