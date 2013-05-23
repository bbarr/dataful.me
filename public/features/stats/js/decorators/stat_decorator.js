define(function(require) {

  return function() {

    this.meta_id = function() { return this.meta('id'); };

    this.valueString = function() { 
      var val = this.value;
      if (typeof val === 'object') {
        val = "'" + val[0] + "' " + val[1] + "% of the time";
      }
      return 'is ' + val;
    };
  }
});
