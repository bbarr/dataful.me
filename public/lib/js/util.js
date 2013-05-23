define(function() {

  return {

    extend: function(d, s) { 
      for (var k in s) {
        d[k] || (d[k] = s[k]); 
      }
    },
    
    defineMixin: function(fn, cached_props) {
      var util = this,
          mixin = function() {
            fn.apply(this, arguments);
            util.extend(this, cached_props);
          };
      return mixin;
    }
  }
});
